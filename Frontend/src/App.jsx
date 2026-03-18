import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import About from "./pages/About/About";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import MainLayout from "./Layout/MainLayout";
import DashboardLayout from "./Layout/DashboardLayout";
import Download from "./pages/Download/Download";
import Overview from "./pages/Dashboard/Overview";
import Metrics from "./pages/Dashboard/Metrics";
import Processes from "./pages/Dashboard/Processes";
import Network from "./pages/Dashboard/Network";
import Insights from "./pages/Dashboard/Insights";
import Settings from "./pages/Dashboard/Settings";
import PageLoader from "./components/Loader/PageLoader";
import Documentation from "./pages/Documentation/Documentation";
import ScrollToTop from "./components/ScrollToTop/ScrollToTop";
import "lenis/dist/lenis.css";
import { useSmoothScroll } from "./lib/useSmoothScroll";

const App = () => {
  useSmoothScroll();
  
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<PageLoader><Home /></PageLoader>} />
        <Route path="/login" element={<PageLoader><Login /></PageLoader>} />
        <Route path="/signup" element={<PageLoader><Signup /></PageLoader>} />
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Overview />} />
          <Route path="metrics" element={<Metrics />} />
          <Route path="processes" element={<Processes />} />
          <Route path="network" element={<Network />} />
          <Route path="insights" element={<Insights />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        <Route element={<MainLayout />}>
          <Route path="/about" element={<About />} />
          <Route path="/documentation" element={<Documentation />} />
          <Route path="/download" element={<Download />} />
        </Route>
      </Routes>
    </Router>
  );
};
export default App;
