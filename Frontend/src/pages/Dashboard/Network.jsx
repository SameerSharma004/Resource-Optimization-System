import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, ArrowDownLeft, Wifi, Share2, Globe, Activity, Database } from "lucide-react";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

const Network = () => {
  const [metrics, setMetrics] = useState({
    net_down: 0,
    net_up: 0,
    history: [],
  });
  useEffect(() => {
    const fetchNetwork = async () => {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
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
          <h2 className="text-3xl font-black text-foreground tracking-tight mb-2">
            Flow{" "}
            <span className="text-primary italic font-serif font-normal text-4xl">
              Analysis
            </span>
          </h2>
          <p className="text-muted-foreground text-sm font-bold tracking-widest uppercase">
            Network Flux Monitoring
          </p>
        </div>

        <div className="flex bg-card backdrop-blur-xl border border-border rounded-2xl p-4 gap-6">
          <div className="flex items-center gap-3">
            <div className="size-2 rounded-full bg-emerald-400 animate-pulse"></div>
            <span className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-widest">
              Connection Stable
            </span>
          </div>
          <div className="flex items-center gap-3 border-l border-border pl-6">
            <Wifi size={14} className="text-primary" />
            <span className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-widest">
              Local Node v4
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {[
          {
            label: "Downlink Transfer",
            value: metrics.net_down.toFixed(2),
            unit: "MB/s",
            icon: ArrowDownLeft,
            color: "primary",
            trend: "Receiving Cluster",
          },
          {
            label: "Uplink Transfer",
            value: metrics.net_up.toFixed(2),
            unit: "MB/s",
            icon: ArrowUpRight,
            color: "purple-500",
            trend: "Broadcasting Data",
          },
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: i === 0 ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="group relative overflow-hidden bg-card backdrop-blur-xl border border-border p-8 rounded-[40px] hover:border-primary/30 transition-all duration-500"
          >
            <div
              className={`absolute top-0 right-0 w-64 h-64 bg-${item.color}/5 blur-[80px] -mr-32 -mt-32 pointer-events-none group-hover:bg-${item.color}/10 transition-all`}
            ></div>

            <div className="flex justify-between items-start relative z-10 mb-8">
              <div
                className={`p-4 rounded-2xl bg-${item.color}/10 text-${item.color} border border-${item.color}/20 flex items-center justify-center`}
              >
                <item.icon size={28} />
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-[0.2em] mb-1">
                  {item.label}
                </p>
                <div className="flex items-baseline gap-2 justify-end">
                  <h3 className="text-4xl font-black text-foreground tracking-tighter tabular-nums">
                    {item.value}
                  </h3>
                  <span className="text-sm font-bold text-muted-foreground/40 uppercase tracking-widest leading-none">
                    {item.unit}
                  </span>
                </div>
              </div>
            </div>

            <div className="h-[200px] w-full flex items-end gap-2 p-1 relative z-10">
              {metrics.history.slice(-20).map((point, idx) => (
                <motion.div
                  key={idx}
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  className={`flex-1 rounded-t-lg bg-${item.color}/40 group-hover:bg-${item.color}/60 transition-all`}
                  style={{
                    height: `${Math.max(10, ((item.color === "primary" ? point.net_down : point.net_up) / 20) * 100)}%`,
                    transformOrigin: "bottom",
                  }}
                />
              ))}
              {metrics.history.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-[10px] font-black text-muted-foreground/10 uppercase tracking-[0.3em]">
                    Calibrating flow...
                  </p>
                </div>
              )}
            </div>

            <div className="mt-8 flex items-center justify-between relative z-10">
              <span className="text-[10px] font-black text-muted-foreground/20 uppercase tracking-widest">
                {item.trend}
              </span>
              <div className="flex items-center gap-1">
                <div
                  className={`size-1.5 rounded-full bg-${item.color} animate-pulse`}
                ></div>
                <span className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-widest">
                  Neural Link Active
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {[
          {
            icon: Database,
            label: "Data Packets",
            value: "42.8k",
            sub: "Processed",
          },
          {
            icon: Globe,
            label: "Geo Clusters",
            value: "Local",
            sub: "Optimized",
          },
          {
            icon: Share2,
            label: "Neural Relay",
            value: "Active",
            sub: "Low Latency",
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-card border border-border p-6 rounded-[32px] flex items-center gap-5"
          >
            <div className="size-12 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground border border-border">
              <stat.icon size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black text-muted-foreground/20 uppercase tracking-widest mb-1">
                {stat.label}
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-black text-foreground">
                  {stat.value}
                </span>
                <span className="text-[8px] font-black text-muted-foreground/30 uppercase tracking-widest">
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
