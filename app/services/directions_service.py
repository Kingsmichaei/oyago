"""Answers trip questions with the open model, grounded in the route documents (RAG)."""

from backboard import BackboardClient

from app.core.config import Settings
from app.core.exceptions import ConfigurationError, UpstreamError
from app.core.prompts import DIRECTIONS_SYSTEM_PROMPT, build_question_prompt
from app.schemas.ask import AskResponse
from app.services.memory_service import MemoryService

FALLBACK_ANSWER = "Sorry, I no get answer for that one. Try again."


class DirectionsService:
    def __init__(self, client: BackboardClient, settings: Settings, memory: MemoryService):
        self.client = client
        self.settings = settings
        self.memory = memory

    async def ask(
        self, question: str, memory_id: str | None, thread_id: str | None, origin: str | None = None
    ) -> AskResponse:
        if not self.settings.routes_assistant_id:
            raise ConfigurationError("ROUTES_ASSISTANT_ID is not set. Run scripts/setup_assistant.py first.")

        places = await self.memory.place_texts(memory_id)
        prompt = build_question_prompt(question, places, origin)

        options = dict(
            system_prompt=DIRECTIONS_SYSTEM_PROMPT,
            llm_provider=self.settings.llm_provider,
            model_name=self.settings.model_name,
            memory="off",  # saved places are passed explicitly above
            stream=False,
        )
        if thread_id:
            options["thread_id"] = thread_id
        else:
            options["assistant_id"] = self.settings.routes_assistant_id

        try:
            response = await self.client.send_message(prompt, **options)
        except Exception as exc:
            raise UpstreamError(f"Model call failed: {exc}") from exc

        return AskResponse(answer=response.content or FALLBACK_ANSWER, thread_id=response.thread_id)
