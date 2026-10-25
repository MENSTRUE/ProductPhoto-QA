# Claims, safety and validity boundaries

## Green / allowed with attribution

- This repository demonstrates a local research MVP with React + FastAPI + OpenCV + a KADID model.
- 10 backend tests **passed in the recorded local Windows test**, with one deprecation warning; this is NOT a blanket guarantee for every machine.
- Reference-group held-out KADID v1 MAE = 0.768295, RMSE = 0.966904, R² = 0.192518 (1,625 images).
- The system exposes uncalibrated blur/brightness diagnostic flags and actual JSON output.
- Later, a distinct v4.2 Kaggle run decoded 120 Finegrain Parquet photos; v1 repo still records 0.

## Yellow / needs clear qualification

- “Quality score”: specify *KADID synthetic-distortion subjective quality estimate 1–5*, never a photo acceptance probability.
- “PASS_PROVISIONAL”: specify *threshold-based diagnostic policy*; manual review remains responsible for decisions.
- “Explainable”: means visible numeric measurements and explicit rules. It does not prove causal interpretability of the regressor.
- “Ready”: only as **local demo research MVP**. Security, production reliability, deployment and stakeholder acceptance are not validated.

## Red / prohibited until verified

- Marketplace compliance/approval/acceptance guarantee.
- Product photo pass/fail accuracy, precision/recall/F1/AUC based on unavailable labels.
- SPAQ MOS training/evaluation with missing photos; three-source model training.
- Head-to-head v1 vs v4.2 improvement as though on same test split.
- Live public deployed demo, uptime, privacy compliance, certified quality auditor or commercial validation.
- Fabricated screenshots, model confidence, benchmark stars, hardware/GPU claims or user adoption numbers.

## Publication template

> ProductPhoto QA is a local research MVP combining source-reference-disjoint KADID perceptual score regression (held-out MAE ≈0.7683) with explainable OpenCV blur/exposure diagnostics and a React/FastAPI interface. PASS/REVIEW flags are provisional heuristics, not verified marketplace quality labels. Finegrain product images were used for a separate domain smoke test in a later run; SPAQ photographs were not available for MOS evaluation.

Before every public update, identify the exact evidence artifact/commit and ensure the statement describes the same run.
