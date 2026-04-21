import { useState } from "react";
import { Link, useLocation } from "react-router";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path: string;
  hasChevron?: boolean;
};

function DashboardIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}

function ProductIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    </svg>
  );
}

function CustomersIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function IncomeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );
}

function PromoteIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function HelpIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <line x1="12" y1="17" x2="12.01" y2="17" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

const navItems: NavItem[] = [
  { name: "Dashboard", icon: <DashboardIcon />, path: "/" },
  { name: "Customers", icon: <CustomersIcon />, path: "/customers" },
  { name: "Product",   icon: <ProductIcon />,   path: "/product" },
  { name: "Income",    icon: <IncomeIcon />,    path: "/income" },
  { name: "Promote",   icon: <PromoteIcon />,   path: "/promote" },
  { name: "Help",      icon: <HelpIcon />,      path: "/help" },
];

// Export so AppLayout can consume
export let sidebarWidth = 240;

interface AppSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const AppSidebar: React.FC<AppSidebarProps> = ({ collapsed, onToggle }) => {
  const location = useLocation();
  const width = collapsed ? 70 : 240;

  const isActive = (path: string) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <aside
      className="fixed top-0 left-0 h-screen bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 flex flex-col z-50 transition-all duration-300 overflow-hidden"
      style={{ width }}
    >
      {/* Logo + toggle */}
      <div className={`flex items-center h-16 px-4 border-b border-gray-100 dark:border-gray-800 ${collapsed ? "justify-center" : "justify-between"}`}>
        {!collapsed && (
          <Link to="/" className="flex items-center gap-2 min-w-0">
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none" className="flex-shrink-0">
              <path d="M16 2L29.856 9.5V24.5L16 32L2.144 24.5V9.5L16 2Z" fill="#465fff" />
              <path d="M16 8L23.928 12.5V21.5L16 26L8.072 21.5V12.5L16 8Z" fill="white" fillOpacity="0.3" />
            </svg>
            <span className="text-sm font-bold text-gray-800 dark:text-white whitespace-nowrap">
              Dashboard <span className="text-[10px] text-gray-400 font-medium">v.01</span>
            </span>
          </Link>
        )}
        {collapsed && (
          <Link to="/">
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
              <path d="M16 2L29.856 9.5V24.5L16 32L2.144 24.5V9.5L16 2Z" fill="#465fff" />
              <path d="M16 8L23.928 12.5V21.5L16 26L8.072 21.5V12.5L16 8Z" fill="white" fillOpacity="0.3" />
            </svg>
          </Link>
        )}
        {!collapsed && (
          <button
            onClick={onToggle}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex-shrink-0"
            title="Collapse sidebar"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
        )}
      </div>

      {/* Collapsed: expand button */}
      {collapsed && (
        <div className="flex justify-center py-2 border-b border-gray-100 dark:border-gray-800">
          <button
            onClick={onToggle}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            title="Expand sidebar"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      )}

      {/* Nav items */}
      <nav className={`flex flex-col gap-0.5 flex-1 py-4 ${collapsed ? "px-2 items-center" : "px-3"}`}>
        {navItems.map((item) => {
          const active = isActive(item.path);
          return (
            <Link
              key={item.name}
              to={item.path}
              title={collapsed ? item.name : undefined}
              className={`flex items-center rounded-lg transition-all duration-150 group relative
                ${collapsed ? "w-10 h-10 justify-center" : "gap-3 px-3 py-2.5"}
                ${active
                  ? "bg-brand-500 text-white"
                  : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-200"
                }`}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              {!collapsed && (
                <>
                  <span className="text-sm font-medium flex-1 whitespace-nowrap">{item.name}</span>
                  {item.hasChevron && (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-50">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  )}
                </>
              )}
              {/* Tooltip when collapsed */}
              {collapsed && (
                <span className="pointer-events-none absolute left-[52px] whitespace-nowrap rounded-md bg-gray-900 px-2 py-1 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity z-50">
                  {item.name}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Upgrade to PRO — only when expanded */}
      {!collapsed && (
        <div className="mx-3 mb-4">
          <div className="rounded-2xl p-4 text-center text-white" style={{ background: "linear-gradient(135deg, #7c3aed 0%, #465fff 100%)" }}>
            <p className="text-xs font-semibold leading-snug mb-3">
              Upgrade to <span className="font-bold">PRO</span> to get<br />access all Features!
            </p>
            <button className="w-full bg-white text-brand-600 text-xs font-bold py-2 rounded-lg hover:bg-gray-50 transition-colors">
              Get Pro Now!
            </button>
          </div>
        </div>
      )}

      {/* User footer */}
      <div className={`border-t border-gray-100 dark:border-gray-800 ${collapsed ? "py-3 flex justify-center" : "p-3"}`}>
        <Link
          to="/profile"
          className={`flex items-center rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors
            ${collapsed ? "w-10 h-10 justify-center" : "gap-3 px-2 py-2"}`}
          title={collapsed ? "Profile" : undefined}
        >
          <img
            src="/images/user/owner.jpg"
            onError={(e) => {
              const t = e.currentTarget;
              t.onerror = null;
              t.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='36' height='36' viewBox='0 0 36 36'%3E%3Ccircle cx='18' cy='18' r='18' fill='%23e4e7ec'/%3E%3Cpath d='M18 10a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 13c5.523 0 10 2.477 10 4v1H8v-1c0-1.523 4.477-4 10-4z' fill='%2398a2b3'/%3E%3C/svg%3E";
            }}
            alt="Evano"
            className="w-9 h-9 rounded-full object-cover flex-shrink-0"
          />
          {!collapsed && (
            <>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 dark:text-white truncate">Evano</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 truncate">Project Manager</p>
              </div>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 flex-shrink-0">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </>
          )}
        </Link>
      </div>
    </aside>
  );
};

export default AppSidebar;
