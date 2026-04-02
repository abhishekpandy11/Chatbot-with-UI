from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import init_settings
from app.database import init_engine, create_db
from app.services.chat_service import init_groq_client

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

    # 1. Load settings — single point of initialisation.
    #    Any missing/invalid env vars will raise here with a clear message.
    try:
        print("🔍 Loading settings...")
        settings = init_settings()
        print("✅ Settings loaded successfully")
    except Exception as e:
        print(f"❌ CRITICAL ERROR: Missing or Invalid Environment Variables!")
        print(f"🔍 Error details: {e}")
        raise  # Re-raise so the process exits — the app cannot run without settings.

    # 2. Initialise the database engine now that DATABASE_URL is available.
    try:
        print("🛠️ Initialising database engine...")
        init_engine(settings.DATABASE_URL)
        print("✅ Database engine initialised")
    except Exception as e:
        print(f"❌ Database Engine Initialisation Failed: {e}")
        raise

    # 3. Create tables.
    try:
        print("🛠️ Creating Database tables...")
        create_db()
        print("✅ Database tables verified/created")
    except Exception as e:
        print(f"❌ Database Table Creation Failed: {e}")
        # Non-fatal — tables may already exist or DB may be slow to wake up.
        pass

    # 4. Initialise the Groq client now that GROQ_API_KEY is available.
    try:
        print("🔍 Initialising Groq client...")
        init_groq_client()
        print("✅ Groq client initialised")
    except Exception as e:
        print(f"❌ Groq Client Initialisation Failed: {e}")
        raise

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
