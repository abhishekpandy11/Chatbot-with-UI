from sqlmodel import SQLModel, create_engine, Session

from app.config import settings

engine = create_engine(
    settings.DATABASE_URL,
    echo=True
)

# ✅ THIS WAS MISSING
def create_db():
    import app.models.user
    import app.models.chat
    import app.models.analytics
    SQLModel.metadata.create_all(engine)

# Dependency for FastAPI
def get_session():
    with Session(engine) as session:
        yield session