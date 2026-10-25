# AGENTS.md — ProductPhoto QA repository operating contract

> **Source-of-truth for AI coding agents and human contributors.** This document is normative for repository maintenance. Read it **before** editing code, metrics, claims or generated artifacts.

## Mission and non-negotiable contract

ProductPhoto QA is an **explainable local research MVP**. It estimates KADID perceptual quality and reports heuristic blur/exposure flags. Never present `PASS_PROVISIONAL` as actual marketplace approval. Never imply SPAQ image evaluation or a product-quality accuracy score without ground truth.

## Source-of-truth precedence

1. **Current code & tests** for implemented API/schema/features (`backend/app/quality.py`, `backend/app/api/routes.py`, frontend `src/App.tsx`, `models/model_config.json`).
2. **Versioned machine-generated evidence** (`reports/`, `exports/`), attached to the specific notebook/run that produced it. In particular `reports/final_summary.json` and `reports/kadid_heldout_metrics.json` are the canonical **v1 KADID** metrics.
3. **Notebook** (`notebooks/productphoto-qa.ipynb`) for experiment method. Source data and environment details require independent verification.
4. **Repository README/docs** for explanatory prose. If prose conflicts with code/evidence, fix the prose and document the discrepancy; never silently alter metrics to agree with the narrative.
5. **Conversation observations / separate Kaggle runs** are supplementary and must be labeled by run. Later **v4.2 Finegrain=120** is not automatically v1 evidence.

The user's local worktree may be ahead of GitHub. Inspect `git status`, `git diff`, branch and `git log` before changing anything. **Never overwrite uncommitted files.**

## Who controls commits

The repository owner explicitly controls commit messages, timing, pushing and merging. **Do not run `git add`, `git commit`, `git push`, branch creation or PR writes unless explicitly requested.** Provide verified local file changes and tests; let the owner select commit text. Never rewrite history or delete work.

## Before → Now → Next

**Before:** KADID Kaggle experiment → artifacts. **Now:** working local React/FastAPI, 10 backend tests passed, KADID v1 held-out 0.768295 MAE, CLI and Swagger inference. **Next:** reproducible frontend build, documentation/asset audit, product-domain human labels, security/CI, staged deployment; SPAQ only with real image–MOS pairs. Update this ledger when independently verified.

## Stable interfaces

- `GET /api/v1/health` → `status`, `model_loaded`, `model_error`.
- `POST /api/v1/analyze` multipart field **`file`**; successful JSON contains `filename`, `status`, `reasons`, `metrics`, `quality_estimate`, `disclaimer`.
- Error statuses: 400 empty, 413 >12MiB, 415 media type, 422 undecodable image.
- Frontend requires these fields; preserve schema or ship coordinated frontend changes and tests.
- `quality_estimate.value` is nullable if model fails to load; **do not fabricate substitutes**.

## Exact ML inference contract (KADID v1)

Feature ordering: `laplacian_var`, `tenengrad`, `brightness_mean`, `brightness_std`, `dark_fraction`, `bright_fraction`, `contrast_p95_p5`, `colorfulness`, `entropy`, `width`, `height`.

Decode in BGR via OpenCV; resize to max edge 640 using `INTER_AREA`, v1 **integer truncation** for target dimensions. Original width and height remain features. Use `backend/app/quality.py` as the shared feature implementation; do not fork a new transform in React or CLI. Load `models/kadid_quality_proxy.joblib` only if trusted, with `model_config.json` feature parity and compatible `scikit-learn==1.6.1`.

Policy thresholds in `models/model_config.json`: Laplacian min 75, mean brightness 65–205, dark fraction ≤0.48, bright fraction ≤0.48. These **uncalibrated heuristics** control `PASS_PROVISIONAL` vs `REVIEW`; KADID score does not automatically classify pass/fail.

## Experiment and evidence discipline

