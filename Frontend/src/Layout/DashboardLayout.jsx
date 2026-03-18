import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import NotificationBanner from "./NotificationBanner";
import PageLoader from "../components/Loader/PageLoader";

function DashboardLayout() {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground font-display relative transition-colors duration-300">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />
        <NotificationBanner />
        <main className="flex-1 overflow-y-auto p-8 bg-muted/20" data-lenis-prevent>

          <PageLoader>
            <Outlet />
          </PageLoader>
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
