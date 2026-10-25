"""Recompute regression metrics from a KADID held-out prediction CSV.

Expected columns: score, predicted. This evaluates KADID score regression,
not marketplace acceptance accuracy. The CSV came from the frozen test split.
"""
from pathlib import Path
import argparse
import json
import pandas as pd
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import numpy as np

def evaluate_predictions(path: str | Path) -> dict:
    frame = pd.read_csv(path)
    required = {"score", "predicted"}
    if not required.issubset(frame.columns):
        raise ValueError(f"Required CSV columns: {sorted(required)}")
    frame = frame.dropna(subset=["score", "predicted"])
    if len(frame) < 2:
        raise ValueError("Need at least two complete prediction pairs")
    observed = pd.to_numeric(frame["score"], errors="raise").to_numpy()
    predicted = pd.to_numeric(frame["predicted"], errors="raise").to_numpy()
    return {
        "dataset": "KADID-10k", "protocol": "existing held-out source-reference split",
        "n": int(len(frame)),
        "mae": float(mean_absolute_error(observed, predicted)),
        "rmse": float(np.sqrt(mean_squared_error(observed, predicted))),
        "r2": float(r2_score(observed, predicted)),
        "scope": "perceptual quality regression; NOT product approval accuracy",
    }

def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--predictions", type=Path,
                        default=Path("exports/kadid_heldout_predictions.csv"))
    args = parser.parse_args()
    print(json.dumps(evaluate_predictions(args.predictions), indent=2))

if __name__ == "__main__":
    main()
