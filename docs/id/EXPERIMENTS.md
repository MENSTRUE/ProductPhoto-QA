# Dataset, audit dan metrik penelitian

## KADID — eksperimen v1 yang tersimpan di GitHub

KADID berisi **10.125** gambar distorsi sintetis dari **81** foto referensi. Split berdasarkan `ref_img` untuk mencegah foto turunan dengan referensi sama muncul pada dua partisi. Train **6.875 / 55 grup**, validation **1.625 / 13 grup**, test **1.625 / 13 grup**. Pemilihan model berdasarkan validation MAE: HistGB **0,819218**, Ridge **0,900278**, Dummy **0,934277**. Test sekali setelah pemilihan: **MAE 0,768295; RMSE 0,966904; R² 0,192518**. Skala target 1–5, semakin tinggi semakin baik. R² 0,19 menunjukkan kemampuan prediksi yang masih terbatas; bukan validasi foto produk asli.

## Finegrain — perbedaan v1 dan v4.2

`reports/finegrain_audit.json` v1 memang mencatat **0** foto digunakan, sebab notebook hanya mencari JPG/PNG langsung. Pada eksperimen Kaggle **v4.2 terpisah**, Parquet berhasil dibaca menjadi **120 foto asli, tanpa error decode**. Itu membuktikan smoke test pada domain produk, tetapi bukan pelatihan model kualitas produk dan tidak ada label benar/salah acceptance. Jangan ubah angka v1 menjadi 120 tanpa provenance run baru.

## SPAQ — audit gagal evaluasi, bukan gagal model

Enam volume `SPAQ.z01`–`SPAQ.z06` dan spreadsheet anotasi tersedia. Sebanyak **11.125** baris MOS tercatat, tetapi `SPAQ.zip` sebagai volume terakhir tidak ada; **0** gambar asli berhasil dicocokkan dengan MOS. Proses 7z sempat timeout 120 detik. **Tidak ada training ataupun hasil MAE SPAQ**; tidak boleh disebut tiga dataset berhasil dievaluasi.

## File bukti

`notebooks/productphoto-qa.ipynb`, `models/kadid_quality_proxy.joblib`, `models/model_config.json`, `reports/final_summary.json`, `reports/kadid_heldout_metrics.json`, `reports/split_audit.json`, `reports/model_selection.csv`, `reports/inference_parity.json`, `reports/spaq_audit.json`, `reports/finegrain_audit.json`, `exports/kadid_heldout_predictions.csv` dan tiga grafik di `assets/plots/`.

Untuk eksperimen baru: simpan versi, seed, commit SHA, dataset source, group split, dependensi, metrik dan caveat di `reports/runs/<id>/`; jangan menimpa v1. [Detail Inggris](../en/EXPERIMENTS.md).
