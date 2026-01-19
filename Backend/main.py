import os
import pandas as pd
from datetime import datetime, timedelta
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# ---------------- APP ---------------- #
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------- DATA LOADER ---------------- #
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(BASE_DIR, "..", "Data")
CACHE = {}

def load_file(file):
    if file in CACHE:
        return CACHE[file]
    df = pd.read_excel(os.path.join(DATA_PATH, file))
    df.columns = df.columns.str.strip()
    CACHE[file] = df
    return df

def calculate_risk(col):
    return pd.to_numeric(col, errors="coerce").fillna(0) * 5


# ---------------- HOME ---------------- #
@app.get("/")
def home():
    return {"status": "ClinIQ backend running locally"}


# ---------------- OVERVIEW ---------------- #
@app.get("/overview")
def overview():
    df = load_file("Study 1_Compiled_EDRR_updated.xlsx")
    df["risk_score"] = calculate_risk(df["Total Open issue Count per subject"])
    df["DQI"] = 100 - df["risk_score"]

    return {
        "average_dqi": round(df["DQI"].mean(), 2),
        "high_risk_subjects": int((df["risk_score"] > 30).sum()),
        "total_subjects": len(df)
    }


# ---------------- PATIENTS ---------------- #
@app.get("/patients")
def patients():
    df = load_file("Study 1_Compiled_EDRR_updated.xlsx")
    df["risk_score"] = calculate_risk(df["Total Open issue Count per subject"])
    df["risk_level"] = pd.cut(
        df["risk_score"],
        [-1,30,70,1000],
        labels=["Low","Medium","High"]
    ).astype(str)

    return df[[
        "Subject",
        "Total Open issue Count per subject",
        "risk_score",
        "risk_level"
    ]].to_dict("records")


# ---------------- SITES ---------------- #
@app.get("/sites")
def sites():
    df = load_file("Study 1_Compiled_EDRR_updated.xlsx")
    df["risk_score"] = calculate_risk(df["Total Open issue Count per subject"])

    return df[[
        "Subject",
        "Total Open issue Count per subject",
        "risk_score"
    ]].to_dict("records")


# ---------------- AI INSIGHTS ---------------- #
@app.get("/ai-insights")
def ai_insights():
    df = load_file("Study 1_Compiled_EDRR_updated.xlsx")
    df["risk_score"] = calculate_risk(df["Total Open issue Count per subject"])

    top = df.sort_values("risk_score", ascending=False).head(3)
    avg = int(df["risk_score"].mean())

    return {
        "alerts": [f"{r['Subject']} at {int(r['risk_score'])}% risk" for _,r in top.iterrows()],
        "reasons": ["High risk outliers detected" if avg > 25 else "System stable"],
        "recommended_actions": ["Continue routine monitoring"],
        "readmission_risk": avg,
        "graph": [
            {"factor":"Comorbidities","value":avg//2},
            {"factor":"Medication","value":avg//1.5},
            {"factor":"Admissions","value":avg}
        ]
    }


# ---------------- FOLLOWUPS ---------------- #
@app.get("/followups")
def followups():
    df = load_file("Study 1_Compiled_EDRR_updated.xlsx")
    df["risk_score"] = calculate_risk(df["Total Open issue Count per subject"])

    df["last_visit"] = pd.to_datetime("2025-01-10")
    df["next_followup"] = df["last_visit"] + pd.to_timedelta(14, unit="d")

    today = pd.Timestamp.today()
    df["status"] = df["next_followup"].apply(
        lambda x: "Missed" if x < today else "Pending"
    )

    return df[[
        "Subject",
        "last_visit",
        "next_followup",
        "status",
        "risk_score"
    ]].to_dict("records")


# ---------------- DATA QUALITY ---------------- #
@app.get("/data-quality")
def data_quality():
    df = load_file("Study 1_Compiled_EDRR_updated.xlsx")
    missing = df.isnull().sum().to_dict()
    return {"missing_fields": missing}


# ---------------- COLLABORATION ---------------- #
@app.get("/collaboration")
def collaboration():
    return [
        {"country":"India","site":"Delhi","pending":18},
        {"country":"Brazil","site":"Rio","pending":12},
        {"country":"USA","site":"Boston","pending":9}
    ]
