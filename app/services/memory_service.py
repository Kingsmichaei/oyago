"""Saved places, stored with Backboard memory (one small assistant per user)."""

import uuid

from backboard import BackboardClient

from app.schemas.place import Place


class MemoryService:
    def __init__(self, client: BackboardClient):
        self.client = client

    async def create_user_memory(self) -> str:
        assistant = await self.client.create_assistant(
            name=f"oyago-user-{uuid.uuid4().hex[:8]}",
            description="Stores one OyaGo user's saved places.",
        )
        return str(assistant.assistant_id)

    async def list_places(self, memory_id: str) -> list[Place]:
        result = await self.client.get_memories(memory_id)
        return [Place(id=str(m.id), text=m.content) for m in result.memories]

    async def add_place(self, memory_id: str, label: str, place: str) -> None:
        label, place = label.strip(), place.strip()
        await self.client.add_memory(
            memory_id,
            content=f"The user's {label} is at {place}, Lagos.",
            metadata={"label": label, "place": place},
        )

    async def delete_place(self, memory_id: str, place_id: str) -> None:
        await self.client.delete_memory(memory_id, place_id)

    async def place_texts(self, memory_id: str | None) -> list[str]:
        """Saved places as plain sentences. Never fails: memory is a bonus, not a blocker."""
        if not memory_id:
            return []
        try:
            return [p.text for p in await self.list_places(memory_id)]
        except Exception:
            return []
