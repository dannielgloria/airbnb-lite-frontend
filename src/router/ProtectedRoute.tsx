import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../state/auth/useAuth";
import { Skeleton } from "../components/ui/Skeleton";

export function ProtectedRoute() {
  const { user, isBootstrapping } = useAuth();
  const location = useLocation();

  if (isBootstrapping) {
    return (
        <div className="scpace-y-4">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-64 w-full" />
        </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return <Outlet />;
}