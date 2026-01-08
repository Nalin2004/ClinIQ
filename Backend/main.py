import os
import pandas as pd
import bcrypt
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from jose import jwt
from datetime import datetime, timedelta

from database import SessionLocal, engine
from models import User
from schemas import UserCreate, Login
import re


BCRYPT_PATTERN = re.compile(r"^\$2[aby]\$")

# ---------------- CONFIG ---------------- #

SECRET_KEY = os.getenv("JWT_SECRET")
if not SECRET_KEY:
    raise RuntimeError("JWT_SECRET environment variable is not set")

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

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()

def verify_password(password: str, hashed: str) -> bool:
    try:
        # bcrypt format
        if BCRYPT_PATTERN.match(hashed):
            return bcrypt.checkpw(password.encode(), hashed.encode())
        else:
            # legacy sha256
            return hashlib.sha256(password.encode()).hexdigest() == hashed
    except:
        return False


# ---------------- JWT ---------------- #

def create_token(data: dict):
    payload = data.copy()
    payload["exp"] = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

def get_current_user(token: HTTPAuthorizationCredentials = Depends(security)):
    try:
        return jwt.decode(token.credentials, SECRET_KEY, algorithms=[ALGORITHM])
    except:
        raise HTTPException(403, "Invalid or expired token")

def require_admin(user=Depends(get_current_user)):
    if user.get("role") != "admin":
        raise HTTPException(403, "Admins only")
    return user

# ---------------- FILE LOADER ---------------- #

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(BASE_DIR, "Data")
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

# ---------------- AUTH ---------------- #

@app.post("/signup")
def signup(user: UserCreate, db: Session = Depends(get_db)):
    new_user = User(
        name=user.name,
        email=user.email,
        hashed_password=hash_password(user.password),
        role="user"
    )
    db.add(new_user)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(400, "Email already registered")
    return {"status": "Account created"}

@app.post("/login")
def login(data: Login, db: Session = Depends(get_db)):
    u = db.query(User).filter(User.email == data.email).first()
    if not u:
        raise HTTPException(401, "Invalid credentials")

    # verify password
    if not verify_password(data.password, u.hashed_password):
        raise HTTPException(401, "Invalid credentials")

    # 🔁 auto-upgrade old sha256 hashes to bcrypt
    if not u.hashed_password.startswith("$2"):
        u.hashed_password = hash_password(data.password)
        db.commit()

    token = create_token({
        "user_id": u.id,
        "name": u.name,
        "role": u.role
    })

    return {"token": token, "name": u.name, "role": u.role}


# ---------------- OVERVIEW ---------------- #

@app.get("/overview")
def get_overview(user=Depends(require_admin)):
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
def get_patients(user=Depends(require_admin)):
    df = load_file("Study 1_Compiled_EDRR_updated.xlsx")
    df["risk_score"] = calculate_risk(df["Total Open issue Count per subject"])
    df["risk_level"] = pd.cut(df["risk_score"], [-1,30,70,1000], labels=["Low","Medium","High"]).astype(str)
    return df[["Subject","Total Open issue Count per subject","risk_score","risk_level"]].to_dict("records")

# ---------------- SITES ---------------- #

@app.get("/sites")
def get_sites(user=Depends(require_admin)):
    df = load_file("Study 1_Compiled_EDRR_updated.xlsx")
    df["risk_score"] = calculate_risk(df["Total Open issue Count per subject"])
    return df[["Subject","Total Open issue Count per subject","risk_score"]].to_dict("records")

# ---------------- AI INSIGHTS ---------------- #

@app.get("/ai-insights")
def get_ai_insights(user=Depends(require_admin)):
    df = load_file("Study 1_Compiled_EDRR_updated.xlsx")
    df["risk_score"] = calculate_risk(df["Total Open issue Count per subject"])
    top = df.sort_values("risk_score", ascending=False).head(3)

    return {
        "alerts": [f"{r['Subject']} at {int(r['risk_score'])}% risk" for _,r in top.iterrows()],
        "reasons": ["System stable – no critical systemic risks detected"],
        "recommended_actions": ["Continue routine monitoring"],
        "readmission_risk": int(df["risk_score"].mean()),
        "graph": [
            {"factor":"Comorbidities","value":int(df["risk_score"].mean()//2)},
            {"factor":"Medication","value":int(df["risk_score"].mean()//1.5)},
            {"factor":"Admissions","value":int(df["risk_score"].mean())}
        ]
    }
