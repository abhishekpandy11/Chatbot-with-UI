from sqlmodel import SQLModel, Field
from typing import Optional


class User(SQLModel, table=True):   # ✅ IMPORTANT
    id: Optional[int] = Field(default=None, primary_key=True)
    username: str = Field(index=True, unique=True)
    email: str = Field(unique=True, index=True)
    password: str
    role: str = "user"   # user / admin