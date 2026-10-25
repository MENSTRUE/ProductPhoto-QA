"""Inference contract matching the Day 18 KADID FULL MASTER v1 notebook."""
from pathlib import Path
import json
import os
from functools import lru_cache

import cv2
import joblib
import numpy as np

FEATURES = [
    "laplacian_var", "tenengrad", "brightness_mean", "brightness_std",
    "dark_fraction", "bright_fraction", "contrast_p95_p5", "colorfulness",
    "entropy", "width", "height",
]
DEFAULT_POLICY = {
    "laplacian_min": 75.0, "brightness_min": 65.0, "brightness_max": 205.0,
    "dark_fraction_max": 0.48, "bright_fraction_max": 0.48,
}
REPO_ROOT = Path(__file__).resolve().parents[2]
MODEL_PATH = Path(os.getenv("PRODUCTPHOTO_MODEL_PATH", str(REPO_ROOT / "models" / "kadid_quality_proxy.joblib")))
CONFIG_PATH = Path(os.getenv("PRODUCTPHOTO_CONFIG_PATH", str(REPO_ROOT / "models" / "model_config.json")))


def decode_image(content: bytes) -> np.ndarray:
    arr = np.frombuffer(content, dtype=np.uint8)
    image = cv2.imdecode(arr, cv2.IMREAD_COLOR)
    if image is None or image.size == 0:
        raise ValueError("File bukan gambar yang dapat dibaca.")
    return image


def extract_features(image: np.ndarray) -> dict[str, float]:
    """Preserve v1 resize, gray, Sobel, colorfulness, entropy, ORIGINAL size."""
    if image is None or image.size == 0:
        raise ValueError("Gambar kosong.")
    height, width = image.shape[:2]
    if max(height, width) > 640:
        ratio = 640 / max(height, width)
        image = cv2.resize(image, (max(1, int(width * ratio)), max(1, int(height * ratio))), interpolation=cv2.INTER_AREA)
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    gx = cv2.Sobel(gray, cv2.CV_32F, 1, 0)
    gy = cv2.Sobel(gray, cv2.CV_32F, 0, 1)
    b, g, r = cv2.split(image.astype(np.float32))
    rg = np.abs(r - g)
    yb = np.abs((r + g) / 2 - b)
    hist = np.bincount(gray.ravel(), minlength=256).astype(float)
    hist /= hist.sum()
    p5, p95 = np.percentile(gray, [5, 95])
    values = [
        float(cv2.Laplacian(gray, cv2.CV_64F).var()),
        float(np.mean(gx * gx + gy * gy)),
        float(gray.mean()), float(gray.std()),
        float((gray < 45).mean()), float((gray > 215).mean()),
        float(p95 - p5),
        float(np.sqrt(rg.std() ** 2 + yb.std() ** 2) + 0.3 * np.sqrt(rg.mean() ** 2 + yb.mean() ** 2)),
        float(-(hist[hist > 0] * np.log2(hist[hist > 0])).sum()),
        float(width), float(height),
    ]
    return dict(zip(FEATURES, values))


def evaluate_policy(features: dict[str, float], policy: dict | None = None) -> tuple[str, list[str]]:
    p = policy or DEFAULT_POLICY
    reasons = []
    if features["laplacian_var"] < p["laplacian_min"]:
        reasons.append("possible_blur")
    if features["brightness_mean"] < p["brightness_min"] or features["dark_fraction"] > p["dark_fraction_max"]:
        reasons.append("possibly_too_dark")
    if features["brightness_mean"] > p["brightness_max"] or features["bright_fraction"] > p["bright_fraction_max"]:
        reasons.append("possibly_too_bright")
    return ("REVIEW" if reasons else "PASS_PROVISIONAL", reasons)


@lru_cache(maxsize=1)
def load_artifacts():
    if not MODEL_PATH.is_file():
        return None, None, f"Model belum ditemukan di {MODEL_PATH}"
    if not CONFIG_PATH.is_file():
        return None, None, f"Konfigurasi model belum ditemukan di {CONFIG_PATH}"
    try:
        config = json.loads(CONFIG_PATH.read_text(encoding="utf-8"))
        if config.get("feature_names") != FEATURES:
            return None, None, "Urutan fitur model_config.json tidak sama dengan eksperimen v1"
        # Only load joblib files YOU created; joblib uses pickle internally.
        model = joblib.load(MODEL_PATH)
        return model, config, None
    except Exception as exc:
        return None, None, f"Gagal memuat model: {exc}"


def analyze(content: bytes) -> dict:
    image = decode_image(content)
    features = extract_features(image)
    model, config, load_error = load_artifacts()
    policy = (config or {}).get("policy", DEFAULT_POLICY)
    status, reasons = evaluate_policy(features, policy)
    score = None
    if model is not None:
        # Fit used a pandas DataFrame with these exact feature names and order.
        import pandas as pd
        sample = pd.DataFrame([[features[key] for key in FEATURES]], columns=FEATURES)
        score = float(np.clip(model.predict(sample)[0], 1, 5))
    return {
        "status": status,
        "reasons": reasons,
        "metrics": features,
        "quality_estimate": {
            "value": round(score, 4) if score is not None else None,
            "scale": "1-5",
            "source": "KADID-10k synthetic-distortion quality regression",
            "available": score is not None,
            "message": load_error if load_error else "Estimasi KADID bukan probabilitas lolos marketplace.",
        },
        "disclaimer": "PASS_PROVISIONAL/REVIEW adalah aturan ilustratif, bukan klasifikasi terkalibrasi atau jaminan kelayakan produk.",
    }
