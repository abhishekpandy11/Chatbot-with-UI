from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer
from jose import JWTError

from sqlmodel import Session, select
from app.database import get_session
from app.models.user import User
from app.auth.jwt_handler import decode_access

# token extractor
oauth2_scheme = HTTPBearer()


# ✅ GET CURRENT USER (THIS WAS MISSING)
def get_current_user(
    token: dict = Depends(oauth2_scheme),
    session: Session = Depends(get_session)
):
    try:
        payload = decode_access(token.credentials)
        username = payload.get("username")

        if username is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token"
            )

        user = session.exec(
            select(User).where(User.username == username)
        ).first()

        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )

        return user

    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token invalid or expired"
        )


# ✅ ADMIN RBAC
def require_admin(user: User = Depends(get_current_user)):
    if user.role != "admin":
        raise HTTPException(
            status_code=403,
            detail="Admin access required"
        )
    return user