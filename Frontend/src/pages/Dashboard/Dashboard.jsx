import { motion as Motion } from "framer-motion";
import {
  Activity,
  ArrowLeft,
  Brain,
  Cpu,
  HardDrive,
  MemoryStick,
  Thermometer,
  Zap,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import Charts from "../../components/Charts/Charts";
import Systeminfo from "@/components/Systeminfo/Systeminfo";

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
  time: new Date().toLocaleTimeString([], {
    hour12: false,
    minute: "2-digit",
    second: "2-digit",
  }),
  cpu: metrics.cpu,
  ram: metrics.ram,
  disk: metrics.disk,
  network: metrics.network,
  temperature: metrics.temperature,
  power: metrics.power,
});

const computeLstmSuggestions = (metrics) => {
  const suggestions = [];

  if (metrics.cpu > 72) {
    suggestions.push({
      title: "Shift heavy tasks to low-demand windows",
      detail:
        "Predicted CPU saturation risk in the next 8-10 min. Delay non-critical batch jobs.",
      priority: "High",
    });
  }

  if (metrics.ram > 78) {
    suggestions.push({
      title: "Trim memory-intensive services",
      detail:
        "LSTM detects likely memory pressure. Restart stale workers or lower in-memory cache limits.",
      priority: "High",
    });
  }

  if (metrics.temperature > 73) {
    suggestions.push({
      title: "Reduce thermal load",
      detail:
        "Thermal trend is rising. Lower concurrency by 15% and prioritize short-running jobs.",
      priority: "Medium",
    });
  }

  if (metrics.power > 130 && metrics.cpu < 48) {
    suggestions.push({
      title: "Investigate power inefficiency",
      detail:
        "Power draw is high compared to compute load. Check background daemons and fan curve profile.",
      priority: "Medium",
    });
  }

  if (!suggestions.length) {
    suggestions.push({
      title: "Keep current operating profile",
      detail:
        "Model confidence indicates stable performance. No immediate optimization action is required.",
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
    memory: nav.deviceMemory
      ? `${nav.deviceMemory} GB (browser estimate)`
      : "Not exposed",
    platform: nav.userAgentData?.platform || nav.platform || "Unknown",
  };
};

const metricCards = [
  { key: "cpu", label: "CPU Usage", icon: Cpu, unit: "%", tone: "strong" },
  {
    key: "ram",
    label: "RAM Usage",
    icon: MemoryStick,
    unit: "%",
    tone: "strong",
  },
  {
    key: "disk",
    label: "Disk Utilization",
    icon: HardDrive,
    unit: "%",
    tone: "normal",
  },
  {
    key: "network",
    label: "Network Load",
    icon: Activity,
    unit: "%",
    tone: "normal",
  },
  {
    key: "temperature",
    label: "CPU Temp",
    icon: Thermometer,
    unit: "°C",
    tone: "warning",
  },
  { key: "power", label: "Power Draw", icon: Zap, unit: "W", tone: "normal" },
];



const priorityStyles = {
  High: "bg-amber-200/20 text-yellow-500 border border-amber-300/30",
  Medium: "bg-sky-200/20 text-sky-500 border border-sky-300/30",
  Low: "bg-emerald-200/20 text-emerald-500 border border-emerald-300/30",
};

const Dashboard = () => {
  const [metrics, setMetrics] = useState(createInitialMetrics);
  const [history, setHistory] = useState(() => [
    toHistoryPoint(createInitialMetrics()),
  ]);
  const [lastInference, setLastInference] = useState(() => new Date());
  const [suggestions, setSuggestions] = useState(() =>
    computeLstmSuggestions(createInitialMetrics()),
  );
  const [modelSource, setModelSource] = useState(() =>
    LSTM_API_URL ? "LSTM API" : "Fallback Rules",
  );
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
    <main className="min-h-screenflex flex-col items-center justify-center bg-white px-4 pb-6 pt-5 ">
      <div className="pointer-events-none absolute inset-0" />

      <header className="relative z-10 mt-2 flex w-full flex-col justify-between lg:flex-row lg:items-start px-4 pb-6 pt-5">
        <div>
          <p className="text-3xl ">AI Resource Intelligence Platform</p>
        </div>
        <NavLink
          className="inline-flex w-fit items-center gap-2 rounded-xl  px-4 py-2 font-medium text-black"
          to="/"
        >
          <ArrowLeft size={16} />
          Home
        </NavLink>
      </header>
      <section className=" max-w-[95%] w-full"></section>
      <section
        className="z-10 mx-auto mt-5 flex flex-col gap-4 "
        aria-label="Resource details"
      >
        <Systeminfo metricCards={metricCards} metrics={metrics} />

        <div className="grid grid-cols-3 gap-3 ">
          <Motion.article
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.35 }}
            viewport={{ once: true, amount: 0.2 }}
            className="rounded-2xl  p-4 border border-gray-200"
          >
            <Charts
              Type={"CPU & RAM (%)"}
              Attribute1={"cpu"}
              Attribute2={"ram"}
              history={history}
            />
          </Motion.article>

          <Motion.article
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            viewport={{ once: true, amount: 0.2 }}
            className="rounded-2xl  p-4 border border-gray-200"
          >
            <Charts
              Type={"Temperature (°C) & Power (W)"}
              Attribute1={"temperature"}
              Attribute2={"power"}
              history={history}
            />
          </Motion.article>
          <Motion.article
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.35 }}
            viewport={{ once: true, amount: 0.2 }}
            className="rounded-2xl border border-gray-200 p-4 "
          >
            <Charts
              Type={"Disk & Network (%)"}
              Attribute1={"disk"}
              Attribute2={"network"}
              history={history}
            />
          </Motion.article>
        </div>

        <aside className="grid grid-cols-2 gap-3">
          <Motion.article
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.35 }}
            viewport={{ once: true, amount: 0.2 }}
            className="rounded-2xl border border-gray-200  p-4 "
          >
            <div className="mb-3 flex items-center justify-between gap-3">
              <h2 className="inline-flex items-center gap-2 text-base font-semibold ">
                <Brain size={18} /> AI Suggestion Engine
              </h2>
              <span className="text-xs ">
                {modelSource} • {lastInference.toLocaleTimeString()}
              </span>
            </div>
            <p className="text-sm ">
              Predictions from your LSTM model are evaluated continuously to
              recommend the next best optimization action.
            </p>
            <ul className="mt-3 grid list-none gap-2 p-0">
              {suggestions.map((item) => (
                <li key={item.title} className="rounded-xl border p-3">
                  <p className="mb-2 flex items-center justify-between gap-2">
                    <strong className="text-sm ">{item.title}</strong>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-semibold uppercase ${priorityStyles[item.priority] || priorityStyles.Medium}`}
                    >
                      {item.priority}
                    </span>
                  </p>
                  <p className="text-sm ">{item.detail}</p>
                </li>
              ))}
            </ul>
          </Motion.article>

          <Motion.article
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.35 }}
            viewport={{ once: true, amount: 0.2 }}
            className="rounded-xl  p-4 border border-gray-200"
          >
            <h2 className="text-base font-semibold ">Environment Snapshot</h2>
            <dl className="mt-3 grid gap-5">
              <div className="border border-gray-200 rounded-2xl p-4 ">
                <dt className="text-sm ">Logical CPU Cores</dt>
                <dd className="mt-1 text-xs text-gray-500">
                  {systemInfo.cores}
                </dd>
              </div>
              <div className="border border-gray-200 rounded-2xl p-4 ">
                <dt className="text-sm ">Device Memory</dt>
                <dd className="mt-1 text-xs text-gray-500">
                  {systemInfo.memory}
                </dd>
              </div>
              <div className="border border-gray-200 rounded-2xl p-4 ">
                <dt className="text-sm ">Platform</dt>
                <dd className="mt-1 text-xs text-gray-500">
                  {systemInfo.platform}
                </dd>
              </div>
            </dl>
          </Motion.article>
        </aside>
      </section>
    </main>
  );
};

export default Dashboard;
