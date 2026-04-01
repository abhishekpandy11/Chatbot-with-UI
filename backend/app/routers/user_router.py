from fastapi import APIRouter, Depends
from app.auth.dependencies import get_current_user
from app.models.user import User

# ✅ THIS LINE WAS MISSING
router = APIRouter(prefix="/user", tags=["User"])


@router.get("/me")
def get_me(user: User = Depends(get_current_user)):
    return {
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "role": user.role
    }