import React, { useEffect, useState } from "react";
import Charts from "../../components/Charts/Charts";
import Systeminfo from "../../components/Systeminfo/Systeminfo";
import {
  Cpu,
  MemoryStick,
  Zap,
  Activity,
  ShieldCheck,
  Cpu as CpuIcon,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

const MetricCard = ({ label, value, unit, icon: Icon, color, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
    className="bg-card border border-border p-5 rounded-xl hover:bg-muted/50 transition-colors flex flex-col gap-4"
  >
    <div className="flex justify-between items-center">
      <span className="text-sm font-medium text-muted-foreground">{label}</span>
      <div className={`text-${color}`}>
        <Icon size={18} strokeWidth={2} />
      </div>
    </div>
    <div className="flex items-baseline gap-1">
      <h3 className="text-2xl font-semibold text-foreground tracking-tight">
        {value}
      </h3>
      <span className="text-sm font-medium text-muted-foreground">{unit}</span>
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
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
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
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          label="CPU Usage"
          value={metrics.cpu.toFixed(1)}
          unit="%"
          icon={Cpu}
          color="primary"
          index={0}
        />
        <MetricCard
          label="Memory Usage"
          value={metrics.ram.toFixed(1)}
          unit="%"
          icon={MemoryStick}
          color="purple-500"
          index={1}
        />
        <MetricCard
          label="Battery Status"
          value={metrics.power.toFixed(0)}
          unit="%"
          icon={Zap}
          color="amber-400"
          index={2}
        />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card border border-border p-5 rounded-xl hover:bg-muted/50 transition-colors flex flex-col gap-4 justify-between"
        >
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-muted-foreground">
              Network Speed
            </span>
            <Activity size={18} className="text-emerald-400" strokeWidth={2} />
          </div>
          <div className="flex justify-between items-end">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Upload</p>
              <p className="text-lg font-semibold text-foreground leading-none">
                {metrics.net_up.toFixed(1)}{" "}
                <span className="text-xs font-normal text-muted-foreground">
                  MB/s
                </span>
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground mb-1">Download</p>
              <p className="text-lg font-semibold text-foreground leading-none">
                {metrics.net_down.toFixed(1)}{" "}
                <span className="text-xs font-normal text-muted-foreground">
                  MB/s
                </span>
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Main Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="col-span-12 lg:col-span-8"
        >
          <div className="bg-card border border-border rounded-xl p-6 h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h4 className="text-base font-semibold text-foreground">
                  System Performance
                </h4>
                <p className="text-sm text-muted-foreground">
                  Live CPU & RAM history
                </p>
              </div>
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  <span className="text-xs text-muted-foreground">CPU</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                  <span className="text-xs text-muted-foreground">RAM</span>
                </div>
              </div>
            </div>
            <div className="flex-1 min-h-[300px]">
              <Charts
                Type="CPU & RAM Usage History"
                Attribute1="cpu"
                Attribute2="ram"
                history={metrics.history}
              />
            </div>
          </div>
        </motion.div>

        {/* Neural Insights */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="col-span-12 lg:col-span-4"
        >
          <div className="bg-card border border-border rounded-xl p-6 h-full flex flex-col">
            <div className="flex items-center gap-3 mb-6">
              <ShieldCheck size={20} className="text-primary" />
              <div>
                <h4 className="text-base font-semibold text-foreground">
                  Smart Tips
                </h4>
                <p className="text-sm text-muted-foreground">
                  AI Recommendations
                </p>
              </div>
            </div>

            <div className="space-y-3 flex-1">
              <AnimatePresence mode="popLayout">
                {suggestions.length > 0 ? (
                  suggestions.slice(0, 3).map((sug, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="bg-muted/30 border border-border p-4 rounded-lg flex items-start gap-3"
                    >
                      <div className="mt-1 w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-foreground leading-tight">
                          {sug.title}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {sug.detail}
                        </p>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center h-full">
                    <Activity
                      className="text-muted-foreground/30 mb-3"
                      size={24}
                    />
                    <p className="text-sm text-muted-foreground">
                      Analyzing system patterns...
                    </p>
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
        className="bg-card border border-border rounded-xl p-6"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <h4 className="text-base font-semibold text-foreground">
              Memory Allocation
            </h4>
            <p className="text-sm text-muted-foreground">
              Real-time RAM distribution
            </p>
          </div>
          <div className="flex border border-border rounded-lg overflow-hidden text-sm">
            <div className="px-4 py-2 bg-muted/30 border-r border-border">
              <span className="text-muted-foreground mr-2">Total</span>
              <span className="font-medium text-foreground">
                {metrics.ram_components.total.toFixed(1)} GB
              </span>
            </div>
            <div className="px-4 py-2 bg-muted/30">
              <span className="text-muted-foreground mr-2">Free</span>
              <span className="font-medium text-foreground">
                {metrics.ram_components.free.toFixed(1)} GB
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="h-2 w-full bg-muted rounded-full overflow-hidden flex">
            <motion.div
              initial={{ width: 0 }}
              animate={{
                width: `${(metrics.ram_components.active / metrics.ram_components.total) * 100}%`,
              }}
              className="h-full bg-primary"
            />
            <motion.div
              initial={{ width: 0 }}
              animate={{
                width: `${(metrics.ram_components.inactive / metrics.ram_components.total) * 100}%`,
              }}
              className="h-full bg-purple-500"
            />
            <motion.div
              initial={{ width: 0 }}
              animate={{
                width: `${(metrics.ram_components.cached / metrics.ram_components.total) * 100}%`,
              }}
              className="h-full bg-muted-foreground/30"
            />
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                label: "System Active",
                value: metrics.ram_components.active,
                color: "bg-primary",
              },
              {
                label: "Applications",
                value: metrics.ram_components.inactive,
                color: "bg-purple-500",
              },
              {
                label: "Cached Data",
                value: metrics.ram_components.cached,
                color: "bg-muted-foreground/30",
              },
              {
                label: "Available",
                value: metrics.ram_components.free,
                color: "bg-muted-foreground/10 border border-border",
              },
            ].map((item, i) => (
              <div key={i} className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${item.color}`}></div>
                  <span className="text-xs text-muted-foreground">
                    {item.label}
                  </span>
                </div>
                <p className="text-xl font-medium text-foreground">
                  {item.value.toFixed(1)}{" "}
                  <span className="text-xs text-muted-foreground">GB</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Overview;
