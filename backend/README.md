# ProductPhoto QA — FastAPI Backend

> **Local research MVP API.** It reports transparent image diagnostics and a KADID perceptual-score estimate; it does **not** validate merchant acceptance.

## What is actually implemented

`GET /api/v1/health` reports API status and model availability. `POST /api/v1/analyze` accepts one multipart photo (`file`) and returns `filename`, `status`, `reasons`, `metrics`, `quality_estimate`, `disclaimer`. Media types: JPEG, PNG, WEBP, BMP; limit **12 MiB**. Inputs are decoded via OpenCV; malformed bytes rejected. Four HTTP error classes are documented in [API](../docs/en/API.md).

## Start (Windows PowerShell)

From `backend/`:

```powershell
py -3.11 -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
.\.venv\Scripts\python.exe -m pytest -q
.\.venv\Scripts\python.exe -m uvicorn app.main:app --reload
```

Swagger: http://127.0.0.1:8000/docs. Use `GET /api/v1/health` and verify `model_loaded:true` before demonstrating learned model predictions. Tested locally with **10 passing tests and one Starlette TestClient deprecation warning**; don't claim warning-free tests. The model's serialized scikit-learn runtime should match **1.6.1**.

## Implementation map

| Path | Responsibility |
|---|---|
| `app/main.py` | App initialization, CORS |
| `app/api/routes.py` | HTTP contract, validation and response |
| `app/core/config.py` | Local origins, 12 MiB limit, allowed MIME |
| `app/services/analysis.py` | HTTP-to-quality service layer |
| `app/quality.py` | Source-of-truth feature calculations, policy, model loader |
| `tests/test_api.py` | Functional API behavior |
| `tests/test_architecture.py` | Source-of-truth and integration expectations |

## Environment

The model is resolved relative to repository `models/` by default; optional variables `PRODUCTPHOTO_MODEL_PATH` and `PRODUCTPHOTO_CONFIG_PATH` can override model/config paths. **Only load trusted `.joblib` artifacts**: joblib deserialization can execute code. Preprocessing: OpenCV BGR, maximum edge 640 (`INTER_AREA`, truncation), 11 features in exact order from `models/model_config.json`.

Frontend CORS is restricted to `http://localhost:5173` and `http://127.0.0.1:5173` in the current code. For public hosting, review origins, TLS, rate limits, memory abuse and privacy before deployment; `uvicorn --reload` is for development only.

## Compatibility and limits

The `status` (`PASS_PROVISIONAL`/`REVIEW`) is a **separate, uncalibrated heuristic** from the learned score. Preserve both outputs across refactors. Returning `quality_estimate.available=false`, `value=null` when model unavailable is honest; do not generate fake scores. Read [AGENTS](../AGENTS.md), [API](../docs/en/API.md), [testing](../docs/en/TESTING.md), [troubleshooting](../docs/en/TROUBLESHOOTING.md).
