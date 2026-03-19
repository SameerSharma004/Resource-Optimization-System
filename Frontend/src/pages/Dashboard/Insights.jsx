import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Brain,
  Zap,
  Battery,
  Activity,
  Search,
  Shield,
  Cpu,
  RefreshCw,
} from "lucide-react";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

const Insights = () => {
  const [prediction, setPrediction] = useState(null);
  const [metrics, setMetrics] = useState({ cpu: 0, ram: 0 });
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizingStep, setOptimizingStep] = useState(0);
  const fetchInsights = async () => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
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

    const steps = [
      "Scanning Patterns...",
      "Analyzing Processes...",
      "Calculating Forecast...",
      "Finalizing Insights...",
    ];

    for (let i = 0; i < steps.length; i++) {
      setOptimizingStep(i);
      await new Promise((r) => setTimeout(r, 800 + Math.random() * 500));
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold text-foreground tracking-tight mb-2">
            AI{" "}
            <span className="text-primary italic font-serif font-normal text-4xl">
              Insights
            </span>
          </h2>
          <p className="text-sm text-muted-foreground">
            System Prediction Engine
          </p>
        </div>

        <button
          onClick={handleOptimizeRequest}
          disabled={isOptimizing}
          className="flex items-center gap-2 bg-card hover:bg-muted/80 text-foreground px-5 py-2.5 rounded-lg text-sm font-medium transition-all border border-border disabled:opacity-50"
        >
          {isOptimizing ? (
            <RefreshCw className="animate-spin" size={16} />
          ) : (
            <Zap size={16} className="text-primary" />
          )}
          {isOptimizing ? "Calibrating..." : "Optimize Now"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          {
            label: "System Health",
            value: optScore.toFixed(0) + "%",
            icon: Brain,
            color: "text-primary",
            sub: "Calculated efficiency",
          },
          {
            label: "Future State",
            value: prediction ? prediction.state : "Scanning...",
            icon: Search,
            color: "text-purple-400",
            sub: `Expected CPU: ${prediction ? prediction.future_cpu : "..."}%`,
          },
          {
            label: "Battery Gain",
            value: `+${gain}m`,
            icon: Battery,
            color: "text-emerald-400",
            sub: "Projected recovery",
          },
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-card border border-border p-6 rounded-xl hover:bg-muted/50 transition-colors flex flex-col"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className={`${item.color}`}>
                <item.icon size={20} />
              </div>
              <span className="text-sm font-medium text-muted-foreground">
                {item.label}
              </span>
            </div>
            <h3 className="text-3xl font-semibold text-foreground tracking-tight mb-1 tabular-nums">
              {item.value}
            </h3>
            <p className="text-sm text-muted-foreground">{item.sub}</p>

            {i === 0 && (
              <div className="mt-4 h-1.5 w-full bg-muted rounded-full overflow-hidden">
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
              className="min-h-[400px] rounded-xl bg-card border border-border flex flex-col items-center justify-center"
            >
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                  <Sparkles className="text-primary animate-pulse" size={28} />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {
                    [
                      "Scanning Data",
                      "Analyzing Paths",
                      "Syncing Stats",
                      "Finalizing",
                    ][optimizingStep]
                  }
                </h3>
                <p className="text-sm text-muted-foreground animate-pulse">
                  Running Calculations...
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-8"
            >
              <div className="flex items-center gap-3">
                <Shield className="text-primary" size={24} />
                <h3 className="text-xl font-semibold text-foreground">
                  Smart Recommendations
                </h3>
              </div>

              <div className="grid gap-4">
                {prediction && prediction.recommendations ? (
                  prediction.recommendations.map((rec, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="bg-card border border-border p-6 rounded-xl hover:bg-muted/50 transition-colors flex gap-4 items-start"
                    >
                      <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground shrink-0">
                        {idx === 0 ? (
                          <Shield size={20} />
                        ) : idx === 1 ? (
                          <Activity size={20} />
                        ) : (
                          <Zap size={20} />
                        )}
                      </div>
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium text-primary">
                            {idx === 0
                              ? "System"
                              : idx === 1
                                ? "Performance"
                                : "Critical"}
                          </span>
                        </div>
                        <p className="text-base text-foreground leading-relaxed font-serif">
                          {rec}
                        </p>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="py-20 rounded-xl border border-dashed border-border flex flex-col items-center justify-center text-center">
                    <Cpu className="text-muted-foreground/50 mb-4" size={32} />
                    <p className="text-muted-foreground text-sm mb-4">
                      Waiting for data analysis
                    </p>
                    <button
                      onClick={handleOptimizeRequest}
                      className="text-sm font-medium text-primary hover:underline transition-all"
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
