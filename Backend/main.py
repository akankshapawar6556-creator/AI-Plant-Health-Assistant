from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
from transformers import pipeline
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

print("Loading AI model...")

classifier = pipeline(
    "image-classification",
    model="kimcomehome/plantvillage-vit-leaf-disease"
)

print("AI model loaded successfully!")


@app.get("/")
def home():
    return {
        "message": "AI Plant Health Assistant Backend is running!"
    }


@app.post("/analyze")
async def analyze_plant(file: UploadFile = File(...)):

    image_bytes = await file.read()

    image = Image.open(
        io.BytesIO(image_bytes)
    ).convert("RGB")

    predictions = classifier(image, top_k=3)

    return {
        "filename": file.filename,
        "status": "analysis_complete",
        "prediction": predictions[0]["label"],
        "confidence": round(predictions[0]["score"] * 100, 2),
        "top_predictions": predictions
    }