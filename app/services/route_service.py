"""Community-submitted routes: written as small markdown docs and added to RAG."""

import re
from datetime import datetime, timezone
from pathlib import Path

from backboard import BackboardClient

from app.core.config import Settings
from app.core.exceptions import ConfigurationError
from app.schemas.route import RouteCreate, RouteCreated


def slugify(text: str, max_len: int = 60) -> str:
    return re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")[:max_len]


def render_route_markdown(route: RouteCreate) -> str:
    return (
        f"## {route.origin} to {route.destination} (community-submitted, not yet verified)\n\n"
        f"**Steps:**\n{route.steps.strip()}\n\n"
        f"**Fare:** {route.fare.strip() or 'not given'}\n\n"
        f"**Tips:** {route.tips.strip() or 'none'}\n\n"
        f"_Added by {route.contributor.strip() or 'anonymous'}_\n"
    )


class RouteService:
    def __init__(self, client: BackboardClient, settings: Settings):
        self.client = client
        self.settings = settings

    def _write_file(self, route: RouteCreate) -> Path:
        folder = self.settings.community_dir
        folder.mkdir(parents=True, exist_ok=True)
        stamp = datetime.now(timezone.utc).strftime("%Y%m%d%H%M%S")
        path = folder / f"{stamp}-{slugify(f'{route.origin}-to-{route.destination}')}.md"
        path.write_text(render_route_markdown(route), encoding="utf-8")
        return path

    async def add_route(self, route: RouteCreate) -> RouteCreated:
        if not self.settings.routes_assistant_id:
            raise ConfigurationError("ROUTES_ASSISTANT_ID is not set. Run scripts/setup_assistant.py first.")
        path = self._write_file(route)
        doc = await self.client.upload_document_to_assistant(self.settings.routes_assistant_id, str(path))
        return RouteCreated(document_id=str(doc.document_id), status=doc.status)
