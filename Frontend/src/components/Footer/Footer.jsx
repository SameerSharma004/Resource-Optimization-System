import React from "react";
import { NavLink } from "react-router-dom";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black text-white ">
      <div className="mx-auto px-4 pt-10 flex flex-col gap-10">
        <div className="flex justify-around gap-8 mb-8">
          <div>
            <h3 className="text-7xl font-bold mb-2">EnergySaver</h3>
            <p className="text-gray-400">
              Helping you save energy and reduce costs.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li className="text-gray-400 hover:text-white">
                <NavLink to={"/dashboard"}>Dashboard</NavLink>
              </li>
              <li className="text-gray-400 hover:text-white">
                <NavLink to={"/dashboard"}>Documantation</NavLink>
              </li>
            </ul>
          </div>

          
        </div>

        <div className="border-t border-gray-700 pt-10 flex justify-center">
          <p className="text-center text-gray-400">
            &copy; {currentYear} EnergySaver. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
