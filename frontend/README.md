# ProductPhoto QA — React Frontend

> Responsive research interface for actual backend analysis, not a demo that fakes model outputs.

## Features and interaction

React 18, TypeScript, Vite; responsive blue-grey dashboard, image picker and drag/drop, previews preserving original aspect ratio, replacement/reset and loading/error flow. GET `/api/v1/health` monitors model/API status; POST `/api/v1/analyze` sends a real multipart FormData `file`; output displays provisional diagnostic flags, KADID quality estimate and measured features, with export of **actual** API JSON. Keep policy and learned estimate separate in presentation.

## Quick start

Run API in one terminal (`backend`):

```powershell
.\.venv\Scripts\python.exe -m uvicorn app.main:app --reload
```

Run UI in another (`frontend`):

```powershell
npm ci
npm run dev
```

Open http://127.0.0.1:5173. The API defaults to http://127.0.0.1:8000; create `frontend/.env` from `.env.example` and set `VITE_API_BASE_URL` if needed, then restart Vite. `.env` must not be committed.

## Build and checks

```powershell
npm run build
npm run preview
```

`npm run build` runs **TypeScript validation and Vite production bundling**. This document does **not** claim build completed successfully until the actual local output is available. Test desktop/mobile, keyboard access, photo square/portrait/landscape (not stretched or cropped), API-down states, invalid files, upload size, JSON export and consistency with Swagger.

## User-facing claim boundaries

Do not label `PASS_PROVISIONAL` as “Approved” or render KADID score as a marketplace pass probability, AI confidence or pass-fail classification metric. Backend still requires product-domain human labels for that.

Read [main README](../README.md), [architecture](../docs/en/ARCHITECTURE.md), [claim policy](../docs/en/CLAIMS.md), [API contract](../docs/en/API.md), [troubleshooting](../docs/en/TROUBLESHOOTING.md).
