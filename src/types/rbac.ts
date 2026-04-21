export type UserRole = "admin" | "agent" | "viewer";

export type Permission =
  | "customers:read"
  | "customers:edit"
  | "customers:delete"
  | "customers:assign"
  | "documents:view"
  | "documents:edit";
