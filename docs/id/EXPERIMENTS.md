# Bukti eksperimen — Day 18

- Model KADID v1: HistGradientBoostingRegressor, pemisahan train/val/test berdasar identitas **81 gambar referensi**.
- Dataset: 10.125 gambar; test 1.625, MAE 0,768295; RMSE 0,966904; R² 0,192518 (hasil notebook v1 yang telah dijalankan pengguna).
- Angka tersebut berasal dari **split v1**; tidak bisa dibandingkan langsung dengan split v4.2 seolah-olah uji yang identik.
- Finegrain: eksperimen v4.2 berhasil memproses 120 foto produk untuk demo fitur, **tanpa ground truth kualitas**. Notebook v1 belum membaca produk dari Parquet.
- SPAQ: 11.125 label MOS tetapi tidak ada gambar terbaca dari arsip terpasang; `SPAQ.zip` tidak tersedia. **Tidak ada evaluasi MOS yang sah.**

Jangan klaim akurasi penerimaan marketplace atau studi tiga sumber selesai. Lihat CSV dan JSON asli di `reports/` dan `exports/` untuk bukti.
