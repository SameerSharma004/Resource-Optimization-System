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
  Settings
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
      const storedUser = localStorage.getItem("user") || sessionStorage.getItem("user");
      if (storedUser && storedUser !== "undefined") {
        try {
          setUser(JSON.parse(storedUser));
        } catch (error) {
          console.error("Failed to parse user from localStorage", error);
        }
      }
    };
    loadUser();
    window.addEventListener("themeChange", loadUser); // Use as trigger to reload user if changed in settings
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
      {/* Brand Logo */}
      <div className="p-8">
        <div className="flex items-center gap-3">
          <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
            <BrainCircuit size={18} className="text-primary" />
          </div>
          <div>
            <h1 className="font-black text-xl tracking-tighter text-sidebar-foreground leading-none">
              NEURAL
            </h1>
            <p className="text-[9px] text-sidebar-foreground/30 uppercase tracking-[0.3em] font-bold mt-1">
              Engine v1.0
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `
                group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 relative
                ${isActive 
                  ? "text-primary bg-primary/5" 
                  : "text-sidebar-foreground/40 hover:text-sidebar-foreground hover:bg-sidebar-accent"}
              `}
            >
              {isActive && (
                <motion.div 
                  layoutId="minimal-active"
                  className="absolute left-0 w-1 h-5 bg-primary rounded-full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                />
              )}
              <item.icon size={18} className={`transition-colors ${isActive ? 'text-primary' : 'group-hover:text-primary/70'}`} />
              <span className="text-sm font-bold tracking-tight">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* User & Logout */}
      <div className="p-4 mt-auto border-t border-sidebar-border">
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-sidebar-accent/50 border border-sidebar-border mb-3">
          <div className="size-9 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/10">
            <User size={16} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-black truncate text-sidebar-foreground">
              {user ? user.name : "Guest"}
            </p>
            <p className="text-[10px] text-sidebar-foreground/30 truncate font-bold uppercase tracking-tight">
              {user ? "Authenticated" : "Limited Access"}
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-sidebar-foreground/40 hover:text-rose-500 hover:bg-rose-500/5 rounded-xl transition-all text-xs font-black uppercase tracking-widest"
        >
          <LogOut size={16} />
          <span>Exit Session</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
