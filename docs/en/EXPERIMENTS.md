# Experimental evidence — Day 18

- KADID v1: HistGradientBoostingRegressor, source-reference-disjoint splitting across **81 reference images**.
- 10,125 images; 1,625 test images. Held-out MAE 0.768295, RMSE 0.966904, R² 0.192518 (user-run v1 notebook).
- v1 and v4.2 used different reference-group splits; their metrics are not a controlled head-to-head comparison.
- Finegrain: the separately run v4.2 decoded 120 product photos for a diagnostic demo, **without human quality labels**. The v1 notebook could not read the Parquet-backed photos.
- SPAQ: 11,125 MOS labels exist but image files were inaccessible because `SPAQ.zip` is missing. **No legitimate MOS regression evaluation was completed.**

Do not claim validated marketplace acceptance accuracy or a completed three-source benchmark. Consult original report JSON and prediction CSV files for evidence.
