from fastapi import APIRouter

from app.api.endpoints import ask, health, location, places, routes, sessions

api_router = APIRouter()
api_router.include_router(health.router)
api_router.include_router(sessions.router)
api_router.include_router(places.router)
api_router.include_router(ask.router)
api_router.include_router(routes.router)
api_router.include_router(location.router)
