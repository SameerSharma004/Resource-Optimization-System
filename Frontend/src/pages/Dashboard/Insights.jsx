import React, { useState, useEffect } from "react";

const API = import.meta.env.VITE_API_URL;

const Insights = () => {
  const [prediction, setPrediction] = useState(null);
  const [metrics, setMetrics] = useState({ cpu: 0, ram: 0 });

  useEffect(() => {
    const interval = setInterval(async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const [sysRes, predRes] = await Promise.all([
          fetch(`${API}/client-system`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          fetch(`${API}/predicted`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);
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
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const optScore = prediction
    ? Math.max(0, 100 - (metrics.cpu * 0.5 + metrics.ram * 0.5))
    : 0;
  const gain = prediction ? (prediction.idle_probability * 45).toFixed(0) : 0;

  return (
    <>
      <div className="flex flex-col gap-5">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              AI Insights
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-lg max-w-2xl">
              Historical optimization analysis and real-time system performance
              recommendations powered by deep-learning models.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-xl border border-slate-200 dark:border-primary/20 bg-white dark:bg-background-dark flex flex-col gap-2">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
              <span className="text-sm font-medium">Optimization Score</span>
              <span className="material-symbols-outlined text-primary">
                speed
              </span>
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                {optScore.toFixed(0)}/100
              </span>
              <span
                className={`text-sm font-semibold flex items-center ${optScore > 80 ? "text-emerald-500" : "text-amber-500"}`}
              >
                <span className="material-symbols-outlined text-xs">
                  {optScore > 80 ? "arrow_upward" : "trending_flat"}
                </span>{" "}
                {optScore > 80 ? "Optimal" : "Needs attention"}
              </span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-primary/10 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className={`${optScore > 80 ? "bg-primary" : "bg-amber-500"} h-full transition-all duration-500`}
                style={{ width: `${optScore}%` }}
              ></div>
            </div>
          </div>
          <div className="p-6 rounded-xl border border-slate-200 dark:border-primary/20 bg-white dark:bg-background-dark flex flex-col gap-2">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
              <span className="text-sm font-medium">User State</span>
              <span className="material-symbols-outlined text-primary">
                bolt
              </span>
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                {prediction ? prediction.state : "Analyzing"}
              </span>
              <span className="text-emerald-500 text-sm font-semibold flex items-center">
                <span className="material-symbols-outlined text-xs">
                  arrow_upward
                </span>{" "}
                {prediction ? prediction.idle_probability * 100 : 0}% Idle Prob.
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-2 italic">
              Confidence: {prediction ? "High" : "N/A"}
            </p>
          </div>
          <div className="p-6 rounded-xl border border-slate-200 dark:border-primary/20 bg-white dark:bg-background-dark flex flex-col gap-2">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
              <span className="text-sm font-medium">Efficiency Gain</span>
              <span className="material-symbols-outlined text-primary">
                trending_up
              </span>
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                +{gain} min
              </span>
              <span className="text-primary text-sm font-semibold flex items-center">
                <span className="material-symbols-outlined text-xs">
                  battery_charging_full
                </span>{" "}
                Expected
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-2">
              Estimated battery life extension
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8">
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">
                  lightbulb
                </span>
                Strategic Recommendations
              </h3>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {prediction && prediction.recommendations ? (
                prediction.recommendations.map((rec, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-xl border border-slate-200 dark:border-primary/20 bg-white dark:bg-background-dark/40 hover:border-primary/40 transition-all group"
                  >
                    <div className="flex gap-5">
                      <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors shrink-0">
                        <span className="material-symbols-outlined text-2xl">
                          memory
                        </span>
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-slate-900 dark:text-white text-lg leading-tight">
                            Live Recommendation
                          </h4>
                          <span className="px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400">
                            Suggested
                          </span>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                          {rec}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-5 rounded-xl border border-slate-200 dark:border-primary/20 bg-white dark:bg-background-dark/40 flex items-center justify-center">
                  <p className="text-slate-500">
                    Waiting for model predictions...
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Insights;
