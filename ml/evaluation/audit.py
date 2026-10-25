"""Audit exported model metadata; do not load untrusted pickle artifacts."""
from pathlib import Path
import json
from backend.app.quality import FEATURES

def audit_feature_contract(config_file: str | Path = "models/model_config.json") -> dict:
    path = Path(config_file)
    if not path.is_file():
        return {"ok": False, "reason": f"Missing {path}"}
    config = json.loads(path.read_text(encoding="utf8"))
    actual = config.get("feature_names")
    return {"ok": actual == FEATURES, "expected": FEATURES, "actual": actual}
