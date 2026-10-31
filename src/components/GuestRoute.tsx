import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";

export function GuestRoute() {
  const currentUser = useAuthStore((state) => state.currentUser);
  const token = useAuthStore((state) => state.token);

  if (currentUser && token) {
    return <Navigate to={`/${currentUser.role}`} replace />;
  }

  return <Outlet />;
}
