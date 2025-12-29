from fastapi import FastAPI
import pandas as pd
import os
from urllib.parse import unquote
import traceback

app = FastAPI()

DATA_PATH = os.path.join(os.path.dirname(__file__), "..", "data")
DATA_CACHE = {}

def load_file(filename):
    if filename in DATA_CACHE:
        return DATA_CACHE[filename]

    path = os.path.join(DATA_PATH, filename)
    df = pd.read_excel(path)
    df.columns = df.columns.str.strip()
    DATA_CACHE[filename] = df
    return df

def calculate_dqi(row):
    dqi = 100
    dqi -= row.get("Total Open issue Count per subject", 0) * 5
    return max(0, round(dqi, 2))

@app.get("/")
def home():
    return {"status": "ClinIQ backend running"}

@app.get("/subjects")
def list_subjects():
    try:
        df = load_file("Study 1_Compiled_EDRR_updated.xlsx")
        df["Subject"] = df["Subject"].astype(str)
        return {"subjects": df["Subject"].tolist()}
    except Exception as e:
        return {"error": str(e)}

@app.get("/overview")
def overview():
    try:
        df = load_file("Study 1_Compiled_EDRR_updated.xlsx")
        df["DQI"] = df.apply(calculate_dqi, axis=1)

        return {
            "average_dqi": round(df["DQI"].mean(), 2),
            "high_risk_subjects": int((df["DQI"] < 60).sum()),
            "total_subjects": len(df)
        }
    except Exception as e:
        return {"error": str(e)}

@app.get("/patient")
def patient_details(subject: str):
    try:
        df = load_file("Study 1_Compiled_EDRR_updated.xlsx")
        df["Subject"] = df["Subject"].astype(str)

        subject = subject.strip()

        patient = df[df["Subject"] == subject]

        if patient.empty:
            return {
                "message": "Subject not found",
                "examples": df["Subject"].head(10).tolist()
            }

        row = patient.iloc[0]

        open_issues = int(row["Total Open issue Count per subject"])
        dqi_value = float(calculate_dqi(row))

        return {
            "subject": str(row["Subject"]),
            "open_issues": open_issues,
            "dqi": dqi_value
        }

    except Exception as e:
        return {"error": str(e)}



