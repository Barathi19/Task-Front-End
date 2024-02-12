// MainContent.js
import React from "react";

const MainContent = ({ children }) => {
  return (
    <div className="p-4 overflow-auto w-[100%]">
      {/* Main content goes here */}
      {/* Main Content */}
      {children}
    </div>
  );
};

export default MainContent;
