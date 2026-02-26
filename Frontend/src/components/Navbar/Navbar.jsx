import React, { useState } from "react";
import { motion as Motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link, NavLink, useLocation } from "react-router-dom";

function Navbar() {
  const location = useLocation();

  return (
    <Motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="flex w-full max-w-7xl justify-between items-center px-10 border-gray-300/25 bg-gray-900/20 border rounded-full backdrop-blur-lg"
    >
      <Motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Link
          to="/"
          className="text-xl font-bold hover:opacity-80 transition text-white"
        >
          Energy Optimization System
        </Link>
      </Motion.div>
      <Motion.div
        className="flex flex-wrap items-center justify-center gap-3 m-2"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            isActive
              ? "inline-flex items-center gap-2 rounded-full  px-5 py-3 font-semibold text-emerald-950 shadow-lg shadow-emerald-500/30 transition hover:-translate-y-0.5"
              : "inline-flex items-center gap-2 rounded-full   px-5 py-3 font-semibold text-white bg-gray-900 transition hover:-translate-y-0.5"
          }
        >
          {location.pathname === "/dashboard" ? "Home" : "Open Dashboard"}
          <ArrowRight size={18} />
        </NavLink>
        <NavLink
          to="/about"
          className="inline-flex items-center rounded-full   px-5 py-3 font-semibold bg-gray-900 text-white transition hover:-translate-y-0.5"
        >
          Documentation
        </NavLink>
      </Motion.div>
    </Motion.div>
  );
}

export default Navbar;
