// components/auth/RequireAuth.tsx
import React from "react";
import { Navigate, useLocation } from "react-router";

type Props = {
  children: React.ReactElement;
  redirectTo?: string;
};

export function RequireAuth({ children, redirectTo = "/login" }: Props) {
  const location = useLocation();

  // Minimal check compatible with your current codebase (localStorage token)
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  if (!token) {
    // preserve where the user tried to go
    return <Navigate to={redirectTo} replace state={{ from: location }} />;
  }

  return children;
}

export default RequireAuth;
