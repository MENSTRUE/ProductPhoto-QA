"""Offline inference helpers sharing the FastAPI preprocessing contract."""
from .predict import predict_file, predict_image
__all__ = ["predict_file", "predict_image"]
