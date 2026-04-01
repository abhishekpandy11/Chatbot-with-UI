from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from app.models.user import User
from app.database import get_session
from app.auth.dependencies import require_admin

router = APIRouter(prefix="/admin", tags=["Admin"])

@router.get("/users")
def all_users(admin=Depends(require_admin), session: Session = Depends(get_session)):
    return session.exec(select(User)).all()