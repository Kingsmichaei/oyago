"""FastAPI dependencies. Tests override `get_backboard` to avoid real API calls."""

from typing import Annotated

from backboard import BackboardClient
from fastapi import Depends

from app.core.config import Settings, get_settings
from app.services.backboard_client import create_backboard_client
from app.services.directions_service import DirectionsService
from app.services.memory_service import MemoryService
from app.services.route_service import RouteService

SettingsDep = Annotated[Settings, Depends(get_settings)]


def get_backboard(settings: SettingsDep) -> BackboardClient:
    return create_backboard_client(settings)


BackboardDep = Annotated[BackboardClient, Depends(get_backboard)]


def get_memory_service(client: BackboardDep) -> MemoryService:
    return MemoryService(client)


def get_directions_service(
    client: BackboardDep,
    settings: SettingsDep,
    memory: Annotated[MemoryService, Depends(get_memory_service)],
) -> DirectionsService:
    return DirectionsService(client, settings, memory)


def get_route_service(client: BackboardDep, settings: SettingsDep) -> RouteService:
    return RouteService(client, settings)


MemoryServiceDep = Annotated[MemoryService, Depends(get_memory_service)]
DirectionsServiceDep = Annotated[DirectionsService, Depends(get_directions_service)]
RouteServiceDep = Annotated[RouteService, Depends(get_route_service)]
