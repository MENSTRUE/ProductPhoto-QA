# Reproduksibilitas eksperimen dan inferensi

Jalankan dengan Python **3.11**, scikit-learn **1.6.1** yang cocok dengan model terserialisasi, dan paket backend sesuai `backend/requirements.txt`. Gunakan `frontend/package-lock.json` melalui `npm ci`.

```powershell
cd backend
py -3.11 -m venv .venv
.\\.venv\\Scripts\\python.exe -m pip install -r requirements.txt
.\\.venv\\Scripts\\python.exe -m pytest -q
cd ..
backend\\.venv\\Scripts\\python.exe -m ml.evaluation.metrics --predictions exports/kadid_heldout_predictions.csv
backend\\.venv\\Scripts\\python.exe -m ml.inference.predict "C:\\path\\to\\produk.jpg"
cd frontend
npm ci
npm run build
```

Model `models/kadid_quality_proxy.joblib` menggunakan pickle/joblib sehingga hanya boleh dimuat dari sumber tepercaya. Preprocessing dalam `backend/app/quality.py` adalah referensi. Prediksi dari CSV yang sudah tersimpan bukan training ulang: training penuh membutuhkan dataset asli, split yang sama, seed 42 dan lingkungan Kaggle relevan.

Untuk run baru, tulis manifest versi, commit SHA, dataset, lisensi, hash, split, feature code, dependensi dan metrik pada folder `reports/runs/` terpisah. [Rincian Inggris](../en/REPRODUCIBILITY.md).
