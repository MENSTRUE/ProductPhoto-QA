# Reproducibility and artifact integrity

## Baseline

Windows 11 + Python 3.11 runtime; backend pins `scikit-learn==1.6.1` to match the serialized KADID estimator version. Frontend Node.js/npm uses `package-lock.json`. Do not assume latest packages can safely deserialize or reproduce old predictions.

## Model provenance

- KADID v1 notebook: `notebooks/productphoto-qa.ipynb`.
- Learned artifact: `models/kadid_quality_proxy.joblib` (trusted, produced in controlled experiment).
- Configuration: `models/model_config.json`; feature names and order must match `backend/app/quality.py`.
- Held-out outputs: `exports/kadid_heldout_predictions.csv`; metrics in `reports/kadid_heldout_metrics.json`.
- `reports/inference_parity.json` contains reloading parity evidence; do not infer model calibration from it.

## Local validation commands

```powershell
cd backend
py -3.11 -m venv .venv
.\\.venv\\Scripts\\python.exe -m pip install -r requirements.txt
.\\.venv\\Scripts\\python.exe -m pytest -q
cd ..
backend\\.venv\\Scripts\\python.exe -m ml.evaluation.metrics --predictions exports/kadid_heldout_predictions.csv
backend\\.venv\\Scripts\\python.exe -m ml.inference.predict "C:\\path\\to\\photo.jpg"
cd frontend
npm ci
npm run build
```

Record exact versions with `pip freeze` and `npm ls --depth=0` for subsequent runs, but **never upload local secrets or full personal paths**. Numerical reproduction from precomputed CSV is not equivalent to rerunning dataset preprocessing/training: the Kaggle input datasets and code version must be available for that.

## Dataset constraints

KADID v1 input mount historically `/kaggle/input/datasets/loliwibu/kadid10k`; Finegrain `/kaggle/input/datasets/loliwibu/finegrain-products`; SPAQ used `/kaggle/input/datasets/loliwibu/spaq-data` or `spaq-dataset`. These paths are experiment-specific, not portable dependencies of local inference. SPAQ input lacked terminal `SPAQ.zip`; do not assume valid split archive from six `.zNN` volumes.

## New experiment provenance manifest

For a future retrain, preserve `run_id`, UTC date/time, Git commit SHA, source dataset owner/revision/license, hash/list of train/validation/test IDs, framework package versions, feature/resize implementation version, model selection and test metrics, failed file count, bias/limitations, hardware/backend and report artifacts. New metrics must go under distinct `reports/runs/` paths rather than overwriting v1.
