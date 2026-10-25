# ProductPhoto QA — Frontend

React + TypeScript + Vite interface connected to the actual ProductPhoto QA FastAPI backend. No mocked prediction data.

## Run locally (Windows / PowerShell)

From the repository root:

```powershell
cd frontend
npm install
npm run dev
```

Open **http://127.0.0.1:5173**.

Keep the backend running in a second VS Code terminal:

```powershell
cd backend
.\.venv\Scripts\python.exe -m uvicorn app.main:app --reload
```

The backend must run at `http://127.0.0.1:8000`. To override the URL, copy `.env.example` to `.env` and change `VITE_API_BASE_URL` (restart Vite after editing).

## Features

- Drag/drop or file picker; preview, replace, and reset image
- Client-side extension and 12MB checks; server-side validation remains authoritative
- Live `GET /api/v1/health` status and refresh
- Real `POST /api/v1/analyze` using multipart `FormData`
- Displays heuristic PASS_PROVISIONAL or REVIEW independent of KADID estimate
- Sharpness, brightness, contrast, image size, and detailed raw metrics
- Export the **actual** API response as JSON
- Mobile responsive layout, basic keyboard accessibility, loading/error states, request cancellation

## Important research limitation

This is a diagnostic prototype. The KADID regression score was learned from synthetically distorted images, **not** from seller approval labels. `PASS_PROVISIONAL` is based on *uncalibrated* blur/brightness thresholds and must never be called verified product acceptance.

## Reproducibility

The frontend deliberately does **not** calculate model scores or use demo placeholders. The `quality_estimate` and metrics shown come from the FastAPI backend. If the backend is down or fails, users see an error. API CORS in the current backend permits `http://localhost:5173` and `http://127.0.0.1:5173`.

## Build

```powershell
npm run build
```

Note: Do not commit `node_modules`, `dist`, or local `.env` files. Git commit naming and timing remain the repository owner's choice.
