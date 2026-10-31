import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";

type ProtectedRouteProps = {
  allowedRole: "admin" | "student";
};

export function ProtectedRoute({ allowedRole }: ProtectedRouteProps) {
  const currentUser = useAuthStore((state) => state.currentUser);
  const token = useAuthStore((state) => state.token);
  const location = useLocation();

  if (!currentUser || !token) {
    return (
      <Navigate
        to={`/login/${allowedRole}`}
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  if (currentUser.role !== allowedRole) {
    return <Navigate to={`/${currentUser.role}`} replace />;
  }

  return <Outlet />;
}
