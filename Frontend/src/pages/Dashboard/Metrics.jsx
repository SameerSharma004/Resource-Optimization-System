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
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay: index * 0.05 }}
    className="bg-card border border-border p-5 rounded-[24px] group hover:border-primary/50 transition-all duration-300 relative overflow-hidden"
  >
    <div
      className={`absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity`}
    />
    <div className="flex justify-between items-center mb-4 relative z-10">
      <span className="text-[10px] font-black text-muted-foreground/30 uppercase tracking-[0.2em]">
        Core {id}
      </span>
      <span
        className={`text-xs font-black tabular-nums ${utilization > 80 ? "text-rose-500" : "text-primary"}`}
      >
        {utilization.toFixed(1)}%
      </span>
    </div>
    <div className="h-20 w-full flex items-end gap-[2px] relative z-10">
      {Array.from({ length: 12 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ height: 0 }}
          animate={{
            height: `${Math.max(10, Math.random() * utilization + 5)}%`,
          }}
          className={`flex-1 rounded-t-sm ${utilization > 80 ? "bg-rose-500/40" : "bg-primary/40"} group-hover:bg-primary/60 transition-colors`}
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
          <h2 className="text-3xl font-black text-foreground tracking-tight mb-2">
            Live{" "}
            <span className="text-primary italic font-serif font-normal text-4xl">
              Telemetry
            </span>
          </h2>
          <p className="text-muted-foreground text-sm font-bold tracking-widest uppercase">
            High Dynamic Range Diagnostics
          </p>
        </div>
        <div className="flex items-center gap-4 bg-card border border-border rounded-2xl px-6 py-3">
          <Activity className="text-primary animate-pulse" size={18} />
          <span className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-widest leading-none">
            Cluster Synchronized
          </span>
        </div>
      </div>

      <section>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10 text-primary border border-primary/20">
              <Cpu size={18} />
            </div>
            <h3 className="text-lg font-black text-foreground">
              CPU Cluster Matrix
            </h3>
          </div>
          <span className="text-[10px] font-black bg-primary/20 text-primary border border-primary/20 px-3 py-1 rounded-full uppercase tracking-widest">
            {metrics.per_core.length} Cores Active
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
          <div className="bg-card backdrop-blur-xl border border-border rounded-[40px] p-10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 blur-[100px] -mr-48 -mt-48" />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12 relative z-10">
              <div className="flex items-center gap-4">
                <div className="size-14 rounded-3xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center">
                  <Database size={28} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-foreground">
                    Memory Infrastructure
                  </h3>
                  <p className="text-[10px] text-muted-foreground/30 uppercase font-black tracking-widest mt-1">
                    Real-time mapping
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-muted-foreground/30 uppercase font-black tracking-widest mb-1">
                  Total Capacity
                </p>
                <h4 className="text-3xl font-black text-foreground tracking-tighter tabular-nums">
                  {metrics.mem_total.toFixed(1)} GB
                </h4>
              </div>
            </div>

            <div className="space-y-10 relative z-10">
              <div className="space-y-4">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-sm font-black text-muted-foreground/60">
                    Utilization Gradient
                  </span>
                  <span className="text-sm font-black text-foreground">
                    {metrics.ram.toFixed(1)}%
                  </span>
                </div>
                <div className="h-4 bg-background border border-border rounded-full overflow-hidden p-[3px]">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${metrics.ram}%` }}
                    className="h-full bg-linear-to-r from-primary to-purple-600 rounded-full shadow-[0_0_20px_rgba(37,99,235,0.3)] transition-all duration-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    label: "Used Memory",
                    value: metrics.mem_used.toFixed(1) + " GB",
                    color: "bg-primary",
                  },
                  {
                    label: "Free Space",
                    value: metrics.mem_free.toFixed(1) + " GB",
                    color: "bg-muted",
                  },
                  {
                    label: "System Status",
                    value:
                      metrics.ram > 85
                        ? "Optimization Advised"
                        : "Optimal Path",
                    color: metrics.ram > 85 ? "bg-rose-500" : "bg-emerald-400",
                  },
                ].map((stat, i) => (
                  <div
                    key={i}
                    className="bg-background border border-border p-6 rounded-[32px] hover:bg-muted/50 transition-colors"
                  >
                    <p className="text-[10px] font-black text-muted-foreground/30 uppercase tracking-[0.2em] mb-2">
                      {stat.label}
                    </p>
                    <div className="flex items-center gap-3">
                      <div
                        className={`size-1.5 rounded-full ${stat.color}`}
                      ></div>
                      <p className="text-xl font-black text-foreground tabular-nums">
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
            <div className="bg-card border border-border rounded-[40px] p-10">
              <div className="flex items-center gap-4 mb-10">
                <div className="size-12 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center">
                  <HardDrive size={22} />
                </div>
                <h3 className="text-xl font-black text-foreground">
                  Disk Throughput
                </h3>
              </div>

              <div className="space-y-8">
                {[
                  {
                    label: "Neural Read Speed",
                    value: metrics.disk_read,
                    icon: ArrowDownLeft,
                    color: "text-emerald-400",
                    bg: "bg-emerald-400/10",
                  },
                  {
                    label: "Neural Write Speed",
                    value: metrics.disk_write,
                    icon: ArrowUpRight,
                    color: "text-primary",
                    bg: "bg-primary/10",
                  },
                ].map((io, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-5">
                      <div
                        className={`size-12 rounded-2xl ${io.bg} ${io.color} border border-border flex items-center justify-center`}
                      >
                        <span className="material-symbols-outlined">
                          {i === 0 ? "download" : "upload"}
                        </span>
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-muted-foreground/30 uppercase tracking-widest">
                          {io.label}
                        </p>
                        <p className="text-2xl font-black text-foreground tabular-nums">
                          {io.value.toFixed(1)}{" "}
                          <span className="text-[10px] text-muted-foreground/30 font-black">
                            MB/s
                          </span>
                        </p>
                      </div>
                    </div>
                    {io.value > 0 ? (
                      <div
                        className={`px-2 py-1 rounded-lg ${io.bg} ${io.color} text-[10px] font-black uppercase tracking-widest`}
                      >
                        Active
                      </div>
                    ) : (
                      <div className="text-[10px] font-black text-muted-foreground/10 uppercase tracking-widest">
                        Idle
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-card border border-border rounded-[40px] p-10">
              <div className="flex items-center gap-4 mb-10">
                <div className="size-12 rounded-2xl bg-amber-400/10 text-amber-400 border border-amber-400/20 flex items-center justify-center">
                  <Monitor size={22} />
                </div>
                <h3 className="text-xl font-black text-foreground">
                  Active Node I/O
                </h3>
              </div>

              <div className="space-y-4">
                {metrics.disk_iops && metrics.disk_iops.length > 0 ? (
                  metrics.disk_iops.map((disk, idx) => (
                    <div
                      key={idx}
                      className="bg-background border border-border p-4 rounded-2xl flex justify-between items-center group hover:border-primary/30 transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <div className="size-8 rounded-lg bg-muted border border-border flex items-center justify-center text-muted-foreground/40 group-hover:text-primary group-hover:bg-primary/10 transition-colors">
                          <Database size={14} />
                        </div>
                        <span className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-widest tabular-nums">
                          {disk.device}
                        </span>
                      </div>
                      <span className="text-sm font-black text-foreground tabular-nums">
                        {disk.iops.toLocaleString()}{" "}
                        <span className="text-[8px] text-muted-foreground/20 uppercase">
                          IOPS
                        </span>
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-10 opacity-20">
                    <HardDrive size={32} className="mb-4" />
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                      Awaiting I/O Events
                    </p>
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
