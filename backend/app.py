from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from torchvision import transforms
import torch
import torch.nn as nn
import torch.nn.functional as F

from PIL import Image
import numpy as np
import cv2

import os
import uuid
import json

import timm
import open_clip



from bmi.bmi_logic import assess_bmi
from utils.hospital_locator import get_nearby_hospitals


app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = "uploads"

# -----------------------
# DEVICE
# -----------------------
device = "cpu"

# -----------------------
# CLASS NAMES
# -----------------------
classes = [
    "anemia",
    "healthy",
    "iodine",
    "malnutrition",
    "pellagra",
    "zinc_deficiency"
]



# -----------------------
# LOAD RECOMMENDATION JSON
# -----------------------

with open("recommendations.json", "r") as f:
    diet_data = json.load(f)

# -----------------------
# LOAD CLIP MODEL
# -----------------------
clip_model, _, preprocess = open_clip.create_model_and_transforms(
    "ViT-L-14",
    pretrained="openai"
)

clip_model = clip_model.to(device)

clip_model.eval()

# -----------------------
# LOAD CLASSIFIER
# -----------------------
classifier = nn.Sequential(
    nn.Linear(768, 512),
    nn.ReLU(),
    nn.BatchNorm1d(512),
    nn.Dropout(0.5),

    nn.Linear(512, 256),
    nn.ReLU(),
    nn.BatchNorm1d(256),
    nn.Dropout(0.3),

    nn.Linear(256, len(classes))
)

classifier.load_state_dict(
    torch.load("nutrition_classifier.pth", map_location=device)
)

classifier = classifier.to(device)
classifier.eval()

# -----------------------
# IMAGE PREPROCESS
# -----------------------
def preprocess_image(img_path):
    img = Image.open(img_path).convert("RGB")
    img = preprocess(img)
    img = img.unsqueeze(0)
    return img

# -----------------------
# SAVE IMAGE
# -----------------------
def save_image_safely(image_file):
    os.makedirs(UPLOAD_FOLDER, exist_ok=True)

    ext = os.path.splitext(image_file.filename)[-1].lower() or ".jpg"
    filename = f"{uuid.uuid4().hex}{ext}"
    path = os.path.join(UPLOAD_FOLDER, filename)

    image_file.save(path)
    return path

# -----------------------
# HOSPITAL API
# -----------------------
@app.route("/hospitals", methods=["GET"])
def hospitals():
    lat = float(request.args.get("lat"))
    lon = float(request.args.get("lon"))

    hospitals, error = get_nearby_hospitals(lat, lon)

    return jsonify({
        "hospitals": hospitals,
        "error": error
    })
from flask import send_file
# -----------------------
# FACE DETECTION
# -----------------------
def detect_face(img_path):
    img = cv2.imread(img_path)

    if img is None:
        return {"status": "error"}

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    face_cascade = cv2.CascadeClassifier(
        cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
    )

    faces = face_cascade.detectMultiScale(
        gray,
        scaleFactor=1.3,
        minNeighbors=5,
        minSize=(50, 50)
    )

    if len(faces) == 0:
        return {"status": "no_face"}

    if len(faces) > 1:
        return {"status": "multiple_faces"}

    # single face
    (x, y, w, h) = faces[0]

    return {
        "status": "ok",
        "face_box": {
            "x": int(x),
            "y": int(y),
            "w": int(w),
            "h": int(h)
        }
    }
# -----------------------
# PREDICT API
# -----------------------
@app.route("/predict", methods=["POST"])
def predict():
    try:
        print("🔥 REQUEST RECEIVED")

        age = float(request.form["age"])
        gender = int(request.form["gender"])
        height = float(request.form["height"])
        weight = float(request.form["weight"])

        lat = request.form.get("lat")
        lon = request.form.get("lon")

        if lat:
            lat = float(lat)
        if lon:
            lon = float(lon)

        image = request.files["image"]
        img_path = save_image_safely(image)
        # -----------------------
# FACE VALIDATION
# -----------------------
        face_result = detect_face(img_path)

        if face_result["status"] == "no_face":
            return jsonify({"error": "no_face_detected"}), 400

        if face_result["status"] == "multiple_faces":
            return jsonify({"error": "multiple_faces"}), 400
        if face_result["status"] == "error":
            return jsonify({"error": "image_processing_failed"}), 500

        face_box = face_result["face_box"]


        try:
            img = preprocess_image(img_path)

            with torch.no_grad():
                img = img.to(device)

                # CLIP features
                features = clip_model.encode_image(img)
                features = features / features.norm(dim=-1, keepdim=True)

                # classifier
                output = classifier(features)

            import torch.nn.functional as F

            probs = F.softmax(output, dim=1)[0]

            # -----------------------
            # FILTER PREDICTIONS
            # -----------------------
            THRESHOLD = 0.01

            filtered_scores = {
                classes[i]: float(probs[i].item())
                for i in range(len(classes))
                if probs[i].item() > THRESHOLD
            }

            # fallback if empty
            if not filtered_scores:
                idx = probs.argmax().item()
                filtered_scores = {
                    classes[idx]: float(probs[idx].item())
                }

            # sort
            filtered_scores = dict(
                sorted(filtered_scores.items(), key=lambda x: x[1], reverse=True)
            )

            predicted_class = list(filtered_scores.keys())[0]
            # -----------------------
            # GENERATE HEATMAP
            # -----------------------
            clip_class_index = classes.index(predicted_class)
        

            # -----------------------
            # RECOMMENDATIONS
            # -----------------------
            recommendations = {
                label: diet_data.get(label, {})
                for label in filtered_scores.keys()
            }

        finally:
        
            if os.path.exists(img_path):
                os.remove(img_path)
        
        # -----------------------
        # BMI
        # -----------------------
        bmi_result = assess_bmi(age, gender, height, weight)

        # -----------------------
        # HOSPITALS
        # -----------------------
        hospitals = []
        location_error = None

        if lat and lon:
            hospitals, location_error = get_nearby_hospitals(lat, lon)
        else:
            location_error = "no_location"

        # -----------------------
        # RESPONSE
        # -----------------------
        return jsonify({
        "model_output": filtered_scores,
        "predicted_class": predicted_class,
        "recommendations": recommendations,
        "bmi_data": bmi_result,
        "lat": lat,
        "lon": lon,
        "hospitals": hospitals,
        "location_error": location_error,
        "face_box": face_box
        
        })
    except Exception as e:
            print("❌ ERROR:", str(e))
            return jsonify({"error": str(e)}), 500

# -----------------------
# HOME
# -----------------------
@app.route("/")
def home():
    return "Backend running with CLIP + Recommendations ✅"

# -----------------------
# RUN
# -----------------------
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)