import { generateCustomers } from "../data/customers";
import type { Customer } from "../data/customers";

type SortKey = "name" | "company" | "country" | "status" | "createdAt";
type SortDir = "asc" | "desc";
type StatusFilter = "all" | "Active" | "Inactive";

type CustomerForm = Omit<Customer, "id" | "avatarColor" | "avatarInitials" | "createdAt">;

interface QueryPayload {
  page: number;
  pageSize: number;
  search: string;
  sortKey: SortKey;
  sortDir: SortDir;
  status: StatusFilter;
}

interface CreatePayload {
  customer: CustomerForm;
}

interface UpdatePayload {
  id: string;
  updates: Partial<CustomerForm>;
}

interface DeletePayload {
  id: string;
}

interface WorkerRequest {
  requestId: number;
  type: "QUERY" | "CREATE" | "UPDATE" | "DELETE";
  payload: QueryPayload | CreatePayload | UpdatePayload | DeletePayload;
}

interface WorkerResponse {
  requestId: number;
  status: "success" | "error";
  result?: any;
  error?: string;
}

const ALL_DATA: Customer[] = generateCustomers(20000);

const avatarColors = [
  "#4f46e5",
  "#7c3aed",
  "#db2777",
  "#dc2626",
  "#d97706",
  "#16a34a",
  "#0891b2",
  "#0284c7",
  "#9333ea",
  "#c2410c",
];

function randomItem<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function makeAvatarInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0].toUpperCase())
    .slice(0, 2)
    .join("");
}

function createCustomerRecord(customer: CustomerForm): Customer {
  const nextIndex = ALL_DATA.reduce((max, item) => {
    const value = Number(item.id.replace(/^cust-0*/, ""));
    return Number.isNaN(value) ? max : Math.max(max, value);
  }, 0) + 1;

  return {
    ...customer,
    id: `cust-${String(nextIndex).padStart(6, "0")}`,
    avatarColor: randomItem(avatarColors),
    avatarInitials: makeAvatarInitials(customer.name),
    createdAt: new Date().toISOString().slice(0, 10),
  };
}

function sortAndFilterCustomers(
  rows: Customer[],
  search: string,
  sortKey: SortKey,
  sortDir: SortDir
) {
  let result = rows;

  if (search.trim()) {
    const query = search.trim().toLowerCase();
    result = result.filter(
      (customer) =>
        customer.name.toLowerCase().includes(query) ||
        customer.email.toLowerCase().includes(query) ||
        customer.company.toLowerCase().includes(query) ||
        customer.country.toLowerCase().includes(query)
    );
  }

  return [...result].sort((a, b) => {
    const av = (a[sortKey] as string).toLowerCase();
    const bv = (b[sortKey] as string).toLowerCase();
    const cmp = av < bv ? -1 : av > bv ? 1 : 0;
    return sortDir === "asc" ? cmp : -cmp;
  });
}

function queryCustomers(payload: QueryPayload) {
  const rows = payload.status === "all"
    ? ALL_DATA
    : ALL_DATA.filter((item) => item.status === payload.status);

  const filtered = sortAndFilterCustomers(rows, payload.search, payload.sortKey, payload.sortDir);
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / payload.pageSize));
  const currentPage = Math.max(1, Math.min(payload.page, totalPages));
  const start = (currentPage - 1) * payload.pageSize;
  const data = filtered.slice(start, start + payload.pageSize);

  return {
    data,
    total,
    page: currentPage,
    pageSize: payload.pageSize,
    totalPages,
    grandTotal: ALL_DATA.length,
  };
}

function updateRecord(id: string, updates: Partial<CustomerForm>) {
  const index = ALL_DATA.findIndex((item) => item.id === id);
  if (index === -1) {
    throw new Error("Customer not found");
  }

  const existing = ALL_DATA[index];
  const updated = {
    ...existing,
    ...updates,
    avatarInitials: updates.name ? makeAvatarInitials(updates.name) : existing.avatarInitials,
  };
  ALL_DATA[index] = updated;
  return updated;
}

function deleteRecord(id: string) {
  const index = ALL_DATA.findIndex((item) => item.id === id);
  if (index === -1) {
    throw new Error("Customer not found");
  }

  ALL_DATA.splice(index, 1);
}

function simulateLatency() {
  return new Promise((resolve) => setTimeout(resolve, 80 + Math.random() * 80));
}

self.onmessage = async (event: MessageEvent<WorkerRequest>) => {
  const { requestId, type, payload } = event.data;

  try {
    await simulateLatency();

    let result: any;

    switch (type) {
      case "QUERY":
        result = queryCustomers(payload as QueryPayload);
        break;
      case "CREATE":
        result = createCustomerRecord((payload as CreatePayload).customer);
        ALL_DATA.unshift(result);
        break;
      case "UPDATE":
        result = updateRecord((payload as UpdatePayload).id, (payload as UpdatePayload).updates);
        break;
      case "DELETE":
        deleteRecord((payload as DeletePayload).id);
        result = null;
        break;
      default:
        throw new Error("Unknown worker action");
    }

    const response: WorkerResponse = {
      requestId,
      status: "success",
      result,
    };
    self.postMessage(response);
  } catch (error) {
    const response: WorkerResponse = {
      requestId,
      status: "error",
      error: error instanceof Error ? error.message : String(error),
    };
    self.postMessage(response);
  }
};
