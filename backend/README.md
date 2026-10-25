# FastAPI backend

From `backend/`:

```powershell
py -3.11 -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
.\.venv\Scripts\python.exe -m pytest -q
.\.venv\Scripts\python.exe -m uvicorn app.main:app --reload
```

API: `GET /api/v1/health` and multipart `POST /api/v1/analyze` (field `file`).
The tested React JSON response schema is retained. Max upload 12 MB.
Model: `../models/kadid_quality_proxy.joblib`, config `../models/model_config.json`.
Never deserialize an unknown or untrusted joblib file.
