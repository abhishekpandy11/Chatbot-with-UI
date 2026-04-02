from datetime import datetime, timedelta
from jose import jwt
from app.config import get_settings

def create_access_token(data: dict):
    settings = get_settings()
    to_encode = data.copy()
    to_encode["exp"] = datetime.utcnow() + timedelta(minutes=30)
    return jwt.encode(to_encode, settings.ACCESS_SECRET, settings.ALGO)

def create_refresh_token(data: dict):
    settings = get_settings()
    to_encode = data.copy()
    to_encode["exp"] = datetime.utcnow() + timedelta(days=7)
    return jwt.encode(to_encode, settings.REFRESH_SECRET, settings.ALGO)

def decode_access(token: str):
    settings = get_settings()
    return jwt.decode(token, settings.ACCESS_SECRET, settings.ALGO)

def decode_refresh(token: str):
    settings = get_settings()
    return jwt.decode(token, settings.REFRESH_SECRET, settings.ALGO)