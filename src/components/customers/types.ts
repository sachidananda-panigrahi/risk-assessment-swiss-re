import type { Customer } from "../../data/customers";

export type CustomerForm = Omit<Customer, "id" | "avatarColor" | "avatarInitials" | "createdAt">;
