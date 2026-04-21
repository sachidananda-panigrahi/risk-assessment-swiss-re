import { useState } from "react";
import { Outlet } from "react-router";
import AppHeader from "./AppHeader";
import AppSidebar from "./AppSidebar";

const AppLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const sidebarWidth = collapsed ? 70 : 240;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <AppSidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />
      <div
        className="flex flex-col min-h-screen transition-all duration-300"
        style={{ marginLeft: sidebarWidth }}
      >
        <AppHeader />
        <main className="flex-1 p-6 w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
