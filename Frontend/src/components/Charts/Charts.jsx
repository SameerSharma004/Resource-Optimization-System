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
        <h2 className="text-base font-semibold ">{Type}</h2>
        <span className="text-xs ">Trend stream</span>
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
            stroke="rgba(125, 246, 182, 0.14)"
          />
          <XAxis dataKey="time" tick={{ fill: "#000000", fontSize: 11 }} />
          <YAxis tick={{ fill: "#000000", fontSize: 11 }} width={32} />
          <Tooltip
            contentStyle={{
              borderRadius: "12px",
              border: "2px solid #576BFF",
              background: "#ffffff",
            }}
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
            stroke="#00118A"
            strokeWidth={2.2}
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </>
  );
}

export default Charts;
