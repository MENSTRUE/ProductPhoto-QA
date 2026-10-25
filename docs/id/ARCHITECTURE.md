# Arsitektur ProductPhoto QA

Alur: **React (port 5173) → FastAPI (port 8000) → OpenCV & model KADID → JSON hasil**.

- `backend/app/main.py`: membuat aplikasi, CORS, menyertakan router.
- `backend/app/api/routes.py`: health, upload dan validasi HTTP.
- `backend/app/core/config.py`: batas upload 12 MB dan origin frontend.
- `backend/app/services/analysis.py`: batas service ke pipeline analisis.
- `backend/app/quality.py`: **satu sumber kebenaran** untuk 11 fitur, resize, model loading, heuristik dan prediksi. Jangan menduplikasi fitur di `ml/`.
- `ml/inference/predict.py`: antarmuka CLI/offline yang memakai pipeline yang sama.
- `ml/evaluation/metrics.py`: menghitung ulang regresi dari CSV prediksi held-out.

Kontrak frontend tetap: `GET /api/v1/health` dan `POST /api/v1/analyze`, multipart key `file`. JSON response tidak berubah.

## Keterbatasan ilmiah

KADID merupakan gambar dengan distorsi sintetis, bukan label kelayakan foto penjual. Status `PASS_PROVISIONAL` / `REVIEW` merupakan aturan tidak terkalibrasi. SPAQ hanya diaudit karena arsip gambar multipart yang tersedia tidak lengkap. Finegrain tidak memiliki label kualitas PASS/FAIL terverifikasi.
