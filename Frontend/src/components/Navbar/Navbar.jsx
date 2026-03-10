import React, { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

function Navbar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
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
    setUser(null);
    navigate("/");
  };
  return (
    <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-background-dark/70 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
            ResourceAI
          </span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600 dark:text-slate-400">
          <a
            className="hover:text-primary transition-colors"
            href="#features"
          >
            Features
          </a>
          <a
            className="hover:text-primary transition-colors"
            href="#how-it-works"
          >
            How It Works
          </a>
          <NavLink to="/documantation" className="hover:text-primary transition-colors">
            Documentation
          </NavLink>
        </div>
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-slate-300">
                Welcome, <span className="text-white font-bold">{user.name}</span>
              </span>
              <NavLink
                to="/dashboard"
                className="bg-primary/20 text-primary border border-primary/30 text-sm font-bold px-4 py-2 rounded-lg hover:bg-primary/30 transition-all flex items-center gap-2"
              >
                Dashboard
              </NavLink>
              <button
                onClick={handleLogout}
                className="text-sm font-medium text-slate-400 hover:text-red-400 transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <>
              <NavLink
                to="/login"
                className="text-sm font-medium px-4 py-2 hover:text-primary transition-colors"
              >
                Login
              </NavLink>
              <NavLink
                to="/signup"
                className="bg-primary text-white text-sm font-bold px-4 py-2 rounded-lg hover:brightness-110 transition-all flex items-center gap-2"
              >
                Register Now
              </NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
