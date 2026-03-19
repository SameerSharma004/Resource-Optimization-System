import customtkinter as ctk
from tkinter import messagebox
import psutil
import requests
import time
import threading
import logging
import json
import os

LOGIN_URL = "https://ai-powered-resource-optimization-system.onrender.com/login"
BACKEND_URL = "https://ai-powered-resource-optimization-system.onrender.com/analyze"
TOKEN = None
USER_EMAIL = ""
CONFIG_FILE = "agent_config.json"


COLOR_BG = "#0f172a"          
COLOR_SIDEBAR = "#1e293b"     
COLOR_ACCENT = "#3b82f6"      
COLOR_SUCCESS = "#22c55e"     
COLOR_TEXT = "#f8fafc"        
COLOR_CARD = "#1e293b"   

ctk.set_appearance_mode("dark")
ctk.set_default_color_theme("blue")

class AgentApp(ctk.CTk):
    def __init__(self):
        super().__init__()
        self.title("Serial Resource Optimizer")
        self.geometry("520x620")
        self.resizable(False, False)
        self.configure(fg_color=COLOR_BG)
        
        self.is_telemetry_running = True
        self.is_app_running = True
        
        self.main_container = ctk.CTkFrame(self, fg_color="transparent")
        self.main_container.pack(side="right", fill="both", expand=True, padx=30, pady=30)
        
        saved_data = self.load_config()
        if saved_data:
            self.auto_login(saved_data['email'], saved_data['password'])
        else:
            self.show_home()

        self.protocol("WM_DELETE_WINDOW", self.on_closing)

    def load_config(self):
        if os.path.exists(CONFIG_FILE):
            try:
                with open(CONFIG_FILE, "r") as f:
                    return json.load(f)
            except:
                return None
        return None

    def save_config(self, email, password):
        with open(CONFIG_FILE, "w") as f:
            json.dump({"email": email, "password": password}, f)

    def clear_config(self):
        if os.path.exists(CONFIG_FILE):
            os.remove(CONFIG_FILE)

    def auto_login(self, email, password):
        self.show_connecting()
        threading.Thread(target=lambda: self.connection_task(email, password), daemon=True).start()

    def clear_view(self):
        for widget in self.main_container.winfo_children():
            widget.destroy()

    def on_closing(self):
        self.is_app_running = False
        self.destroy()

    def show_home(self):
        self.clear_view()
        
        title = ctk.CTkLabel(self.main_container, text="Serial Resource Optimizer", font=("Arial", 28, "bold"), text_color=COLOR_TEXT)
        title.pack(pady=(20, 10), anchor="w")
        
        subtitle = ctk.CTkLabel(
            self.main_container, 
            text="The next generation of AI-driven system optimization.", 
            font=("Arial", 14), 
            text_color="gray",
            wraplength=300,
            justify="left"
        )
        subtitle.pack(pady=(0, 30), anchor="w")
        
        card = ctk.CTkFrame(self.main_container, fg_color=COLOR_CARD, corner_radius=12)
        card.pack(fill="x", pady=10)
        
        ctk.CTkLabel(card, text="📊 Real-time Monitoring", font=("Arial", 13, "bold"), text_color=COLOR_ACCENT).pack(pady=(15, 5), padx=20, anchor="w")
        ctk.CTkLabel(card, text="Track CPU, RAM, and Network with precision.", font=("Arial", 12), text_color="gray").pack(pady=(0, 15), padx=20, anchor="w")
        
        btn_start = ctk.CTkButton(
            self.main_container,
            text="Get Started",
            command=self.show_login,
            fg_color=COLOR_ACCENT,
            hover_color="#2563eb",
            height=50,
            font=("Arial", 16, "bold"),
            corner_radius=10
        )
        btn_start.pack(pady=40, fill="x")

    def show_login(self):
        self.clear_view()
        
        back_btn = ctk.CTkButton(
            self.main_container, text="← Back", width=60, height=25, 
            fg_color="transparent", text_color="gray", command=self.show_home
        )
        back_btn.pack(anchor="w", pady=(0, 20))
        
        ctk.CTkLabel(self.main_container, text="Agent Login", font=("Arial", 24, "bold"), text_color=COLOR_TEXT).pack(anchor="w", pady=10)
        ctk.CTkLabel(self.main_container, text="Use your corporate credentials to link this device.", font=("Arial", 13), text_color="gray").pack(anchor="w", pady=(0, 30))
        
        self.email_entry = ctk.CTkEntry(
            self.main_container, placeholder_text="Enter Email", 
            width=300, height=45, corner_radius=10, fg_color="#1e293b", border_color="#334155"
        )
        self.email_entry.pack(pady=10, fill="x")
        
        self.password_entry = ctk.CTkEntry(
            self.main_container, placeholder_text="Security Password", 
            show="*", width=300, height=45, corner_radius=10, fg_color="#1e293b", border_color="#334155"
        )
        self.password_entry.pack(pady=10, fill="x")
        
        self.error_label = ctk.CTkLabel(self.main_container, text="", font=("Arial", 12), text_color="#ef4444")
        self.error_label.pack(pady=10)
        
        login_btn = ctk.CTkButton(
            self.main_container, text="Connect Device", 
            command=self.initiate_connection, 
            height=50, font=("Arial", 16, "bold"), corner_radius=10
        )
        login_btn.pack(pady=20, fill="x")

    def show_connecting(self):
        self.clear_view()
        
        title = ctk.CTkLabel(self.main_container, text="Establishing Connection", font=("Arial", 22, "bold"), text_color=COLOR_TEXT)
        title.pack(pady=(60, 10))
        
        self.conn_status = ctk.CTkLabel(self.main_container, text="Trying to connect...", font=("Arial", 14), text_color=COLOR_ACCENT)
        self.conn_status.pack(pady=10)
        
        self.conn_progress = ctk.CTkProgressBar(self.main_container, width=320, height=12, corner_radius=4)
        self.conn_progress.pack(pady=20)
        self.conn_progress.set(0)
        
        self.conn_detail = ctk.CTkLabel(self.main_container, text="Authorizing secure tunnel...", font=("Arial", 11), text_color="gray")
        self.conn_detail.pack(pady=10)

    def show_active_dashboard(self):
        self.clear_view()
        
        ctk.CTkLabel(self.main_container, text="Agent Overview", font=("Arial", 22, "bold"), text_color=COLOR_SUCCESS).pack(anchor="w", pady=(10, 5))
        ctk.CTkLabel(self.main_container, text=f"Active Account: {USER_EMAIL}", font=("Arial", 12), text_color="gray").pack(anchor="w", pady=(0, 20))
        
        self.stats_container = ctk.CTkFrame(self.main_container, fg_color="#1e293b", corner_radius=15)
        self.stats_container.pack(fill="x", pady=10)
        
        self.cpu_label = ctk.CTkLabel(self.stats_container, text="CPU Usage: --%", font=("Arial", 14, "bold"), text_color=COLOR_TEXT)
        self.cpu_label.pack(side="left", padx=20, pady=20)
        
        self.ram_label = ctk.CTkLabel(self.stats_container, text="RAM Usage: --%", font=("Arial", 14, "bold"), text_color=COLOR_TEXT)
        self.ram_label.pack(side="right", padx=20, pady=20)
        
        controls_frame = ctk.CTkFrame(self.main_container, fg_color="transparent")
        controls_frame.pack(fill="x", pady=20)
        
        self.stop_btn = ctk.CTkButton(
            controls_frame, 
            text="Stop Telemetry", 
            command=self.toggle_telemetry,
            fg_color="#334155", 
            hover_color="#475569"
        )
        self.stop_btn.pack(side="left", expand=True, padx=5)
        
        self.logout_btn = ctk.CTkButton(
            controls_frame, 
            text="Logout", 
            command=self.handle_logout,
            fg_color="#450a0a", 
            hover_color="#7f1d1d"
        )
        self.logout_btn.pack(side="right", expand=True, padx=5)
        
        self.telemetry_status = ctk.CTkLabel(self.main_container, text="Status: Streaming data...", font=("Arial", 11), text_color="gray")
        self.telemetry_status.pack(pady=10)

    def toggle_telemetry(self):
        self.is_telemetry_running = not self.is_telemetry_running
        if self.is_telemetry_running:
            self.stop_btn.configure(text="Stop Telemetry")
            self.telemetry_status.configure(text="Status: Streaming data...", text_color="gray")
        else:
            self.stop_btn.configure(text="Start Telemetry")
            self.telemetry_status.configure(text="Status: Telemetry Paused", text_color="#ef4444")
            self.cpu_label.configure(text="CPU Usage: --%")
            self.ram_label.configure(text="RAM Usage: --%")

    def handle_logout(self):
        global TOKEN
        TOKEN = None
        self.is_telemetry_running = False
        self.clear_config()
        self.show_home()

    def initiate_connection(self):
        email = self.email_entry.get()
        password = self.password_entry.get()
        
        if not email or not password:
            self.error_label.configure(text="Please enter all required fields.")
            return
            
        self.show_connecting()
        threading.Thread(target=lambda: self.connection_task(email, password), daemon=True).start()

    def connection_task(self, email, password):
        global USER_EMAIL
        try:
            self.after(0, lambda: self.update_conn_ui("Verifying Credentials...", 0.3, "Contacting secure server..."))
            time.sleep(1)
            
            success, message = self.get_token_request(email, password)
            
            if not success:
                self.after(0, lambda: self.handle_conn_fail(message))
                return

            self.save_config(email, password)
            USER_EMAIL = email
            
            self.after(0, lambda: self.update_conn_ui("Finalizing Setup...", 0.8, "Initializing system bridge..."))
            time.sleep(0.8)
            
            self.after(0, self.show_active_dashboard)
            self.is_telemetry_running = True
            threading.Thread(target=self.agent_loop, daemon=True).start()
            
        except Exception as e:
            self.after(0, lambda: self.handle_conn_fail(f"Network Error: {str(e)[:20]}"))

    def update_conn_ui(self, status, progress, detail):
        if self.is_app_running:
            self.conn_status.configure(text=status)
            self.conn_progress.set(progress)
            self.conn_detail.configure(text=detail)

    def handle_conn_fail(self, message):
        self.show_login()
        if hasattr(self, 'error_label'):
            self.error_label.configure(text=message)

    def get_token_request(self, email, password):
        global TOKEN
        try:
            response = requests.post(LOGIN_URL, json={"email": email, "password": password}, timeout=10)
            if response.status_code == 200:
                TOKEN = response.json()["token"]
                return True, "Success"
            elif response.status_code == 401:
                return False, "Invalid Email or Password"
            return False, f"Server Error {response.status_code}"
        except:
            return False, "Could not reach server"

    def agent_loop(self):
        global TOKEN
        last_net = last_disk = last_disk_io = None
        last_time = time.time()
        
        while TOKEN and self.is_app_running:
            if not self.is_telemetry_running:
                time.sleep(1)
                continue
                
            try:
                data = collect_system_data()
                current_time = time.time()
                time_diff = current_time - last_time
                if last_net and time_diff > 0:
                    data['net_upload_mbps'] = round((data['network_sent_bytes'] - last_net['sent']) / (1024*1024) / time_diff, 2)
                    data['net_download_mbps'] = round((data['network_recv_bytes'] - last_net['recv']) / (1024*1024) / time_diff, 2)
                    data['disk_read_mbps'] = round((data['disk_read_bytes'] - last_disk['read']) / (1024*1024) / time_diff, 2) if last_disk else 0.0
                    data['disk_write_mbps'] = round((data['disk_write_bytes'] - last_disk['write']) / (1024*1024) / time_diff, 2) if last_disk else 0.0
                
                if self.is_app_running:
                    self.after(0, lambda c=data['cpu_usage'], r=data['memory_usage']: self.update_stats_ui(c, r))

                last_net = {'sent': data['network_sent_bytes'], 'recv': data['network_recv_bytes']}
                last_disk = {'read': data['disk_read_bytes'], 'write': data['disk_write_bytes']}
                last_time = current_time

                headers = {"Authorization": f"Bearer {TOKEN}"}
                requests.post(BACKEND_URL, json=data, headers=headers, timeout=5)
                time.sleep(2)
            except:
                time.sleep(2)

    def update_stats_ui(self, cpu, ram):
        if self.is_app_running and hasattr(self, 'cpu_label') and self.cpu_label.winfo_exists():
            try:
                self.cpu_label.configure(text=f"CPU Usage: {cpu}%")
                self.ram_label.configure(text=f"RAM Usage: {ram}%")
            except:
                pass

