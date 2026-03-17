import React, { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
const navItems = [
  { path: "/dashboard", label: "Dashboard", icon: "dashboard" },
  { path: "/dashboard/metrics", label: "System Metrics", icon: "monitoring" },
  { path: "/dashboard/processes", label: "Processes", icon: "memory" },
  { path: "/dashboard/network", label: "Network", icon: "lan" },
  { path: "/dashboard/insights", label: "AI Insights", icon: "psychology" },
];
function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  useEffect(() => {
    const storedUser = localStorage.getItem("user") || sessionStorage.getItem("user");
    if (storedUser && storedUser !== "undefined") {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse user from localStorage", error);
      }
    }
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
    <aside className="w-64 shrink-0 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-background-dark flex flex-col">
      <div className="p-6 flex items-center gap-3 border-b border-slate-200 dark:border-slate-800">
        <div className="bg-primary p-1.5 rounded-lg flex items-center justify-center">
          <span className="material-symbols-outlined text-white text-2xl">
            auto_awesome
          </span>
        </div>
        <div>
          <h1 className="font-bold text-sm tracking-tight">AI OPTIMIZER</h1>
          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">
            v1.0.0
          </p>
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                isActive
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span className="text-sm">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
      <div className="p-4 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3 bg-slate-100 dark:bg-slate-800/50 p-2 rounded-xl">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold truncate dark:text-white">
              {user ? user.name : "Guest User"}
            </p>
            <p className="text-[10px] text-slate-500 truncate">
              {user ? user.email : "Not logged in"}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="p-1 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 flex justify-center items-center cursor-pointer transition-colors"
          >
            <span className="material-symbols-outlined text-slate-400 text-sm hover:text-red-500 transition-colors ">
              logout
            </span>
          </button>
        </div>
      </div>
    </aside>
  );
}
export default Sidebar;
