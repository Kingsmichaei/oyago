from typing import Literal

from pydantic import BaseModel, ConfigDict, Field


class LocateRequest(BaseModel):
    model_config = ConfigDict(allow_inf_nan=False)

    lat: float = Field(ge=-90, le=90)
    lng: float = Field(ge=-180, le=180)


class LocateResponse(BaseModel):
    name: str | None
    source: Literal["stop", "osm", "none"]
    distance_m: int | None = Field(default=None, description="Distance to the matched stop, if any")


class Stop(BaseModel):
    """A known bus stop / motor park from data/stops.json."""

    name: str
    aliases: list[str] = []
    lat: float
    lng: float
    verified: bool = False
