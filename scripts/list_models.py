"""List open-weight models available through Backboard.

Usage (from the backend folder):
    python -m scripts.list_models gemma
"""

import asyncio
import sys

from app.core.config import get_settings
from app.services.backboard_client import create_backboard_client


async def main() -> None:
    bb = create_backboard_client(get_settings())
    word = (sys.argv[1] if len(sys.argv) > 1 else "gemma").lower()
    for provider in ("openrouter", "featherless"):
        try:
            result = await bb.list_models(provider=provider, limit=100)
        except Exception as exc:
            print(f"{provider}: {exc}")
            continue
        for model in getattr(result, "models", None) or []:
            name = getattr(model, "name", None) or getattr(model, "model_name", None) or str(model)
            if word in str(name).lower():
                print(f"{provider}  {name}")


if __name__ == "__main__":
    asyncio.run(main())
