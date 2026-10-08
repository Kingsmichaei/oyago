from fastapi import APIRouter

from app.api.deps import DirectionsServiceDep
from app.schemas.ask import AskRequest, AskResponse

router = APIRouter(prefix="/ask", tags=["directions"])


@router.post("", response_model=AskResponse)
async def ask(body: AskRequest, directions: DirectionsServiceDep):
    return await directions.ask(body.question, body.memory_id, body.thread_id)
