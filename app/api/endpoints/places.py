from fastapi import APIRouter, status

from app.api.deps import MemoryServiceDep
from app.schemas.common import OkResponse
from app.schemas.place import PlaceCreate, PlaceList

router = APIRouter(prefix="/places", tags=["places"])


@router.get("", response_model=PlaceList)
async def list_places(memory_id: str, memory: MemoryServiceDep):
    return PlaceList(places=await memory.list_places(memory_id))


@router.post("", response_model=OkResponse, status_code=status.HTTP_201_CREATED)
async def add_place(body: PlaceCreate, memory: MemoryServiceDep):
    await memory.add_place(body.memory_id, body.label, body.place)
    return OkResponse()


@router.delete("/{place_id}", response_model=OkResponse)
async def delete_place(place_id: str, memory_id: str, memory: MemoryServiceDep):
    await memory.delete_place(memory_id, place_id)
    return OkResponse()
