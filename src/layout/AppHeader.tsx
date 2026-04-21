import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { useRbac } from "../context/RbacContext";
import type { UserRole } from "../types/rbac";

function BellIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

const ROLES: UserRole[] = ["admin", "agent", "viewer"];
const roleBadgeColors: Record<UserRole, string> = {
  admin: "bg-brand-500 text-white",
  agent: "bg-warning-400 text-white",
  viewer: "bg-gray-400 text-white",
};

const AppHeader: React.FC = () => {
  const [notifOpen, setNotifOpen] = useState(false);
  const [roleOpen, setRoleOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const roleRef = useRef<HTMLDivElement>(null);
  const { currentRole, setRole } = useRbac();

  // Close notification dropdown on outside click
  useEffect(() => {
    if (!notifOpen) return;
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [notifOpen]);

  // Close role dropdown on outside click
  useEffect(() => {
    if (!roleOpen) return;
    const handler = (e: MouseEvent) => {
      if (roleRef.current && !roleRef.current.contains(e.target as Node)) {
        setRoleOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [roleOpen]);

  return (
    <header className="sticky top-0 z-40 flex w-full items-center justify-between bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-6 py-4 h-16">
      {/* Greeting */}
      <div>
        <h1 className="text-lg font-semibold text-gray-800 dark:text-white leading-tight">
          Hello Evano{" "}
          <span role="img" aria-label="wave">
            👋
          </span>
          ,
        </h1>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Welcome back!</p>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative hidden sm:flex items-center">
          <span className="absolute left-3 text-gray-400 pointer-events-none">
            <SearchIcon />
          </span>
          <input
            ref={inputRef}
            type="text"
            placeholder="Search..."
            className="h-9 w-48 md:w-64 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 pl-9 pr-4 text-sm text-gray-700 dark:text-gray-200 placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-500/10 transition-all"
          />
          <span className="absolute right-2.5 rounded border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-1.5 py-0.5 text-[10px] text-gray-400 hidden md:inline">
            ⌘K
          </span>
        </div>

        {/* RBAC Role Switcher — for demo/evaluation */}
        <div ref={roleRef} className="relative hidden sm:block">
          <button
            onClick={() => setRoleOpen(!roleOpen)}
            className="flex items-center gap-1.5 h-7 px-2.5 rounded-full border border-gray-200 dark:border-gray-700 text-xs font-medium transition-colors hover:border-gray-300 dark:hover:border-gray-600"
          >
            <span className={`inline-block w-2 h-2 rounded-full ${roleBadgeColors[currentRole].split(" ")[0]}`} />
            <span className="text-gray-600 dark:text-gray-300 capitalize">{currentRole}</span>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
          </button>
          {roleOpen && (
            <div className="absolute right-0 top-9 z-50 w-36 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-lg py-1 overflow-hidden">
              <p className="px-3 py-1.5 text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide">Switch Role</p>
              {ROLES.map((role) => (
                <button
                  key={role}
                  onClick={() => { setRole(role); setRoleOpen(false); }}
                  className={`w-full flex items-center gap-2 px-3 py-2 text-xs transition-colors
                    ${currentRole === role
                      ? "text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-500/10 font-semibold"
                      : "text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                    }`}
                >
                  <span className={`inline-block w-2 h-2 rounded-full ${roleBadgeColors[role].split(" ")[0]}`} />
                  <span className="capitalize">{role}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notification bell */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative flex items-center justify-center w-9 h-9 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Notifications"
          >
            <BellIcon />
            {/* Unread dot */}
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-500 ring-2 ring-white dark:ring-gray-900" />
          </button>

          {notifOpen && (
            <div className="absolute right-0 top-11 w-72 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-lg p-4 z-50">
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">Notifications</p>
              <div className="space-y-2 text-xs text-gray-500 dark:text-gray-400">
                <p>No new notifications.</p>
              </div>
            </div>
          )}
        </div>

        {/* User avatar + name */}
        <Link to="/profile" className="flex items-center gap-2 group">
          <img
            src="/images/user/owner.jpg"
            onError={(e) => {
              const target = e.currentTarget;
              target.onerror = null;
              target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='36' height='36' viewBox='0 0 36 36'%3E%3Ccircle cx='18' cy='18' r='18' fill='%23e4e7ec'/%3E%3Cpath d='M18 10a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 13c5.523 0 10 2.477 10 4v1H8v-1c0-1.523 4.477-4 10-4z' fill='%2398a2b3'/%3E%3C/svg%3E";
            }}
            alt="Evano"
            className="w-8 h-8 rounded-full object-cover ring-2 ring-gray-200 dark:ring-gray-700 group-hover:ring-brand-300 transition-all"
          />
          <span className="hidden md:block text-sm font-medium text-gray-700 dark:text-gray-200 group-hover:text-brand-500 transition-colors">
            Evano
          </span>
        </Link>
      </div>
    </header>
  );
};

export default AppHeader;
