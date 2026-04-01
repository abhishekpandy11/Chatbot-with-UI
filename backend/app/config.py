from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    DATABASE_URL: str
    GROQ_API_KEY: str
    ACCESS_SECRET: str
    REFRESH_SECRET: str
    ALGO: str = "HS256"

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

settings = Settings()
