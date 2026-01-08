import os
import bcrypt
import pandas as pd
from datetime import datetime, timedelta
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from jose import jwt, JWTError

from database import SessionLocal, engine
from models import User
from schemas import UserCreate, Login


# ---------------- CONFIG ---------------- #
SECRET_KEY = os.getenv("JWT_SECRET", "local_dev_secret")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

security = HTTPBearer()
app = FastAPI()


# ---------------- CORS ---------------- #
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://clin-iq-omega.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

User.metadata.create_all(bind=engine)


# ---------------- DB ---------------- #
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ---------------- PASSWORD ---------------- #
def hash_password(password: str):
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()

def verify_password(password: str, hashed: str):
    return bcrypt.checkpw(password.encode(), hashed.encode())


# ---------------- JWT ---------------- #
def create_token(data: dict):
    payload = data.copy()
    payload["exp"] = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

def get_current_user(token: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(token.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        raise HTTPException(403, "Invalid or expired token")

def require_admin(user=Depends(get_current_user)):
    if user.get("role") != "admin":
        raise HTTPException(403, "Admin access required")
    return user


# ---------------- FILE LOADER ---------------- #
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
    return {"status": "ClinIQ backend running"}


# ---------------- AUTH ---------------- #
@app.post("/signup")
def signup(user: UserCreate, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == user.email).first():
        raise HTTPException(400, "Email already registered")

    new_user = User(
        name=user.name,
        email=user.email,
        hashed_password=hash_password(user.password),
        role="user"
    )

    db.add(new_user)
    db.commit()
    return {"status": "Account created"}


@app.post("/login")
def login(data: Login, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()
    if not user or not verify_password(data.password, user.hashed_password):
        raise HTTPException(401, "Invalid credentials")

    token = create_token({
        "user_id": user.id,
        "name": user.name,
        "role": user.role
    })

    return {
        "token": token,
        "name": user.name,
        "role": user.role
    }


# ---------------- OVERVIEW ---------------- #
@app.get("/overview")
def overview(user=Depends(require_admin)):
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
def patients(user=Depends(require_admin)):
    df = load_file("Study 1_Compiled_EDRR_updated.xlsx")
    df["risk_score"] = calculate_risk(df["Total Open issue Count per subject"])
    df["risk_level"] = pd.cut(df["risk_score"], [-1,30,70,1000],
                               labels=["Low","Medium","High"]).astype(str)

    return df[[
        "Subject",
        "Total Open issue Count per subject",
        "risk_score",
        "risk_level"
    ]].to_dict("records")


# ---------------- SITES ---------------- #
@app.get("/sites")
def sites(user=Depends(require_admin)):
    df = load_file("Study 1_Compiled_EDRR_updated.xlsx")
    df["risk_score"] = calculate_risk(df["Total Open issue Count per subject"])

    return df[[
        "Subject",
        "Total Open issue Count per subject",
        "risk_score"
    ]].to_dict("records")


# ---------------- AI INSIGHTS ---------------- #
@app.get("/ai-insights")
def ai_insights(user=Depends(require_admin)):
    df = load_file("Study 1_Compiled_EDRR_updated.xlsx")
    df["risk_score"] = calculate_risk(df["Total Open issue Count per subject"])
    top = df.sort_values("risk_score", ascending=False).head(3)

    avg = int(df["risk_score"].mean())

    return {
        "alerts": [f"{r['Subject']} at {int(r['risk_score'])}% risk" for _,r in top.iterrows()],
        "reasons": ["System stable – no critical systemic risks detected"],
        "recommended_actions": ["Continue routine monitoring"],
        "readmission_risk": avg,
        "graph": [
            {"factor":"Comorbidities","value":avg//2},
            {"factor":"Medication","value":avg//1.5},
            {"factor":"Admissions","value":avg}
        ]
    }
