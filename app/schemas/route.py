from pydantic import BaseModel, Field


class RouteCreate(BaseModel):
    origin: str = Field(min_length=2, max_length=80)
    destination: str = Field(min_length=2, max_length=80)
    steps: str = Field(min_length=10, max_length=2000)
    fare: str = Field(default="", max_length=120)
    tips: str = Field(default="", max_length=500)
    contributor: str = Field(default="anonymous", max_length=40)


class RouteCreated(BaseModel):
    document_id: str
    status: str
