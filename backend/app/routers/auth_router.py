from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from app.database import get_session
from app.models.user import User
from app.schemas.user import UserCreate, UserLogin
from app.auth.hashing import hash_password, verify_password
from app.auth.jwt_handler import create_access_token, create_refresh_token, decode_refresh

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/signup")
def signup(data: UserCreate, session: Session = Depends(get_session)):
    existing = session.exec(select(User).where(User.username == data.username)).first()
    if existing:
        raise HTTPException(400, "User exists")

    user = User(
        username=data.username,
        email=data.email,
        password=hash_password(data.password),
        role="user"
    )
    session.add(user)
    session.commit()
    session.refresh(user)

    return {"msg": "User created"}

@router.post("/login")
def login(data: UserLogin, session: Session = Depends(get_session)):
    user = session.exec(select(User).where(User.username == data.username)).first()
    if not user or not verify_password(data.password, user.password):
        raise HTTPException(401, "Invalid user/pass")

    access = create_access_token({"username": user.username, "role": user.role})
    refresh = create_refresh_token({"username": user.username})

    return {
        "access_token": access,
        "refresh_token": refresh
    }

@router.post("/refresh")
def refresh_token(refresh_token: str):
    try:
        payload = decode_refresh(refresh_token)
        username = payload["username"]
        access = create_access_token({"username": username})
        return {"access_token": access}
    except:
        raise HTTPException(401, "Invalid refresh token")