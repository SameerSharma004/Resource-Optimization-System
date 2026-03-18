import React, { useEffect, useState } from "react";
import Charts from "../../components/Charts/Charts";
import Systeminfo from "../../components/Systeminfo/Systeminfo";
import { Cpu, MemoryStick, Zap, Activity, ShieldCheck, Cpu as CpuIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

const MetricCard = ({ label, value, unit, icon: Icon, color, index }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
    className="relative group overflow-hidden bg-card backdrop-blur-xl border border-border p-6 rounded-[32px] hover:border-primary/50 transition-all duration-500"
  >
    <div className={`absolute top-0 right-0 w-32 h-32 bg-${color}/10 blur-[50px] -mr-16 -mt-16 group-hover:bg-${color}/20 transition-colors`}></div>
    
    <div className="flex justify-between items-start relative z-10">
      <div className={`p-3 rounded-2xl bg-${color}/10 text-${color} border border-${color}/20`}>
        <Icon size={24} />
      </div>
      <div className="flex flex-col items-end">
        <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-1">{label}</span>
        <div className="flex items-baseline gap-1">
          <h3 className="text-3xl font-black text-foreground tracking-tighter">{value}</h3>
          <span className="text-sm font-bold text-muted-foreground/30">{unit}</span>
        </div>
      </div>
    </div>
  </motion.div>
);

const Overview = () => {
  const [metrics, setMetrics] = useState({
    cpu: 0,
    ram: 0,
    power: 0,
    net_up: 0,
    net_down: 0,
    ram_components: { active: 0, inactive: 0, cached: 0, free: 0, total: 1 },
    per_core: [],
    history: [],
    top_processes: [],
  });
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const fetchAllData = async () => {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      if (!token) return;
      try {
        const [systemRes, predictionRes] = await Promise.all([
          fetch(`${API}/client-system`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API}/predicted`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        
        if (systemRes.status === 401 || predictionRes.status === 401) {
          localStorage.removeItem("token");
          sessionStorage.removeItem("token");
          window.location.href = "/login";
          return;
        }

        const systemData = await systemRes.json();
        const predictionData = await predictionRes.json();

        if (systemData && systemData.current) {
          setMetrics({
            cpu: Number(systemData.current.cpu_usage) || 0,
            ram: Number(systemData.current.memory_usage) || 0,
            power: Number(systemData.current.battery_percent) || 0,
            net_up: Number(systemData.current.net_upload_mbps) || 0,
            net_down: Number(systemData.current.net_download_mbps) || 0,
            ram_components: systemData.current.ram_components || { active: 0, inactive: 0, cached: 0, free: 0, total: 1 },
            history: systemData.history || [],
            top_processes: systemData.current.top_processes || [],
          });
        }

        if (predictionData && predictionData.state && predictionData.recommendations) {
          setSuggestions(
            predictionData.recommendations.map((rec) => ({
              title: rec,
              detail: "NEURAL FORECAST ANALYSIS",
              priority: "High",
            })),
          );
        }
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    fetchAllData();
    const interval = setInterval(fetchAllData, 2000);
    return () => clearInterval(interval);
  }, []);


  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard label="CPU Compute" value={metrics.cpu.toFixed(1)} unit="%" icon={Cpu} color="primary" index={0} />
        <MetricCard label="RAM Load" value={metrics.ram.toFixed(1)} unit="%" icon={MemoryStick} color="purple-500" index={1} />
        <MetricCard label="Energy Level" value={metrics.power.toFixed(0)} unit="%" icon={Zap} color="amber-400" index={2} />
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card backdrop-blur-xl border border-border p-6 rounded-[32px] flex flex-col justify-between"
        >
          <div className="flex justify-between items-start">
             <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
               <Activity size={24} />
             </div>
             <div className="text-right">
               <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Data Flux</span>
               <div className="mt-1">
                 <p className="text-lg font-black text-foreground leading-tight">↑ {metrics.net_up.toFixed(1)} <span className="text-[10px] text-muted-foreground/30">MB/s</span></p>
                 <p className="text-lg font-black text-foreground leading-tight">↓ {metrics.net_down.toFixed(1)} <span className="text-[10px] text-muted-foreground/30">MB/s</span></p>
               </div>
             </div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Main Chart */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="col-span-12 lg:col-span-8 relative group"
        >
          <div className="absolute inset-0 bg-primary/5 blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
          <div className="bg-card backdrop-blur-xl border border-border rounded-[40px] p-8 h-full relative z-10">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h4 className="text-sm font-black text-muted-foreground uppercase tracking-widest mb-1">Live Telemetry</h4>
                <p className="text-xl font-black text-foreground tracking-tight">System Performance History</p>
              </div>
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <div className="size-2 rounded-full bg-primary"></div>
                  <span className="text-[10px] font-black text-muted-foreground uppercase">CPU</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="size-2 rounded-full bg-purple-500"></div>
                  <span className="text-[10px] font-black text-muted-foreground uppercase">RAM</span>
                </div>
              </div>
            </div>
            <div className="h-[300px]">
              <Charts Type="CPU & RAM Usage History" Attribute1="cpu" Attribute2="ram" history={metrics.history} />
            </div>
          </div>
        </motion.div>

        {/* Neural Insights */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="col-span-12 lg:col-span-4"
        >
          <div className="bg-linear-to-br from-primary/10 to-purple-500/10 backdrop-blur-xl border border-border rounded-[40px] p-8 h-full">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 rounded-[20px] bg-primary text-white shadow-lg shadow-primary/20">
                <ShieldCheck size={24} />
              </div>
              <div>
                <h4 className="text-sm font-black text-foreground tracking-tight">Neural Insights</h4>
                <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">AI Prediction Engine</p>
              </div>
            </div>

            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {suggestions.length > 0 ? (
                  suggestions.slice(0, 3).map((sug, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="bg-background/40 border border-border p-5 rounded-[24px] group hover:bg-background/60 transition-all cursor-default"
                    >
                      <div className="flex items-start gap-4">
                        <div className="mt-1 size-2 rounded-full bg-amber-400 group-hover:scale-125 transition-transform"></div>
                        <div>
                          <p className="text-sm font-bold text-foreground leading-snug">{sug.title}</p>
                          <p className="text-[10px] text-muted-foreground/40 mt-2 font-black tracking-widest uppercase">{sug.detail}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="size-16 rounded-full bg-background/40 flex items-center justify-center mb-4">
                      <Activity className="text-muted-foreground/20" size={32} />
                    </div>
                     <p className="text-sm font-bold text-muted-foreground/60">Neural Engine Calibrating</p>
                     <p className="text-[10px] text-muted-foreground/20 mt-1 uppercase font-black tracking-widest">Awaiting system delta...</p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>

      {/* RAM Composition */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border rounded-[40px] p-10"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h4 className="text-sm font-black text-muted-foreground uppercase tracking-widest mb-1">Resource Allocation</h4>
            <p className="text-2xl font-black text-foreground tracking-tight">Memory Architecture</p>
          </div>
          <div className="flex bg-muted/40 p-2 rounded-2xl gap-2">
            {[
              { label: 'Total', value: metrics.ram_components.total },
              { label: 'Free', value: metrics.ram_components.free, color: 'text-muted-foreground/60' }
            ].map((item, i) => (
              <div key={i} className="px-6 py-2">
                <p className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-widest">{item.label}</p>
                <p className={`text-lg font-black ${item.color || 'text-foreground'}`}>{item.value.toFixed(1)} GB</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-8">
          <div className="h-4 w-full bg-muted/40 rounded-full overflow-hidden flex p-1">
            <motion.div initial={{ width: 0 }} animate={{ width: `${(metrics.ram_components.active / metrics.ram_components.total) * 100}%` }} className="h-full bg-primary rounded-full" />
            <motion.div initial={{ width: 0 }} animate={{ width: `${(metrics.ram_components.inactive / metrics.ram_components.total) * 100}%` }} className="h-full bg-purple-500 rounded-full mx-1" />
            <motion.div initial={{ width: 0 }} animate={{ width: `${(metrics.ram_components.cached / metrics.ram_components.total) * 100}%` }} className="h-full bg-muted-foreground/20 rounded-full" />
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
               { label: 'System active', value: metrics.ram_components.active, color: 'bg-primary' },
               { label: 'Applications', value: metrics.ram_components.inactive, color: 'bg-purple-500' },
               { label: 'Cached data', value: metrics.ram_components.cached, color: 'bg-muted-foreground/20' },
               { label: 'Available', value: metrics.ram_components.free, color: 'bg-background border border-border' }
            ].map((item, i) => (
              <div key={i} className="group">
                <div className="flex items-center gap-3 mb-2">
                  <div className={`size-2 rounded-full ${item.color}`}></div>
                  <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{item.label}</span>
                </div>
                <p className="text-xl font-black text-foreground tracking-tight">{item.value.toFixed(1)} <span className="text-xs text-muted-foreground/40">GB</span></p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Overview;
