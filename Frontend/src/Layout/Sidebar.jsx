import React, { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Network,
  LayoutDashboard,
  Activity,
  Cpu,
  BrainCircuit,
  LogOut,
  User,
  Settings,
} from "lucide-react";

const navItems = [
  { path: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { path: "/dashboard/metrics", label: "Live Metrics", icon: Activity },
  { path: "/dashboard/processes", label: "Processes", icon: Cpu },
  { path: "/dashboard/network", label: "Network", icon: Network },
  { path: "/dashboard/insights", label: "AI Insights", icon: BrainCircuit },
  { path: "/dashboard/settings", label: "Settings", icon: Settings },
];

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUser = () => {
      const storedUser =
        localStorage.getItem("user") || sessionStorage.getItem("user");
      if (storedUser && storedUser !== "undefined") {
        try {
          setUser(JSON.parse(storedUser));
        } catch (error) {
          console.error("Failed to parse user from localStorage", error);
        }
      }
    };
    loadUser();
    window.addEventListener("themeChange", loadUser);
    return () => window.removeEventListener("themeChange", loadUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("token");
    setUser(null);
    navigate("/");
  };

  return (
    <aside className="w-64 shrink-0 border-r border-sidebar-border bg-sidebar flex flex-col relative z-20 font-display transition-colors duration-300">
      <div className="p-5">
        <NavLink to="/" className="flex items-center gap-2 group">
          <span className=" text-xl tracking-tighter text-white">
            Serial Resource
            <span className="text-primary italic font-serif font-medium ml-1">
              Optimizer
            </span>
          </span>
        </NavLink>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`
                group flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 relative
                ${
                  isActive
                    ? "text-primary bg-primary/10"
                    : "text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent"
                }
              `}
            >
              {isActive && (
                <motion.div
                  layoutId="minimal-active"
                  className="absolute left-0 w-1 h-5 bg-primary rounded-r-full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                />
              )}
              <item.icon
                size={18}
                className={`transition-colors ${isActive ? "text-primary" : "group-hover:text-sidebar-foreground"}`}
              />
              <span className="text-sm font-medium">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="p-4 mt-auto border-t border-sidebar-border">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-sidebar-accent/50 border border-sidebar-border mb-3">
          <div className="size-9 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/10">
            <User size={16} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate text-sidebar-foreground">
              {user ? user.name : "Guest"}
            </p>
            <p className="text-xs text-sidebar-foreground/50 truncate">
              {user ? user.email : "Limited Access"}
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 text-sidebar-foreground/60 hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all text-sm font-medium"
        >
          <LogOut size={16} />
          <span>Exit Session</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
