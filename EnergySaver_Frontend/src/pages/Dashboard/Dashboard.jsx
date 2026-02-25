import { motion as Motion } from "framer-motion";
import {
  Activity,
  ArrowLeft,
  Brain,
  Cpu,
  Gauge,
  HardDrive,
  MemoryStick,
  Thermometer,
  Zap,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const LSTM_API_URL = import.meta.env.VITE_LSTM_API_URL;

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const createInitialMetrics = () => ({
  cpu: 34,
  ram: 47,
  disk: 43,
  network: 31,
  temperature: 58,
  power: 68,
});

const nextMetricValue = (current, min, max, movement = 4) => {
  const drift = (Math.random() - 0.5) * movement * 2;
  return clamp(Number((current + drift).toFixed(1)), min, max);
};

const nextMetrics = (previous) => ({
  cpu: nextMetricValue(previous.cpu, 8, 95, 6),
  ram: nextMetricValue(previous.ram, 15, 98, 5),
  disk: nextMetricValue(previous.disk, 20, 96, 4),
  network: nextMetricValue(previous.network, 4, 92, 8),
  temperature: nextMetricValue(previous.temperature, 36, 89, 2.2),
  power: nextMetricValue(previous.power, 38, 180, 7),
});

const toHistoryPoint = (metrics) => ({
  time: new Date().toLocaleTimeString([], { hour12: false, minute: "2-digit", second: "2-digit" }),
  cpu: metrics.cpu,
  ram: metrics.ram,
  temperature: metrics.temperature,
  power: metrics.power,
});

const computeLstmSuggestions = (metrics) => {
  const suggestions = [];

  if (metrics.cpu > 72) {
    suggestions.push({
      title: "Shift heavy tasks to low-demand windows",
      detail: "Predicted CPU saturation risk in the next 8-10 min. Delay non-critical batch jobs.",
      priority: "High",
    });
  }

  if (metrics.ram > 78) {
    suggestions.push({
      title: "Trim memory-intensive services",
      detail: "LSTM detects likely memory pressure. Restart stale workers or lower in-memory cache limits.",
      priority: "High",
    });
  }

  if (metrics.temperature > 73) {
    suggestions.push({
      title: "Reduce thermal load",
      detail: "Thermal trend is rising. Lower concurrency by 15% and prioritize short-running jobs.",
      priority: "Medium",
    });
  }

  if (metrics.power > 130 && metrics.cpu < 48) {
    suggestions.push({
      title: "Investigate power inefficiency",
      detail: "Power draw is high compared to compute load. Check background daemons and fan curve profile.",
      priority: "Medium",
    });
  }

  if (!suggestions.length) {
    suggestions.push({
      title: "Keep current operating profile",
      detail: "Model confidence indicates stable performance. No immediate optimization action is required.",
      priority: "Low",
    });
  }

  return suggestions;
};

const normalizeSuggestions = (raw) => {
  const payload = Array.isArray(raw) ? raw : raw?.suggestions;
  if (!Array.isArray(payload) || payload.length === 0) {
    return null;
  }

  const normalized = payload
    .map((item) => ({
      title: item?.title || item?.action || "",
      detail: item?.detail || item?.description || "",
      priority: item?.priority || "Medium",
    }))
    .filter((item) => item.title && item.detail);

  return normalized.length ? normalized : null;
};

const getSystemInfo = () => {
  const nav = window.navigator;
  return {
    cores: nav.hardwareConcurrency || "N/A",
    memory: nav.deviceMemory ? `${nav.deviceMemory} GB (browser estimate)` : "Not exposed",
    platform: nav.userAgentData?.platform || nav.platform || "Unknown",
  };
};

const metricCards = [
  { key: "cpu", label: "CPU Usage", icon: Cpu, unit: "%", tone: "strong" },
  { key: "ram", label: "RAM Usage", icon: MemoryStick, unit: "%", tone: "strong" },
  { key: "disk", label: "Disk Utilization", icon: HardDrive, unit: "%", tone: "normal" },
  { key: "network", label: "Network Load", icon: Activity, unit: "%", tone: "normal" },
  { key: "temperature", label: "CPU Temp", icon: Thermometer, unit: "°C", tone: "warning" },
  { key: "power", label: "Power Draw", icon: Zap, unit: "W", tone: "normal" },
];

const toneStyles = {
  strong: "text-emerald-200 bg-emerald-300/15",
  normal: "text-emerald-200 bg-emerald-300/10",
  warning: "text-amber-100 bg-amber-300/15",
};

const priorityStyles = {
  High: "bg-amber-200/20 text-amber-100 border border-amber-300/30",
  Medium: "bg-sky-200/20 text-sky-100 border border-sky-300/30",
  Low: "bg-emerald-200/20 text-emerald-100 border border-emerald-300/30",
};

const pageGlowStyle = {
  background:
    "radial-gradient(circle at 12% 8%, rgba(79, 245, 159, 0.22), transparent 36%), radial-gradient(circle at 88% 2%, rgba(138, 255, 198, 0.15), transparent 28%)",
};

const Dashboard = () => {
  const [metrics, setMetrics] = useState(createInitialMetrics);
  const [history, setHistory] = useState(() => [toHistoryPoint(createInitialMetrics())]);
  const [lastInference, setLastInference] = useState(() => new Date());
  const [suggestions, setSuggestions] = useState(() => computeLstmSuggestions(createInitialMetrics()));
  const [modelSource, setModelSource] = useState(() => (LSTM_API_URL ? "LSTM API" : "Fallback Rules"));
  const [tick, setTick] = useState(0);
  const systemInfo = useMemo(() => getSystemInfo(), []);
  const requestPendingRef = useRef(false);

  useEffect(() => {
    const id = window.setInterval(() => {
      setMetrics((prev) => {
        const next = nextMetrics(prev);
        setHistory((prevHistory) => {
          const updated = [...prevHistory, toHistoryPoint(next)];
          return updated.slice(-24);
        });
        return next;
      });
      setTick((prev) => prev + 1);
    }, 1000);

    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    if (!LSTM_API_URL) {
      setSuggestions(computeLstmSuggestions(metrics));
      setLastInference(new Date());
      return;
    }

    if (tick % 5 !== 0 || requestPendingRef.current) {
      return;
    }

    const controller = new AbortController();
    requestPendingRef.current = true;

    const run = async () => {
      try {
        const response = await fetch(LSTM_API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ metrics }),
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`LSTM API returned ${response.status}`);
        }

        const data = await response.json();
        const normalized = normalizeSuggestions(data);

        if (!normalized) {
          throw new Error("Invalid LSTM payload");
        }

        setSuggestions(normalized);
        setModelSource("LSTM API");
      } catch {
        setSuggestions(computeLstmSuggestions(metrics));
        setModelSource("Fallback Rules");
      } finally {
        requestPendingRef.current = false;
        setLastInference(new Date());
      }
    };

    run();

    return () => controller.abort();
  }, [metrics, tick]);

  return (
    <main className="relative min-h-screen bg-gradient-to-br from-[#03150d] to-[#082417] px-4 pb-6 pt-5 text-emerald-100">
      <div className="pointer-events-none absolute inset-0" style={pageGlowStyle} aria-hidden="true" />

      <header className="relative z-10 mx-auto mt-2 flex w-full max-w-7xl flex-col justify-between gap-4 lg:flex-row lg:items-start">
        <div>
          <p className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-300/25 bg-emerald-900/45 px-3 py-1 text-xs uppercase tracking-wider text-emerald-200">
            <Gauge size={14} />
            Live Resource Console
          </p>
          <h1 className="mt-3 text-3xl font-semibold text-emerald-50 md:text-4xl">EnergySaver Dashboard</h1>
          <p className="mt-2 text-emerald-200/70">
            Real-time resource telemetry with LSTM-powered optimization insights.
          </p>
        </div>

        <Link
          className="inline-flex w-fit items-center gap-2 rounded-xl border border-emerald-300/25 bg-emerald-900/40 px-4 py-2 font-medium text-emerald-100"
          to="/"
        >
          <ArrowLeft size={16} />
          Landing Page
        </Link>
      </header>

      <section className="relative z-10 mx-auto mt-5 grid w-full max-w-7xl gap-4 xl:grid-cols-3" aria-label="Resource details">
        <div className="xl:col-span-3 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {metricCards.map((item, index) => {
            const Icon = item.icon;
            const value = metrics[item.key];

            return (
              <Motion.article
                key={item.key}
                className="rounded-2xl border border-emerald-300/20 bg-gradient-to-br from-emerald-900/55 to-emerald-950/70 p-4 shadow-inner shadow-emerald-100/5"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: index * 0.06 }}
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <span className="text-xs text-emerald-200/70">{item.label}</span>
                    <strong className="mt-1 block text-2xl font-semibold text-emerald-50">
                      {value}
                      {item.unit}
                    </strong>
                  </div>
                  <span className={`inline-flex h-8 w-8 items-center justify-center rounded-lg ${toneStyles[item.tone]}`}>
                    <Icon size={18} />
                  </span>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-emerald-300/20" role="img" aria-label={`${item.label} ${value}${item.unit}`}>
                  <span
                    className="block h-full rounded-full bg-gradient-to-r from-emerald-300 to-emerald-100 transition-all duration-500"
                    style={{ width: `${Math.min(value, 100)}%` }}
                  />
                </div>
              </Motion.article>
            );
          })}
        </div>

        <div className="grid min-w-0 gap-3 xl:col-span-2">
          <article className="rounded-2xl border border-emerald-300/20 bg-gradient-to-br from-emerald-900/55 to-emerald-950/70 p-4 shadow-inner shadow-emerald-100/5">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h2 className="text-base font-semibold text-emerald-50">CPU vs RAM (%)</h2>
              <span className="text-xs text-emerald-200/70">Last 24 sec</span>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={history}>
                <CartesianGrid strokeDasharray="4 4" stroke="rgba(125, 246, 182, 0.14)" />
                <XAxis dataKey="time" tick={{ fill: "#9fcaaf", fontSize: 11 }} />
                <YAxis domain={[0, 100]} tick={{ fill: "#9fcaaf", fontSize: 11 }} width={32} />
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid rgba(124, 245, 181, 0.25)",
                    background: "rgba(7, 34, 21, 0.95)",
                  }}
                />
                <Line type="monotone" dataKey="cpu" stroke="#80f7b8" strokeWidth={2.5} dot={false} />
                <Line type="monotone" dataKey="ram" stroke="#b4ffd3" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </article>

          <article className="rounded-2xl border border-emerald-300/20 bg-gradient-to-br from-emerald-900/55 to-emerald-950/70 p-4 shadow-inner shadow-emerald-100/5">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h2 className="text-base font-semibold text-emerald-50">Thermal & Power Profile</h2>
              <span className="text-xs text-emerald-200/70">Trend stream</span>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={history}>
                <defs>
                  <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8fffc8" stopOpacity={0.55} />
                    <stop offset="95%" stopColor="#8fffc8" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 4" stroke="rgba(125, 246, 182, 0.14)" />
                <XAxis dataKey="time" tick={{ fill: "#9fcaaf", fontSize: 11 }} />
                <YAxis tick={{ fill: "#9fcaaf", fontSize: 11 }} width={32} />
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid rgba(124, 245, 181, 0.25)",
                    background: "rgba(7, 34, 21, 0.95)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="temperature"
                  stroke="#8fffc8"
                  strokeWidth={2}
                  fill="url(#tempGradient)"
                />
                <Line type="monotone" dataKey="power" stroke="#e1ffe9" strokeWidth={2.2} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </article>
        </div>

        <aside className="grid gap-3">
          <article className="rounded-2xl border border-emerald-300/20 bg-gradient-to-br from-emerald-900/55 to-emerald-950/70 p-4 shadow-inner shadow-emerald-100/5">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h2 className="inline-flex items-center gap-2 text-base font-semibold text-emerald-50">
                <Brain size={18} /> AI Suggestion Engine
              </h2>
              <span className="text-xs text-emerald-200/70">
                {modelSource} • {lastInference.toLocaleTimeString()}
              </span>
            </div>
            <p className="text-sm text-emerald-200/70">
              Predictions from your LSTM model are evaluated continuously to recommend the next best
              optimization action.
            </p>
            <ul className="mt-3 grid list-none gap-2 p-0">
              {suggestions.map((item) => (
                <li
                  key={item.title}
                  className="rounded-xl border border-emerald-300/20 bg-emerald-900/40 p-3"
                >
                  <p className="mb-2 flex items-center justify-between gap-2">
                    <strong className="text-sm text-emerald-50">{item.title}</strong>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold uppercase ${priorityStyles[item.priority] || priorityStyles.Medium}`}>
                      {item.priority}
                    </span>
                  </p>
                  <p className="text-sm text-emerald-200/75">{item.detail}</p>
                </li>
              ))}
            </ul>
          </article>

          <article className="rounded-2xl border border-emerald-300/20 bg-gradient-to-br from-emerald-900/55 to-emerald-950/70 p-4 shadow-inner shadow-emerald-100/5">
            <h2 className="text-base font-semibold text-emerald-50">Environment Snapshot</h2>
            <dl className="mt-3 grid gap-3">
              <div>
                <dt className="text-xs text-emerald-200/70">Logical CPU Cores</dt>
                <dd className="mt-1 text-sm text-emerald-100">{systemInfo.cores}</dd>
              </div>
              <div>
                <dt className="text-xs text-emerald-200/70">Device Memory</dt>
                <dd className="mt-1 text-sm text-emerald-100">{systemInfo.memory}</dd>
              </div>
              <div>
                <dt className="text-xs text-emerald-200/70">Platform</dt>
                <dd className="mt-1 text-sm text-emerald-100">{systemInfo.platform}</dd>
              </div>
            </dl>
          </article>
        </aside>
      </section>
    </main>
  );
};

export default Dashboard;
