"""Central API settings. No secrets or environment-specific assumptions."""
from dataclasses import dataclass

@dataclass(frozen=True)
class Settings:
    max_upload_bytes: int = 12 * 1024 * 1024
    allowed_media_types: frozenset[str] = frozenset({
        "image/jpeg", "image/png", "image/webp", "image/bmp"
    })
    cors_origins: tuple[str, ...] = (
        "http://localhost:5173", "http://127.0.0.1:5173"
    )
settings = Settings()
