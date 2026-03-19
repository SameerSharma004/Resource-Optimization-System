import React, { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight, LogOut, LayoutDashboard, Download as DownloadIcon, BookOpen, Home as HomeIcon } from "lucide-react";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

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
    setIsMobileMenuOpen(false);
    navigate("/");
  };

  const isHomePage = location.pathname === "/";
  const isAuthPage = location.pathname === "/login" || location.pathname === "/signup";

  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 px-6 py-4 md:px-12 flex justify-between items-center transition-all duration-500 ${
          isScrolled
            ? "bg-black/80 backdrop-blur-2xl border-b border-white/5 py-3"
            : "bg-transparent py-6"
        }`}
      >
        <NavLink to="/" className="flex items-center gap-2 group relative z-50" onClick={closeMenu}> 
          <span className="text-xl md:text-2xl font-bold tracking-tighter text-white">
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
                <a href="#features" className="hover:text-white transition-colors">Features</a>
                <a href="#how-it-works" className="hover:text-white transition-colors">How it Works</a>
                <NavLink to="/documentation" className="hover:text-white transition-colors">Documentation</NavLink>
                <NavLink to="/download" className="hover:text-white transition-colors">Download</NavLink>
              </>
            ) : (
              <>
                <NavLink to="/" className="hover:text-white transition-colors">Home</NavLink>
                <NavLink to="/documentation" className="hover:text-white transition-colors">Documentation</NavLink>
                <NavLink to="/download" className="hover:text-white transition-colors">Download</NavLink>
              </>
            )}
          </div>
        )}

        {!isAuthPage && (
          <div className="flex items-center gap-4 md:gap-6 relative z-50">
            {user ? (
              <div className="hidden md:flex items-center gap-4">
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
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-6">
                <NavLink to="/login" className="text-white/50 hover:text-white text-sm font-bold transition-colors">Sign in</NavLink>
                <NavLink to="/signup" className="bg-white text-black px-8 py-3 rounded-full text-sm font-black tracking-tight hover:scale-105 transition-all shadow-xl shadow-white/5">Get Started</NavLink>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden size-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        )}
      </nav>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMenu}
              className="fixed inset-0 bg-black/90 backdrop-blur-xl z-45 lg:hidden"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-[85%] max-w-sm bg-background-dark/50 border-l border-white/5 z-50 p-8 flex flex-col lg:hidden"
            >
              <div className="mt-20 flex flex-col gap-6 flex-1">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 border-b border-white/5 pb-4">Navigation</p>
                
                <div className="flex flex-col gap-2 text-2xl font-black text-white/80">
                  {isHomePage ? (
                    <>
                      <a href="#features" onClick={closeMenu} className="flex items-center justify-between hover:text-primary transition-colors py-2">Features <ArrowRight size={20} className="text-white/20" /></a>
                      <a href="#how-it-works" onClick={closeMenu} className="flex items-center justify-between hover:text-primary transition-colors py-2">How it Works <ArrowRight size={20} className="text-white/20" /></a>
                    </>
                  ) : (
                    <NavLink to="/" onClick={closeMenu} className="flex items-center justify-between hover:text-primary py-2"><span className="flex items-center gap-3"><HomeIcon size={20} /> Home</span> <ArrowRight size={20} className="text-white/20" /></NavLink>
                  )}
                  <NavLink to="/documentation" onClick={closeMenu} className="flex items-center justify-between hover:text-primary py-2"><span className="flex items-center gap-3"><BookOpen size={20} /> Docs</span> <ArrowRight size={20} className="text-white/20" /></NavLink>
                  <NavLink to="/download" onClick={closeMenu} className="flex items-center justify-between hover:text-primary py-2"><span className="flex items-center gap-3"><DownloadIcon size={20} /> Agent</span> <ArrowRight size={20} className="text-white/20" /></NavLink>
                </div>

                <div className="mt-auto flex flex-col gap-4 border-t border-white/5 pt-8">
                  {user ? (
                    <>
                      <NavLink
                        to="/dashboard"
                        onClick={closeMenu}
                        className="bg-primary text-black py-4 rounded-2xl text-center font-black tracking-tighter flex items-center justify-center gap-2"
                      >
                        <LayoutDashboard size={18} /> Enter Dashboard
                      </NavLink>
                      <button
                        onClick={handleLogout}
                        className="border border-white/10 text-white/60 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-white/5 transition-all"
                      >
                        <LogOut size={16} /> Logout Account
                      </button>
                    </>
                  ) : (
                    <div className="flex flex-col gap-4">
                      <NavLink
                        to="/signup"
                        onClick={closeMenu}
                        className="bg-white text-black py-4 rounded-2xl text-center font-black tracking-tighter"
                      >
                        Get Started
                      </NavLink>
                      <NavLink
                        to="/login"
                        onClick={closeMenu}
                        className="border border-white/10 text-white py-4 rounded-2xl text-center font-bold"
                      >
                        Sign In
                      </NavLink>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
