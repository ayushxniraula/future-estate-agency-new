import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useClientSession } from "../my-components/userclientsession";

export const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { session } = useClientSession();
  const location = useLocation();
  if (!session) {
    // Store intended redirect and trigger login modal on home page
    localStorage.setItem("postLoginRedirect", location.pathname);
    localStorage.setItem("showLoginModal", "true");
    return <Navigate to="/" replace />;
  }
  return children;
};
