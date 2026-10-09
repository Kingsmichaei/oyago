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

    # "Use my location": snap to a known stop within this radius, else ask OpenStreetMap
    stop_match_radius_m: int = 2000
    nominatim_url: str = "https://nominatim.openstreetmap.org/reverse"
    nominatim_contact: str = ""  # email or URL, sent in the User-Agent per Nominatim's usage policy
    nominatim_timeout_s: float = 5.0
    nominatim_min_interval_s: float = 1.0  # Nominatim allows at most 1 request per second

    @property
    def cors_origins(self) -> list[str]:
        return [o.strip() for o in self.allowed_origins.split(",") if o.strip()]

    @property
    def routes_file(self) -> Path:
        return self.data_dir / "lagos_routes.md"

    @property
    def community_dir(self) -> Path:
        return self.data_dir / "community"

    @property
    def stops_file(self) -> Path:
        return self.data_dir / "stops.json"

    @property
    def nominatim_user_agent(self) -> str:
        contact = self.nominatim_contact.strip()
        return f"OyaGo/0.1 (contact: {contact})" if contact else "OyaGo/0.1"


@lru_cache
def get_settings() -> Settings:
    return Settings()
