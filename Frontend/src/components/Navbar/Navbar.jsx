import React, { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
export default function Navbar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    const storedUser =
      localStorage.getItem("user") || sessionStorage.getItem("user");
    if (storedUser && storedUser !== "undefined") {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse user from localStorage", error);
      }
    }
  }, []);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
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
  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/signup";
  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 px-6 py-4 md:px-12 flex justify-between items-center transition-all duration-300 ${
        isScrolled
          ? "bg-background-dark/80 backdrop-blur-xl border-b border-white/5 py-3"
          : "bg-transparent py-6"
      }`}
    >
      <NavLink to="/" className="flex items-center gap-2 group"> 
        <span className="font- text-2xl tracking-tighter text-white">
          Serial Resource
          <span className="text-primary italic font-serif font-medium ml-1">
            Optimizer
          </span>
        </span>
      </NavLink>

      {!isAuthPage && (
        <div className="hidden lg:flex items-center gap-10 text-white/50 text-sm font-bold tracking-tight">
          {isHomePage ? (
            <>
              <a
                href="#features"
                className="hover:text-white transition-colors"
              >
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
                Documentation
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
                Documentation
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
      )}

      {!isAuthPage && (
        <div className="flex items-center gap-6">
          {user ? (
            <div className="flex items-center gap-4">
              <NavLink
                to="/dashboard"
                className="bg-primary text-black px-6 py-2.5 rounded-full text-sm font-black tracking-tight hover:scale-105 transition-all shadow-lg shadow-primary/20"
              >
                Dashboard
              </NavLink>
              <button
                onClick={handleLogout}
                className="size-10 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white transition-all"
              >
                <span className="material-symbols-outlined text-xl">
                  logout
                </span>
              </button>
            </div>
          ) : (
            <>
              <NavLink
                to="/login"
                className="text-white/50 hover:text-white text-sm font-bold hidden md:block transition-colors"
              >
                Sign in
              </NavLink>
              <NavLink
                to="/signup"
                className="bg-white text-black px-8 py-3 rounded-full text-sm font-black tracking-tight hover:scale-105 transition-all shadow-xl shadow-white/5"
              >
                Get Started
              </NavLink>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
