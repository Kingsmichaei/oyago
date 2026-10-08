"""One-time setup: create the shared routes assistant and upload the route knowledge.

Usage (from the backend folder):
    python -m scripts.setup_assistant
    python -m scripts.setup_assistant <existing_assistant_id>   # re-upload the routes file

Copy the printed ROUTES_ASSISTANT_ID into backend/.env and your Render env vars.
"""

import asyncio
import sys

from app.core.config import get_settings
from app.services.backboard_client import create_backboard_client


async def main() -> None:
    settings = get_settings()
    routes_file = settings.routes_file

    if "TODO" in routes_file.read_text(encoding="utf-8"):
        sys.exit(
            f"{routes_file.name} still has TODO placeholders. Replace them with routes you "
            "actually know before uploading - the AI only knows what this file says."
        )

    bb = create_backboard_client(settings)

    if len(sys.argv) > 1:
        assistant_id = sys.argv[1]
        print(f"Using existing assistant {assistant_id}")
    else:
        assistant = await bb.create_assistant(
            name="OyaGo Lagos Routes",
            description="Lagos danfo, BRT, keke and okada route knowledge for OyaGo.",
        )
        assistant_id = str(assistant.assistant_id)
        print(f"Created assistant {assistant_id}")

    doc = await bb.upload_document_to_assistant(assistant_id, str(routes_file))
    print(f"Uploaded {routes_file.name}: {doc.document_id}")

    while True:
        status = await bb.get_document_status(doc.document_id)
        print(f"  status: {status.status}")
        if status.status == "indexed":
            break
        if status.status == "error":
            sys.exit(f"Indexing failed: {status.status_message}")
        await asyncio.sleep(2)

    print(f"\nDone. Add this to backend/.env and Render:\nROUTES_ASSISTANT_ID={assistant_id}")


if __name__ == "__main__":
    asyncio.run(main())
