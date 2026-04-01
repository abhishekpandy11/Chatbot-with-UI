from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import create_db

from app.routers import auth_router, user_router, chat_router, analytics_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def health_check():
    return {"status": "healthy", "service": "Chat Backend"}


@app.on_event("startup")
def on_start():
    print("🔥 App started")
    create_db()   


app.include_router(auth_router.router)
app.include_router(user_router.router)
app.include_router(chat_router.router)
app.include_router(analytics_router.router)