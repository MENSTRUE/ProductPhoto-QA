"""ProductPhoto QA API - stable React-compatible routes."""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api.routes import router
from .core.config import settings

app = FastAPI(
    title="ProductPhoto QA", version="0.2.0",
    description="Explainable photo quality diagnostics; not validated marketplace acceptance.",
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)
app.include_router(router, prefix="/api/v1")
