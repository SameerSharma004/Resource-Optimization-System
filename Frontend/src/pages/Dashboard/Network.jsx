import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUpRight,
  ArrowDownLeft,
  Wifi,
  Share2,
  Globe,
  Activity,
  Database,
} from "lucide-react";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

const Network = () => {
  const [metrics, setMetrics] = useState({
    net_down: 0,
    net_up: 0,
    history: [],
  });
  useEffect(() => {
    const fetchNetwork = async () => {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      if (!token) return;
      try {
        const res = await fetch(`${API}/client-system`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.status === 401) {
          localStorage.removeItem("token");
          sessionStorage.removeItem("token");
          window.location.href = "/login";
          return;
        }
        const systemData = await res.json();
        if (systemData && systemData.current) {
          setMetrics({
            net_down: Number(systemData.current.net_download_mbps) || 0,
            net_up: Number(systemData.current.net_upload_mbps) || 0,
            history: systemData.history || [],
          });
        }
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    fetchNetwork();
    const interval = setInterval(fetchNetwork, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold text-foreground tracking-tight mb-2">
            Network{" "}
            <span className="text-primary italic font-serif font-normal text-4xl">
              Usage
            </span>
          </h2>
          <p className="text-sm text-muted-foreground">
            Real-time Traffic Monitoring
          </p>
        </div>

        
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {[
          {
            label: "Download Speed",
            value: metrics.net_down.toFixed(2),
            unit: "MB/s",
            icon: ArrowDownLeft,
            color: "primary",
            trend: "Incoming Traffic",
          },
          {
            label: "Upload Speed",
            value: metrics.net_up.toFixed(2),
            unit: "MB/s",
            icon: ArrowUpRight,
            color: "purple-500",
            trend: "Outgoing Traffic",
          },
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: i === 0 ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-card border border-border p-6 rounded-xl hover:bg-muted/50 transition-colors flex flex-col"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="text-muted-foreground">
                <p className="text-sm font-medium mb-1">{item.label}</p>
                <div className="flex items-baseline gap-1">
                  <h3 className="text-3xl font-semibold text-foreground tabular-nums">
                    {item.value}
                  </h3>
                  <span className="text-sm font-medium text-muted-foreground">
                    {item.unit}
                  </span>
                </div>
              </div>
              <div
                className={`p-3 rounded-lg bg-${item.color}/10 text-${item.color}`}
              >
                <item.icon size={24} />
              </div>
            </div>

            <div className="h-[120px] w-full flex items-end gap-1.5 p-1 mt-auto">
              {metrics.history.length > 0 ? metrics.history.slice(-25).map((point, idx) => (
                <motion.div
                  key={idx}
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  className={`flex-1 rounded-t-sm transition-all ${item.color === 'primary' ? 'bg-primary/30 hover:bg-primary/50' : 'bg-secondary/30 hover:bg-secondary/50'}`}
                  style={{
                    height: `${Math.max(5, ((item.color === "primary" ? (Number(point.net_download_mbps) || 0) : (Number(point.net_upload_mbps) || 0)) / 20) * 100)}%`,
                    transformOrigin: "bottom",
                  }}
                />
              )) : (
                <div className="w-full h-full flex items-center justify-center opacity-20">
                  <Activity size={32} className="animate-pulse" />
                </div>
              )}
            </div>

            <div className="mt-6 flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {item.trend}
              </span>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${item.color === 'primary' ? 'bg-primary' : 'bg-secondary'}`}></div>
                <span className="text-sm text-muted-foreground">Active</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {[
          {
            icon: Database,
            label: "Total Data",
            value: "42.8k",
            sub: "Packets",
          },
          {
            icon: Globe,
            label: "Location",
            value: "Local",
            sub: "Node",
          },
          {
            icon: Share2,
            label: "Status",
            value: "Active",
            sub: "Connected",
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-card border border-border p-5 rounded-xl flex items-center gap-4 hover:bg-muted/50 transition-colors"
          >
            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground">
              <stat.icon size={20} />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </p>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-semibold text-foreground">
                  {stat.value}
                </span>
                <span className="text-xs text-muted-foreground">
                  {stat.sub}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Network;
