# Testing, QA and release gates

## Verified recorded checks

Windows test run: `pytest -q` → **10 passed, 1 warning** in ~2.4 seconds. The remaining warning was Starlette TestClient/httpx deprecation, not a test failure. CLI predicted from an actual `produk.jpg` with `quality_estimate.value=2.2069` in the user test and no `runpy` warning after lazy-import fix. User previously observed Swagger 200 and React JSON export. These are dated observations, not continuously monitored CI assertions.

## Local backend

```powershell
cd backend
.\\.venv\\Scripts\\python.exe -m pytest -q
.\\.venv\\Scripts\\python.exe -m uvicorn app.main:app --reload
```

Test health + model loaded; valid JPG; unsupported MIME 415; empty data 400; >12MiB 413; invalid bytes 422. Verify matching fields after any refactor. Warning is tracked and should not be suppressed to pretend zero deprecations.

## Local frontend

```powershell
cd frontend
npm ci
npm run build
npm run dev
```

Manual checklist: API connection, keyboard file chooser, drag/drop, preview on square/wide/tall images, `object-fit: contain` behavior, loading, error display, cancel/reset, consistent KADID score and policy, export downloadable JSON, narrow-screen layout, accessibility labels and network failure handling.

**Do not mark build passed until actual terminal output is available.** The first frontend delivery previously lacked verified production build evidence; treat it as **unverified until tested**.

## Regression gates

- Model feature ordering exactly matches config and v1 notebook, verified by tests.
- API response shape does not break React.
- Missing model remains nullable/unavailable, never fake score.
- V1 metrics unaffected by backend refactor.
- No new artifacts accidentally included or private photos committed.

## Next testing upgrades

CI workflow for pytest/TypeScript build; browser E2E via Playwright; image fuzz/decompression abuse tests; cross-platform tests, model hash checks, accessibility audit, and staging API smoke against deployed infrastructure. None of these are claimed implemented at baseline.
