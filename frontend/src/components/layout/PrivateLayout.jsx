import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import PublicHeader from "./Header";

function PrivateLayout() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <div className="relative min-h-screen overflow-hidden">

      {/* Glow Layer */}
      <div className="absolute inset-0 center-glow pointer-events-none z-0"></div>

      {/* Content */}
      <div className="relative z-10">
        <PublicHeader />
        <div className="pt-32 px-12">
          <Outlet />
        </div>
      </div>

    </div>
  );
}

export default PrivateLayout;