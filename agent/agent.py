import customtkinter as ctk
from tkinter import messagebox
import psutil
import requests
import time
import threading
import logging

LOGIN_URL = "https://ai-powered-resource-optimization-system.onrender.com/login"
BACKEND_URL = "https://ai-powered-resource-optimization-system.onrender.com/analyze"

TOKEN = None

ctk.set_appearance_mode("dark")
ctk.set_default_color_theme("blue")

def get_token():

    global TOKEN

    email = email_entry.get()
    password = password_entry.get()

    if not email or not password:
        messagebox.showerror("Error", "Please enter email and password")
        return

    try:

        response = requests.post(
            LOGIN_URL,
            json={
                "email": email,
                "password": password
            }
        )

        if response.status_code == 200:

            TOKEN = response.json()["token"]
            logging.info("Authentication successful")

        else:

            messagebox.showerror("Login Failed", response.text)

    except Exception as e:

        logging.error(f"Token error: {e}")

def get_top_processes():

    processes = []

    for proc in psutil.process_iter(['pid', 'name', 'cpu_percent', 'memory_info']):

        try:

            pinfo = proc.info

            mem_mb = pinfo['memory_info'].rss / (1024 * 1024) if pinfo['memory_info'] else 0

            processes.append({
                "pid": pinfo['pid'],
                "name": pinfo['name'],
                "cpu_percent": pinfo['cpu_percent'] or 0.0,
                "memory_mb": round(mem_mb, 1)
            })

        except (psutil.NoSuchProcess, psutil.AccessDenied, psutil.ZombieProcess):
            pass

    processes.sort(key=lambda p: p['memory_mb'], reverse=True)

    return processes[:5]


def collect_system_data():

    battery = psutil.sensors_battery()

    cpu_percent = psutil.cpu_percent(interval=1)
    cpu_cores = psutil.cpu_percent(interval=None, percpu=True)

    net_io = psutil.net_io_counters()
    disk_io = psutil.disk_io_counters()
    disk_io_perdisk = psutil.disk_io_counters(perdisk=True) or {}

    vm = psutil.virtual_memory()

    return {

        "cpu_usage": cpu_percent,
        "cpu_cores": cpu_cores,

        "memory_usage": vm.percent,
        "memory_total_gb": round(vm.total / (1024**3), 2),
        "memory_used_gb": round(vm.used / (1024**3), 2),
        "memory_free_gb": round(vm.free / (1024**3), 2),
        "ram_components": {
            "active": round(getattr(vm, 'active', vm.used) / (1024**3), 2),
            "inactive": round(getattr(vm, 'inactive', 0) / (1024**3), 2),
            "cached": round(getattr(vm, 'cached', 0) / (1024**3), 2),
            "free": round(vm.free / (1024**3), 2),
            "total": round(vm.total / (1024**3), 2),
        },

        "network_sent_bytes": net_io.bytes_sent,
        "network_recv_bytes": net_io.bytes_recv,

        "disk_read_bytes": disk_io.read_bytes if disk_io else 0,
        "disk_write_bytes": disk_io.write_bytes if disk_io else 0,
        "disk_io_perdisk": {name: {"read_count": io.read_count, "write_count": io.write_count} for name, io in disk_io_perdisk.items()},

        "top_processes": get_top_processes(),

        "screen_brightness": 70,
        "battery_percent": battery.percent if battery else 100,

        "keyboard_activity": 0,
        "mouse_activity": 0
    }

def run_agent():

    global TOKEN

    last_net = None
    last_disk = None
    last_disk_io = None
    last_time = time.time()

    while True:

        try:

            data = collect_system_data()

            current_time = time.time()
            time_diff = current_time - last_time

            if last_net and time_diff > 0:

                data['net_upload_mbps'] = round(
                    (data['network_sent_bytes'] - last_net['sent']) / (1024*1024) / time_diff, 2
                )

                data['net_download_mbps'] = round(
                    (data['network_recv_bytes'] - last_net['recv']) / (1024*1024) / time_diff, 2
                )

                data['disk_read_mbps'] = round(
                    (data['disk_read_bytes'] - last_disk['read']) / (1024*1024) / time_diff, 2
                ) if last_disk else 0.0

                data['disk_write_mbps'] = round(
                    (data['disk_write_bytes'] - last_disk['write']) / (1024*1024) / time_diff, 2
                ) if last_disk else 0.0

                disk_iops_list = []
                disk_io_data = data.get('disk_io_perdisk')
                if isinstance(disk_io_data, dict):
                    for disk_name, io_counts in disk_io_data.items():
                        if isinstance(last_disk_io, dict) and disk_name in last_disk_io:
                            prev_io = last_disk_io[disk_name]
                            read_diff = io_counts.get('read_count', 0) - prev_io.get('read_count', 0)
                            write_diff = io_counts.get('write_count', 0) - prev_io.get('write_count', 0)
                            iops = int((read_diff + write_diff) / time_diff)
                            if iops > 0:
                                disk_iops_list.append({"device": disk_name, "iops": iops})
                
                disk_iops_list.sort(key=lambda x: x.get('iops', 0), reverse=True)
                data['disk_iops'] = disk_iops_list[:5]

            else:

                data['net_upload_mbps'] = 0.0
                data['net_download_mbps'] = 0.0
                data['disk_read_mbps'] = 0.0
                data['disk_write_mbps'] = 0.0
                data['disk_iops'] = []

            last_net = {'sent': data['network_sent_bytes'], 'recv': data['network_recv_bytes']}
            last_disk = {'read': data['disk_read_bytes'], 'write': data['disk_write_bytes']}
            
            disk_io_data_new = data.get('disk_io_perdisk')
            last_disk_io = disk_io_data_new if isinstance(disk_io_data_new, dict) else {}
            last_time = current_time
            
            data.pop('disk_io_perdisk', None)


            headers = {
                "Authorization": f"Bearer {TOKEN}"
            }

            response = requests.post(BACKEND_URL, json=data, headers=headers)

            logging.info(
                f"Data sent (Status {response.status_code}) "
                f"| CPU {data['cpu_usage']}% | RAM {data['memory_usage']}%"
            )

        except requests.exceptions.ConnectionError:

            logging.warning("Connection failed, waiting for backend...")

        except Exception as e:

            logging.error(f"Error: {e}")

        time.sleep(2)

def ask_permission():

    response = messagebox.askyesno(
        "Permission Required",
        "Allow access to system resources (CPU, RAM, Network)?"
    )

    if response:

        status_label.configure(text="Authenticating with server...")

        get_token()

        if not TOKEN:
            status_label.configure(text="Authentication Failed")
            return

        status_label.configure(text="Agent Running")

        thread = threading.Thread(target=run_agent, daemon=True)
        thread.start()

    else:

        status_label.configure(text="Permission Denied")

app = ctk.CTk()
app.title("AI Resource Optimization Agent")
app.geometry("420x360")

title = ctk.CTkLabel(
    app,
    text="AI Resource Optimization Agent",
    font=("Arial", 20, "bold")
)
title.pack(pady=15)

email_entry = ctk.CTkEntry(app, placeholder_text="Email", width=250)
email_entry.pack(pady=5)

password_entry = ctk.CTkEntry(app, placeholder_text="Password", show="*", width=250)
password_entry.pack(pady=5)

status_label = ctk.CTkLabel(
    app,
    text="Login to start the agent",
    font=("Arial", 14)
)
status_label.pack(pady=10)

btn = ctk.CTkButton(
    app,
    text="Allow Permission",
    command=ask_permission,
    width=200
)
btn.pack(pady=20)

app.mainloop()