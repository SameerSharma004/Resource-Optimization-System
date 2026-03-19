import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
function Footer() {
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
  return (
    <footer className="bg-primary rounded-[40px] mt-48 px-10 pt-48 pb-12 relative text-black">
      <div className="absolute left-1/2 -translate-x-1/2 -top-32 w-[800px] max-w-[90%] z-20">
        <div className="bg-white rounded-[28px] shadow-2xl p-12 text-center border border-black/5">
          <h2 className="text-4xl font-black leading-tight tracking-tight text-background-dark">
            Improve your system <br />
            with neural <span className="text-primary italic font-serif font-normal lowercase">optimization</span>
          </h2>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link 
              to="/download"
              className="bg-background-dark flex justify-center items-center text-white px-8 py-4 rounded-full font-black uppercase tracking-widest text-xs hover:scale-105 transition-transform shadow-xl shadow-black/5"
            >
              Download Agent
            </Link>
            {user ? (
              <Link 
                to="/dashboard"
                className="bg-white text-background-dark border-2 border-background-dark px-8 py-4 rounded-full font-black uppercase tracking-widest text-xs hover:bg-gray-50 transition-colors"
              >
                Go to Dashboard
              </Link>
            ) : (
              <Link 
                to="/signup"
                className="bg-white text-background-dark border-2 border-background-dark px-8 py-4 rounded-full font-black uppercase tracking-widest text-xs hover:bg-gray-50 transition-colors"
              >
                Create Account
              </Link>
            )}
          </div>
        </div>
      </div>
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start mt-20 gap-16 md:gap-0">
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-3 font-black text-2xl tracking-tighter text-background-dark">
            <div className="w-5 h-5 bg-background-dark rounded-full"></div>
            Serial Resource Optimizer
          </div>
          <p className="max-w-[200px] text-sm font-medium text-background-dark/60 leading-relaxed">
            Improving system performance with kernel-level AI.
          </p>
        </div>
        <div className="flex flex-wrap gap-16 md:gap-32 text-sm text-background-dark">
          <div>
            <h4 className="font-black text-xs uppercase tracking-widest mb-6 opacity-40">MENU</h4>
            <ul className="space-y-3 font-bold">
              <li><a href="#features" className="hover:opacity-60 transition-opacity">Features</a></li>
              <li><Link to="/documentation" className="hover:opacity-60 transition-opacity">Documentation</Link></li>
              <li><Link to="/download" className="hover:opacity-60 transition-opacity">Download Agent</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-black text-xs uppercase tracking-widest mb-6 opacity-40">COMPANY</h4>
            <ul className="space-y-3 font-bold">
              <li><Link to="/login" className="hover:opacity-60 transition-opacity">Sign in</Link></li>
              <li><Link to="/signup" className="hover:opacity-60 transition-opacity">Register</Link></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="text-center text-xs font-bold text-background-dark/40 mt-20 pt-8 border-t border-background-dark/10">
        © 2026 AI Optimizer. All rights reserved.
      </div>
    </footer>
  );
}
export default Footer;
