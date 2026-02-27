import React from "react";
import { NavLink } from "react-router-dom";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black text-white border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-3xl font-bold mb-4">Resource Optimization System</h3>
            <p className="text-gray-400 leading-relaxed max-w-sm">
              Real-time AI-based system monitoring and optimization platform.
              Leveraging LSTM deep learning which help you to enhance power efficiency and
              performance.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Navigation</h4>
            <ul className="space-y-3 text-gray-400">
              <li>
                <NavLink to="/" className="hover:text-white transition-colors">
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/dashboard"
                  className="hover:text-white transition-colors"
                >
                  Dashboard
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/about"
                  className="hover:text-white transition-colors"
                >
                  Documentation
                </NavLink>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Technology</h4>
            <ul className="space-y-3 text-gray-400">
              <li>LSTM Neural Networks</li>
              <li>Real-time Telemetry</li>
              <li>Predictive Analytics</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            &copy; {currentYear} EnergySaver. All rights reserved.
          </p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <span className="text-gray-500 text-sm hover:text-white cursor-pointer transition-colors">
              Privacy Policy
            </span>
            <span className="text-gray-500 text-sm hover:text-white cursor-pointer transition-colors">
              Terms of Service
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
