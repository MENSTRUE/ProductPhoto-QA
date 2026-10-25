# Troubleshooting penting

| Kendala | Penyebab | Solusi |
|---|---|---|
| `Photo not found` | Foto ada di OneDrive bukan `$HOME\\Pictures` | Salin **path nyata** dari Explorer; contoh pengguna `C:\\Users\\Asus\\OneDrive\\Pictures\\produk.jpg` |
| CLI argument `image` kurang | Variabel `$photo` kosong | Uji `$photo.FullName`, gunakan absolute path yang benar |
| `runpy found in sys.modules` | `ml/inference/__init__.py` mengimpor `predict` lebih awal | Hindari import eager; CLI sudah berhasil setelah revisi |
| `InconsistentVersionWarning` | Model dan sklearn versi berbeda | Pin **1.6.1** lalu tes lagi |
| `StarletteDeprecationWarning` | Deprecation pada TestClient | Tidak menggagalkan 10 tes; pantau upgrade dependensi |
| `model_loaded: false` | Model/config tak ditemukan atau feature mismatch | Periksa `models/`, `model_config.json`, env path |
| HTTP 413 / 415 / 422 | Terlalu besar / tipe salah / gambar tak dapat dibaca | Gunakan JPG/PNG valid maksimum 12 MiB |
| UI terputus dari API | Backend belum hidup, URL/CORS berbeda | Tes `/api/v1/health` dan setelan frontend |
| Foto terlihat gepeng | CSS memaksa tinggi dan crop | Gunakan `object-fit: contain` dan rasio asli |
| SPAQ 7z timeout | Volume terakhir `SPAQ.zip` tidak ada | Jangan retry puluhan GB; catat sebagai tidak dievaluasi |
| Finegrain v1 kosong | Data tersimpan sebagai bytes di Parquet | Bedakan v1 0 vs v4.2 120 tanpa menimpa metrik |

Gunakan `git status --short`, `pytest -q` dan `npm run build` sebagai pengujian awal. Jangan unggah foto pengguna, secrets, atau log privat ke issue publik. [Lebih lengkap](../en/TROUBLESHOOTING.md).
