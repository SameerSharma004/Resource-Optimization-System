from flask import Flask, jsonify, request
import time
import os
import numpy as np
import psutil
from flask_cors import CORS
from tensorflow.keras.models import load_model
from sklearn.preprocessing import MinMaxScaler

from collector_buffer import SlidingWindowBuffer

app = Flask(__name__)
CORS(app)
# -----------------------------
# GLOBAL STATE
# -----------------------------
DEFAULT_MODEL_CANDIDATES = [
    "/models/model.h5",  # container mount path
    os.path.join(os.path.dirname(__file__), "model", "model.h5"),  # local repo path
]
SEQUENCE_LENGTH = 10

MODEL_LOADED = False
MODEL_LOAD_ERROR = None
LAST_PREDICTION = None

buffer = SlidingWindowBuffer(window_size=SEQUENCE_LENGTH)

# Load model at startup
MODEL_PATH = None
LAST_SYSTEM_DATA = None
try:
    env_model_path = os.getenv("MODEL_PATH")
    candidate_paths = [env_model_path] if env_model_path else DEFAULT_MODEL_CANDIDATES
    MODEL_PATH = next((path for path in candidate_paths if path and os.path.exists(path)), None)
    if not MODEL_PATH:
        raise FileNotFoundError(
            f"Model file not found. Checked: {', '.join([p for p in candidate_paths if p])}"
        )
    model = load_model(MODEL_PATH, compile=False)
    MODEL_LOADED = True
except Exception as e:
    MODEL_LOAD_ERROR = str(e)
    print("Model load failed:", e)
    model = None

# Scaler (same logic as training)
scaler = MinMaxScaler()
# Fit scaler with dummy range (will be updated with live data)
scaler.fit([[0,0,0,0,0,0], [100,100,100,100,50,50]])

# -----------------------------
# ROUTES
# -----------------------------

@app.route("/status", methods=["GET"])
def status():
    return jsonify({
        "status": "ok",
        "model_loaded": MODEL_LOADED,
        "model_path": MODEL_PATH,
        "model_error": MODEL_LOAD_ERROR
    })

@app.route("/system", methods=["GET"])
def system():
    return jsonify({
        "server_cpu_usage": psutil.cpu_percent(),
        "server_memory_usage": psutil.virtual_memory().percent,
        "server_uptime_minutes": int(time.time() / 60),
        "server_status": "Stable"
    })

@app.route("/analyze", methods=["POST"])
def analyze():
    global LAST_PREDICTION, LAST_SYSTEM_DATA

    if not MODEL_LOADED:
        return jsonify({"status": "error", "message": "Model not loaded"}), 500

    data = request.get_json()
    if not data:
        return jsonify({"status": "error", "message": "No data received"}), 400

    try:
        raw_features = [
            float(data["cpu_usage"]),
            float(data["memory_usage"]),
            float(data["screen_brightness"]),
            float(data["battery_percent"]),
            int(data["keyboard_activity"]),
            int(data["mouse_activity"])
        ]

        # Store latest client system data
        LAST_SYSTEM_DATA = {
            "cpu_usage": raw_features[0],
            "memory_usage": raw_features[1],
            "screen_brightness": raw_features[2],
            "battery_percent": raw_features[3],
            "keyboard_activity": raw_features[4],
            "mouse_activity": raw_features[5]
        }

    except KeyError as e:
        return jsonify({
            "status": "error",
            "message": f"Missing field: {str(e)}"
        }), 400

    # Normalize
    scaled_features = scaler.transform([raw_features])[0]

    # Add to sliding window
    buffer.add(scaled_features.tolist())

    # Run prediction only if buffer ready
    if buffer.is_ready():
        sequence = np.array(buffer.get_sequence()).reshape(
            1, SEQUENCE_LENGTH, len(raw_features)
        )

        idle_prob = float(model.predict(sequence)[0][0])

        if idle_prob > 0.7:
            state = "Likely Idle"
            confidence = "High"
            recommendations = [
                "Reduce screen brightness by 20%",
                "Switch CPU to power saver mode",
                "Pause unused background applications"
            ]
            gain = 35
        elif idle_prob > 0.4:
            state = "Uncertain"
            confidence = "Medium"
            recommendations = [
                "Lower screen brightness slightly",
                "Monitor background applications"
            ]
            gain = 15
        else:
            state = "Active"
            confidence = "High"
            recommendations = ["System running optimally"]
            gain = 0

        LAST_PREDICTION = {
            "idle_probability": round(idle_prob, 2),
            "user_state": state,
            "confidence": confidence,
            "recommendations": recommendations,
            "estimated_battery_gain_minutes": gain
        }
        print("UPDATED SYSTEM DATA:", LAST_SYSTEM_DATA)

    return jsonify({
        "status": "received",
        "buffer_size": len(buffer.buffer)
    })
    

@app.route("/client-system", methods=["GET"])
def client_system():
    if LAST_SYSTEM_DATA is None:
        return jsonify({"status": "warming_up"})
    return jsonify(LAST_SYSTEM_DATA)

@app.route("/predicted", methods=["GET"])
def predicted():
    if LAST_PREDICTION is None:
        return jsonify({
            "status": "warming_up",
            "message": "Collecting sufficient data for prediction"
        })

    return jsonify(LAST_PREDICTION)



# -----------------------------
# RUN SERVER
# -----------------------------
if __name__ == "__main__":
    debug_mode = os.getenv("FLASK_DEBUG", "false").lower() == "true"
    app.run(host="0.0.0.0", port=5000, debug=debug_mode)
