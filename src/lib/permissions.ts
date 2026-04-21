import type { Permission, UserRole } from "../types/rbac";

export const rolePermissions: Record<UserRole, Permission[]> = {
  admin: [
    "customers:read",
    "customers:edit",
    "customers:delete",
    "customers:assign",
    "documents:view",
    "documents:edit",
  ],
  agent: [
    "customers:read",
    "customers:edit",
    "customers:assign",
    "documents:view",
  ],
  viewer: ["customers:read", "documents:view"],
};

export function hasPermission(role: UserRole, permission: Permission): boolean {
  return rolePermissions[role].includes(permission);
}
