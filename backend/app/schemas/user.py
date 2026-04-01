from pydantic import BaseModel, EmailStr


# ✅ Signup Schema
class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str


# ✅ Login Schema
class UserLogin(BaseModel):
    username: str
    password: str


# ✅ Response Schema (optional but recommended)
class UserResponse(BaseModel):
    id: int
    username: str
    email: EmailStr
    role: str

    class Config:
        from_attributes = True   # (Pydantic v2) SQLModel support