from pydantic import BaseModel, Field


class PlaceCreate(BaseModel):
    memory_id: str
    label: str = Field(min_length=1, max_length=30, examples=["Home"])
    place: str = Field(min_length=2, max_length=120, examples=["Ikotun, near the roundabout"])


class Place(BaseModel):
    id: str
    text: str


class PlaceList(BaseModel):
    places: list[Place]


class SessionResponse(BaseModel):
    memory_id: str
