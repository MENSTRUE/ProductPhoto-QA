"""Reusable inference from scripts; delegates to the SAME backend pipeline.

Call from repository root:
    python -m ml.inference.predict path/to/photo.jpg
Only load .joblib artifacts you trust.
"""
from pathlib import Path
import argparse
import json
from backend.app.quality import analyze

def predict_image(content: bytes) -> dict:
    return analyze(content)

def predict_file(path: str | Path) -> dict:
    source = Path(path)
    if not source.is_file():
        raise FileNotFoundError(f"Photo not found: {source}")
    return {"filename": source.name, **predict_image(source.read_bytes())}

def main() -> None:
    parser = argparse.ArgumentParser(description="ProductPhoto QA local image inference")
    parser.add_argument("image", type=Path)
    args = parser.parse_args()
    print(json.dumps(predict_file(args.image), ensure_ascii=False, indent=2))

if __name__ == "__main__":
    main()