- KADID v1: 10,125 images, 81 refs, train 6,875/55 groups, val 1,625/13, test 1,625/13; HistGB held-out MAE 0.768295, RMSE 0.966904, R² 0.192518.
- Preserve reference-group disjointness, champion chosen on validation only, held-out test frozen.
- SPAQ: six split `.z01`–`.z06` files and 11,125 MOS rows were observed; terminal `SPAQ.zip` missing and **0 original photos evaluated**. No three-source claim.
- Finegrain: v1 repo `reports/finegrain_audit.json` records 0 direct files. Separate v4.2 Kaggle observation reports 120 decoded Parquet product images. This is not validation against human pass/fail labels.
- Never report fabricated accuracy, confidence, fake review labels, fabricated benchmarks or sourced images.
- Preserve original reports. To add a new run create distinct artifacts such as `reports/runs/v4_2/...` and a provenance manifest. Never overwrite v1 metrics in place.

## Security and privacy

- Do not ingest untrusted `.joblib` (pickle arbitrary execution risk).
- Never commit `.env`, credentials, raw 30GB datasets, personal/third-party images, `.venv`, `node_modules`, `dist`, uploaded photos, or private API responses.
- Keep image size/content-type/decodability validation. Content-type alone is not security validation. Restrict public endpoints, mitigate decompression bombs, rate-limit, configure TLS and CORS before deployment.
- Don't assert hosted production security, compliance, SLA or privacy features that aren't implemented.
- Don't silently install dependencies, change python packages, train/retrain, upload files, or use paid services.

## Change workflow / acceptance criteria

1. Read repository status, related implementation and evidence before edits.
2. State scope, risks and expected changed paths. Preserve API response contract and current UI.
3. Make minimal changes; don't add placeholders to make directories look populated.
4. Run backend: `cd backend; .\\.venv\\Scripts\\python.exe -m pytest -q` (Windows).
5. Run offline evaluation from root: `backend\\.venv\\Scripts\\python.exe -m ml.evaluation.metrics --predictions exports/kadid_heldout_predictions.csv`.
6. Run frontend: `cd frontend; npm ci; npm run build` and inspect responsive UI manually. If unable, report **not run**.
7. Check Git hygiene via `git status --short`, staged changes and leaked secrets; don't commit automatically.
8. Update README/docs/asset manifest/tests as required; state tested/unverified explicitly.

## Preferred documentation map

Root README = repository landing page. `AGENTS.md` = binding contributor/agent workflow. `docs/en/` and `docs/id/` = explanatory operational and research references. `backend/README.md`, `frontend/README.md` = component runbooks. `assets/plots/` = tracked original images. No external binary raw datasets or unverified screenshots.

## Claim boundary examples

✅ “KADID held-out MAE ≈0.7683 on source-reference-disjoint split.”
✅ “10 backend tests passed locally on 25 October 2026, with one deprecation warning.”
✅ “Live model predicted a 1–5 **KADID estimate** on a local photo.”
❌ “96% marketplace accept accuracy.”
❌ “SPAQ trained successfully.”
❌ “Finegrain provides labeled photo-quality truth.”
❌ “Public deployment verified.”

## Troubleshooting reminders

- `FileNotFoundError` on Windows: paths may be under `OneDrive\\Pictures` not `$HOME\\Pictures`.
- Scikit-learn warning: check serialized model version before trusting predictions; don't blindly upgrade.
- `runpy` warning on CLI: avoid eager `from .predict import ...` inside `ml/inference/__init__.py`.
- FastAPI/Starlette deprecation warning can appear while tests pass; track upstream changes, don't fake zero warnings.
- SPAQ split archive without final `.zip`: do not retry 30GB extraction indefinitely or claim success.

## Maintainer sign-off checklist

- [ ] API contract and 10 tests preserved
- [ ] Dataset provenance and exact metrics unchanged
- [ ] Frontend compile/manual test explicitly reported
- [ ] No missing/broken asset links
- [ ] No secrets/private datasets or unsafe new file uploads
- [ ] Limitations and release state accurate
- [ ] Owner chooses commit, push and release
