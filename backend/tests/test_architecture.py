"""Regression tests for stable endpoints and reusable ML code."""
from io import BytesIO
import cv2
import numpy as np
from fastapi.testclient import TestClient
from app.main import app
from app.quality import extract_features, FEATURES
from pathlib import Path

client = TestClient(app)

def test_openapi_has_stable_endpoints():
    paths = client.get("/openapi.json").json()["paths"]
    assert "/api/v1/health" in paths
    assert "/api/v1/analyze" in paths

def test_analysis_contract_matches_features():
    image = np.full((128, 256, 3), 128, dtype=np.uint8)
    assert list(extract_features(image)) == FEATURES

def test_analyze_response_backward_compatible():
    image = np.full((128, 256, 3), 128, dtype=np.uint8)
    ok, encoded = cv2.imencode(".png", image)
    assert ok
    response = client.post("/api/v1/analyze", files={
        "file": ("example.png", BytesIO(encoded.tobytes()), "image/png")})
    assert response.status_code == 200
    data = response.json()
    assert {"filename", "status", "reasons", "metrics", "quality_estimate", "disclaimer"} <= data.keys()
    assert data["filename"] == "example.png"

def test_empty_image_rejected():
    response = client.post("/api/v1/analyze", files={"file": ("empty.png", b"", "image/png")})
    assert response.status_code == 400
