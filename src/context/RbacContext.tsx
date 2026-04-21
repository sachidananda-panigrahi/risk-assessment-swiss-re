import { createContext, useContext, useState } from "react";
import type { Permission, UserRole } from "../types/rbac";
import { hasPermission } from "../lib/permissions";

interface RbacContextValue {
  currentRole: UserRole;
  setRole: (role: UserRole) => void;
  can: (permission: Permission) => boolean;
}

const RbacContext = createContext<RbacContextValue | null>(null);

export function RbacProvider({ children }: { children: React.ReactNode }) {
  const [currentRole, setCurrentRole] = useState<UserRole>("admin");

  const setRole = (role: UserRole) => setCurrentRole(role);

  const can = (permission: Permission) =>
    hasPermission(currentRole, permission);

  return (
    <RbacContext.Provider value={{ currentRole, setRole, can }}>
      {children}
    </RbacContext.Provider>
  );
}

export function useRbac(): RbacContextValue {
  const ctx = useContext(RbacContext);
  if (!ctx) throw new Error("useRbac must be used within RbacProvider");
  return ctx;
}
