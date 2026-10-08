from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.api.router import api_router
from app.core.config import get_settings
from app.core.exceptions import OyaGoError


def create_app() -> FastAPI:
    settings = get_settings()
    app = FastAPI(title=settings.app_name, version="0.1.0")

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    @app.exception_handler(OyaGoError)
    async def handle_oyago_error(_: Request, exc: OyaGoError):
        return JSONResponse(status_code=exc.status_code, content={"detail": exc.message})

    app.include_router(api_router)
    return app


app = create_app()
