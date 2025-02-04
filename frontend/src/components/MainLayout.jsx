import { Outlet } from "react-router-dom";
import LeftSidebar from "./LeftSidebar";

function MainLayout() {
  return (
    <div className="flex min-h-screen">
      {/* Left Sidebar - Fixed Width */}
      <LeftSidebar />

      {/* Main Content - Takes up remaining space */}
      <div className="flex-1 bg-gray-50 p-4">
        <Outlet />
      </div>
    </div>
  );
}

export default MainLayout;
