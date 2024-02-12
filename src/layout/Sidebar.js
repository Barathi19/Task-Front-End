// Sidebar.js
import React from "react";
import { Link, useLocation } from "react-router-dom";
import menuItems from "./LayoutNav";
import Logo from "../assets/svg/dq-logo.svg";

const Sidebar = ({ user }) => {
  const location = useLocation();
  const permitNav = menuItems.filter((menu) => {
    return user?.role && menu.permission.some((role) => role === user?.role);
  });

  return (
    <div className="bg-blue-950/[0.9] text-white h-screen w-40">
      {/* Sidebar content goes here */}
      {/* Logo and text */}
      <div className="flex items-center justify-center">
        <img className="w-28" src={Logo} alt="" />
      </div>
      <nav className="truncate flex flex-col">
        {permitNav.map((item) => (
          <div className="flex" key={item.path}>
            {location.pathname === item.path ||
            item.path === `/${location.pathname?.split("/")[1]}` ? (
              <div className="bg-gray-100 w-1 h-12" />
            ) : null}
            <Link
              key={item.path}
              to={item.path}
              className={`inline-block ${
                location.pathname === item.path ||
                item.path === `/${location.pathname?.split("/")[1]}`
                  ? "bg-indigo-300 text-white-800"
                  : "text-indigo-100/[0.5] ml-1"
              } p-3 transition w-full bg-opacity-30`}
            >
              <div>
                {item.icon}
                <span
                  className={`${
                    location.pathname === item.path ||
                    item.path === `/${location.pathname?.split("/")[1]}`
                      ? "text-white-800"
                      : "text-indigo-100/[0.5]"
                  } hover:text-white-600`}
                >
                  &nbsp; &nbsp;{item.text}
                </span>
              </div>
            </Link>
          </div>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
