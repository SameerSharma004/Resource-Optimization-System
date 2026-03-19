import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Cpu,
  Database,
  HardDrive,
  Layout,
  Monitor,
  Activity,
  Terminal,
  ShieldCheck,
  ArrowUpRight,
  ArrowDownLeft,
} from "lucide-react";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

const CoreCard = ({ id, utilization, index }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay: index * 0.05 }}
    className="bg-card border border-border p-4 rounded-xl hover:bg-muted/50 transition-colors flex flex-col"
  >
    <div className="flex justify-between items-center mb-3">
      <span className="text-xs font-medium text-muted-foreground">
        Core {id}
      </span>
      <span
        className={`text-xs font-semibold tabular-nums ${utilization > 80 ? "text-destructive" : "text-primary"}`}
      >
        {utilization.toFixed(1)}%
      </span>
    </div>
    <div className="h-16 w-full flex items-end gap-1">
      {Array.from({ length: 12 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ height: 0 }}
          animate={{
            height: `${Math.max(10, Math.random() * utilization + 5)}%`,
          }}
          className={`flex-1 rounded-t-sm ${utilization > 80 ? "bg-destructive/40" : "bg-primary/40"} hover:opacity-80 transition-colors`}
        />
      ))}
    </div>
  </motion.div>
);

const Metrics = () => {
  const [metrics, setMetrics] = useState({
    cpu: 0,
    ram: 0,
    power: 0,
    net_up: 0,
    net_down: 0,
    disk_read: 0,
    disk_write: 0,
    per_core: [],
    history: [],
    top_processes: [],
    mem_total: 0,
    mem_used: 0,
    mem_free: 0,
    disk_iops: [],
  });
  useEffect(() => {
    const fetchMetrics = async () => {
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
            ...systemData.current,
            cpu: Number(systemData.current.cpu_usage) || 0,
            ram: Number(systemData.current.memory_usage) || 0,
            power: Number(systemData.current.battery_percent) || 0,
            net_up: Number(systemData.current.net_upload_mbps) || 0,
            net_down: Number(systemData.current.net_download_mbps) || 0,
            disk_read: Number(systemData.current.disk_read_mbps) || 0,
            disk_write: Number(systemData.current.disk_write_mbps) || 0,
            mem_total: Number(systemData.current.memory_total_gb) || 0,
            mem_used: Number(systemData.current.memory_used_gb) || 0,
            mem_free: Number(systemData.current.memory_free_gb) || 0,
            disk_iops: systemData.current.disk_iops || [],
            per_core: systemData.current.cpu_cores || [],
            history: systemData.history || [],
          });
        }
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    fetchMetrics();
    const interval = setInterval(fetchMetrics, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold text-foreground tracking-tight mb-2">
            Live{" "}
            <span className="text-primary italic font-serif font-normal text-4xl">
              Metrics
            </span>
          </h2>
          <p className="text-muted-foreground text-sm">
            Real-time System Stats
          </p>
        </div>
        <div className="flex items-center gap-3 bg-card border border-border rounded-lg px-4 py-2">
          <Activity className="text-primary animate-pulse" size={16} />
          <span className="text-sm font-medium text-muted-foreground">
            Live Data
          </span>
        </div>
      </div>

      <section>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Cpu className="text-primary" size={20} />
            <h3 className="text-lg font-semibold text-foreground">CPU Cores</h3>
          </div>
          <span className="text-xs font-medium bg-primary/10 text-primary px-2.5 py-1 rounded-md">
            {metrics.per_core.length} Active
          </span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {metrics.per_core.map((util, i) => (
            <CoreCard key={i} id={i} utilization={util} index={i} />
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-12">
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
              <div className="flex items-center gap-3">
                <Database className="text-primary" size={24} />
                <div>
                  <h3 className="text-lg font-semibold text-foreground">
                    Memory Allocation
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Real-time stats
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground mb-1">
                  Total Capacity
                </p>
                <h4 className="text-2xl font-semibold text-foreground tabular-nums">
                  {metrics.mem_total.toFixed(1)} GB
                </h4>
              </div>
            </div>

            <div className="space-y-8">
              <div className="space-y-3">
                <div className="flex justify-between items-end">
                  <span className="text-sm font-medium text-muted-foreground">
                    Usage Level
                  </span>
                  <span className="text-sm font-medium text-foreground">
                    {metrics.ram.toFixed(1)}%
                  </span>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${metrics.ram}%` }}
                    className="h-full bg-primary transition-all duration-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  {
                    label: "Used Memory",
                    value: metrics.mem_used.toFixed(1) + " GB",
                    color: "bg-primary",
                  },
                  {
                    label: "Free Space",
                    value: metrics.mem_free.toFixed(1) + " GB",
                    color: "bg-muted-foreground/30",
                  },
                  {
                    label: "System Status",
                    value: metrics.ram > 85 ? "High Usage" : "Healthy",
                    color:
                      metrics.ram > 85 ? "bg-destructive" : "bg-emerald-500",
                  },
                ].map((stat, i) => (
                  <div
                    key={i}
                    className="bg-muted/30 border border-border p-4 rounded-lg flex flex-col gap-1"
                  >
                    <p className="text-xs text-muted-foreground">
                      {stat.label}
                    </p>
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${stat.color}`}
                      ></div>
                      <p className="text-lg font-medium text-foreground tabular-nums">
                        {stat.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <HardDrive className="text-purple-500" size={20} />
                <h3 className="text-lg font-semibold text-foreground">
                  Disk Activity
                </h3>
              </div>

              <div className="space-y-6">
                {[
                  {
                    label: "Read Speed",
                    value: metrics.disk_read,
                    icon: ArrowDownLeft,
                    color: "text-emerald-500",
                    bg: "bg-emerald-500/10",
                  },
                  {
                    label: "Write Speed",
                    value: metrics.disk_write,
                    icon: ArrowUpRight,
                    color: "text-primary",
                    bg: "bg-primary/10",
                  },
                ].map((io, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-10 h-10 rounded-lg ${io.bg} ${io.color} flex items-center justify-center`}
                      >
                        <span className="material-symbols-outlined text-xl">
                          {i === 0 ? "download" : "upload"}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-0.5">
                          {io.label}
                        </p>
                        <p className="text-xl font-medium text-foreground tabular-nums">
                          {io.value.toFixed(1)}{" "}
                          <span className="text-sm text-muted-foreground">
                            MB/s
                          </span>
                        </p>
                      </div>
                    </div>
                    {io.value > 0 ? (
                      <div className="text-xs font-medium text-emerald-500">
                        Active
                      </div>
                    ) : (
                      <div className="text-xs text-muted-foreground">Idle</div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <Monitor className="text-amber-500" size={20} />
                <h3 className="text-lg font-semibold text-foreground">
                  Storage Devices
                </h3>
              </div>

              <div className="space-y-3">
                {metrics.disk_iops && metrics.disk_iops.length > 0 ? (
                  metrics.disk_iops.map((disk, idx) => (
                    <div
                      key={idx}
                      className="bg-muted/30 border border-border p-3 rounded-lg flex justify-between items-center hover:bg-muted/50 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-md bg-background flex items-center justify-center text-muted-foreground border border-border">
                          <Database size={14} />
                        </div>
                        <span className="text-sm font-medium text-foreground tabular-nums">
                          {disk.device}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-foreground tabular-nums">
                        {disk.iops.toLocaleString()}{" "}
                        <span className="text-xs text-muted-foreground font-normal">
                          IOPS
                        </span>
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
                    <HardDrive size={24} className="mb-2 opacity-50" />
                    <p className="text-sm">Waiting for activity...</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Metrics;
