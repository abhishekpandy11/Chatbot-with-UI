from sqlmodel import SQLModel, create_engine, Session
from typing import Optional

# Engine is None until init_engine() is called during the startup event.
engine = None

def init_engine(database_url: str):
    """Create the SQLAlchemy engine. Called once at startup after settings are loaded."""
    global engine
    engine = create_engine(database_url, echo=True)

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