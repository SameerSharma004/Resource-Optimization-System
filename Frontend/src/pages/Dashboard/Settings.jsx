import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, 
  Moon, 
  Sun, 
  Zap, 
  Save, 
  RefreshCcw,
  Shield,
  LogOut,
  Terminal,
  Activity,
  Server,
  Trash2,
  AlertTriangle,
  Bell
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({ name: "User", email: "guest@system.local" });
  const [isDark, setIsDark] = useState(() => {
    return document.documentElement.classList.contains("dark");
  });
  const [saved, setSaved] = useState(false);
  const [backendStatus, setBackendStatus] = useState("Checking...");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [notifications, setNotifications] = useState(true);

  const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    const storedUser = localStorage.getItem("user") || sessionStorage.getItem("user");
    if (storedUser && storedUser !== "undefined") {
      try {
        const parsed = JSON.parse(storedUser);
        setUser({
          name: parsed.username || parsed.name || "System Administrator",
          email: parsed.email || "active@session.local"
        });
      } catch (e) {
        console.error("User parse error");
      }
    }
    
    // Default interval is now hardcoded at 2000ms
    localStorage.setItem("refreshInterval", "2000");

    const storedNotifs = localStorage.getItem("notifications");
    if (storedNotifs !== null) setNotifications(storedNotifs === "true");

    fetch(`${API}/status`)
      .then(res => res.json())
      .then(data => setBackendStatus(data.status === "ok" ? "Connected" : "Error"))
      .catch(() => setBackendStatus("Disconnected"));
  }, [API]);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
    window.dispatchEvent(new Event("themeChange"));
  }, [isDark]);

  const handleSave = () => {
    localStorage.setItem("notifications", notifications.toString());
    setSaved(true);
    setTimeout(() => {
        setSaved(false);
        window.dispatchEvent(new Event("settingsChange"));
    }, 2000);
  };


  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = "/login";
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    try {
      const res = await fetch(`${API}/delete-account`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = "/";
      } else {
        alert("Failed to delete account. Please try again.");
      }
    } catch (e) {
      alert("Network error. Could not delete account.");
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };


  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-foreground tracking-tight mb-2">
            Control <span className="text-primary italic font-serif font-normal text-4xl">Center</span>
          </h2>
          <p className="text-muted-foreground text-[10px] font-black tracking-[0.3em] uppercase">Configure your system parameters</p>
        </div>
        <button
          onClick={handleSave}
          className="group flex items-center gap-3 bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all active:scale-95 glow-effect"
        >
          {saved ? <RefreshCcw className="animate-spin" size={16} /> : <Save size={16} />}
          {saved ? "Synchronized" : "Commit Changes"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Account Info */}
        <div className="md:col-span-12">
          <section className="bg-card backdrop-blur-xl border border-border rounded-[40px] p-10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 size-64 bg-primary/5 blur-[80px] -mr-32 -mt-32"></div>
            
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
              <div className="flex items-center gap-6">
                <div className="size-20 rounded-3xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-inner">
                  <User size={40} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-foreground tracking-tight">{user.name}</h3>
                  <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mt-1 opacity-60">{user.email}</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-muted hover:bg-muted/80 text-foreground border border-border transition-all font-black uppercase tracking-widest text-[10px]"
                >
                  <LogOut size={16} />
                  Logout
                </button>
                <button 
                  onClick={() => setShowDeleteConfirm(true)}
                  className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white border border-rose-500/20 transition-all font-black uppercase tracking-widest text-[10px]"
                >
                  <Trash2 size={16} />
                  Delete Account
                </button>
              </div>
            </div>
          </section>
        </div>

        {/* Visual Settings */}
        <div className="md:col-span-12">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <section className="bg-card border border-border rounded-[40px] p-10">
                <div className="flex items-center gap-4 mb-10">
                  <div className="size-12 rounded-2xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center">
                    <Sun size={22} />
                  </div>
                  <h3 className="text-xl font-black text-foreground">Visual Mode</h3>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => setIsDark(false)}
                    className={`p-6 rounded-[32px] border transition-all flex flex-col items-center gap-4 group relative overflow-hidden ${!isDark ? 'bg-background border-primary shadow-lg' : 'bg-muted/20 border-border hover:border-primary/30'}`}
                  >
                    <div className={`size-12 rounded-2xl flex items-center justify-center transition-colors ${!isDark ? 'bg-primary text-white' : 'bg-muted text-muted-foreground/40'}`}>
                      <Sun size={24} />
                    </div>
                    <p className="text-sm font-black text-foreground">Light Mode</p>
                  </button>

                  <button 
                    onClick={() => setIsDark(true)}
                    className={`p-6 rounded-[32px] border transition-all flex flex-col items-center gap-4 group relative overflow-hidden ${isDark ? 'bg-background border-primary shadow-lg' : 'bg-muted/20 border-border hover:border-primary/30'}`}
                  >
                    <div className={`size-12 rounded-2xl flex items-center justify-center transition-colors ${isDark ? 'bg-primary text-white' : 'bg-muted text-muted-foreground/40'}`}>
                      <Moon size={24} />
                    </div>
                    <p className="text-sm font-black text-foreground">Dark Mode</p>
                  </button>
                </div>
              </section>

              <section className="bg-card border border-border rounded-[40px] p-10">
                <div className="flex flex-col gap-6">
                  <div className="pt-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center border border-amber-500/20">
                         <Bell size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-black text-foreground">Dashboard Alerts</p>
                        <p className="text-[9px] text-muted-foreground uppercase font-black">AI Triggered Notifications</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setNotifications(!notifications)}
                      className={`w-12 h-6 rounded-full relative transition-all duration-300 ${notifications ? 'bg-primary' : 'bg-muted'}`}
                    >
                      <div className={`absolute top-1 size-4 rounded-full bg-white transition-all duration-300 ${notifications ? 'right-1' : 'left-1'}`}></div>
                    </button>
                  </div>
                </div>
              </section>
           </div>
        </div>

       
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence mode="wait">
        {showDeleteConfirm && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-100 flex items-center justify-center px-6"
          >
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => !isDeleting && setShowDeleteConfirm(false)}></div>
            <motion.div 
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              className="relative z-10 w-full max-w-lg bg-card border border-border rounded-[40px] p-10 shadow-2xl"
            >
              <div className="size-20 rounded-3xl bg-rose-500/10 flex items-center justify-center text-rose-500 border border-rose-500/20 mb-8 mx-auto">
                <AlertTriangle size={40} />
              </div>
              
              <h3 className="text-2xl font-black text-foreground text-center mb-4 tracking-tight">
                Delete Account
              </h3>
              
              <p className="text-muted-foreground text-center mb-10 text-sm leading-relaxed">
                You are about to Delete your account. This action will permanently erase your authentication data from our database.
              </p>
              
              <div className="flex flex-col gap-4">
                <button 
                  onClick={handleDeleteAccount}
                  disabled={isDeleting}
                  className="w-full py-5 rounded-2xl bg-rose-500 text-white font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 active:scale-95 transition-all disabled:opacity-50"
                >
                  {isDeleting ? <RefreshCcw className="animate-spin" size={16} /> : <Trash2 size={16} />}
                  Confirm Delete
                </button>
                <button 
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={isDeleting}
                  className="w-full py-5 rounded-2xl bg-muted text-foreground font-black uppercase tracking-widest text-xs active:scale-95 transition-all"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Settings;
