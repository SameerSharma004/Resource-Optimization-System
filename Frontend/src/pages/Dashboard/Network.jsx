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
      try {
        const token = localStorage.getItem("token");
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
        {/* Page Header */}
        <div className="flex flex-col gap-2">
          <h1 className="text-slate-900 dark:text-slate-100 text-4xl font-black tracking-tight">
            Network Monitoring
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg">
            Real-time analysis of network throughput and active sockets.
          </p>
        </div>
        {/* Top Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
          <div className="flex flex-col gap-2 rounded-xl p-6 border border-slate-200 dark:border-primary/20 bg-white dark:bg-primary/5">
            <div className="flex justify-between items-start">
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium uppercase tracking-wider">
                Latency (Avg)
              </p>
              <span className="material-symbols-outlined text-primary">
                speed
              </span>
            </div>
            <p className="text-slate-900 dark:text-slate-100 text-3xl font-bold">
              14 ms
            </p>
            <p className="text-rose-500 text-sm font-medium flex items-center gap-1">
              <span className="material-symbols-outlined text-xs">
                trending_down
              </span>{" "}
              -2.1% performance drop
            </p>
          </div>
        </div>
        {/* Throughput Graphs */}
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
        {/* Tables Section */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Active Connections */}
          <div className="rounded-xl border border-slate-200 dark:border-primary/20 bg-white dark:bg-primary/5 overflow-hidden">
            <div className="p-6 border-b border-slate-200 dark:border-primary/20 flex justify-between items-center">
              <h3 className="text-slate-900 dark:text-slate-100 font-bold">
                Active Connections
              </h3>
              <button className="text-primary text-xs font-bold uppercase tracking-widest hover:underline">
                View All
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 dark:bg-background-dark text-slate-500 dark:text-slate-400 text-xs uppercase">
                  <tr>
                    <th className="px-6 py-3">Process</th>
                    <th className="px-6 py-3">Remote IP</th>
                    <th className="px-6 py-3">Protocol</th>
                    <th className="px-6 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-slate-100 dark:divide-primary/10">
                  <tr>
                    <td className="px-6 py-4 font-medium">chrome.exe</td>
                    <td className="px-6 py-4 font-mono text-xs">
                      172.217.16.142
                    </td>
                    <td className="px-6 py-4">HTTPS</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 rounded bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs">
                        ESTABLISHED
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-medium">python_worker</td>
                    <td className="px-6 py-4 font-mono text-xs">
                      52.12.98.201
                    </td>
                    <td className="px-6 py-4">gRPC</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 rounded bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs">
                        ESTABLISHED
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-medium">slack_app</td>
                    <td className="px-6 py-4 font-mono text-xs">
                      34.211.5.112
                    </td>
                    <td className="px-6 py-4">WSS</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-500/20 text-slate-600 dark:text-slate-400 text-xs">
                        IDLE
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-medium">system_kernel</td>
                    <td className="px-6 py-4 font-mono text-xs">8.8.8.8</td>
                    <td className="px-6 py-4">UDP</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 rounded bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 text-xs">
                        WAITING
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          {/* Data Usage Per App */}
          <div className="rounded-xl border border-slate-200 dark:border-primary/20 bg-white dark:bg-primary/5 overflow-hidden">
            <div className="p-6 border-b border-slate-200 dark:border-primary/20 flex justify-between items-center">
              <h3 className="text-slate-900 dark:text-slate-100 font-bold">
                Usage per Application
              </h3>
              <div className="flex gap-2">
                <span className="text-slate-500 text-xs">Filter:</span>
                <select className="bg-transparent border-none text-xs font-bold text-primary p-0 m-0 focus:ring-0">
                  <option>Last 24h</option>
                  <option>Last 7d</option>
                </select>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Model Trainer (Python)</span>
                  <span className="text-slate-500">4.2 GB</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-background-dark rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full"
                    style={{ width: "75%" }}
                  ></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Web Browser Cluster</span>
                  <span className="text-slate-500">1.8 GB</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-background-dark rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full"
                    style={{ width: "32%" }}
                  ></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Internal API Sync</span>
                  <span className="text-slate-500">0.9 GB</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-background-dark rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full"
                    style={{ width: "15%" }}
                  ></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Docker Hub Pulls</span>
                  <span className="text-slate-500">0.4 GB</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-background-dark rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full"
                    style={{ width: "8%" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Network;
