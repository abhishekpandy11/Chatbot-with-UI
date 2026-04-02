from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import create_db
from app.config import settings, Settings

from app.routers import auth_router, user_router, chat_router, analytics_router

app = FastAPI()

print("🚀 LATEST CODE VERSION LOADED (March 2, 2026 14:15)")

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
    print("🔥 FastAPI Startup Sequence Initiated")
    try:
        print("🔍 Loading settings...")
        settings = Settings()
        print("✅ Settings loaded successfully")
    except Exception as e:
        print(f"❌ CRITICAL ERROR: Missing or Invalid Environment Variables!")
        print(f"🔍 Error details: {e}")
        # Not raising here temporarily so logs can be viewed easily
        # but the app won't function without these.
    try:
        print("🛠️ Creating Database tables...")
        create_db()
        print("✅ Database tables verified/created")
    except Exception as e:
        print(f"❌ Database Initialization Failed: {e}")
        # We don't necessarily want to crash here if the DB is just slow to wake up
        pass
    print("🚀 App is ready to receive traffic")


app.include_router(auth_router.router)
app.include_router(user_router.router)
app.include_router(chat_router.router)
app.include_router(analytics_router.router)

if __name__ == "__main__":
    import uvicorn
    import os
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)