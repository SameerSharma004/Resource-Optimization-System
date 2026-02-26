import psutil
import time
import requests
import os

BACKEND_BASE_URL = "http://35.154.100.145:5000"

ANALYZE_URL = f"{BACKEND_BASE_URL}/analyze"
PREDICT_URL = f"{BACKEND_BASE_URL}/predicted"

INTERVAL = 10  # seconds


def collect_system_data():
    cpu = psutil.cpu_percent()
    memory = psutil.virtual_memory().percent

    battery = psutil.sensors_battery()
    battery_percent = battery.percent if battery else 100

    # Keyboard/mouse placeholders (v1)
    keyboard_activity = 0
    mouse_activity = 0

    data = {
        "cpu_usage": cpu,
        "memory_usage": memory,
        "screen_brightness": 70,   # placeholder
        "battery_percent": battery_percent,
        "keyboard_activity": keyboard_activity,
        "mouse_activity": mouse_activity
    }
    return data


def send_data(data):
    try:
        requests.post(ANALYZE_URL, json=data, timeout=3)
    except Exception as e:
        print("❌ Failed to send data:", e)


def fetch_prediction():
    try:
        r = requests.get(PREDICT_URL, timeout=3)
        return r.json()
    except Exception as e:
        return {"status": "error", "message": str(e)}


def clear_screen():
    os.system("cls" if os.name == "nt" else "clear")


def display(prediction):
    clear_screen()
    print("⚡ AI Laptop Power Saver (EC2)")
    print("-" * 40)

    if prediction.get("status") == "warming_up":
        print("🧠 AI Status : Learning your behavior...")
        return

    print(f"🧠 User State        : {prediction.get('user_state')}")
    print(f"📊 Idle Probability : {prediction.get('idle_probability')}")
    print(f"🎯 Confidence       : {prediction.get('confidence')}")
    print("\n🔧 Recommendations:")
    for rec in prediction.get("recommendations", []):
        print(f"  • {rec}")

    print(f"\n🔋 Estimated Battery Gain : {prediction.get('estimated_battery_gain_minutes')} minutes")


def main():
    print("🚀 Local AI Agent started")
    print(f"🌐 Connected to {BACKEND_BASE_URL}")

    while True:
        data = collect_system_data()
        send_data(data)

        prediction = fetch_prediction()
        display(prediction)

        time.sleep(INTERVAL)


if __name__ == "__main__":
    main()