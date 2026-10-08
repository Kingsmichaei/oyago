from pydantic import BaseModel, Field


class AskRequest(BaseModel):
    question: str = Field(min_length=2, max_length=500)
    memory_id: str | None = Field(default=None, description="The user's memory assistant id")
    thread_id: str | None = Field(default=None, description="Continue an existing conversation")


class AskResponse(BaseModel):
    answer: str
    thread_id: str | None
