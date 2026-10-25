# Testing dan Quality Assurance

**Bukti lokal yang tersedia:** `pytest -q` pada backend menghasilkan **10 passed, 1 warning**. Warning berasal dari deprecation Starlette/httpx dan bukan error hasil model. CLI `produk.jpg` berhasil memberi estimasi KADID 2,2069, sementara Swagger dan frontend juga sebelumnya berhasil mengirim/menerima JSON. `npm run build` **belum dikonfirmasi sukses** dalam bukti percakapan ini.

```powershell
cd backend
.\\.venv\\Scripts\\python.exe -m pytest -q
.\\.venv\\Scripts\\python.exe -m uvicorn app.main:app --reload
# terminal lain
cd frontend
npm ci
npm run build
npm run dev
```

Checklist manual: health model loaded, upload berhasil, JPG valid, tipe file tak didukung, file kosong, lebih dari 12 MiB, bytes tidak valid, loading/error dan ekspor JSON; foto persegi/landscape/portrait harus utuh tanpa crop/gepeng; cek keyboard/mobile, koneksi gagal dan reset.

CI, Playwright, fuzzing upload, security penetration test dan verifikasi deploy masih rencana. Jangan diberi status selesai sebelum dijalankan. [Tes rinci Inggris](../en/TESTING.md).
