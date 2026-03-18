import React from "react";
import Navbar from "../components/Navbar/Navbar";
import { Outlet, useLocation } from "react-router-dom";
import Footer from "@/components/Footer/Footer";
import PageLoader from "../components/Loader/PageLoader";
function MainLayout() {
  const location = useLocation();
  const isDashboard = location.pathname === "/dashboard";
  return (
    <div className="dark bg-background-dark text-white selection:bg-primary/30 min-h-screen flex flex-col">
      {!isDashboard && (
        <Navbar />
      )}
      <div className="grow">
        <PageLoader>
          <Outlet />
        </PageLoader>
      </div>
      {isDashboard ? (
        null
      ) : <div className="mt-auto">
          <Footer />
        </div>}
    </div>
  );
}
export default MainLayout;
