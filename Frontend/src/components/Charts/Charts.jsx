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

  const textColor = isDark ? "#94a3b8" : "#64748b";
  const tooltipBg = isDark ? "#111326" : "#ffffff";
  const tooltipText = isDark ? "#f8fafc" : "#0A0B1A";
  const gridColor = isDark ? "rgba(99, 103, 255, 0.1)" : "rgba(99, 103, 255, 0.05)";
  const primaryColor = "#6367FF";
  const secondaryColor = "#8494FF";

  return (
    <>
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-sm font-black text-foreground uppercase tracking-wider">{Type}</h2>
        <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-40">Live Sync</span>
      </div>
      <ResponsiveContainer width="100%" height={250}>
        <AreaChart data={Array.isArray(history) ? history : []} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={primaryColor} stopOpacity={0.3} />
              <stop offset="95%" stopColor={primaryColor} stopOpacity={0} />
            </linearGradient>
            <linearGradient id="secondaryGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={secondaryColor} stopOpacity={0.2} />
              <stop offset="95%" stopColor={secondaryColor} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="4 4"
            vertical={false}
            stroke={gridColor}
          />
          <XAxis 
            dataKey="time" 
            tick={{ fill: textColor, fontSize: 10, fontWeight: 700 }} 
            axisLine={false}
            tickLine={false}
          />
          <YAxis 
            tick={{ fill: textColor, fontSize: 10, fontWeight: 700 }} 
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              borderRadius: "16px",
              border: `1px solid ${isDark ? "rgba(99, 103, 255, 0.2)" : "rgba(99, 103, 255, 0.1)"}`,
              background: tooltipBg,
              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
              padding: "12px"
            }}
            itemStyle={{ color: tooltipText, fontSize: "12px", fontWeight: 800 }}
            labelStyle={{ color: textColor, fontSize: "10px", fontWeight: 900, marginBottom: "4px", textTransform: "uppercase" }}
          />
          <Area
            type="monotone"
            dataKey={Attribute1}
            stroke={primaryColor}
            strokeWidth={3}
            fill="url(#chartGradient)"
            animationDuration={1000}
          />
          <Area
            type="monotone"
            dataKey={Attribute2}
            stroke={secondaryColor}
            strokeWidth={2}
            fill="url(#secondaryGradient)"
            strokeDasharray="5 5"
            animationDuration={1500}
          />
        </AreaChart>
      </ResponsiveContainer>
    </>
  );
}

export default Charts;
