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
import Alerts from "./pages/Dashboard/Alerts";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Overview />} />
          <Route path="metrics" element={<Metrics />} />
          <Route path="processes" element={<Processes />} />
          <Route path="network" element={<Network />} />
          <Route path="insights" element={<Insights />} />
          <Route path="alerts" element={<Alerts />} />
        </Route>

        <Route element={<MainLayout />}>
          <Route path="/about" element={<About />} />
          <Route path="/download" element={<Download />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
