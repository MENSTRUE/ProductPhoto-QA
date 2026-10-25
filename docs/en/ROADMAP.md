# Roadmap and release criteria

## Before

Exploratory KADID-10k visual quality regression in Kaggle; grouped source-reference split; HistGB selection by validation; joblib model and evidence exports. SPAQ archives investigated, Finegrain product data inventoried.

## Now — local MVP

- [x] React/Vite interface for photo upload and preview
- [x] FastAPI health and analyze endpoint
- [x] Shared v1 11-feature OpenCV extraction
- [x] KADID regression model inference via API and CLI
- [x] Separate PASS_PROVISIONAL/REVIEW diagnostic rules
- [x] JSON export
- [x] Recorded 10 backend tests passed with one warning
- [x] v1 reported metrics and 3 visual research assets checked into repo
- [ ] **Frontend production build verified** (owner to run `npm run build`)
- [ ] **Privacy/security/attribution audit completed**

## Next — evidence-first priorities

### P0 Documentation and integrity

- Verify README links, complete AGENTS and bilingual docs; capture actual screenshot(s) with permission, no fabricated UI.
- Check local-vs-remote Git diff, ignore virtualenv/node_modules/generated secrets.
- Run frontend build and smoke test UI after changes; document result explicitly.

### P1 Research quality

- Add real human-labeled product-quality test data and define clear acceptance task.
- Calibrate thresholds separately for use cases; measure error by category and resolution, not only aggregate KADID MAE.
- Preserve v1 and v4.2 experiment provenance separately.
- Add test scenarios for backend upload abuse and HTTP boundaries.

### P2 Engineering/release

- Add CI, linting, accessible browser E2E, staging deployment, secrets and runtime hardening.
- Complete independent SPAQ photo+MOS protocol if valid original photos and archive become available.
- Versioned release with reproducible environment, model card and deployment checklist.

## Definition of done (MVP portfolio)

Local API and frontend function, backend tests pass, offline model matches v1 contract, content/claims accurate, screenshots and assets verified, frontend builds, Git clean of secrets, README/AGENTS complete. **Production readiness and calibrated merchant QC are separate future goals.**
