from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List
from datetime import datetime
from app.models.user import User

class Conversation(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    title: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class Message(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    conversation_id: int = Field(foreign_key="conversation.id")
    role: str  # 'user' or 'assistant'
    content: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    tokens_used: Optional[int] = Field(default=0)
