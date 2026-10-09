"""FastAPI dependencies. Tests override `get_backboard` and `get_http_client` to avoid real API calls."""

from collections.abc import AsyncIterator
from typing import Annotated

import httpx
from backboard import BackboardClient
from fastapi import Depends

from app.core.config import Settings, get_settings
from app.services.backboard_client import create_backboard_client
from app.services.directions_service import DirectionsService
from app.services.location_service import LocationService
from app.services.memory_service import MemoryService
from app.services.route_service import RouteService

SettingsDep = Annotated[Settings, Depends(get_settings)]


def get_backboard(settings: SettingsDep) -> BackboardClient:
    return create_backboard_client(settings)


BackboardDep = Annotated[BackboardClient, Depends(get_backboard)]


async def get_http_client() -> AsyncIterator[httpx.AsyncClient]:
    async with httpx.AsyncClient() as client:
        yield client


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


def get_location_service(
    settings: SettingsDep, http: Annotated[httpx.AsyncClient, Depends(get_http_client)]
) -> LocationService:
    return LocationService(settings, http)


MemoryServiceDep = Annotated[MemoryService, Depends(get_memory_service)]
DirectionsServiceDep = Annotated[DirectionsService, Depends(get_directions_service)]
RouteServiceDep = Annotated[RouteService, Depends(get_route_service)]
LocationServiceDep = Annotated[LocationService, Depends(get_location_service)]
