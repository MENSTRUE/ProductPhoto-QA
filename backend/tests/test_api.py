from io import BytesIO

import cv2
import numpy as np
from fastapi.testclient import TestClient
from app.main import app
from app.quality import FEATURES, extract_features

client = TestClient(app)


def test_health():
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_feature_contract():
    image = np.full((128, 256, 3), 128, dtype=np.uint8)
    features = extract_features(image)
    assert list(features) == FEATURES
    assert features["width"] == 256
    assert features["height"] == 128


def test_analyze_valid_image():
    image = np.full((128, 256, 3), 128, dtype=np.uint8)
    ok, encoded = cv2.imencode(".png", image)
    assert ok
    response = client.post("/api/v1/analyze", files={"file": ("sample.png", BytesIO(encoded.tobytes()), "image/png")})
    assert response.status_code == 200
    data = response.json()
    assert data["status"] in ("REVIEW", "PASS_PROVISIONAL")
    assert data["quality_estimate"]["scale"] == "1-5"


def test_reject_invalid_extension_content():
    response = client.post("/api/v1/analyze", files={"file": ("fake.jpg", b"not an image", "image/jpeg")})
    assert response.status_code == 422


def test_reject_wrong_media_type():
    response = client.post("/api/v1/analyze", files={"file": ("test.txt", b"hello", "text/plain")})
    assert response.status_code == 415


def test_reject_too_large():
    response = client.post("/api/v1/analyze", files={"file": ("huge.jpg", b"x" * (12 * 1024 * 1024 + 1), "image/jpeg")})
    assert response.status_code == 413
