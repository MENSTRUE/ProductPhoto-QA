# ProductPhoto QA

**Explainable photo-quality diagnostics for product photography** — Day 18 / 100 Days of Projects.

A functional research MVP combining a KADID perceptual-quality regression baseline with OpenCV sharpness/lighting diagnostics and a React interface. **Not a validated marketplace photo-acceptance classifier.**

## Features
- Drag-and-drop photo upload and image preview via React + TypeScript + Vite.
- FastAPI endpoint for image analysis (`POST /api/v1/analyze`).
- OpenCV sharpness, brightness, contrast, color and entropy descriptors.
- KADID model estimate on a 1–5 scale when the trained model is present.
- Provisional review recommendations, detailed metrics and JSON export.
- Reusable offline ML inference and evaluation helpers.

## Run locally (Windows PowerShell)

First ensure `models/kadid_quality_proxy.joblib` and `models/model_config.json` came from the trusted Kaggle run.

**Terminal 1 — Backend:**

```powershell
cd backend
py -3.11 -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
.\.venv\Scripts\python.exe -m pytest -q
.\.venv\Scripts\python.exe -m uvicorn app.main:app --reload
```

Swagger UI: http://127.0.0.1:8000/docs

**Terminal 2 — Frontend:**

```powershell
cd frontend
npm install
npm run dev
```

App: http://127.0.0.1:5173

**Repository-root ML tools:**

```powershell
py -3.11 -m ml.evaluation.metrics --predictions exports/kadid_heldout_predictions.csv
py -3.11 -m ml.inference.predict "C:\path\to\photo.jpg"
```

The second tool requires the backend packages installed into the interpreter used for the command; alternatively use `backend\.venv\Scripts\python.exe -m ml.inference.predict ...` from the project root.

## Research outcomes

| Source | Actual role | Outcome |
|---|---|---|
| KADID-10k | Supervised perceptual quality regression | v1 held-out MAE 0.7683 / RMSE 0.9669 / R² 0.1925 |
| Finegrain products | Product-domain OpenCV smoke test | 120 decoded in later v4.2 run; no quality ground truth |
| SPAQ | MOS metadata audit | Missing final split-archive ZIP; photographs not evaluated |

KADID model estimates and provisional PASS/REVIEW diagnostics are **distinct outputs**. Their apparent disagreement is not proof of a bug, nor proof of seller quality.

Documentation: [ID architecture](docs/id/ARCHITECTURE.md) · [EN architecture](docs/en/ARCHITECTURE.md) · [ID experiments](docs/id/EXPERIMENTS.md) · [EN experiments](docs/en/EXPERIMENTS.md).

## Safety and scope

Do not commit raw datasets, virtual environments, `node_modules`, personal photos, or secrets. Only load `.joblib` artifacts from trusted sources; deserialization can execute code.

MIT license.
