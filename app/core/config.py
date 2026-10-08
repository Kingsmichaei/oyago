from functools import lru_cache
from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict

BASE_DIR = Path(__file__).resolve().parents[2]  # backend/


class Settings(BaseSettings):
    """App settings, read from environment variables or backend/.env."""

    model_config = SettingsConfigDict(env_file=BASE_DIR / ".env", extra="ignore")

    app_name: str = "OyaGo API"

    backboard_api_key: str = ""
    routes_assistant_id: str = ""

    # Open-weight model served through Backboard
    llm_provider: str = "openrouter"
    model_name: str = "google/gemma-3-27b-it"

    # Comma-separated list of allowed frontend origins, or "*"
    allowed_origins: str = "*"

    data_dir: Path = BASE_DIR / "data"

    @property
    def cors_origins(self) -> list[str]:
        return [o.strip() for o in self.allowed_origins.split(",") if o.strip()]

    @property
    def routes_file(self) -> Path:
        return self.data_dir / "lagos_routes.md"

    @property
    def community_dir(self) -> Path:
        return self.data_dir / "community"


@lru_cache
def get_settings() -> Settings:
    return Settings()
