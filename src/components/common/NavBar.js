import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { UserOutlined, ScheduleOutlined } from "@ant-design/icons";
import Header from "./Header";

// add more menu items as per requirement:
const menuItems = [
  { path: "/profilelist", icon: <UserOutlined />, text: "Profile List" },
  { path: "/schedulelist", icon: <ScheduleOutlined />, text: "Schedule List" },
];

const NavBar = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div
        className={`${
          isSidebarOpen ? "w-60" : "w-11"
        } text-white transition-all duration-300 ease-in-out overflow-hidden`}
        style={{ backgroundColor: "#572abf" }}
        onMouseEnter={() => setIsSidebarOpen(true)}
        onMouseLeave={() => setIsSidebarOpen(true)}
      >
        <div className="p-4"></div>
        <nav className="truncate flex flex-col mt-5">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`inline-block ${
                location.pathname === item.path ? "bg-indigo-300" : ""
              } p-3 transition bg-opacity-30`}
            >
              <div>
                {item.icon}
                <span className="text-indigo-100">&nbsp; &nbsp;{item.text}</span>
              </div>
            </Link>
          ))}
        </nav>
      </div>

      {/* Header */}
      <div className="flex-1 mt-3">
        <Header />
        {/* Main Content */}
        <div className="flex-1 p-3 mt-1 bg-gray-100" style={{ height: "93.8vh" }}>
          {/* Render children here */}
          {children}
        </div>
      </div>
    </div>
  );
};

export default NavBar;