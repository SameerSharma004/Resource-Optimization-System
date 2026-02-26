import React from "react";
import Navbar from "../components/Navbar/Navbar";
import { Outlet, useLocation } from "react-router-dom";
import Footer from "@/components/Footer/Footer";
function MainLayout() {
  const location = useLocation();
  const isDashboard = location.pathname === "/dashboard";

  return (
    <div className="">
      {!isDashboard && (
        <div className="fixed top-5 left-0 right-0 z-50 bg-none flex justify-center py-4">
          <Navbar />
        </div>
      )}
      <div>
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
