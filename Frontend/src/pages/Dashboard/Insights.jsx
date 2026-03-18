import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Brain, Zap, Battery, Activity, Search, Shield, Cpu, RefreshCw } from "lucide-react";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

const Insights = () => {
  const [prediction, setPrediction] = useState(null);
  const [metrics, setMetrics] = useState({ cpu: 0, ram: 0 });
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizingStep, setOptimizingStep] = useState(0);
  const fetchInsights = async () => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token) return;

    try {
      const [sysRes, predRes] = await Promise.all([
        fetch(`${API}/client-system`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API}/predicted`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (sysRes.status === 401 || (predRes && predRes.status === 401)) {
        localStorage.removeItem("token");
        sessionStorage.removeItem("token");
        window.location.href = "/login";
        return;
      }

      const systemData = await sysRes.json();
      const predData = await predRes.json();

      if (systemData && systemData.current) {
        setMetrics({
          cpu: Number(systemData.current.cpu_usage) || 0,
          ram: Number(systemData.current.memory_usage) || 0,
        });
      }

      if (predData && predData.status !== "warming_up") {
        setPrediction(predData);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  useEffect(() => {
    fetchInsights();
    const interval = setInterval(fetchInsights, 3000);
    return () => clearInterval(interval);
  }, []);



  const handleOptimizeRequest = async () => {
    setIsOptimizing(true);
    setOptimizingStep(0);
    
    const steps = ["Scanning Neural Patterns...", "Analyzing Kernel Threads...", "Generating Forecast...", "Curating Strategy..."];
    
    for (let i = 0; i < steps.length; i++) {
      setOptimizingStep(i);
      await new Promise(r => setTimeout(r, 800 + Math.random() * 500));
    }

    await fetchInsights();
    setIsOptimizing(false);
  };

  const optScore = prediction
    ? Math.max(0, 100 - prediction.future_cpu)
    : 100 - (metrics.cpu * 0.5 + metrics.ram * 0.5);

  const gain = prediction ? Math.round((100 - prediction.future_cpu) / 5) : 0;

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div>
          <h2 className="text-3xl font-black text-foreground tracking-tight mb-2">
            Core <span className="text-primary italic font-serif font-normal text-4xl">Intelligence</span>
          </h2>
          <p className="text-muted-foreground text-sm font-bold tracking-widest uppercase">Neural Forecasting Engine</p>
        </div>
        
        <button
          onClick={handleOptimizeRequest}
          disabled={isOptimizing}
          className="group relative bg-card hover:bg-muted/50 text-foreground px-10 py-5 rounded-[24px] font-black uppercase tracking-[0.2em] text-xs transition-all border border-border hover:border-primary/50 disabled:opacity-50 overflow-hidden shadow-sm"
        >
          <div className="absolute inset-0 bg-linear-to-r from-primary/10 via-purple-500/10 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity blur-xl"></div>
          <span className="relative flex items-center justify-center gap-3">
            {isOptimizing ? <RefreshCw className="animate-spin" size={16} /> : <Zap size={16} className="text-primary" />}
            {isOptimizing ? "Calibrating..." : "Optimize Now"}
          </span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { label: 'Neural Efficiency', value: optScore.toFixed(0) + '%', icon: Brain, color: 'text-primary', sub: 'Calculated system path' },
          { label: 'AI Forecast', value: prediction ? prediction.state : 'Scanning...', icon: Search, color: 'text-purple-400', sub: `Future CPU: ${prediction ? prediction.future_cpu : '...'}%` },
          { label: 'Energy Recovery', value: `+${gain}m`, icon: Battery, color: 'text-emerald-400', sub: 'Projected battery gain' }
        ].map((item, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-card backdrop-blur-xl border border-border p-8 rounded-[40px] group hover:border-primary/20 transition-all duration-500 relative overflow-hidden"
          >
            <div className="flex justify-between items-start mb-6">
               <div className={`p-4 rounded-2xl bg-background border border-border ${item.color}`}>
                 <item.icon size={24} />
               </div>
            </div>
            <p className="text-[10px] font-black text-muted-foreground/30 uppercase tracking-[0.2em] mb-2">{item.label}</p>
            <h3 className="text-4xl font-black text-foreground tracking-tighter mb-2 tabular-nums">{item.value}</h3>
            <p className="text-[10px] font-black text-muted-foreground/20 uppercase tracking-widest">{item.sub}</p>
            
            {i === 0 && (
              <div className="mt-6 h-1 w-full bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${optScore}%` }}
                  className="h-full bg-primary"
                />
              </div>
            )}
          </motion.div>
        ))}
      </div>

      <div className="relative">
        <AnimatePresence mode="wait">
          {isOptimizing ? (
            <motion.div
              key="loader"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              className="min-h-[500px] rounded-[56px] bg-card backdrop-blur-3xl border border-border flex flex-col items-center justify-center overflow-hidden relative"
            >
              <div className="absolute inset-0">
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 blur-[120px] rounded-full animate-pulse"></div>
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-purple-500/5 blur-[80px] rounded-full animate-ping"></div>
              </div>
              
              <div className="relative z-10 flex flex-col items-center">
                <div className="size-24 rounded-[32px] bg-linear-to-tr from-primary to-purple-600 p-px mb-10 shadow-lg glow-effect">
                   <div className="size-full bg-background backdrop-blur-xl rounded-[31px] flex items-center justify-center">
                     <Sparkles className="text-primary animate-pulse" size={32} />
                   </div>
                </div>
                <h3 className="text-3xl font-black text-foreground mb-3 tracking-tight">
                  {["Pattern Scan", "Kernel Mapping", "Neural Sync", "Finalizing"][optimizingStep]}
                </h3>
                <p className="text-muted-foreground/30 font-black text-[10px] uppercase tracking-[0.4em] animate-pulse">Neural Engine Active</p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-8"
            >
              <div className="flex items-center gap-4">
                <div className="size-10 rounded-2xl bg-card border border-border flex items-center justify-center text-primary shadow-sm">
                  <Shield size={20} />
                </div>
                <h3 className="text-2xl font-black text-foreground tracking-tight">Neural Strategy Intelligence</h3>
              </div>

              <div className="grid gap-6">
                {prediction && prediction.recommendations ? (
                  prediction.recommendations.map((rec, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="group bg-card backdrop-blur-xl border border-border p-10 rounded-[48px] hover:border-primary/30 transition-all duration-500 relative overflow-hidden shadow-sm"
                    >
                      <div className="absolute -right-20 -bottom-20 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
                         <Brain size={240} className="text-primary" />
                      </div>
                      <div className="flex flex-col md:flex-row gap-10 relative z-10">
                        <div className="size-16 rounded-3xl bg-background border border-border flex items-center justify-center text-muted-foreground/40 group-hover:text-primary group-hover:bg-primary/5 transition-all">
                          {idx === 0 ? <Shield size={28} /> : idx === 1 ? <Activity size={28} /> : <Zap size={28} />}
                        </div>
                        <div className="space-y-4 flex-1">
                          <div className="flex items-center gap-4">
                            <span className="px-3 py-1 rounded-full bg-background border border-border text-[10px] font-black uppercase tracking-widest text-primary">
                              {idx === 0 ? "Executive" : idx === 1 ? "Diagnostic" : "Strategic"}
                            </span>
                            <div className="h-px flex-1 bg-border/30"></div>
                          </div>
                          <p className="text-xl font-medium text-foreground/80 leading-relaxed font-serif">
                            {rec}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="py-32 rounded-[64px] border-4 border-dashed border-border flex flex-col items-center justify-center text-center group hover:border-primary/20 transition-colors">
                    <div className="size-20 rounded-[32px] bg-card border border-border flex items-center justify-center text-muted-foreground/10 mb-8 group-hover:text-primary/40 transition-colors shadow-sm">
                       <Cpu size={40} />
                    </div>
                    <p className="text-muted-foreground/20 font-black text-sm uppercase tracking-[0.3em] mb-6">Awaiting Initial Calibration</p>
                    <button 
                      onClick={handleOptimizeRequest}
                      className="text-primary font-black uppercase text-xs tracking-[0.3em] hover:tracking-[0.5em] transition-all"
                    >
                      Initialize Link
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Insights;
