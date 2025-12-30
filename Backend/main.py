from fastapi import FastAPI
import pandas as pd
import os

app = FastAPI()

DATA_PATH = os.path.join(os.path.dirname(__file__), "..", "data")
DATA_CACHE = {}

# ---------------- FILE LOADER ---------------- #
def load_file(filename):
    if filename in DATA_CACHE:
        return DATA_CACHE[filename]

    path = os.path.join(DATA_PATH, filename)
    df = pd.read_excel(path)
    df.columns = df.columns.str.strip()
    DATA_CACHE[filename] = df
    return df

# ---------------- DQI ENGINE ---------------- #
def calculate_dqi(row):
    issues = row.get("Total Open issue Count per subject", 0)
    return max(0, round(100 - int(issues) * 5, 2))

# ---------------- HOME ---------------- #
@app.get("/")
def home():
    return {"status": "ClinIQ backend running"}

# ---------------- SUBJECT LIST ---------------- #
@app.get("/subjects")
def list_subjects():
    df = load_file("Study 1_Compiled_EDRR_updated.xlsx")
    df["Subject"] = df["Subject"].astype(str)
    return {"subjects": df["Subject"].tolist()}

# ---------------- OVERVIEW ---------------- #
@app.get("/overview")
def overview():
    df = load_file("Study 1_Compiled_EDRR_updated.xlsx")
    df["DQI"] = df.apply(calculate_dqi, axis=1)

    return {
        "average_dqi": float(round(df["DQI"].mean(), 2)),
        "high_risk_subjects": int((df["DQI"] < 60).sum()),
        "total_subjects": int(len(df))
    }

# ---------------- PATIENT DRILLDOWN ---------------- #
@app.get("/patient")
def patient_details(subject: str):
    df = load_file("Study 1_Compiled_EDRR_updated.xlsx")
    df["Subject"] = df["Subject"].astype(str)

    patient = df[df["Subject"] == subject.strip()]

    if patient.empty:
        return {"message": "Subject not found"}

    row = patient.iloc[0]

    return {
        "subject": str(row["Subject"]),
        "open_issues": int(row["Total Open issue Count per subject"]),
        "dqi": float(calculate_dqi(row))
    }

# ---------------- SITE PERFORMANCE ENGINE ---------------- #
@app.get("/sites")
def site_performance():
    edrr = load_file("Study 1_Compiled_EDRR_updated.xlsx")
    meddra = load_file("Study 1_GlobalCodingReport_MedDRA_updated.xlsx")
    whodd = load_file("Study 1_GlobalCodingReport_WHODD_updated.xlsx")

    edrr["Subject"] = edrr["Subject"].astype(str)
    meddra["Subject"] = meddra["Subject"].astype(str)
    whodd["Subject"] = whodd["Subject"].astype(str)

    meddra_uncoded = meddra[meddra["Coding Status"] == "UnCoded Term"] \
        .groupby("Subject").size().reset_index(name="uncoded_meddra")

    whodd_uncoded = whodd[whodd["Coding Status"] == "UnCoded Term"] \
        .groupby("Subject").size().reset_index(name="uncoded_whodd")

    merged = edrr.merge(meddra_uncoded, on="Subject", how="left") \
                 .merge(whodd_uncoded, on="Subject", how="left") \
                 .fillna(0)

    merged["risk_score"] = (
        merged["Total Open issue Count per subject"] * 5 +
        merged["uncoded_meddra"] * 2 +
        merged["uncoded_whodd"] * 2
    )

    return merged[
        ["Subject",
         "Total Open issue Count per subject",
         "uncoded_meddra",
         "uncoded_whodd",
         "risk_score"]
    ].to_dict(orient="records")