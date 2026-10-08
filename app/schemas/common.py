from pydantic import BaseModel


class OkResponse(BaseModel):
    ok: bool = True


class HealthResponse(BaseModel):
    ok: bool
    model: str
    routes_ready: bool
