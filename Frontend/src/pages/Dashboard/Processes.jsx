import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  Cpu,
  Database,
  HardDrive,
  Search,
  Terminal,
} from "lucide-react";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

const Processes = () => {
  const [metrics, setMetrics] = useState({
    top_processes: [],
    cpu: 0,
    ram: 0,
    mem_total: 0,
    mem_used: 0,
  });
  const [search, setSearch] = useState("");
  useEffect(() => {
    const fetchProcesses = async () => {
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
    };

    fetchProcesses();
    const interval = setInterval(fetchProcesses, 2000);
    return () => clearInterval(interval);
  }, []);

  const filteredProcesses = metrics.top_processes.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.pid.toString().includes(search),
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold text-foreground tracking-tight mb-2">
            System{" "}
            <span className="text-primary italic font-serif font-normal text-4xl">
              Processes
            </span>
          </h2>
          <p className="text-sm text-muted-foreground">Process Explorer</p>
        </div>

        <div className="relative group min-w-[300px]">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search className="text-muted-foreground" size={16} />
          </div>
          <input
            type="text"
            placeholder="Filter by PID or Name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-card border border-border rounded-lg py-2 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            label: "Total Processes",
            value: metrics.top_processes.length,
            icon: Terminal,
            color: "primary",
          },
          {
            label: "CPU Usage",
            value: `${metrics.cpu.toFixed(1)}%`,
            icon: Cpu,
            color: "purple-500",
          },
          {
            label: "Memory Usage",
            value: `${metrics.ram.toFixed(1)}%`,
            icon: Database,
            color: "emerald-400",
          },
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-card border border-border p-5 rounded-xl hover:bg-muted/50 transition-colors flex flex-col gap-4"
          >
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-muted-foreground">
                {item.label}
              </span>
              <div className={`text-${item.color}`}>
                <item.icon size={18} strokeWidth={2} />
              </div>
            </div>
            <p className="text-2xl font-semibold text-foreground tracking-tight">
              {item.value}
            </p>
          </motion.div>
        ))}
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/30 border-b border-border">
                {[
                  "PID",
                  "Process Name",
                  "CPU Usage (%)",
                  "Memory",
                  "Status",
                ].map((header, i) => (
                  <th
                    key={i}
                    className="px-6 py-4 text-xs font-medium text-muted-foreground"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <AnimatePresence>
                {filteredProcesses.map((proc) => (
                  <motion.tr
                    key={proc.pid}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="group hover:bg-muted/20 transition-all"
                  >
                    <td className="px-6 py-4 text-sm text-muted-foreground tabular-nums">
                      {proc.pid}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Terminal size={14} className="text-primary" />
                        </div>
                        <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                          {proc.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3 min-w-[150px]">
                        <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{
                              width: `${Math.min(proc.cpu_percent, 100)}%`,
                            }}
                            className={`h-full rounded-full ${proc.cpu_percent > 20 ? "bg-destructive" : "bg-primary"}`}
                          />
                        </div>
                        <span className="text-sm text-muted-foreground tabular-nums w-12">
                          {proc.cpu_percent.toFixed(1)}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground tabular-nums">
                      {proc.memory_mb.toFixed(1)} MB
                    </td>
                    <td className="px-6 py-4">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                        <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                          Active
                        </span>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Processes;
