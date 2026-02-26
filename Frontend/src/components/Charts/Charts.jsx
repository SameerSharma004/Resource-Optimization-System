import React from "react";
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
  return (
    <>
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-base font-semibold text-white">{Type}</h2>
        <span className="text-xs text-white">Trend stream</span>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={Array.isArray(history) ? history : []}>
          <defs>
            <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ffffff" stopOpacity={0.55} />
              <stop offset="95%" stopColor="#ffffff" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="4 4"
            stroke="rgba(125, 246, 182, 0.14)"
          />
          <XAxis dataKey="time" tick={{ fill: "#ffffff", fontSize: 11 }} />
          <YAxis tick={{ fill: "#ffffff", fontSize: 11 }} width={32} />
          <Tooltip
            contentStyle={{
              borderRadius: "12px",
              border: "1px solid #000000",
              background: "#000000",
            }}
          />
          <Area
            type="monotone"
            dataKey={Attribute1}
            stroke="#ffffff"
            strokeWidth={2}
            fill="url(#tempGradient)"
          />
          <Line
            type="monotone"
            dataKey={Attribute2}
            stroke="#808080"
            strokeWidth={2.2}
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </>
  );
}

export default Charts;
