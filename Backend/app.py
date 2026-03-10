from flask import Flask, jsonify, request
import os
import numpy as np
import datetime
import jwt
from functools import wraps
from flask_cors import CORS
from tensorflow.keras.models import load_model
from sklearn.preprocessing import MinMaxScaler
from pymongo import MongoClient
from werkzeug.security import generate_password_hash, check_password_hash


# -------------------------------------------------
# APP INITIALIZATION
# -------------------------------------------------

app = Flask(__name__)
CORS(app)


# -------------------------------------------------
# CONFIGURATION
# -------------------------------------------------

SECRET_KEY = os.getenv("SECRET_KEY", "supersecretkey")
MONGO_URI = os.getenv("MONGO_URI")


# -------------------------------------------------
# DATABASE CONNECTION
# -------------------------------------------------

users_collection = None

try:
    mongo_client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
    mongo_client.server_info()

    db = mongo_client["ros"]
    users_collection = db["userdata"]

    print("MongoDB connected successfully")

except Exception as e:
    print("MongoDB connection failed:", e)


# -------------------------------------------------
# MODEL LOADING
# -------------------------------------------------

DEFAULT_MODEL_CANDIDATES = [
    "/models/model.h5",
    os.path.join(os.path.dirname(__file__), "model", "model.h5"),
]

SEQUENCE_LENGTH = 10
MODEL_LOADED = False
MODEL_LOAD_ERROR = None
MODEL_PATH = None

try:

    env_model_path = os.getenv("MODEL_PATH")
    candidate_paths = [env_model_path] if env_model_path else DEFAULT_MODEL_CANDIDATES

    MODEL_PATH = next((p for p in candidate_paths if p and os.path.exists(p)), None)

    if not MODEL_PATH:
        raise FileNotFoundError("Model file not found")

    model = load_model(MODEL_PATH, compile=False)
    MODEL_LOADED = True

    print("AI Model loaded successfully")

except Exception as e:

    MODEL_LOAD_ERROR = str(e)
    print("Model load failed:", e)
    model = None


# -------------------------------------------------
# DATA SCALER
# -------------------------------------------------

scaler = MinMaxScaler()
scaler.fit([[0,0,0,0,0,0], [100,100,100,100,50,50]])


# -------------------------------------------------
# CLIENT SYSTEM MEMORY STORE
# -------------------------------------------------

LAST_SYSTEM_DATA = None
SYSTEM_HISTORY = []
LAST_PREDICTION = None


# -------------------------------------------------
# AUTHENTICATION DECORATOR
# -------------------------------------------------

def token_required(f):

    @wraps(f)
    def decorated(*args, **kwargs):

        auth_header = request.headers.get("Authorization")

        if not auth_header:
            return jsonify({"message": "Token missing"}), 401

        try:

            token = auth_header.split(" ")[1]
            decoded = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])

            request.user = decoded

        except Exception:

            return jsonify({"message": "Invalid or expired token"}), 401

        return f(*args, **kwargs)

    return decorated


# -------------------------------------------------
# AUTH ROUTES
# -------------------------------------------------

@app.route("/signup", methods=["POST"])
def signup():

    if users_collection is None:
        return jsonify({"error": "Database not connected"}), 500

    data = request.get_json()

    if not data:
        return jsonify({"error": "Invalid request"}), 400

    name = data.get("name")
    email = data.get("email")
    password = data.get("password")

    if not name or not email or not password:
        return jsonify({"error": "Missing required fields"}), 400

    if users_collection.find_one({"email": email}):
        return jsonify({"error": "User already exists"}), 409

    hashed_password = generate_password_hash(password)

    users_collection.insert_one({
        "name": name,
        "email": email,
        "password": hashed_password,
        "created_at": datetime.datetime.utcnow()
    })

    return jsonify({"status": "registered"})


