import React from "react";
import Navbar from "../components/Navbar/Navbar";
import { Outlet, useLocation } from "react-router-dom";
import Footer from "@/components/Footer/Footer";
function MainLayout() {
  const location = useLocation();
  const isDashboard = location.pathname === "/dashboard";

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen">
      {!isDashboard && (
        <Navbar />
      )}
      <div className="pt-24 min-h-[calc(100vh-100px)]">
        <Outlet />
      </div>
      {isDashboard ? (
        null
      ) : <div className="">
          <Footer />
        </div>}
    </div>
  );
}

export default MainLayout;
