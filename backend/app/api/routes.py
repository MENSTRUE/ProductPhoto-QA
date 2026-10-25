"""Stable v1 endpoints consumed by the existing React frontend."""
from fastapi import APIRouter, File, HTTPException, UploadFile
from ..core.config import settings
from ..services.analysis import analyze_photo_bytes, model_status

router = APIRouter()

@router.get("/health")
def health():
    return model_status()

@router.post("/analyze")
async def analyze_photo(file: UploadFile = File(...)):
    if file.content_type not in settings.allowed_media_types:
        raise HTTPException(status_code=415, detail="Gunakan JPG, PNG, WEBP, atau BMP.")
    try:
        content = await file.read(settings.max_upload_bytes + 1)
        if not content:
            raise HTTPException(status_code=400, detail="File kosong.")
        if len(content) > settings.max_upload_bytes:
            raise HTTPException(status_code=413, detail="Ukuran foto maksimal 12 MB.")
        try:
            result = analyze_photo_bytes(content)
        except ValueError as exc:
            raise HTTPException(status_code=422, detail=str(exc)) from exc
        return {"filename": file.filename, **result}
    finally:
        await file.close()
