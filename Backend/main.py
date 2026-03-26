from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image, ImageOps
import tensorflow as tf
import numpy as np
import os

# =========================
# APP
# =========================
app = FastAPI(title="AI Cattle & Buffalo Breed Classifier")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================
# PATHS
# =========================
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

MODEL_PATH = os.path.join(BASE_DIR, "model", "keras_model.h5")
LABEL_PATH = os.path.join(BASE_DIR, "model", "labels.txt")

# =========================
# LOAD MODEL
# =========================
print("📦 Loading model...")
model = tf.keras.models.load_model(MODEL_PATH)
print("✅ Model loaded")

# =========================
# LOAD LABELS
# =========================
labels = []
with open(LABEL_PATH, "r") as f:
    for line in f:
        name = line.strip()

        # remove numbering if exists
        if " " in name and name.split(" ")[0].isdigit():
            name = " ".join(name.split(" ")[1:])

        labels.append(name)

print("✅ Clean labels:", labels)

# =========================
# ROOT
# =========================
@app.get("/")
def root():
    return {"status": "Backend running"}

# =========================
# PREPROCESS (EXACT TM)
# =========================
def preprocess_tm(image):
    size = (224, 224)

    # fix rotation from phone camera
    image = ImageOps.exif_transpose(image)

    # center crop + resize
    image = ImageOps.fit(image, size, Image.Resampling.LANCZOS)

    img_array = np.asarray(image).astype(np.float32)

    # normalize between -1 and +1
    img_array = (img_array / 127.5) - 1

    # add batch
    img_array = np.expand_dims(img_array, axis=0)

    return img_array

# =========================
# PREDICT
# =========================
@app.post("/predict")
async def predict(image: UploadFile = File(...)):
    try:
        img = Image.open(image.file).convert("RGB")

        processed = preprocess_tm(img)

        predictions = model.predict(processed)[0]
        index = int(np.argmax(predictions))

        breed = labels[index]
        confidence = round(float(predictions[index]) * 100, 2)
        category = "Buffalo" if "buffalo" in breed.lower() else "Cattle"

        return {
            "breed": breed,
            "confidence": confidence,
            "category": category
        }

    except Exception as e:
        print("Prediction error:", e)
        return {"error": str(e)}
