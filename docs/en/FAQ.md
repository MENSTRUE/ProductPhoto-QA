# FAQ — ProductPhoto QA

### What exactly does the app assess?
OpenCV-derived sharpness, exposure, contrast, colorfulness, grayscale entropy and dimensional metadata, plus a KADID-trained perceptual quality **estimate**. No verified e-commerce approval labels are available.

### Why PASS_PROVISIONAL on a 2.2069 / 5 estimate?
The hard-coded policy checks specific blur/brightness conditions; the KADID model estimates a different source-dataset score. They are not jointly calibrated.

### Does a higher Laplacian always imply a better photo?
No. Fine edges, textures, resolution, compression artifacts and sensor noise can all affect sharpness proxies.

### Is this a real AI model?
Yes, the KADID scikit-learn regression artifact is loaded via joblib and used for predictions. The **PASS/REVIEW status** is an explicit rule-based diagnostic, not a learned classifier.

### What is the accuracy?
There is no valid marketplace classification accuracy. The supported metric is held-out **KADID regression MAE 0.7683**, alongside RMSE 0.9669 and R² 0.1925, on 1–5 synthetic-distortion scores.

### Was it trained on SPAQ?
No. The SPAQ photo archive was incomplete, so no photo–MOS evaluations were possible; only metadata was inventoried.

### Did Finegrain contribute?
The repository v1 report says **0 product photos used**; a later v4.2 smoke-test decoded 120 real product images from Parquet but did not have verified quality labels. Keep the two run versions distinct.

### Are the screenshots and charts real?
Three committed plots are actual v1 experiment PNGs; no screenshots or promotional visuals have been added without real capture.

### Can I deploy it?
A local MVP runs today. Public deployment requires additional security, privacy, tests, CORS/TLS and ops controls. See [deployment](DEPLOYMENT.md).

### Is the joblib file safe?
Only deserialize your own trusted artifact. Joblib is pickle-based and can execute arbitrary code when loading untrusted files.

### Why pin scikit-learn 1.6.1?
The model was serialized under that version. Keeping the compatible version avoids prior version mismatch warnings.

### Why 10 tests but still a warning?
Tests passed but Starlette emitted a dependency deprecation warning; it is technical debt, not a failed assertion.

### Can I use the dataset images on my site?
Only with each dataset's independent licensing/attribution and privacy requirements. MIT on this code does not grant rights to third-party photos.
