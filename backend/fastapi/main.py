import sentry_sdk
from fastapi import FastAPI
from fastapi.routing import APIRoute
from starlette.middleware.cors import CORSMiddleware

from api.main import api_router
from core.config import settings


def custom_generate_unique_id(route: APIRoute) -> str:
    return f"{route.tags[0]}-{route.name}"


if settings.SENTRY_DSN and settings.ENVIRONMENT != "local":
    sentry_sdk.init(dsn=str(settings.SENTRY_DSN), enable_tracing=True)

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    generate_unique_id_function=custom_generate_unique_id,
)

if settings.ENVIRONMENT == "production":
    CORS_ALLOWED_ORIGINS = [
        'https://api.blockbuilders.tech',
        'http://api.blockbuilders.tech',
        'https://app.blockbuilders.tech',
        'http://app.blockbuilders.tech'
    ]
else :
    CORS_ALLOWED_ORIGINS = [
        "http://localhost",
        "http://localhost:3030",
        "http://127.0.0.1",
        "http://127.0.0.1:3030",
        "http://0.0.0.0",
        "http://app.blockbuilders.tech",
    ]


# Set all CORS enabled origins
if settings.all_cors_origins:
    app.add_middleware(
        CORSMiddleware,
        # allow_origins=settings.all_cors_origins,
        allow_origins=CORS_ALLOWED_ORIGINS,  # For development, allow all origins
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

app.include_router(api_router, prefix=settings.API_V1_STR)