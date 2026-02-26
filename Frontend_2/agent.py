import json
import os
import socket
import time
from datetime import datetime, timezone
from urllib import error, request

try:
    import psutil
except Exception:
    psutil = None


BACKEND_BASE_URL = os.getenv("BACKEND_BASE_URL", "http://13.205.188.251:5000").rstrip("/")
ANALYZE_URL = os.getenv("ANALYZE_URL", f"{BACKEND_BASE_URL}/analyze")
PREDICT_URL = os.getenv("PREDICT_URL", f"{BACKEND_BASE_URL}/predicted")
INTERVAL = int(os.getenv("AGENT_INTERVAL_SECONDS", "10"))


def _cpu_percent(sample_time=0.2):
    if psutil:
        return round(psutil.cpu_percent(interval=sample_time), 2)

    def read_cpu_times():
        with open("/proc/stat", "r", encoding="utf-8") as f:
            parts = f.readline().split()
        values = [int(x) for x in parts[1:]]
        idle = values[3] + values[4]
        total = sum(values)
        return idle, total

    idle_1, total_1 = read_cpu_times()
    time.sleep(sample_time)
    idle_2, total_2 = read_cpu_times()
    total_delta = total_2 - total_1
    idle_delta = idle_2 - idle_1
    if total_delta <= 0:
        return 0.0
    return round((1 - (idle_delta / total_delta)) * 100, 2)


def _memory_percent():
    if psutil:
        return round(psutil.virtual_memory().percent, 2)

    mem_total = None
    mem_available = None
    with open("/proc/meminfo", "r", encoding="utf-8") as f:
        for line in f:
            if line.startswith("MemTotal:"):
                mem_total = int(line.split()[1])
            elif line.startswith("MemAvailable:"):
                mem_available = int(line.split()[1])
            if mem_total is not None and mem_available is not None:
                break

    if not mem_total or mem_available is None:
        return 0.0
    used = mem_total - mem_available
    return round((used / mem_total) * 100, 2)


def _battery_percent(default=100.0):
    if psutil:
        battery = psutil.sensors_battery()
        if battery is not None and battery.percent is not None:
            return round(float(battery.percent), 2)

    power_supply_dir = "/sys/class/power_supply"
    if not os.path.isdir(power_supply_dir):
        return default

    for name in os.listdir(power_supply_dir):
        if not name.startswith("BAT"):
            continue
        cap_path = os.path.join(power_supply_dir, name, "capacity")
        try:
            with open(cap_path, "r", encoding="utf-8") as f:
                return round(float(f.read().strip()), 2)
        except Exception:
            continue
    return default


def _screen_brightness_percent(default=70.0):
    base_path = "/sys/class/backlight"
    if not os.path.isdir(base_path):
        return default

    for name in os.listdir(base_path):
        max_path = os.path.join(base_path, name, "max_brightness")
        value_path = os.path.join(base_path, name, "brightness")
        try:
            with open(max_path, "r", encoding="utf-8") as f:
                max_value = float(f.read().strip())
            with open(value_path, "r", encoding="utf-8") as f:
                current_value = float(f.read().strip())
            if max_value > 0:
                return round((current_value / max_value) * 100, 2)
        except Exception:
            continue

    return default


def _activity_proxy(cpu_usage, memory_usage):
    # Backend expects activity fields; use bounded dynamic proxies instead of fixed zeroes.
    keyboard_activity = int(cpu_usage >= 20 or memory_usage >= 75)
    mouse_activity = int(cpu_usage >= 15)
    return keyboard_activity, mouse_activity


def collect_system_data():
    cpu = _cpu_percent()
    memory = _memory_percent()
    battery_percent = _battery_percent()
    brightness = _screen_brightness_percent()
    keyboard_activity, mouse_activity = _activity_proxy(cpu, memory)

    return {
        "timestamp_utc": datetime.now(timezone.utc).isoformat(),
        "device_name": socket.gethostname(),
        "cpu_usage": cpu,
        "memory_usage": memory,
        "screen_brightness": brightness,
        "battery_percent": battery_percent,
        "keyboard_activity": keyboard_activity,
        "mouse_activity": mouse_activity,
    }


