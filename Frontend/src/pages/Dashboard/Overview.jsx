import React, { useEffect, useState } from "react";
import Charts from "../../components/Charts/Charts";
import Systeminfo from "../../components/Systeminfo/Systeminfo";
import { Cpu, MemoryStick, Zap } from "lucide-react";
const API = import.meta.env.VITE_API_URL;
const Overview = () => {
  const [metrics, setMetrics] = useState({
    cpu: 0,
    ram: 0,
    power: 0,
    net_up: 0,
    net_down: 0,
    ram_components: { active: 0, inactive: 0, cached: 0, free: 0, total: 1 },
    history: [],
    top_processes: [],
  });
  const [suggestions, setSuggestions] = useState([]);
  useEffect(() => {
    const interval = setInterval(async () => {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      if (!token) return;
      try {
        const [systemRes, predictionRes] = await Promise.all([
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
            ram_components: systemData.current.ram_components || {
              active: 0,
              inactive: 0,
              cached: 0,
              free: 0,
              total: 1,
            },
            history: systemData.history || [],
            top_processes: systemData.current.top_processes || [],
          });
        }
        if (
          predictionData &&
          predictionData.state &&
          predictionData.recommendations
        ) {
          setSuggestions(
            predictionData.recommendations.map((rec) => ({
              title: rec,
              detail: "AI-generated recommendation",
              priority: "High",
            })),
          );
        }
      } catch (error) {
        console.error("Fetch error:", error);
      }
    }, 2000);
    return () => clearInterval(interval);
  }, []);
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Systeminfo
          label="CPU Usage"
          value={metrics?.cpu}
          unit="%"
          icon={Cpu}
          tone="strong"
          index={0}
        />
        <Systeminfo
          label="RAM Allocation"
          value={metrics?.ram}
          unit="%"
          icon={MemoryStick}
          tone="strong"
          index={1}
        />
        <Systeminfo
          label="Battery"
          value={metrics?.power}
          unit="%"
          icon={Zap}
          tone="normal"
          index={2}
        />
        <div className="bg-white dark:bg-background-dark p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
                Network Speed
              </p>
              <h3 className="text-2xl font-bold mt-1 tracking-tight text-slate-800 dark:text-slate-100 mb-1">
                <span className="text-sm font-medium text-slate-500">↑ </span>
                {metrics.net_up.toFixed(1)}{" "}
                <span className="text-sm font-normal text-slate-400 mr-2">
                  MB/s
                </span>
              </h3>
              <h3 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
                <span className="text-sm font-medium text-slate-500">↓ </span>
                {metrics.net_down.toFixed(1)}{" "}
                <span className="text-sm font-normal text-slate-400">MB/s</span>
              </h3>
            </div>
            <div className="text-emerald-500 bg-emerald-500/10 p-1 rounded flex items-center h-fit">
              <span className="material-symbols-outlined text-sm">
                wifi_tethering
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-8 bg-white dark:bg-background-dark rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 overflow-hidden">
          <Charts
            Type="CPU & RAM Usage History"
            Attribute1="cpu"
            Attribute2="ram"
            history={metrics.history}
          />
        </div>
        <div className="col-span-12 lg:col-span-4 bg-white dark:bg-background-dark rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
          <h4 className="font-bold text-lg mb-6">RAM Composition</h4>
          <div className="space-y-6">
            <div className="flex h-12 w-full rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800">
              <div
                className="h-full bg-primary transition-all duration-700"
                style={{
                  width: `${(metrics.ram_components.active / metrics.ram_components.total) * 100}%`,
                }}
                title="System (Active)"
              ></div>
              <div
                className="h-full bg-primary/60 transition-all duration-700"
                style={{
                  width: `${(metrics.ram_components.inactive / metrics.ram_components.total) * 100}%`,
                }}
                title="Applications (Inactive)"
              ></div>
              <div
                className="h-full bg-primary/30 transition-all duration-700"
                style={{
                  width: `${(metrics.ram_components.cached / metrics.ram_components.total) * 100}%`,
                }}
                title="Cached"
              ></div>
              <div
                className="h-full bg-slate-100 dark:bg-slate-800 transition-all duration-700"
                style={{
                  width: `${(metrics.ram_components.free / metrics.ram_components.total) * 100}%`,
                }}
                title="Free"
              ></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm bg-primary"></div>
                <div className="min-w-0">
                  <p className="text-[10px] text-slate-500 uppercase font-bold">
                    System
                  </p>
                  <p className="text-sm font-bold">
                    {metrics.ram_components.active.toFixed(1)} GB
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm bg-primary/60"></div>
                <div className="min-w-0">
                  <p className="text-[10px] text-slate-500 uppercase font-bold">
                    Apps
                  </p>
                  <p className="text-sm font-bold">
                    {metrics.ram_components.inactive.toFixed(1)} GB
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm bg-primary/30"></div>
                <div className="min-w-0">
                  <p className="text-[10px] text-slate-500 uppercase font-bold">
                    Cache
                  </p>
                  <p className="text-sm font-bold">
                    {metrics.ram_components.cached.toFixed(1)} GB
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm bg-slate-200 dark:bg-slate-700"></div>
                <div className="min-w-0">
                  <p className="text-[10px] text-slate-500 uppercase font-bold">
                    Free
                  </p>
                  <p className="text-sm font-bold">
                    {metrics.ram_components.free.toFixed(1)} GB
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-12 bg-white dark:bg-background-dark border border-slate-200 dark:border-primary/20 rounded-xl p-6 shadow-sm relative overflow-hidden">
          <div className="flex items-center gap-3 mb-6 relative z-10">
            <div className="bg-primary/20 p-2 rounded-lg flex justify-center items-center text-primary">
              <span className="material-symbols-outlined">lightbulb</span>
            </div>
            <div>
              <h4 className="text-lg font-bold text-black dark:text-white">
                AI Assistant Insights
              </h4>
            </div>
          </div>
          <div className="space-y-4 relative z-10">
            {suggestions.length > 0 ? (
              suggestions.map((sug, i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-slate-800/50 border-l-4 border-t border-r border-b border-amber-500 dark:border-amber-400 p-4 rounded-r-lg mb-2"
                >
                  <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-amber-500">
                      warning
                    </span>
                    <div>
                      <p className="text-sm font-bold text-black dark:text-white">
                        {sug.title}
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        {sug.detail}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-slate-50 dark:bg-slate-800/50 border-l-4 border-primary p-4 rounded-r-lg">
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary">
                    check_circle
                  </span>
                  <div>
                    <p className="text-sm font-bold text-black dark:text-white">
                      System Optimal
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      No pending AI optimizations required.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
export default Overview;
