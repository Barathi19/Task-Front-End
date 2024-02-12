import React, { useState } from "react";

const Header = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleClick = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const signOut = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div className="ml-auto mr-4">
      <div className="ml-80">
        <div className="ml-80">
          <div className="ml-80">
            <button
              type="button"
              className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-orange-400 ml-10"
              id="user-menu-button"
              aria-expanded="false"
              aria-haspopup="true"
              onClick={handleClick}
            >
              <span className="absolute -inset-1.5"></span>
              <span className="sr-only">Open user menu</span>
              <img
                className="h-8 w-8 rounded-full"
                src="https://img.freepik.com/premium-vector/people-icon-person-symbol-vector-illustration_276184-166.jpg?size=626&ext=jpg&ga=GA1.1.1469926222.1706540669&semt=ais"
                alt=""
              />
            </button>
          </div>
        </div>
      </div>
      {isProfileOpen && (
        <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <a
            href="#"
            className="block px-4 py-2 text-sm text-gray-700"
            role="menuitem"
            tabIndex="-1"
            id="user-menu-item-0"
          >
            Your Profile
          </a>
          <a
            href="#"
            className="block px-4 py-2 text-sm text-gray-700"
            role="menuitem"
            tabIndex="-1"
            id="user-menu-item-1"
          >
            Settings
          </a>
          <a
            href="#"
            className="block px-4 py-2 text-sm text-gray-700"
            role="menuitem"
            tabIndex="-1"
            id="user-menu-item-2"
            onClick={signOut}
          >
            Sign out
          </a>
        </div>
      )}
    </div>
  );
};

export default Header;
