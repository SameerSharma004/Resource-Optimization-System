import React, { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
export default function Navbar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
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
  const isHomePage = location.pathname === "/";
  return (
    <nav
      className="fixed top-8 left-1/2 -translate-x-1/2 z-50
      w-[1100px] max-w-[95%] bg-background-dark backdrop-blur-2xl text-white
      px-10 py-4 rounded-full flex justify-between items-center border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
    >
      <NavLink to="/" className="flex items-center gap-3 group">
        <div className="relative">
          <div className="w-4 h-4 bg-primary rounded-full group-hover:scale-125 transition-transform duration-500"></div>
          <div className="absolute inset-0 bg-primary blur-md opacity-0 group-hover:opacity-50 transition-opacity"></div>
        </div>
        <span className="font-black text-xl tracking-tighter text-white">
          AI{" "}
          <span className="text-primary italic font-serif font-normal">
            Optimizer
          </span>
        </span>
      </NavLink>
      <div className="hidden md:flex gap-10 text-gray-400 text-sm font-bold uppercase tracking-widest">
        {isHomePage ? (
          <>
            <a href="#features" className="hover:text-white transition-colors">
              Features
            </a>
            <a
              href="#how-it-works"
              className="hover:text-white transition-colors"
            >
              How it Works
            </a>
            <NavLink
              to="/documentation"
              className="hover:text-white transition-colors"
            >
              Docs
            </NavLink>
            <NavLink
              to="/download"
              className="hover:text-white transition-colors"
            >
              Download
            </NavLink>
          </>
        ) : (
          <>
            <NavLink to="/" className="hover:text-white transition-colors">
              Home
            </NavLink>
            <NavLink
              to="/documentation"
              className="hover:text-white transition-colors"
            >
              Docs
            </NavLink>
            <NavLink
              to="/download"
              className="hover:text-white transition-colors"
            >
              Download
            </NavLink>
          </>
        )}
      </div>
      <div className="flex items-center gap-8">
        {user ? (
          <div className="flex items-center gap-5">
            <span className="text-gray-500 text-xs font-black uppercase tracking-widest hidden sm:inline">
              User:{" "}
              <span className="text-white">{user.name.split(" ")[0]}</span>
            </span>
            <div className="flex items-center gap-1 bg-white/5 p-1 rounded-full border border-white/5">
              <NavLink
                to="/dashboard"
                className="bg-white text-black px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest hover:bg-gray-200 transition-colors"
              >
                Dashboard
              </NavLink>
              <button
                onClick={handleLogout}
                className="bg-primary size-8 rounded-full flex items-center justify-center hover:brightness-110 transition-all text-white"
                title="Logout"
              >
                <span className="material-symbols-outlined text-sm">
                  logout
                </span>
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-8">
            <NavLink
              to="/login"
              className="text-gray-400 text-xs font-black uppercase tracking-widest hover:text-white transition-colors"
            >
              Sign in
            </NavLink>
            <NavLink
              to="/signup"
              className="flex items-center bg-primary text-black rounded-full gap-2 overflow-hidden group hover:scale-105 transition-all"
            >
              <div className=" bg-white  px-3 py-2 rounded-full">
                <span className="text-xs font-black uppercase tracking-widest">
                  Register
                </span>
              </div>
              <div className="flex items-center pr-2">
                <span className="material-symbols-outlined text-white text-lg group-hover:translate-x-1 transition-transform">
                  arrow_right_alt
                </span>
              </div>
            </NavLink>
          </div>
        )}
      </div>
    </nav>
  );
}
