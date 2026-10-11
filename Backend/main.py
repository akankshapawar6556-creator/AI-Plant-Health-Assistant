from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
from optimum.onnxruntime import ORTModelForImageClassification
from transformers import AutoImageProcessor
import numpy as np
import io
import os
import requests

app = FastAPI(title="AI Plant Health Assistant")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://ai-plant-health-assistant-2z00u5rud-ak-a616.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MODEL_DIR = "./model_files"
os.makedirs(MODEL_DIR, exist_ok=True)

BASE_URL = "https://github.com/akankshapawar6556-creator/AI-Plant-Health-Assistant/releases/download/v1.0-model"

FILES = [
    "config.json",
    "model_quantized.onnx",
    "ort_config.json",
    "preprocessor_config.json",
]

for fname in FILES:
    fpath = os.path.join(MODEL_DIR, fname)
    if not os.path.exists(fpath):
        print(f"Downloading {fname}...")
        url = f"{BASE_URL}/{fname}"
        r = requests.get(url, stream=True)
        r.raise_for_status()
        with open(fpath, "wb") as f:
            for chunk in r.iter_content(chunk_size=8192):
                f.write(chunk)
        print(f"{fname} downloaded!")
    else:
        print(f"{fname} already exists, skipping.")

print("Loading quantized ONNX model...")

processor = AutoImageProcessor.from_pretrained(MODEL_DIR)
model = ORTModelForImageClassification.from_pretrained(
    MODEL_DIR, file_name="model_quantized.onnx"
)

print("Model loaded successfully!")


@app.get("/")
def home():
    return {"message": "AI Plant Health Assistant Backend is running!"}


@app.post("/analyze")
async def analyze_plant(file: UploadFile = File(...)):
    image_bytes = await file.read()
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")

    inputs = processor(images=image, return_tensors="np")

    outputs = model(**inputs)
    logits = outputs.logits

    # Softmax manually
    exp_logits = np.exp(logits - np.max(logits, axis=-1, keepdims=True))
    probs = exp_logits / np.sum(exp_logits, axis=-1, keepdims=True)
    probs = probs[0]

    # Top 3
    top_indices = np.argsort(probs)[::-1][:3]
    labels = [model.config.id2label[int(i)] for i in top_indices]

    predictions = [
        {"label": labels[i], "score": float(probs[top_indices[i]])}
        for i in range(len(labels))
    ]

    return {
        "filename": file.filename,
        "status": "analysis_complete",
        "prediction": predictions[0]["label"],
        "confidence": round(predictions[0]["score"] * 100, 2),
        "top_predictions": predictions,
    }