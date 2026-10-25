"""Backend use case. Calculation stays in the existing, tested quality module.

The ml/ package offers reusable offline tools without becoming a second,
inconsistent copy of preprocessing.
"""
from ..quality import analyze, load_artifacts

def analyze_photo_bytes(content: bytes) -> dict:
    return analyze(content)

def model_status() -> dict:
    model, _, error = load_artifacts()
    return {"status": "ok", "model_loaded": model is not None, "model_error": error}
