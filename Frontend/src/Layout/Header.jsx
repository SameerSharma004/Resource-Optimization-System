import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const navItems = [
  { path: "/dashboard", label: "Dashboard", icon: "dashboard" },
  { path: "/dashboard/metrics", label: "System Metrics", icon: "monitoring" },
  { path: "/dashboard/processes", label: "Processes", icon: "memory" },
  { path: "/dashboard/network", label: "Network", icon: "lan" },
  { path: "/dashboard/insights", label: "AI Insights", icon: "psychology" },
  { path: "/dashboard/settings", label: "Settings", icon: "settings" },
];

function Header() {
  const location = useLocation();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const activeLabel = navItems.find(i => i.path === location.pathname)?.label || 'MANAGEMENT';

  return (
    <header className="h-20 flex items-center justify-between px-10 border-b border-border bg-background/80 backdrop-blur-md z-20 w-full sticky top-0 transition-colors duration-300">
      <div className="flex items-center gap-8">
        <div className="space-y-0.5">
          <p className="text-[10px] font-black text-primary tracking-[0.3em] uppercase">
            Neural Overdrive
          </p>
          <h1 className="text-2xl font-black text-foreground tracking-tighter">
            {activeLabel}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="hidden md:flex flex-col items-end pr-6">
          <p className="text-[10px] font-black text-muted-foreground tracking-widest uppercase">
            System Time
          </p>
          <p className="text-sm font-black text-foreground tabular-nums">
            {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </p>
        </div>
      </div>
    </header>
  );
}

export default Header;
