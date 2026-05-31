import { Navigate } from "react-router-dom";
import { useAuthStore } from "../stores/auth";
import { useEffect, useState } from "react";
import { getMe } from "../api/auth";

interface Props {
  children: React.ReactNode;
  requiredRole?: "admin" | "cashier";
}

export default function ProtectedRoute({ children, requiredRole }: Props) {
  const { user, accessToken, setAuth, clearAuth } = useAuthStore();
  const [checking, setChecking] = useState(!user && !!accessToken);

  useEffect(() => {
    if (!user && accessToken) {
      getMe()
        .then((me) => {
          setAuth(me, accessToken, localStorage.getItem("refresh_token") || "");
        })
        .catch(() => {
          clearAuth();
        })
        .finally(() => setChecking(false));
    }
  }, []);

  if (!accessToken) return <Navigate to="/login" replace />;
  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brown-950">
        <div className="text-gold-500 text-lg">Loading...</div>
      </div>
    );
  }
  if (requiredRole && user?.role !== requiredRole && !(requiredRole === "cashier" && user?.role === "admin")) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}