// Layout.js
import React from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import MainContent from "./MainContent";

const Layout = ({ children, user }) => {
  return (
    <div className="flex overflow-hidden w-full">
      <Sidebar user={user} />
      <div className="flex-1 flex flex-col h-[100vh]">
        <Header />
        <MainContent children={children} />
      </div>
    </div>
  );
};

export default Layout;
