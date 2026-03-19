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
  Bell,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: "User",
    email: "guest@system.local",
  });
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
    const storedUser =
      localStorage.getItem("user") || sessionStorage.getItem("user");
    if (storedUser && storedUser !== "undefined") {
      try {
        const parsed = JSON.parse(storedUser);
        setUser({
          name: parsed.username || parsed.name || "System Administrator",
          email: parsed.email || "active@session.local",
        });
      } catch (e) {
        console.error("User parse error");
      }
    }
    localStorage.setItem("refreshInterval", "2000");

    const storedNotifs = localStorage.getItem("notifications");
    if (storedNotifs !== null) setNotifications(storedNotifs === "true");

    fetch(`${API}/status`)
      .then((res) => res.json())
      .then((data) =>
        setBackendStatus(data.status === "ok" ? "Connected" : "Error"),
      )
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
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    try {
      const res = await fetch(`${API}/delete-account`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
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
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground tracking-tight mb-2">
            System{" "}
            <span className="text-primary italic font-serif font-normal text-4xl">
              Settings
            </span>
          </h2>
          <p className="text-sm text-muted-foreground">
            Manage your account and preferences
          </p>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2.5 rounded-lg text-sm font-medium transition-all active:scale-95"
        >
          {saved ? (
            <RefreshCcw className="animate-spin" size={16} />
          ) : (
            <Save size={16} />
          )}
          {saved ? "Saved" : "Save Changes"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Account Info */}
        <div className="md:col-span-12">
          <section className="bg-card border border-border rounded-xl p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                  <User size={32} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground">
                    {user.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {user.email}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted hover:bg-muted/80 text-foreground border border-border transition-all text-sm font-medium"
                >
                  <LogOut size={16} />
                  Logout
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-destructive/10 hover:border-red-600 text-red-500  hover:text-red-600 border border-destructive/20 transition-all text-sm font-medium"
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <section className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary border border-primary/20 flex items-center justify-center">
                  <Sun size={20} />
                </div>
                <h3 className="text-lg font-semibold text-foreground">
                  Theme Mode
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setIsDark(false)}
                  className={`p-4 rounded-lg border transition-all flex flex-col items-center gap-3 ${!isDark ? "bg-muted border-primary" : "bg-transparent border-border hover:bg-muted/50"}`}
                >
                  <Sun
                    size={24}
                    className={
                      !isDark ? "text-primary" : "text-muted-foreground"
                    }
                  />
                  <p className="text-sm font-medium text-foreground">
                    Light Mode
                  </p>
                </button>

                <button
                  onClick={() => setIsDark(true)}
                  className={`p-4 rounded-lg border transition-all flex flex-col items-center gap-3 ${isDark ? "bg-muted border-primary" : "bg-transparent border-border hover:bg-muted/50"}`}
                >
                  <Moon
                    size={24}
                    className={
                      isDark ? "text-primary" : "text-muted-foreground"
                    }
                  />
                  <p className="text-sm font-medium text-foreground">
                    Dark Mode
                  </p>
                </button>
              </div>
            </section>

            <section className="bg-card border border-border rounded-xl p-6">
              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center border border-amber-500/20">
                      <Bell size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        System Alerts
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Notifications for important events
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setNotifications(!notifications)}
                    className={`w-11 h-6 rounded-full relative transition-all duration-300 ${notifications ? "bg-primary" : "bg-muted"}`}
                  >
                    <div
                      className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300 ${notifications ? "right-1" : "left-1"}`}
                    ></div>
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
            <div
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
              onClick={() => !isDeleting && setShowDeleteConfirm(false)}
            ></div>
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative z-10 w-full max-w-md bg-card border border-border rounded-xl p-6 shadow-xl"
            >
              <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center text-destructive mb-6 mx-auto">
                <AlertTriangle size={32} />
              </div>

              <h3 className="text-xl font-semibold text-foreground text-center mb-2">
                Delete Account
              </h3>

              <p className="text-muted-foreground text-center mb-8 text-sm">
                You are about to delete your account. This action will
                permanently erase your authentication data from our database.
              </p>

              <div className="flex flex-col gap-3">
                <button
                  onClick={handleDeleteAccount}
                  disabled={isDeleting}
                  className="w-full py-2.5 rounded-lg bg-destructive text-destructive-foreground font-medium text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  {isDeleting ? (
                    <RefreshCcw className="animate-spin" size={16} />
                  ) : (
                    <Trash2 size={16} />
                  )}
                  Confirm Delete
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={isDeleting}
                  className="w-full py-2.5 rounded-lg bg-muted text-foreground font-medium text-sm transition-all hover:bg-muted/80"
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
