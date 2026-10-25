"""ProductPhoto QA API — local development starter."""
from contextlib import asynccontextmanager
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from .quality import analyze, load_artifacts

MAX_UPLOAD = 12 * 1024 * 1024
ALLOWED_TYPES = {"image/jpeg", "image/png", "image/webp", "image/bmp"}

app = FastAPI(title="ProductPhoto QA", version="0.1.0", description="Explainable photo quality diagnostics; not validated marketplace acceptance.")
app.add_middleware(CORSMiddleware, allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"], allow_credentials=False, allow_methods=["GET", "POST"], allow_headers=["*"])


@app.get("/api/v1/health")
def health():
    model, _, error = load_artifacts()
    return {"status": "ok", "model_loaded": model is not None, "model_error": error}


@app.post("/api/v1/analyze")
async def analyze_photo(file: UploadFile = File(...)):
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(status_code=415, detail="Gunakan JPG, PNG, WEBP, atau BMP.")
    # Read at most limit + 1; don't allocate unbounded uploaded files.
    try:
        content = await file.read(MAX_UPLOAD + 1)
        if not content:
            raise HTTPException(status_code=400, detail="File kosong.")
        if len(content) > MAX_UPLOAD:
            raise HTTPException(status_code=413, detail="Ukuran foto maksimal 12 MB.")
        try:
            result = analyze(content)
        except ValueError as exc:
            raise HTTPException(status_code=422, detail=str(exc)) from exc
        return {"filename": file.filename, **result}
    finally:
        await file.close()
