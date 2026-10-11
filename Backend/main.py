from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
from optimum.onnxruntime import ORTModelForImageClassification
from transformers import AutoImageProcessor
import torch
import io

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

print("Loading quantized ONNX model...")

MODEL_DIR = "./onnx_model_quantized"

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

    inputs = processor(images=image, return_tensors="pt")
    with torch.no_grad():
        outputs = model(**inputs)

    logits = outputs.logits
    probs = torch.nn.functional.softmax(logits, dim=-1)[0]

    top_k = torch.topk(probs, k=3)
    labels = [model.config.id2label[i.item()] for i in top_k.indices]

    predictions = [
        {"label": labels[i], "score": float(top_k.values[i])}
        for i in range(len(labels))
    ]

    return {
        "filename": file.filename,
        "status": "analysis_complete",
        "prediction": predictions[0]["label"],
        "confidence": round(predictions[0]["score"] * 100, 2),
        "top_predictions": predictions,
    }