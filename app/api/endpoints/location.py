from fastapi import APIRouter

from app.api.deps import LocationServiceDep
from app.schemas.location import LocateRequest, LocateResponse

router = APIRouter(prefix="/locate", tags=["location"])


@router.post("", response_model=LocateResponse)
async def locate(body: LocateRequest, location: LocationServiceDep):
    """Nearest known bus stop to the user's coordinates, or the area name from OpenStreetMap.

    Coordinates are used for this lookup only: they are not stored, logged or sent to the model.
    """
    return await location.locate(body.lat, body.lng)
