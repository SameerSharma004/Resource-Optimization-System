import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X, Zap, ShieldAlert } from "lucide-react";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

const NotificationBanner = () => {
  const [alert, setAlert] = useState(null);
  const [isVisible, setIsVisible] = useState(true);
  const [enabled, setEnabled] = useState(true);
  useEffect(() => {
    const syncSettings = () => {
      const stored = localStorage.getItem("notifications");
      setEnabled(stored !== "false");
    };
    syncSettings();
    window.addEventListener("settingsChange", syncSettings);
    return () => window.removeEventListener("settingsChange", syncSettings);
  }, []);

  useEffect(() => {
    if (!enabled) {
      setAlert(null);
      return;
    }

    const fetchAlerts = async () => {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      if (!token) return;

      try {
        const res = await fetch(`${API}/predicted`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const data = await res.json();

        if (data.status !== "warming_up") {
          if (data.future_cpu > 80) {
            setAlert({
              type: "critical",
              message: `CRITICAL LOAD DETECTED: System projected to hit ${data.future_cpu.toFixed(1)}% usage.`,
              icon: AlertTriangle
            });
          } else if (data.future_cpu > 60) {
            setAlert({
              type: "warning",
              message: `High resource saturation predicted: ${data.future_cpu.toFixed(1)}% load incoming.`,
              icon: Zap
            });
          } else {
            setAlert(null);
          }
        }
      } catch (e) {
        console.error("Alert fetch failed");
      }
    };

    fetchAlerts();
    const interval = setInterval(fetchAlerts, 5000);
    return () => clearInterval(interval);
  }, [enabled]);



  if (!alert || !isVisible) return null;

  const colorClasses = alert.type === "critical" 
    ? "bg-rose-500 text-white shadow-xl shadow-rose-500/20" 
    : "bg-amber-500 text-black shadow-xl shadow-amber-500/10";

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      className={`relative z-30 px-10 py-3 flex items-center justify-between overflow-hidden transition-colors ${colorClasses}`}
    >
      <div className="flex items-center gap-4">
        <div className="bg-white/20 p-2 rounded-lg backdrop-blur-md">
           <alert.icon size={18} />
        </div>
        <p className="text-[11px] font-black uppercase tracking-widest">
          {alert.message}
        </p>
      </div>
      
      <button 
        onClick={() => setIsVisible(false)}
        className="hover:bg-white/20 p-1.5 rounded-lg transition-colors"
      >
        <X size={16} />
      </button>
      
      {/* Animated Shine Effect */}
      <motion.div 
        animate={{ x: ["-100%", "200%"] }}
        transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
        className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent skew-x-12"
      />
    </motion.div>
  );
};

export default NotificationBanner;
