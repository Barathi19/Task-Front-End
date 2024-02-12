import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import menuItems from "../../layout/LayoutNav";

function LandingPage() {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const [path, setPath] = useState(null);
  const permit =
    token &&
    user &&
    menuItems.filter((menu) => menu.permission.includes(user?.role));
  const nav = () => {
    if (permit) {
      console.log(permit, "permit");
      permit.length ? setPath(permit[0].path) : setPath("*");
    } else {
      setPath("/login");
    }
  };

  useEffect(() => {
    nav();
  }, []);

  return <Navigate to={path} />;
}

export default LandingPage;
