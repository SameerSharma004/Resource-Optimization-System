import React, { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Network,
  LayoutDashboard,
  Activity,
  Cpu,
  BrainCircuit,
  LogOut,
  User,
  Settings,
  X,
} from "lucide-react";

const navItems = [
  { path: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { path: "/dashboard/metrics", label: "Live Metrics", icon: Activity },
  { path: "/dashboard/processes", label: "Processes", icon: Cpu },
  { path: "/dashboard/insights", label: "AI Insights", icon: BrainCircuit },
  { path: "/dashboard/settings", label: "Settings", icon: Settings },
];

function Sidebar({ isOpen, toggleSidebar }) {
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
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleSidebar}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      <aside 
        className={`
          fixed inset-y-0 left-0 w-72 lg:static lg:w-64 shrink-0 border-r border-sidebar-border bg-sidebar 
          flex flex-col z-50 font-display transition-all duration-500 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        <div className="p-5 flex items-center justify-between lg:block">
          <NavLink to="/" className="flex items-center gap-2 group">
            <span className="text-xl tracking-tighter text-black dark:text-white">
              Serial Resource
              <span className="text-primary italic font-serif font-medium ml-1">
                Optimizer
              </span>
            </span>
          </NavLink>
          <button 
            onClick={toggleSidebar}
            className="p-2 lg:hidden text-sidebar-foreground hover:bg-sidebar-accent rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => { if(window.innerWidth < 1024) toggleSidebar(); }}
                className={`
                  group flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-300 relative
                  ${
                    isActive
                      ? "text-primary bg-primary/10 shadow-sm"
                      : "text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent"
                  }
                `}
              >
                {isActive && (
                  <motion.div
                    layoutId="minimal-active"
                    className="absolute left-0 w-1.5 h-6 bg-primary rounded-r-full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  />
                )}
                <item.icon
                  size={18}
                  className={`transition-colors duration-300 ${isActive ? "text-primary scale-110" : "group-hover:text-sidebar-foreground group-hover:scale-110"}`}
                />
                <span className="text-sm font-medium">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="p-4 mt-auto border-t border-sidebar-border bg-sidebar/50">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-sidebar-accent/50 border border-sidebar-border/30 mb-3 shadow-inner">
            <div className="size-10 rounded-full bg-primary/15 flex items-center justify-center text-primary border border-primary/20 shadow-lg">
              <User size={18} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold truncate text-sidebar-foreground tracking-tight">
                {user ? user.name : "Guest"}
              </p>
              <p className="text-[10px] text-sidebar-foreground/50 truncate font-mono">
                {user ? user.email : "Limited Access"}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-3 text-sidebar-foreground/60 hover:text-white hover:bg-destructive rounded-xl transition-all duration-300 text-sm font-bold shadow-sm hover:shadow-destructive/20"
          >
            <LogOut size={16} />
            <span>Terminate Session</span>
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
