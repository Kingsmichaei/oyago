from fastapi import APIRouter, status

from app.api.deps import RouteServiceDep
from app.schemas.route import RouteCreate, RouteCreated

router = APIRouter(prefix="/routes", tags=["community routes"])


@router.post("", response_model=RouteCreated, status_code=status.HTTP_201_CREATED)
async def add_route(body: RouteCreate, routes: RouteServiceDep):
    """A route shared by the community. It is indexed into the AI's route knowledge."""
    return await routes.add_route(body)