def get_top_processes():
    processes = []
    for proc in psutil.process_iter(['pid', 'name', 'cpu_percent', 'memory_info']):
        try:
            pinfo = proc.info
            mem_mb = pinfo['memory_info'].rss / (1024 * 1024) if pinfo['memory_info'] else 0
            processes.append({
                "pid": pinfo['pid'], "name": pinfo['name'], "cpu_percent": pinfo['cpu_percent'] or 0.0, "memory_mb": round(mem_mb, 1)
            })
        except: pass
    processes.sort(key=lambda p: p['memory_mb'], reverse=True)
    return processes[:5]

def collect_system_data():
    vm = psutil.virtual_memory()
    net_io = psutil.net_io_counters()
    disk_io = psutil.disk_io_counters()
    return {
        "cpu_usage": psutil.cpu_percent(interval=1),
        "cpu_cores": psutil.cpu_percent(interval=None, percpu=True),
        "memory_usage": vm.percent,
        "memory_total_gb": round(vm.total / (1024**3), 2),
        "memory_used_gb": round(vm.used / (1024**3), 2),
        "memory_free_gb": round(vm.free / (1024**3), 2),
        "network_sent_bytes": net_io.bytes_sent,
        "network_recv_bytes": net_io.bytes_recv,
        "disk_read_bytes": disk_io.read_bytes if disk_io else 0,
        "disk_write_bytes": disk_io.write_bytes if disk_io else 0,
        "top_processes": get_top_processes(),
        "battery_percent": psutil.sensors_battery().percent if psutil.sensors_battery() else 100
    }

if __name__ == "__main__":
    app = AgentApp()
    app.mainloop()
