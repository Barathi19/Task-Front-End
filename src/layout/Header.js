// Header.js
import React, { useEffect, useState } from "react";
import { Dropdown, Menu } from "antd";
import { LogoutOutlined, UserOutlined } from "@ant-design/icons";
import { imageFallBack } from "../constant/appConstant";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const [user, setUser] = useState({});
  const navigate = useNavigate();
  useEffect(() => {
    const userDetails = JSON.parse(localStorage.getItem("user"));
    user && setUser(userDetails);
  }, []);
  const userMenu = [
    {
      label: "Account",
      key: 1,
      icon: <UserOutlined />,
      onClick: () => navigate("/profilelist/profile"),
      hidden: "user",
    },
    {
      label: "Logout",
      key: 2,
      icon: <LogoutOutlined />,
    },
  ];
  const handleSelect = ({ key }) => {
    if (key == "2") {
      localStorage.clear();
      window.location.href = "/";
    }
  };

  return (
    <div className="bg-blue-950/[0.9] text-white p-4 ml-[1px]  w-[100%]">
      {/* Header content goes here */}
      {/* <div className="flex justify-end">
        <button
          type="button"
          className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-orange-400"
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
        {isProfileOpen && (
          <div className="absolute right-0 z-10 mt-10 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
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
      </div>  */}
      <div className="flex justify-end">
        <Dropdown
          overlay={
            <Menu onClick={handleSelect} className="w-28">
              {userMenu.map((item) =>
                user?.role !== item.hidden ? (
                  <Menu.Item
                    key={item.key}
                    icon={item.icon}
                    onClick={item.onClick}
                  >
                    {item.label}
                  </Menu.Item>
                ) : null
              )}
            </Menu>
          }
          trigger={["click"]}
          placement="bottomRight"
        >
          <div className="align-middle font-medium text-[15px] text-white flex items-center justify-center gap-3 mr-3 cursor-pointer">
            {user?.firstName || ""} {user?.lastName || ""}
            <img
              className="rounded-full h-[30px] w-[30px] object-cover ml-2.5"
              src={imageFallBack}
              alt="profile"
            />
          </div>
        </Dropdown>
      </div>
    </div>
  );
};

export default Header;
