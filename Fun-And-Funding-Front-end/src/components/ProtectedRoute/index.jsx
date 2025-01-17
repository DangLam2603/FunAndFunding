/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import Cookies from "js-cookie";
import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ allowedRoles }) => {
  const userState = Cookies.get("_auth_state");
  const parsedUserState = userState ? JSON.parse(userState) : null;
  const role = parsedUserState ? parsedUserState.role : null;
  return allowedRoles[0].includes(role) ? <Outlet /> : <Navigate to="/error" />;
};

export default ProtectedRoute;
