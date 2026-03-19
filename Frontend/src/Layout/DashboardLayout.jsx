import React, { useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import NotificationBanner from "./NotificationBanner";
import PageLoader from "../components/Loader/PageLoader";

function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground font-display relative transition-colors duration-300">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header toggleSidebar={toggleSidebar} />
        <NotificationBanner />
        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-muted/20" data-lenis-prevent>
          <PageLoader>
            <Outlet />
          </PageLoader>
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
