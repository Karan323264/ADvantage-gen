import { Routes, Route } from "react-router-dom";
import LandingPage from "./features/landing/LandingPage";
import DashboardPage from "./features/dashboard/DashBoardPage";
import CampaignHistory from "./features/dashboard/CampaignHistory";
import PrivateLayout from "./components/layout/PrivateLayout";
import ProtectedRoute from "./components/layout/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />

      {/* Dashboard */}
      <Route element={<PrivateLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
      </Route>

      {/* History */}
      <Route
        path="/dashboard/history"
        element={
          <ProtectedRoute>
            <CampaignHistory />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;