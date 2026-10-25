# ProductPhoto QA Architecture

Flow: **React (port 5173) → FastAPI (port 8000) → OpenCV and KADID model → JSON response**.

- `backend/app/main.py`: application setup, CORS and router registration.
- `backend/app/api/routes.py`: HTTP health check, uploads and validation.
- `backend/app/core/config.py`: 12 MB upload limit and frontend origins.
- `backend/app/services/analysis.py`: use-case boundary.
- `backend/app/quality.py`: **single source of truth** for 11 features, preprocessing, artifact loading, provisional diagnostics, and KADID inference.
- `ml/inference/predict.py`: offline CLI using the same pipeline.
- `ml/evaluation/metrics.py`: recompute regression metrics from the held-out prediction CSV.

The React-facing API remains unchanged: `GET /api/v1/health` and `POST /api/v1/analyze` using the `file` multipart field.

## Scientific limitations

KADID concerns synthetic perceptual distortions, not seller photo acceptance. `PASS_PROVISIONAL` and `REVIEW` are uncalibrated heuristics. SPAQ photo MOS evaluation is unavailable because the mounted split archive lacks its terminal ZIP. Finegrain does not provide verified quality-acceptance labels.
