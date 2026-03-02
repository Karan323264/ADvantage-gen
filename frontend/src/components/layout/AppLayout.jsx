import { Outlet } from "react-router-dom";
import Header from "./Header";

function AppLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="w-full">
        <Outlet />
      </main>
    </div>
  );
}
export default AppLayout;