"""'Use my location': turn the phone's coordinates into a place name the model understands.

Privacy: coordinates never leave this module except as a rounded (~100 m) query to Nominatim.
Only the place name goes back to the caller, and nothing here logs coordinates.
"""

import asyncio
import json
import logging
import math
import time
from functools import lru_cache
from pathlib import Path

import httpx

from app.core.config import Settings
from app.schemas.location import LocateResponse, Stop

logger = logging.getLogger(__name__)

# httpx logs full request URLs at INFO level, and ours contain coordinates
logging.getLogger("httpx").setLevel(logging.WARNING)

EARTH_RADIUS_M = 6_371_000
# Nominatim address fields, most local first
OSM_NAME_FIELDS = ("suburb", "neighbourhood", "quarter", "city_district", "town", "village", "city")


def haversine_m(lat1: float, lng1: float, lat2: float, lng2: float) -> float:
    """Great-circle distance between two points, in metres."""
    p1, p2 = math.radians(lat1), math.radians(lat2)
    dp, dl = p2 - p1, math.radians(lng2 - lng1)
    a = math.sin(dp / 2) ** 2 + math.cos(p1) * math.cos(p2) * math.sin(dl / 2) ** 2
    return 2 * EARTH_RADIUS_M * math.asin(math.sqrt(a))


@lru_cache
def load_stops(path: Path) -> tuple[Stop, ...]:
    try:
        return tuple(Stop(**s) for s in json.loads(path.read_text(encoding="utf-8")))
    except (OSError, ValueError) as exc:
        logger.warning("Could not load stops from %s (%s); using OpenStreetMap only", path, exc)
        return ()


class ReverseGeocodeCache:
    """Remembers Nominatim answers by rounded coordinates and spaces requests out per its usage policy."""

    def __init__(self, max_size: int = 2048):
        self.names: dict[tuple[float, float], str | None] = {}
        self.max_size = max_size
        self._lock = asyncio.Lock()
        self._last_request = 0.0

    def put(self, key: tuple[float, float], name: str | None) -> None:
        if len(self.names) >= self.max_size:
            self.names.pop(next(iter(self.names)))  # drop the oldest entry
        self.names[key] = name

    async def wait_turn(self, min_interval_s: float) -> None:
        async with self._lock:
            delay = self._last_request + min_interval_s - time.monotonic()
            if delay > 0:
                await asyncio.sleep(delay)
            self._last_request = time.monotonic()

    def clear(self) -> None:
        self.names.clear()
        self._last_request = 0.0


# Shared across requests: the service itself is created per request
osm_cache = ReverseGeocodeCache()


class LocationService:
    def __init__(
        self,
        settings: Settings,
        http: httpx.AsyncClient,
        stops: tuple[Stop, ...] | None = None,
        cache: ReverseGeocodeCache = osm_cache,
    ):
        self.settings = settings
        self.http = http
        self.stops = load_stops(settings.stops_file) if stops is None else stops
        self.cache = cache

    def nearest_stop(self, lat: float, lng: float) -> tuple[Stop, float] | None:
        """The closest known stop and its distance in metres, if it's within the match radius."""
        best = min(
            ((stop, haversine_m(lat, lng, stop.lat, stop.lng)) for stop in self.stops),
            key=lambda pair: pair[1],
            default=None,
        )
        if best and best[1] <= self.settings.stop_match_radius_m:
            return best
        return None

    async def reverse_geocode(self, lat: float, lng: float) -> str | None:
        """Suburb or neighbourhood name from OpenStreetMap. Never raises: returns None on any failure."""
        key = (round(lat, 3), round(lng, 3))
        if key in self.cache.names:
            return self.cache.names[key]

        try:
            await self.cache.wait_turn(self.settings.nominatim_min_interval_s)
            res = await self.http.get(
                self.settings.nominatim_url,
                params={"format": "jsonv2", "lat": key[0], "lon": key[1], "zoom": 16, "accept-language": "en"},
                headers={"User-Agent": self.settings.nominatim_user_agent},
                timeout=self.settings.nominatim_timeout_s,
            )
            res.raise_for_status()
            address = res.json().get("address") or {}
        except Exception as exc:
            # Only the error type: httpx messages include the URL, which has the coordinates
            logger.warning("Nominatim reverse geocode failed: %s", type(exc).__name__)
            return None

        name = next((address[f] for f in OSM_NAME_FIELDS if address.get(f)), None)
        self.cache.put(key, name)
        return name

    async def locate(self, lat: float, lng: float) -> LocateResponse:
        match = self.nearest_stop(lat, lng)
        if match:
            stop, distance = match
            return LocateResponse(name=stop.name, source="stop", distance_m=round(distance))

        name = await self.reverse_geocode(lat, lng)
        if name:
            return LocateResponse(name=name, source="osm")
        return LocateResponse(name=None, source="none")
