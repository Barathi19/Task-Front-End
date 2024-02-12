import React from "react";
import LandingPage from "../pages/landingPage";
import Login from "../pages/login";
import PrivateRoute from "../privateRouter";
import ErrorRoute from "../components/common/errorRoute";
import { useRoutes } from "react-router-dom";
import ProfileList from "../pages/profileList";
import ScheduleList from "../pages/scheduleList";
import RescheduleList from "../pages/rescheduleList";
import Profile from "../pages/profile";
import InterviewPanel from "../pages/interviewPanel";
import InterviewSchedule from "../pages/interviewSchedule";
import ReScheduleInterview from "../pages/reScheduleInterview";
import RecruiterList from "../pages/recruiterList";

const routes = [
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/",
    element: <PrivateRoute />,
    children: [
      {
        path: "/profilelist",
        element: <ProfileList />,
      },
      {
        path: "/schedulelist",
        element: <ScheduleList />,
      },
      {
        path: "/userpanel",
        element: <Profile />,
      },
      {
        path: "/reschedulelist",
        element: <RescheduleList />,
      },
      {
        path: "/profilelist/:id",
        element: <Profile />,
      },
      {
        path: "/profilelist/profile",
        element: <Profile />,
      },
      {
        path: "/schedulelist/view/:id",
        element: <ReScheduleInterview />,
      },
      {
        path: "/interview",
        element: <InterviewPanel />,
      },
      {
        path: "/profilelist/createinterview/:id",
        element: <InterviewSchedule />,
      },
      {
        path: "/schedulelist/edit/:id",
        element: <InterviewSchedule />,
      },
      {
        path: "/interview/:id",
        element: <ReScheduleInterview />,
      },
      {
        path: "/recruiterpanel",
        element: <RecruiterList />,
      },
    ],
  },
  {
    path: "*",
    element: <ErrorRoute />,
  },
];

function Routes() {
  const content = useRoutes(routes);
  return content;
}

export default Routes;
