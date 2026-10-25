# Frequently Asked Questions / Tanya Jawab

**Apakah Day 18 sudah selesai?** Untuk MVP lokal, fitur inti telah berjalan. Build frontend produksi dan review keamanan/dokumentasi menjadi gerbang akhir. Bukan QC marketplace siap produksi.

**Mengapa `PASS_PROVISIONAL` tetapi skor 2,2069/5?** Status memakai aturan blur/pencahayaan, skor memakai regresi KADID sintetis. Kedua keluaran tidak saling menentukan.

**Apa akurasinya?** Belum ada akurasi klasifikasi foto produk. Metrik sah: MAE KADID v1 0,7683, RMSE 0,9669, R² 0,1925 pada data uji terpisah.

**SPAQ jadi dipakai?** Metadata hanya diaudit; tidak ada foto–MOS yang berhasil dibaca. Tidak ada evaluasi SPAQ.

**Finegrain 0 atau 120?** Keduanya hasil eksperimen berbeda: v1 yang tersimpan di repo 0; v4.2 terpisah 120 gambar Parquet terdecode. Tanpa label kualitas asli.

**Modelnya AI sungguhan?** Iya, model regresi KADID di `.joblib` digunakan melalui FastAPI/CLI. Kategori PASS/REVIEW sendiri bukan klasifikasi AI.

**Grafiknya asli?** Tiga PNG `assets/plots/` berasal dari output eksperimen v1. Screenshot UI belum diaudit sebagai berkas yang tersimpan di GitHub.

**Bisa hosting?** Secara teknis dapat dipersiapkan, tetapi belum diuji publik dan memerlukan keamanan, CORS/TLS, privasi dan monitoring.

**Lisensi MIT mencakup foto dataset?** Tidak. Hak dataset eksternal terpisah.

**Mengapa pin sklearn 1.6.1?** Menjaga kompatibilitas model yang diserialisasi dengan versi tersebut.
