from fastapi import APIRouter, status

from app.api.deps import MemoryServiceDep
from app.schemas.place import SessionResponse

router = APIRouter(prefix="/session", tags=["session"])


@router.post("", response_model=SessionResponse, status_code=status.HTTP_201_CREATED)
async def create_session(memory: MemoryServiceDep):
    """Create a personal memory store for a new user. The phone keeps the id."""
    return SessionResponse(memory_id=await memory.create_user_memory())
