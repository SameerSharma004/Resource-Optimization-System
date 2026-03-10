import React, { useState, useEffect } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

function Charts({Type, Attribute1, Attribute2, history}) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const checkTheme = () => setIsDark(document.documentElement.classList.contains("dark"));
    checkTheme();
    
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  const textColor = isDark ? "#94a3b8" : "#000000";
  const tooltipBg = isDark ? "#0f172a" : "#ffffff";
  const tooltipText = isDark ? "#f1f5f9" : "#000000";
  const gridColor = isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(125, 246, 182, 0.14)";

  return (
    <>
      <div className="mb-3 flex items-center justify-between gap-3 text-slate-900 dark:text-slate-100">
        <h2 className="text-base font-semibold">{Type}</h2>
        <span className="text-xs text-slate-500">Trend stream</span>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={Array.isArray(history) ? history : []}>
          <defs>
            <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#576BFF" stopOpacity={0.55} />
              <stop offset="95%" stopColor="#576BFF" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="4 4"
            stroke={gridColor}
          />
          <XAxis dataKey="time" tick={{ fill: textColor, fontSize: 11 }} />
          <YAxis tick={{ fill: textColor, fontSize: 11 }} width={32} />
          <Tooltip
            contentStyle={{
              borderRadius: "12px",
              border: "2px solid #576BFF",
              background: tooltipBg,
              color: tooltipText,
            }}
            itemStyle={{ color: tooltipText }}
          />
          <Area
            type="monotone"
            dataKey={Attribute1}
            stroke="#576BFF"
            strokeWidth={2}
            fill="url(#tempGradient)"
          />
          <Line
            type="monotone"
            dataKey={Attribute2}
            stroke={isDark ? "#818cf8" : "#00118A"}
            strokeWidth={2.2}
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </>
  );
}

export default Charts;
