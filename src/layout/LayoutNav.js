import React from "react";
import { UserOutlined, ScheduleOutlined } from "@ant-design/icons";

const menuItems = [
  {
    path: "/profilelist",
    icon: <UserOutlined />,
    text: "Users",
    permission: ["recruiter", "admin"],
  },
  {
    path: "/schedulelist",
    icon: <ScheduleOutlined />,
    text: "Schedule",
    permission: ["recruiter"],
  },
  {
    path: "/reschedulelist",
    icon: <ScheduleOutlined />,
    text: "Reschedule",
    permission: ["recruiter"],
  },
  {
    path: "/interview",
    icon: <ScheduleOutlined />,
    text: "Interview",
    permission: ["user"],
  },
  {
    path: "/userpanel",
    icon: <UserOutlined />,
    text: "My Account",
    permission: ["user"],
  },
  {
    path: "/recruiterpanel",
    icon: <UserOutlined />,
    text: "Recruiters",
    permission: ["admin"],
  },
];

export default menuItems;
