# Panduan API ProductPhoto QA

Alamat default `http://127.0.0.1:8000`, Swagger `/docs`. `GET /api/v1/health` mengembalikan `status`, `model_loaded`, dan `model_error`. Pastikan `model_loaded: true` sebelum menyatakan bahwa skor berasal dari model.

`POST /api/v1/analyze` menerima multipart field **`file`**: JPEG, PNG, WebP atau BMP maksimal **12 MiB**. Hasil mencakup `filename`, `status` (`PASS_PROVISIONAL` atau `REVIEW`), `reasons`, sebelas angka `metrics`, objek `quality_estimate` (nilai bisa `null` jika model tidak tersedia) dan `disclaimer`. Kode error 400 file kosong, 413 terlalu besar, 415 media tidak didukung, 422 gambar tidak bisa di-decode.

```powershell
Invoke-RestMethod http://127.0.0.1:8000/api/v1/health
curl.exe -X POST http://127.0.0.1:8000/api/v1/analyze -F "file=@C:\\path\\to\\produk.jpg"
```

Frontend membaca JSON dari server, bukan membuat skor tiruan. Endpoint ini bukan sertifikasi kualitas marketplace. [Kontrak detail Inggris](../en/API.md).