def _post_json(url, payload, timeout=5):
    data = json.dumps(payload).encode("utf-8")
    req = request.Request(
        url,
        data=data,
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    with request.urlopen(req, timeout=timeout) as response:
        body = response.read().decode("utf-8").strip()
        return json.loads(body) if body else {"status": "ok"}


def _get_json(url, timeout=5):
    with request.urlopen(url, timeout=timeout) as response:
        body = response.read().decode("utf-8").strip()
        return json.loads(body) if body else {}


def send_data(data):
    try:
        return _post_json(ANALYZE_URL, data)
    except error.HTTPError as e:
        details = e.read().decode("utf-8", errors="replace")
        return {
            "status": "error",
            "message": f"HTTP {e.code} from /analyze",
            "details": details,
        }
    except Exception as e:
        return {"status": "error", "message": f"Failed to send data: {e}"}


def fetch_prediction():
    try:
        raw = _get_json(PREDICT_URL)
        return normalize_prediction(raw)
    except error.HTTPError as e:
        details = e.read().decode("utf-8", errors="replace")
        return {
            "status": "error",
            "message": f"HTTP {e.code} from /predicted",
            "details": details,
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}


def _as_float(value):
    try:
        if value is None:
            return None
        return float(value)
    except Exception:
        return None


def _format_probability(value):
    parsed = _as_float(value)
    if parsed is None:
        return "N/A"
    if parsed <= 1:
        parsed *= 100
    return f"{parsed:.2f}%"


def normalize_prediction(raw):
    if not isinstance(raw, dict):
        return {"status": "error", "message": "Prediction payload is not a JSON object"}

    payload = raw.get("prediction", raw)
    if not isinstance(payload, dict):
        return {"status": "error", "message": "Prediction payload is malformed"}

    status = payload.get("status") or raw.get("status") or "ok"
    if status == "error":
        return {
            "status": "error",
            "message": payload.get("message") or raw.get("message") or "Unknown backend error",
        }

    recommendations = payload.get("recommendations", [])
    if isinstance(recommendations, str):
        recommendations = [recommendations]
    elif not isinstance(recommendations, list):
        recommendations = [str(recommendations)]

    if status != "warming_up" and not recommendations:
        recommendations = ["No recommendation returned by backend yet."]

    return {
        "status": status,
        "user_state": payload.get("user_state", "unknown"),
        "idle_probability": _format_probability(payload.get("idle_probability")),
        "confidence": _format_probability(payload.get("confidence")),
        "recommendations": recommendations,
        "estimated_battery_gain_minutes": payload.get("estimated_battery_gain_minutes", 0),
        "samples_seen": payload.get("samples_seen", raw.get("samples_seen")),
    }


def clear_screen():
    if os.getenv("TERM"):
        os.system("cls" if os.name == "nt" else "clear")


def display(prediction, send_result):
    clear_screen()
    print("AI Laptop Power Saver Agent")
    print("=" * 40)
    print(f"Backend: {BACKEND_BASE_URL}")

    if send_result.get("status") == "error":
        print(f"Send status: {send_result.get('message')}")
    else:
        print("Send status: ok")

    print("-" * 40)

    if prediction.get("status") == "error":
        print(f"Prediction error: {prediction.get('message')}")
        if prediction.get("details"):
            print(f"Details: {prediction.get('details')}")
        return

    if prediction.get("status") == "warming_up":
        print("AI status: warming_up")
        if prediction.get("samples_seen") is not None:
            print(f"Samples seen: {prediction.get('samples_seen')}")
        print("Learning user behavior. Waiting for stable prediction...")
        return

    print(f"User state      : {prediction.get('user_state')}")
    print(f"Idle probability: {prediction.get('idle_probability')}")
    print(f"Confidence      : {prediction.get('confidence')}")
    print("Recommendations :")
    for rec in prediction.get("recommendations", []):
        print(f"  - {rec}")
    print(
        "Estimated battery gain (minutes): "
        f"{prediction.get('estimated_battery_gain_minutes')}"
    )


def main():
    print("Local AI Agent started")
    print(f"Connected to {BACKEND_BASE_URL}")
    print(f"Polling interval: {INTERVAL}s")

    while True:
        data = collect_system_data()
        send_result = send_data(data)
        prediction = fetch_prediction()
        display(prediction, send_result)
        time.sleep(INTERVAL)


if __name__ == "__main__":
    main()
