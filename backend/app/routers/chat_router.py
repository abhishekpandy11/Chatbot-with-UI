from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlmodel import Session, select
from typing import List

from app.database import get_session
from app.auth.dependencies import get_current_user
from app.services.chat_service import chat_with_rag, stream_chat_with_rag
from app.models.chat import Conversation, Message

router = APIRouter(prefix="/chat", tags=["Chat"])

@router.post("/conversations")
async def create_conversation(title: str, user=Depends(get_current_user), session: Session = Depends(get_session)):
    conv = Conversation(user_id=user.id, title=title)
    session.add(conv)
    session.commit()
    session.refresh(conv)
    return conv

@router.get("/conversations")
async def get_conversations(user=Depends(get_current_user), session: Session = Depends(get_session)):
    stmt = select(Conversation).where(Conversation.user_id == user.id).order_by(Conversation.created_at.desc())
    return session.exec(stmt).all()

@router.get("/conversations/{conversation_id}/messages")
async def get_conversation_messages(conversation_id: int, user=Depends(get_current_user), session: Session = Depends(get_session)):
    conv_stmt = select(Conversation).where(Conversation.id == conversation_id, Conversation.user_id == user.id)
    conv = session.exec(conv_stmt).first()
    if not conv:
        raise HTTPException(status_code=404, detail="Conversation not found")
        
    stmt = select(Message).where(Message.conversation_id == conversation_id).order_by(Message.created_at)
    return session.exec(stmt).all()

@router.delete("/conversations/{conversation_id}")
async def delete_conversation(conversation_id: int, user=Depends(get_current_user), session: Session = Depends(get_session)):
    conv_stmt = select(Conversation).where(Conversation.id == conversation_id, Conversation.user_id == user.id)
    conv = session.exec(conv_stmt).first()
    if not conv:
        raise HTTPException(status_code=404, detail="Conversation not found")
        
    # Delete associated messages first
    msg_stmt = select(Message).where(Message.conversation_id == conversation_id)
    messages = session.exec(msg_stmt).all()
    for m in messages:
        session.delete(m)
        
    session.commit() # Flush and clear the foreign key references first!
        
    session.delete(conv)
    session.commit()
    return {"status": "deleted"}

@router.get("/stream/")
async def stream_chat(query: str, conversation_id: int, user=Depends(get_current_user)):
    return StreamingResponse(
        stream_chat_with_rag(query, conversation_id, user.id), 
        media_type="text/event-stream"
    )

@router.post("/")
async def chat(msg: str, user=Depends(get_current_user)):
    # Legacy handler
    response = await chat_with_rag(msg)
    return {"reply": response}