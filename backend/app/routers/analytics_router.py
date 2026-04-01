from fastapi import APIRouter, Depends
from sqlmodel import Session, select, func
from app.database import get_session
from app.auth.dependencies import get_current_user
from app.models.analytics import UsageLog

router = APIRouter(prefix="/analytics", tags=["Analytics"])

@router.get("/")
async def get_analytics(user=Depends(get_current_user), session: Session = Depends(get_session)):
    # Calculate sum of tokens and total cost for the current user
    stmt = select(
        func.sum(UsageLog.tokens).label("total_tokens"),
        func.sum(UsageLog.cost).label("total_cost")
    ).where(UsageLog.user_id == user.id)
    
    result = session.exec(stmt).first()
    
    # Calculate daily usage for charts potentially
    # ...
    
    return {
        "total_tokens": result[0] if result and result[0] else 0,
        "total_cost": result[1] if result and result[1] else 0.0,
    }

@router.get("/logs")
async def get_usage_logs(user=Depends(get_current_user), session: Session = Depends(get_session), limit: int = 100):
    stmt = select(UsageLog).where(UsageLog.user_id == user.id).order_by(UsageLog.created_at.desc()).limit(limit)
    return session.exec(stmt).all()
