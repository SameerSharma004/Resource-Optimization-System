import psutil
import requests
import time

BACKEND_URL = "http://13.205.188.251:5000/analyze"

def collect_system_data():
    battery = psutil.sensors_battery()

    return {
        "cpu_usage": psutil.cpu_percent(interval=1),
        "memory_usage": psutil.virtual_memory().percent,
        "screen_brightness": 70,
        "battery_percent": battery.percent if battery else 100,
        "keyboard_activity": 0,
        "mouse_activity": 0
    }

while True:
    try:
        data = collect_system_data()
        response = requests.post(BACKEND_URL, json=data)
        print("Data sent:", response.json())
    except Exception as e:
        print("Error:", e)

    time.sleep(3)