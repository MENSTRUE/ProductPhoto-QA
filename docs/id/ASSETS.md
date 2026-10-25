# Katalog aset visual dan bukti

## Tiga grafik yang benar-benar ada di GitHub

### Scatter skor KADID test
![Prediksi vs skor aktual KADID](../../assets/plots/heldout_quality_scatter.png)

### Perbandingan MAE validasi
![Perbandingan model validasi](../../assets/plots/validation_comparison.png)

### Distribusi fitur gambar
![Distribusi fitur ketajaman dan cahaya](../../assets/plots/image_feature_distribution.png)

Ketiga file tersebut sudah terdaftar pada GitHub `main` saat audit. Selain itu `assets/.gitkeep` merupakan placeholder kosong. **Belum ada screenshot UI resmi yang terverifikasi** dalam repository. Screenshot nyata boleh ditambahkan pada `assets/screenshots/` setelah disensor jika memuat data pribadi; jangan membuat link ke file yang belum ada.

## Model, notebook, tabel

`models/kadid_quality_proxy.joblib` = model yang sudah dilatih; `models/model_config.json` = urutan fitur/kebijakan; `notebooks/productphoto-qa.ipynb` = skrip riset; `exports/kadid_heldout_predictions.csv` = hasil aktual dan prediksi test; `reports/` = metadata evaluasi, seleksi model, audit Finegrain, audit SPAQ, inventory, policy dan parity.

Aset dataset dan foto pengguna tidak termasuk izin lisensi MIT untuk source code. [Katalog Inggris](../en/ASSETS.md).
