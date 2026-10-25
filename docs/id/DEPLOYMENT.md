# Menjalankan dan menyiapkan deployment

**Saat ini hanya lingkungan lokal yang terverifikasi.** Dari root proyek jalankan backend pada terminal 1:

```powershell
cd backend
.\\.venv\\Scripts\\python.exe -m uvicorn app.main:app --reload
```

Frontend terminal 2:

```powershell
cd frontend
npm ci
npm run dev
```

Buka `http://127.0.0.1:5173` dan Swagger `http://127.0.0.1:8000/docs`. Konfigurasi `VITE_API_BASE_URL` di `.env` bila base URL berubah; sesuaikan origin CORS di backend.

Sebelum publik: validasi `npm run build`, uji API dan browser, paket versi Python dan model, HTTPS/TLS, domain CORS terkontrol, ukuran/jenis file, batas decode dan rate-limit, log tanpa path privat, pengelolaan rahasia, izin foto pengguna, lisensi dataset, monitoring, rencana rollback dan human review. Jangan host `uvicorn --reload` sebagai server publik.

Belum ada URL aplikasi publik atau klaim produksi. [Panduan Inggris](../en/DEPLOYMENT.md).
