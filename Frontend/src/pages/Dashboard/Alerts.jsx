import React, { useState, useEffect } from "react";

const API = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000";

const Alerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [lastNotified, setLastNotified] = useState(0);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const [sysRes, predRes] = await Promise.all([
          fetch(`${API}/client-system`),
          fetch(`${API}/predicted`),
        ]);
        const systemData = await sysRes.json();
        const predData = await predRes.json();

        const newAlerts = [];
        const now = new Date();

        if (systemData && systemData.current) {
          const cpu = Number(systemData.current.cpu_usage);
          const ram = Number(systemData.current.memory_usage);

          if (cpu > 85) {
            newAlerts.push({
              id: Date.now() + "-cpu",
              severity: "Critical",
              title: "CPU Load Spike",
              source: "Resource Monitor",
              msg: `System CPU usage exceeded 85% threshold (Current: ${cpu.toFixed(1)}%).`,
              time: now,
              icon: "report",
              color: "red",
            });
          }
          if (ram > 85) {
            newAlerts.push({
              id: Date.now() + "-ram",
              severity: "Warning",
              title: "Memory Near Capacity",
              source: "Node Health",
              msg: `Total memory utilized: ${ram.toFixed(1)}%. Consider scaling instances.`,
              time: now,
              icon: "warning",
              color: "amber",
            });
          }
        }

        if (
          predData &&
          predData.status !== "warming_up" &&
          predData.user_state === "Likely Idle"
        ) {
          newAlerts.push({
            id: Date.now() + "-idle",
            severity: "Info",
            title: "System Identified as Idle",
            source: "Optimization Engine",
            msg: `AI detected idle system state with ${predData.confidence} confidence.`,
            time: now,
            icon: "info",
            color: "blue",
          });
        }

        // Prevent spamming alerts every 2 seconds by keeping a buffer
        if (newAlerts.length > 0 && Date.now() - lastNotified > 15000) {
          setAlerts((prev) => {
            const next = [...newAlerts, ...prev];
            return next.slice(0, 50); // Keep last 50
          });
          setLastNotified(Date.now());
        }
      } catch (error) {
        console.error("Fetch error:", error);
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [lastNotified]);

  return (
    <>
      {/* Sidebar */}

      {/* Content Area */}
      <div className="flex flex-1 flex-col p-4 md:p-8 overflow-y-auto">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="flex flex-col gap-1">
            <h1 className="text-slate-900 dark:text-slate-100 text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em]">
              Alerts History
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-base font-normal leading-normal">
              Monitor system events and optimization triggers in real-time.
            </p>
          </div>
          <button className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-lg font-bold flex items-center gap-2 text-sm transition-all shadow-lg shadow-primary/20">
            <span className="material-symbols-outlined text-lg">download</span>
            Export Report
          </button>
        </div>
        {/* Filter Bar */}
        <div className="flex gap-3 pb-6 flex-wrap items-center">
          <span className="text-sm font-semibold text-slate-400 mr-2">
            Filter by severity:
          </span>
          <div className="flex h-9 items-center justify-center gap-x-2 rounded-lg bg-primary text-white px-5 cursor-pointer shadow-md shadow-primary/20">
            <p className="text-sm font-medium leading-normal">All Alerts</p>
          </div>
          <div className="flex h-9 items-center justify-center gap-x-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-5 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer transition-colors border border-transparent">
            <span className="material-symbols-outlined text-red-500 text-lg">
              error
            </span>
            <p className="text-sm font-medium leading-normal">Critical</p>
          </div>
          <div className="flex h-9 items-center justify-center gap-x-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-5 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer transition-colors border border-transparent">
            <span className="material-symbols-outlined text-amber-500 text-lg">
              warning
            </span>
            <p className="text-sm font-medium leading-normal">Warning</p>
          </div>
          <div className="flex h-9 items-center justify-center gap-x-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-5 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer transition-colors border border-transparent">
            <span className="material-symbols-outlined text-blue-500 text-lg">
              info
            </span>
            <p className="text-sm font-medium leading-normal">Info</p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <button className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-primary transition-colors">
              <span className="material-symbols-outlined text-lg">
                calendar_today
              </span>
              Last 24 Hours
              <span className="material-symbols-outlined text-lg">
                expand_more
              </span>
            </button>
          </div>
        </div>
        {/* Alerts List */}
        <div className="flex flex-col gap-1 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-900/50">
          {alerts.length === 0 ? (
            <div className="flex px-6 py-5 text-slate-500 justify-center">
              No active alerts. Scanning system...
            </div>
          ) : (
            alerts.map((alert) => (
              <div
                key={alert.id}
                className="flex gap-4 px-6 py-5 border-b border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group"
              >
                <div
                  className={`text-${alert.color}-500 flex items-center justify-center rounded-lg bg-${alert.color}-100 dark:bg-${alert.color}-500/10 shrink-0 size-12`}
                >
                  <span className="material-symbols-outlined">
                    {alert.icon}
                  </span>
                </div>
                <div className="flex flex-1 flex-col justify-center">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-${alert.color}-100 dark:bg-${alert.color}-500/20 text-${alert.color}-600 dark:text-${alert.color}-400`}
                    >
                      {alert.severity}
                    </span>
                    <p className="text-slate-900 dark:text-slate-100 text-base font-bold leading-tight">
                      {alert.title}
                    </p>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 text-sm font-medium mb-1">
                    {alert.source}
                  </p>
                  <p className="text-slate-500 dark:text-slate-500 text-xs font-normal leading-normal">
                    {alert.msg}
                  </p>
                </div>
                <div className="shrink-0 flex flex-col items-end gap-2">
                  <p className="text-slate-400 text-xs font-medium">
                    {alert.time.toLocaleTimeString()}
                  </p>
                  <button className="opacity-0 group-hover:opacity-100 transition-opacity text-primary text-xs font-bold hover:underline">
                    View Details
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        {/* Pagination */}
        <div className="flex items-center justify-between mt-8 py-4 border-t border-slate-200 dark:border-slate-800">
          <p className="text-sm text-slate-500">
            Showing <span className="font-bold">5</span> of{" "}
            <span className="font-bold">124</span> events
          </p>
          <div className="flex gap-2">
            <button className="px-4 py-2 text-sm font-medium bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-400 cursor-not-allowed">
              Previous
            </button>
            <button className="px-4 py-2 text-sm font-medium bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
              Next
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Alerts;
