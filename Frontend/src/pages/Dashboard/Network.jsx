import React, { useState, useEffect } from "react";

const API = import.meta.env.VITE_API_URL;

const Network = () => {
  const [metrics, setMetrics] = useState({
    net_down: 0,
    net_up: 0,
    history: [],
  });

  useEffect(() => {
    const interval = setInterval(async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const res = await fetch(`${API}/client-system`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
        const systemData = await res.json();
        if (systemData && systemData.current) {
          setMetrics({
            net_down: Number(systemData.current.net_download_mbps) || 0,
            net_up: Number(systemData.current.net_upload_mbps) || 0,
            history: systemData.history || [],
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
      <div className="mx-auto space-y-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-slate-900 dark:text-slate-100 text-4xl font-black tracking-tight">
            Network Monitoring
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg">
            Real-time analysis of network throughput.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2 rounded-xl p-6 border border-slate-200 dark:border-primary/20 bg-white dark:bg-primary/5">
            <div className="flex justify-between items-start">
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium uppercase tracking-wider">
                Current Download
              </p>
              <span className="material-symbols-outlined text-primary">
                download
              </span>
            </div>
            <p className="text-slate-900 dark:text-slate-100 text-3xl font-bold">
              {metrics.net_down.toFixed(2)} MB/s
            </p>
            <p className="text-emerald-500 text-sm font-medium flex items-center gap-1">
              <span className="material-symbols-outlined text-xs">
                trending_up
              </span>{" "}
              live polling
            </p>
          </div>
          <div className="flex flex-col gap-2 rounded-xl p-6 border border-slate-200 dark:border-primary/20 bg-white dark:bg-primary/5">
            <div className="flex justify-between items-start">
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium uppercase tracking-wider">
                Current Upload
              </p>
              <span className="material-symbols-outlined text-primary">
                upload
              </span>
            </div>
            <p className="text-slate-900 dark:text-slate-100 text-3xl font-bold">
              {metrics.net_up.toFixed(2)} MB/s
            </p>
            <p className="text-emerald-500 text-sm font-medium flex items-center gap-1">
              <span className="material-symbols-outlined text-xs">
                trending_up
              </span>{" "}
              live polling
            </p>
          </div>
          
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-xl border border-slate-200 dark:border-primary/20 bg-white dark:bg-primary/5 p-6">
            <h3 className="text-slate-900 dark:text-slate-100 font-bold mb-4">
              Live Download Speed
            </h3>
            <div className="h-48 w-full bg-slate-50 dark:bg-background-dark rounded flex items-end gap-1 p-2 overflow-hidden">
              {metrics.history &&
                metrics.history
                  .slice(-15)
                  .map((point, idx) => (
                    <div
                      key={idx}
                      className="bg-primary/60 w-full rounded-t transition-all duration-300"
                      style={{
                        height: `${Math.min(100, Math.max(5, (point.net_down / 50) * 100))}%`,
                      }}
                    ></div>
                  ))}
              {(!metrics.history || metrics.history.length === 0) && (
                <div className="w-full flex justify-center text-slate-400 text-sm mt-10">
                  Waiting for data...
                </div>
              )}
            </div>
          </div>
          <div className="rounded-xl border border-slate-200 dark:border-primary/20 bg-white dark:bg-primary/5 p-6">
            <h3 className="text-slate-900 dark:text-slate-100 font-bold mb-4">
              Live Upload Speed
            </h3>
            <div className="h-48 w-full bg-slate-50 dark:bg-background-dark rounded flex items-end gap-1 p-2 overflow-hidden">
              {metrics.history &&
                metrics.history
                  .slice(-15)
                  .map((point, idx) => (
                    <div
                      key={idx}
                      className="bg-indigo-400/60 w-full rounded-t transition-all duration-300"
                      style={{
                        height: `${Math.min(100, Math.max(5, (point.net_up / 50) * 100))}%`,
                      }}
                    ></div>
                  ))}
              {(!metrics.history || metrics.history.length === 0) && (
                <div className="w-full flex justify-center text-slate-400 text-sm mt-10">
                  Waiting for data...
                </div>
              )}
            </div>
          </div>
        </div>
        
      </div>
    </>
  );
};

export default Network;
