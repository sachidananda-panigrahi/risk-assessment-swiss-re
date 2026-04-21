import { generateCustomers } from "../data/customers";
import type { Customer } from "../data/customers";

// Singleton dataset — generated once, shared across all API calls
const ALL_DATA: Customer[] = generateCustomers(20000);

export type SortKey = "name" | "company" | "country" | "status" | "createdAt";
export type SortDir = "asc" | "desc";
export type StatusFilter = "all" | "Active" | "Inactive";

export interface CustomerQueryParams {
  page: number;        // 1-based
  pageSize: number;
  search?: string;
  sortKey?: SortKey;
  sortDir?: SortDir;
  status?: StatusFilter;
}

export interface CustomerQueryResult {
  data: Customer[];
  total: number;        // filtered total
  page: number;
  pageSize: number;
  totalPages: number;
  grandTotal: number;   // unfiltered total (for header badge)
}

/**
 * Mock API — simulates server-side filter + sort + paginate.
 * Adds 80–160 ms latency to mimic real network round-trip.
 */
export async function queryCustomers(
  params: CustomerQueryParams
): Promise<CustomerQueryResult> {
  // Simulate network latency
  const latency = 80 + Math.random() * 80;
  await new Promise((resolve) => setTimeout(resolve, latency));

  const {
    page,
    pageSize,
    search = "",
    sortKey = "createdAt",
    sortDir = "desc",
    status = "all",
  } = params;

  // 1. Filter by status
  let rows = status === "all" ? ALL_DATA : ALL_DATA.filter((c) => c.status === status);

  // 2. Filter by search
  if (search.trim()) {
    const q = search.trim().toLowerCase();
    rows = rows.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.company.toLowerCase().includes(q) ||
        c.country.toLowerCase().includes(q)
    );
  }

  // 3. Sort
  rows = [...rows].sort((a, b) => {
    const av = (a[sortKey] as string).toLowerCase();
    const bv = (b[sortKey] as string).toLowerCase();
    const cmp = av < bv ? -1 : av > bv ? 1 : 0;
    return sortDir === "asc" ? cmp : -cmp;
  });

  // 4. Paginate
  const total = rows.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const clampedPage = Math.max(1, Math.min(page, totalPages));
  const start = (clampedPage - 1) * pageSize;
  const data = rows.slice(start, start + pageSize);

  return {
    data,
    total,
    page: clampedPage,
    pageSize,
    totalPages,
    grandTotal: ALL_DATA.length,
  };
}
