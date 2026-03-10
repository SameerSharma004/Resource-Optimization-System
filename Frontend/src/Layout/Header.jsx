import React from "react";
import { useLocation } from "react-router-dom";

const navItems = [
  { path: "/dashboard", label: "Dashboard", icon: "dashboard" },
  { path: "/dashboard/metrics", label: "System Metrics", icon: "monitoring" },
  { path: "/dashboard/processes", label: "Processes", icon: "memory" },
  { path: "/dashboard/network", label: "Network", icon: "lan" },
  { path: "/dashboard/insights", label: "AI Insights", icon: "psychology" },
  { path: "/dashboard/alerts", label: "Alerts", icon: "notifications" },
];

function Header() {
  const location = useLocation();

  return (
    <header className="h-16 flex items-center justify-between px-8 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-background-dark z-10 w-full">
      <div className="flex items-center gap-6">
        <h2 className="text-sm font-bold tracking-tight uppercase">
            {navItems.find(i => i.path === location.pathname)?.label || 'MANAGEMENT'}
        </h2>
        <div className="flex items-center gap-4 text-[11px] font-medium text-slate-500 uppercase tracking-wider border-l border-slate-200 dark:border-slate-800 pl-6">
          
        </div>
      </div>
      
    </header>
  );
}

export default Header;
