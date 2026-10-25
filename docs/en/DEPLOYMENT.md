# Deployment and operations guide

## Supported now: local development only

Terminal A (repo root → backend):

```powershell
cd backend
.\\.venv\\Scripts\\python.exe -m uvicorn app.main:app --reload
```

Terminal B (repo root → frontend):

```powershell
cd frontend
npm ci
npm run dev
```

Backend: `http://127.0.0.1:8000/docs`. Frontend: `http://127.0.0.1:5173`. Default CORS is limited to these localhost port 5173 origins. The frontend API URL can be configured through `VITE_API_BASE_URL` in `frontend/.env` (copy `.env.example`). Restart Vite after edits.

## Build

Run `npm run build` from `frontend`, which executes `tsc -b && vite build` and generates `dist/`. That **only** builds static client assets; it does not deploy an API or provision hosting.

## Checklist before any public deployment

1. Verify hosting owner/region/data retention/legal basis, inspect dataset and image licenses and remove personal test photos.
2. Run backend tests, frontend build, API contract + E2E checks; record output/commit hash.
3. Package a pinned Python 3.11 environment, trusted model, exact config, health startup and resource bounds. Confirm `.joblib` integrity; never accept arbitrary uploads as model binaries.
4. Configure TLS/reverse proxy, unprivileged runtime, restricted CORS origin(s), upload MIME+magic+decode validation, decompression limits, rate limits, timeouts, observability and error redaction.
5. Define privacy and abuse handling for potentially personal uploaded photos; avoid keeping raw images by default if not necessary.
6. Define uptime monitoring, rollback, deployment secrets storage and incident response; route errors without leaking host file paths.
7. State **not a calibrated seller acceptance system** prominently, monitor drift on actual domain photos, and require human review.

## Deployment status

**Not deployed.** No cloud URL, CDN, domain, container runtime, CI status or online service contract has been established in the audited repository; do not invent them.
