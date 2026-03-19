import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

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

  const activeLabel =
    navItems.find((i) => i.path === location.pathname)?.label || "MANAGEMENT";

  return (
    <header className="h-20 flex items-center justify-between px-10 border-b border-border bg-background/80 backdrop-blur-md z-20 w-full sticky top-0 transition-colors duration-300">
      <div className="flex items-center gap-8">
        <div className="space-y-0.5">
          <h1 className="text-xl font-semibold text-foreground tracking-tight">
            {activeLabel}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="hidden md:flex flex-col items-end pr-6">
          <p className="text-xs font-medium text-muted-foreground tracking-wider uppercase">
            System Time
          </p>
          <p className="text-sm font-medium text-foreground tabular-nums">
            {currentTime.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })}
          </p>
        </div>
        <div>
          <Link
            to="/"
            className="bg-primary text-black px-6 py-2.5 rounded-full text-sm tracking-tight hover:scale-105 transition-all shadow-lg shadow-primary/20"
          >
            Home
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Header;
