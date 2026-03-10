import React, { useState, useEffect } from "react";

const API = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000";

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
    const interval = setInterval(async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API}/client-system`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
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
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div className=" mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-primary font-bold text-sm tracking-wide uppercase">
              <span className="material-symbols-outlined text-lg">
                pulse_alert
              </span>
              Live Telemetry
            </div>
            <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">
              System Metrics
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              High-fidelity performance monitoring and cluster health
              diagnostics.
            </p>
          </div>
        </div>
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">
                memory
              </span>
              Per-Core CPU Distribution
            </h2>
            <span className="text-xs font-mono bg-primary/10 text-primary px-2 py-1 rounded">
              8 Cores Active
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {metrics.per_core &&
              metrics.per_core.map((coreUtil, idx) => (
                <div
                  key={idx}
                  className="bg-background-light dark:bg-background-dark border border-primary/20 rounded-xl p-4 flex flex-col gap-3"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold uppercase text-slate-500">
                      Core {idx}
                    </span>
                    <span
                      className={`text-sm font-mono ${coreUtil > 80 ? "text-red-500" : coreUtil > 50 ? "text-amber-500" : "text-primary"}`}
                    >
                      {coreUtil.toFixed(1)}%
                    </span>
                  </div>
                  <div className="h-24 w-full relative flex items-end gap-1">
                    <div
                      className={`absolute inset-0 bg-linear-to-t ${coreUtil > 80 ? "from-red-500/5" : coreUtil > 50 ? "from-amber-500/5" : "from-primary/5"} to-transparent rounded`}
                    ></div>
                    {Array.from({ length: 10 }).map((_, barIdx) => {
                      let h =
                        Math.random() * (coreUtil - coreUtil / 2) +
                        coreUtil / 2;
                      return (
                        <div
                          key={barIdx}
                          className={`flex-1 ${coreUtil > 80 ? "bg-red-500/50" : coreUtil > 50 ? "bg-amber-500/50" : "bg-primary/50"} rounded-t-sm transition-all duration-300`}
                          style={{ height: `${Math.max(5, h)}%` }}
                        ></div>
                      );
                    })}
                  </div>
                </div>
              ))}
          </div>
        </section>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <section className="lg:col-span-2 space-y-4">
            <div className="bg-background-light dark:bg-background-dark border border-primary/20 rounded-xl p-6">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">
                    data_usage
                  </span>
                  Memory Infrastructure
                </h2>
                <div className="text-right">
                  <p className="text-2xl font-black text-slate-900 dark:text-white">
                    {metrics.mem_total.toFixed(1)} GB Total
                  </p>
                  <p className="text-xs text-primary font-bold">
                    {metrics.mem_free.toFixed(1)} GB AVAILABLE
                  </p>
                </div>
              </div>
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex h-10 w-full rounded-lg overflow-hidden border border-primary/10">
                    <div
                      className="bg-primary h-full transition-all duration-300"
                      style={{ width: `${metrics.ram}%` }}
                      title="Used"
                    ></div>
                    <div
                      className="bg-slate-200 dark:bg-slate-800 h-full transition-all duration-300"
                      style={{ width: `${100 - metrics.ram}%` }}
                      title="Free"
                    ></div>
                  </div>
                  <div className="flex flex-wrap gap-4 text-xs font-medium">
                    <div className="flex items-center gap-1.5">
                      <span className="size-2 rounded-full bg-primary"></span>
                      Used ({metrics.mem_used.toFixed(1)} GB)
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="size-2 rounded-full bg-slate-400"></span>
                      Free ({metrics.mem_free.toFixed(1)} GB)
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-slate-100 dark:bg-white/5 border border-primary/10">
                    <p className="text-xs font-bold text-slate-500 uppercase mb-1">
                      Active Processes
                    </p>
                    <p className="text-lg font-bold text-slate-900 dark:text-slate-100">
                      {metrics.top_processes ? metrics.top_processes.length : 0}{" "}
                      processes
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-slate-100 dark:bg-white/5 border border-primary/10">
                    <p className="text-xs font-bold text-slate-500 uppercase mb-1">
                      Status
                    </p>
                    <p className="text-lg font-bold text-slate-900 dark:text-slate-100">
                      {metrics.ram > 85 ? "Warning" : "Healthy"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section className="space-y-4">
            <div className="bg-background-light dark:bg-background-dark border border-primary/20 rounded-xl p-6 h-full">
              <h2 className="text-xl font-bold flex items-center gap-2 mb-6">
                <span className="material-symbols-outlined text-primary">
                  storage
                </span>
                Disk Throughput
              </h2>
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-lg">
                      <span className="material-symbols-outlined">
                        download
                      </span>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-500 uppercase">
                        Read Speed
                      </p>
                      <p className="text-2xl font-black text-slate-900 dark:text-white">
                        {metrics.disk_read.toFixed(1)} MB/s
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    {metrics.disk_read > 0 ? (
                      <span className="text-emerald-500 text-sm font-bold flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs">
                          arrow_upward
                        </span>{" "}
                        Active
                      </span>
                    ) : (
                      <span className="text-slate-400 text-sm font-bold">
                        Idle
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-primary/10 text-primary rounded-lg">
                      <span className="material-symbols-outlined">upload</span>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-500 uppercase">
                        Write Speed
                      </p>
                      <p className="text-2xl font-black text-slate-900 dark:text-white">
                        {metrics.disk_write.toFixed(1)} MB/s
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    {metrics.disk_write > 0 ? (
                      <span className="text-primary text-sm font-bold flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs">
                          arrow_upward
                        </span>{" "}
                        Active
                      </span>
                    ) : (
                      <span className="text-slate-400 text-sm font-bold">
                        Idle
                      </span>
                    )}
                  </div>
                </div>
                <div className="pt-6 border-t border-primary/20">
                  <p className="text-xs font-bold text-slate-500 uppercase mb-4">
                    Active Disk IOPS
                  </p>
                  <div className="space-y-3">
                    {metrics.disk_iops && metrics.disk_iops.length > 0 ? (
                      metrics.disk_iops.map((disk, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between text-sm"
                        >
                          <span className="text-slate-500 dark:text-slate-400 font-medium">
                            {disk.device.toUpperCase()}
                          </span>
                          <span className="font-mono text-primary font-bold">
                            {disk.iops.toLocaleString()} IOPS
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="text-sm text-slate-400 italic">
                        No significant disk activity
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default Metrics;
