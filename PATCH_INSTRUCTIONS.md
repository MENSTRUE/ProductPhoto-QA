# Cara pasang ke proyek yang sudah ada

1. Backup atau commit lokal versi berjalan sesuai pilihanmu (tidak dijalankan otomatis oleh paket ini).
2. Ekstrak ZIP; salin ISI paket ke root `D:\porto\100 day\day 18\ProductPhoto QA`, pilih merge/replace untuk file yang disebut dalam paket.
3. **Tidak** mengganti `backend/app/quality.py` karena fitur dan hasil model yang sudah berjalan harus dipertahankan.
4. **Tidak** mengganti `frontend/`, `models/`, `notebooks/`, `assets/`, `reports/` atau `exports/`.
5. Dari `backend/`, jalankan `./.venv/Scripts/python.exe -m pip install -r requirements.txt` lalu `./.venv/Scripts/python.exe -m pytest -q`.
6. Jalankan backend seperti sebelumnya. Cek `/api/v1/health`, `/api/v1/analyze`, dan React.
7. Dari repo root, cek `git status`; tentukan sendiri waktu dan pesan commit.

Catatan: jika repositorimu memiliki modifikasi lokal pada `.gitignore` / `README.md`, tinjau diff terlebih dahulu sebelum menimpanya.
