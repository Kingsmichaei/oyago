from backboard import BackboardClient

from app.core.config import Settings
from app.core.exceptions import ConfigurationError


def create_backboard_client(settings: Settings) -> BackboardClient:
    if not settings.backboard_api_key:
        raise ConfigurationError("BACKBOARD_API_KEY is not set on the server.")
    return BackboardClient(api_key=settings.backboard_api_key)