@app.route("/login", methods=["POST"])
def login():

    if users_collection is None:
        return jsonify({"error": "Database not connected"}), 500

    data = request.get_json()

    if not data:
        return jsonify({"error": "Invalid request"}), 400

    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Missing email or password"}), 400

    user = users_collection.find_one({"email": email})

    if not user or not check_password_hash(user["password"], password):
        return jsonify({"error": "Invalid login"}), 401

    token = jwt.encode({
        "user_id": str(user["_id"]),
        "email": user["email"],
        "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=24)
    }, SECRET_KEY, algorithm="HS256")

    return jsonify({
        "token": token,
        "user": {
            "name": user.get("name", "User"),
            "email": user.get("email")
        }
    })


# -------------------------------------------------
# AI ANALYSIS ROUTE
# -------------------------------------------------

@app.route("/analyze", methods=["POST"])
@token_required
def analyze():

    global LAST_SYSTEM_DATA, SYSTEM_HISTORY, LAST_PREDICTION

    if not MODEL_LOADED:
        return jsonify({"error": "Model not loaded"}), 500

    data = request.get_json()

    if not data:
        return jsonify({"error": "No data received"}), 400

    # Store latest system data
    LAST_SYSTEM_DATA = data

    SYSTEM_HISTORY.append({
        "time": datetime.datetime.utcnow().strftime("%H:%M:%S"),
        "cpu": data.get("cpu_usage", 0),
        "ram": data.get("memory_usage", 0),
        "net_up": data.get("net_upload_mbps", 0),
        "net_down": data.get("net_download_mbps", 0)
    })

    if len(SYSTEM_HISTORY) > 30:
        SYSTEM_HISTORY.pop(0)

    try:

        raw_features = [
            float(data.get("cpu_usage", 0)),
            float(data.get("memory_usage", 0)),
            float(data.get("screen_brightness", 70)),
            float(data.get("battery_percent", 100)),
            int(data.get("keyboard_activity", 0)),
            int(data.get("mouse_activity", 0))
        ]

        scaled = scaler.transform([raw_features])[0]

        sequence = np.array([scaled] * SEQUENCE_LENGTH).reshape(
            1, SEQUENCE_LENGTH, len(raw_features)
        )

        idle_prob = float(model.predict(sequence, verbose=0)[0][0])

        if idle_prob > 0.7:

            state = "Likely Idle"
            recommendations = [
                "Reduce screen brightness",
                "Enable power saver mode",
                "Pause background apps"
            ]

        elif idle_prob > 0.4:

            state = "Uncertain"
            recommendations = [
                "Lower screen brightness",
                "Monitor background apps"
            ]

        else:

            state = "Active"
            recommendations = ["System running optimally"]

        LAST_PREDICTION = {
            "time": datetime.datetime.utcnow().strftime("%H:%M:%S"),
            "idle_probability": round(idle_prob, 2),
            "state": state,
            "recommendations": recommendations
        }

        return jsonify({
            "user": request.user["email"],
            "idle_probability": round(idle_prob, 2),
            "state": state,
            "recommendations": recommendations
        })

    except Exception as e:

        return jsonify({"error": str(e)}), 400


# -------------------------------------------------
# CLIENT SYSTEM DATA
# -------------------------------------------------

@app.route("/client-system", methods=["GET"])
@token_required
def client_system():

    if LAST_SYSTEM_DATA is None:
        return jsonify({"status": "warming_up"})

    return jsonify({
        "current": LAST_SYSTEM_DATA,
        "history": SYSTEM_HISTORY
    })


# -------------------------------------------------
# SERVER STATUS ROUTE
# -------------------------------------------------

@app.route("/status")
def status():

    return jsonify({
        "status": "ok",
        "model_loaded": MODEL_LOADED,
        "model_path": MODEL_PATH,
        "model_error": MODEL_LOAD_ERROR
    })

# -------------------------------------------------
# LAST AI PREDICTION
# -------------------------------------------------

@app.route("/predicted", methods=["GET"])
@token_required
def predicted():

    if LAST_PREDICTION is None:
        return jsonify({
            "status": "warming_up",
            "message": "Waiting for prediction"
        })

    return jsonify(LAST_PREDICTION)
# -------------------------------------------------
# SERVER START
# -------------------------------------------------

if __name__ == "__main__":

    debug_mode = os.getenv("FLASK_DEBUG", "false").lower() == "true"

    print("Starting AI Resource Optimization Backend...")
    app.run(host="0.0.0.0", port=5000, debug=debug_mode)