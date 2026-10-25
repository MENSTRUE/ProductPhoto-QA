# Experiments, datasets and evidence ledger

## Protocol / provenance

The repository's notebook and `reports/*.json` describe **v1**. Treat them as the exact reference. Do not substitute observations from other runs without recording the run identifier and changed code/splits.

### KADID v1

10,125 distorted images from **81** reference photographs. Source-reference-disjoint train (6,875; 55 groups), validation (1,625; 13 groups), test (1,625; 13 groups). Quality label 1–5, higher interpreted as better. Candidate Dummy, Ridge, HistGradientBoosting; validation MAE used to pick HistGB (0.819217629); Ridge 0.900277649, Dummy 0.934276923. Held-out **test MAE 0.7682952859270697, RMSE 0.9669035725157733, R² 0.1925177073295007** on 1,625 images. KADID feature failures: 0. Experiment was evaluated on synthetically degraded photos, NOT marketplace approval data.

### Finegrain (two distinct run states)

Repository v1 `reports/finegrain_audit.json` gives `image_files: 0, demo_rows: 0` because the prototype only searched extracted image suffixes. In a distinct later Kaggle v4.2 trial, code read **120 actual photo bytes from Parquet** with no decode errors. Those figures are complementary, not contradictory. No ground-truth quality PASS/FAIL annotations; only diagnostic demonstration. The 120-photo outputs are **not currently tracked in this repository's v1 results**.

### SPAQ

Six 5 GiB multi-volume archives `SPAQ.z01` ... `.z06`, three annotation spreadsheets, and MOS sheet with 11,125 metadata rows were observed across logs. Terminal `SPAQ.zip` is missing from mounts; direct decoded SPAQ photos = 0; matching image–MOS pairs = 0. 7z attempted an incomplete split volume and timed out after 120 seconds in later notebook; nothing was recovered. Therefore **no SPAQ image regression was executed**, and **no SPAQ MAE, Spearman or R² can be reported**.

### Evidence mapping

- `notebooks/productphoto-qa.ipynb`: v1 experiment (KADID preprocessing/fit/test, SPAQ inventory, naive product smoke).
- `reports/final_summary.json`: v1 summary; `reports/kadid_heldout_metrics.json`: held-out metrics; `reports/split_audit.json`: group counts; `reports/model_selection.csv`: validation comparison.
- `reports/spaq_audit.json`: metadata and missing image evidence; `reports/finegrain_audit.json`: v1 empty product smoke count.
- `reports/policy.json`: non-calibrated thresholds; `reports/kadid_image_failures.json`: failure count evidence.
- `reports/inference_parity.json`: reloaded model prediction parity; `exports/kadid_heldout_predictions.csv`: 1,625 paired labels/predictions.
- `assets/plots/`: 3 v1 visualizations listed in [ASSETS](ASSETS.md).

### Experimental caveats

Reference grouping mitigates content leakage across KADID distortions but does not guarantee generalization to diverse real product photos. A dataset's subjective source scale is not an e-commerce compliance grade; thresholds not calibrated. The achieved R² (~0.19) is modest. Do not compare v1/v4.2 metrics as controlled head-to-head without identical split/reference grouping.

### Future reproducible experiment requirement

Store each run under `reports/runs/<run-id>/` with code SHA, dataset mount hashes/provenance, split IDs, preprocessing version, feature ordering, dependency versions, model config, independent evaluation, limitations and an immutable summary. Distinct datasets must preserve their native label meaning.
