import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, Cpu, Database, HardDrive, Search, Terminal } from "lucide-react";

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


  const filteredProcesses = metrics.top_processes.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.pid.toString().includes(search)
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-foreground tracking-tight mb-2">
            Neural{" "}
            <span className="text-primary italic font-serif font-normal text-4xl">
              Processes
            </span>
          </h2>
          <p className="text-muted-foreground text-sm font-bold tracking-widest uppercase">
            Deep System Analysis
          </p>
        </div>

        <div className="relative group min-w-[300px]">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search
              className="text-muted-foreground/40 group-hover:text-primary transition-colors"
              size={18}
            />
          </div>
          <input
            type="text"
            placeholder="Filter by PID or Name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-background border border-border rounded-2xl py-3 pl-12 pr-4 text-sm font-bold text-foreground placeholder:text-muted-foreground/20 focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all backdrop-blur-xl"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            label: "Active Threads",
            value: metrics.top_processes.length,
            icon: Terminal,
            color: "primary",
          },
          {
            label: "Total CPU Load",
            value: `${metrics.cpu.toFixed(1)}%`,
            icon: Cpu,
            color: "purple-500",
          },
          {
            label: "Memory Pressure",
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
            className="bg-card backdrop-blur-xl border border-border p-6 rounded-[32px] group relative overflow-hidden"
          >
            <div
              className={`absolute -right-4 -top-4 w-24 h-24 bg-${item.color}/10 blur-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity`}
            ></div>
            <div className="flex justify-between items-start mb-4">
              <div
                className={`p-3 rounded-2xl bg-${item.color}/10 text-${item.color} border border-${item.color}/20`}
              >
                <item.icon size={20} />
              </div>
            </div>
            <p className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-widest mb-1">
              {item.label}
            </p>
            <p className="text-3xl font-black text-foreground tracking-tighter">
              {item.value}
            </p>
          </motion.div>
        ))}
      </div>

      <div className="bg-card backdrop-blur-xl border border-border rounded-[40px] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/40 border-b border-border">
                {[
                  "PID",
                  "Neural Link",
                  "Resource Allocation",
                  "Mem Usage",
                  "State",
                ].map((header, i) => (
                  <th
                    key={i}
                    className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <AnimatePresence>
                {filteredProcesses.map((proc, idx) => (
                  <motion.tr
                    key={proc.pid}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="group hover:bg-muted/30 transition-all"
                  >
                    <td className="px-8 py-6 text-sm font-black text-muted-foreground/40 tabular-nums">
                      {proc.pid}
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="size-10 rounded-2xl bg-linear-to-tr from-primary to-purple-600 p-px">
                          <div className="size-full bg-background backdrop-blur-md rounded-[15px] flex items-center justify-center">
                            <Terminal size={16} className="text-primary" />
                          </div>
                        </div>
                        <span className="text-sm font-black text-foreground group-hover:text-primary transition-colors tabular-nums">
                          {proc.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4 min-w-[200px]">
                        <div className="flex-1 h-2 bg-muted/40 rounded-full overflow-hidden p-0.5">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{
                              width: `${Math.min(proc.cpu_percent, 100)}%`,
                            }}
                            className={`h-full rounded-full ${proc.cpu_percent > 20 ? "bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]" : "bg-primary"}`}
                          />
                        </div>
                        <span className="text-sm font-black text-foreground/80 tabular-nums">
                          {proc.cpu_percent.toFixed(1)}%
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-sm font-black text-foreground/60 tabular-nums">
                      {proc.memory_mb.toFixed(1)} MB
                    </td>
                    <td className="px-8 py-6">
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                        <div className="size-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
                        <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">
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
