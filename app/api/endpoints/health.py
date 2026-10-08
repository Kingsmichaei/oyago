from fastapi import APIRouter

from app.api.deps import SettingsDep
from app.schemas.common import HealthResponse

router = APIRouter(tags=["health"])


@router.get("/health", response_model=HealthResponse)
async def health(settings: SettingsDep):
    return HealthResponse(
        ok=True,
        model=f"{settings.llm_provider}/{settings.model_name}",
        routes_ready=bool(settings.routes_assistant_id),
    )
