from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    DATABASE_URL: str
    GROQ_API_KEY: str
    ACCESS_SECRET: str
    REFRESH_SECRET: str
    ALGO: str = "HS256"

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

# Module-level singleton — populated by main.py during the startup event.
# All consumers should import `get_settings()` rather than `settings` directly
# so they always receive the fully-initialised object.
_settings: Settings | None = None

def get_settings() -> Settings:
    if _settings is None:
        raise RuntimeError(
            "Settings have not been initialised yet. "
            "Ensure the FastAPI startup event has completed before accessing settings."
        )
    return _settings

def init_settings() -> Settings:
    """Instantiate and cache the Settings singleton. Called once at startup."""
    global _settings
    _settings = Settings()
    return _settings
