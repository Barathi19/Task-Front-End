import React, { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import ErrorRoute from "../components/common/errorRoute";
import Layout from "../layout/Layout";
import menuItems from "../layout/LayoutNav";

function PrivateRoute() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const isPermit = menuItems.some((menu) =>
    (menu.path && menu.path === pathname) ||
    menu.path === `/${pathname.split("/")[1]}`
      ? menu.permission.includes(user?.role)
      : false
  );

  useEffect(() => {
    if (!token || !user) {
      navigate("/");
    }
  }, []);
  return isPermit ? (
    <>
      <Layout user={user}>
        <Outlet />
      </Layout>
    </>
  ) : (
    <ErrorRoute />
  );
}

export default PrivateRoute;
