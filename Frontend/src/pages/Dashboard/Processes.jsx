import React, { useState, useEffect } from "react";

const API = import.meta.env.VITE_API_URL;

const Processes = () => {
  const [metrics, setMetrics] = useState({
    top_processes: [],
    cpu: 0,
    ram: 0,
    mem_total: 0,
  });

  useEffect(() => {
    const interval = setInterval(async () => {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      if (!token) return;
      try {
        const res = await fetch(`${API}/client-system`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
        if (res.status === 401) {
          localStorage.removeItem("token");
          sessionStorage.removeItem("token");
          window.location.href = "/login";
          return;
        }

        const systemData = await res.json();
        if (systemData && systemData.current) {
          setMetrics({
            top_processes: systemData.current.top_processes || [],
            cpu: Number(systemData.current.cpu_usage) || 0,
            ram: Number(systemData.current.memory_usage) || 0,
            mem_total: Number(systemData.current.memory_total_gb) || 0,
            mem_used: Number(systemData.current.memory_used_gb) || 0,
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
      <div className="mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-slate-900 dark:text-slate-100 text-3xl font-black leading-tight tracking-tight">
              Processes Management
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-base font-normal">
              Monitor active system processes in real-time.
            </p>
          </div>
          
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
          <div className="flex flex-col gap-2 rounded-xl p-6 bg-white dark:bg-background-dark border border-slate-200 dark:border-primary/20 shadow-sm">
            <div className="flex justify-between items-start">
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                Top Processes Tracked
              </p>
              <span className="material-symbols-outlined text-primary opacity-50">
                analytics
              </span>
            </div>
            <p className="text-slate-900 dark:text-slate-100 text-3xl font-bold">
              {metrics.top_processes.length}
            </p>
            <div className="flex items-center gap-1">
              <span className="text-green-500 text-sm font-bold flex items-center">
                <span className="material-symbols-outlined text-sm">
                  trending_up
                </span>
                Real-time
              </span>
              <span className="text-slate-400 text-xs font-normal">
                tracking active
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-2 rounded-xl p-6 bg-white dark:bg-background-dark border border-slate-200 dark:border-primary/20 shadow-sm">
            <div className="flex justify-between items-start">
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                CPU Usage
              </p>
              <span className="material-symbols-outlined text-primary opacity-50">
                speed
              </span>
            </div>
            <p className="text-slate-900 dark:text-slate-100 text-3xl font-bold">
              {metrics.cpu}%
            </p>
            <div className="flex items-center gap-1">
              <span className="text-slate-400 text-xs font-normal">
                Global system load
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-2 rounded-xl p-6 bg-white dark:bg-background-dark border border-slate-200 dark:border-primary/20 shadow-sm">
            <div className="flex justify-between items-start">
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                Memory Usage
              </p>
              <span className="material-symbols-outlined text-primary opacity-50">
                storage
              </span>
            </div>
            <p className="text-slate-900 dark:text-slate-100 text-3xl font-bold">
              {metrics.mem_used?.toFixed(1) || 0} GB
            </p>
            <div className="flex items-center gap-1">
              <span className="text-slate-400 text-xs font-normal">
                capacity: {metrics.mem_total?.toFixed(1) || 0} GB
              </span>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-background-dark rounded-xl border border-slate-200 dark:border-primary/20 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-primary/5 border-b border-slate-200 dark:border-primary/20">
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 cursor-pointer hover:text-primary transition-colors">
                    <div className="flex items-center gap-2">
                      PID{" "}
                      <span className="material-symbols-outlined text-sm">
                        swap_vert
                      </span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 cursor-pointer hover:text-primary transition-colors">
                    <div className="flex items-center gap-2">
                      Name{" "}
                      <span className="material-symbols-outlined text-sm">
                        swap_vert
                      </span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    User
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    CPU %
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Memory
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Status
                  </th>
                 
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-primary/10">
                {metrics.top_processes &&
                  metrics.top_processes.map((proc, idx) => (
                    <tr
                      key={idx}
                      className="hover:bg-slate-50 dark:hover:bg-primary/5 transition-colors group"
                    >
                      <td className="px-6 py-5 text-sm font-medium text-slate-400 dark:text-slate-500">
                        {proc.pid}
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div
                            className={`size-8 rounded bg-primary/10 flex items-center justify-center ${proc.cpu_percent > 10 ? "text-rose-500" : "text-primary"} group-hover:scale-110 transition-transform`}
                          >
                            <span className="material-symbols-outlined text-base">
                              smart_toy
                            </span>
                          </div>
                          <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                            {proc.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-sm text-slate-500 dark:text-slate-400">
                        system
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3 min-w-[120px]">
                          <div className="flex-1 h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                            <div
                              className={`h-full ${proc.cpu_percent > 10 ? "bg-rose-500" : "bg-primary"}`}
                              style={{
                                width: `${Math.min(proc.cpu_percent, 100)}%`,
                              }}
                            ></div>
                          </div>
                          <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                            {proc.cpu_percent.toFixed(1)}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-sm text-slate-500 dark:text-slate-400">
                        {proc.memory_mb} MB
                      </td>
                      <td className="px-6 py-5">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-400">
                          Running
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        
        </div>
        
      </div>
    </>
  );
};

export default Processes;
