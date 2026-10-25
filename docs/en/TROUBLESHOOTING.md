# Troubleshooting (Windows / Kaggle / API / model)

| Symptom | Diagnosis | Recommended action |
|---|---|---|
| `Photo not found: C:\\Users\\...\\Pictures\\produk.jpg` | Windows redirected `Pictures` to OneDrive | In File Explorer Copy as path; test `C:\\Users\\Asus\\OneDrive\\Pictures\\produk.jpg` only when confirmed |
| CLI `predict.py: error: image required` | PowerShell `$photo` was null | Check `$photo | Format-List FullName`, pass a real absolute file path |
| `runpy: found in sys.modules` | Eager `from .predict import ...` inside `ml/inference/__init__.py` | Avoid eager import for `python -m ml.inference.predict`; rerun CLI |
| `InconsistentVersionWarning` | Estimator loaded with different sklearn version | Use **1.6.1** for this model and rerun tests, no blind upgrades |
| `StarletteDeprecationWarning` | Upstream TestClient/httpx API transition | Track warning; if tests pass, do not misclassify as model error |
| Health `model_loaded: false` | Missing joblib/config or ordered feature mismatch | Verify `models/`, env paths, `model_config.json`; inspect `model_error` |
| HTTP 415 | Unsupported MIME | Use correct JPEG/PNG/WebP/BMP |
| HTTP 413 | >12 MiB | Reduce file size or explicitly revise policy with tests |
| HTTP 422 | Not decodable image | Verify data bytes, not only extension |
| UI says API offline | Uvicorn not running or CORS/API URL differs | Check `GET /api/v1/health`, `VITE_API_BASE_URL`, allowed origins |
| UI photo preview cropped/gepeng | Forced CSS height with cover | Use `object-fit: contain` and appropriate aspect ratio |
| Frontend build fail | TypeScript/Vite mismatch or dependencies | `npm ci`, then `npm run build` and inspect first diagnostic |
| SPAQ `.z01` times out / no MOS image pairs | Missing terminal `SPAQ.zip` | Do not spend repeated 120s scans; find complete official source or record blocker |
| Finegrain v1 shows 0 | Images were Parquet bytes not loose JPG | v1 report remains accurate; separate v4.2 decoded 120, avoid rewriting provenance |
| `git status` shows node_modules or `.venv` | Incorrect ignored/tracked files | Inspect `.gitignore`, `git ls-files`, remove tracked copies carefully with owner's approval |

## Minimal debug session

```powershell
# Project root
Get-Location
git status --short
Test-Path models/kadid_quality_proxy.joblib
backend\\.venv\\Scripts\\python.exe -m ml.evaluation.metrics --predictions exports/kadid_heldout_predictions.csv
# In backend:
# .\\.venv\\Scripts\\python.exe -m pytest -q
```

Never copy private user images, authentication keys or internal machine names into public GitHub issues. Distinguish user-provided commands from verified results.
