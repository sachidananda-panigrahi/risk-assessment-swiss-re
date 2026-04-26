import type { Customer } from "../data/customers";

export type SortKey = "name" | "company" | "country" | "status" | "createdAt";
export type SortDir = "asc" | "desc";
export type StatusFilter = "all" | "Active" | "Inactive";

export interface CustomerQueryParams {
  page: number;
  pageSize: number;
  search?: string;
  sortKey?: SortKey;
  sortDir?: SortDir;
  status?: StatusFilter;
  refreshKey?: number;
}

export interface CustomerQueryResult {
  data: Customer[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  grandTotal: number;
}

type QueryPayload = Omit<CustomerQueryParams, "refreshKey"> & {
  search: string;
  sortKey: SortKey;
  sortDir: SortDir;
  status: StatusFilter;
};

type CreatePayload = { customer: Omit<Customer, "id" | "avatarColor" | "avatarInitials" | "createdAt"> };

type UpdatePayload = { id: string; updates: Partial<Omit<Customer, "id" | "avatarColor" | "avatarInitials" | "createdAt">> };

type DeletePayload = { id: string };

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

const worker = new Worker(new URL("../workers/dataWorker.ts", import.meta.url), { type: "module" });

const pending = new Map<number, {
  resolve: (value: any) => void;
  reject: (reason?: unknown) => void;
}>();
let nextRequestId = 1;

worker.onmessage = (event: MessageEvent<WorkerResponse>) => {
  const { requestId, status, result, error } = event.data;
  const entry = pending.get(requestId);
  if (!entry) return;

  pending.delete(requestId);
  if (status === "success") {
    entry.resolve(result);
  } else {
    entry.reject(new Error(error ?? "Worker request failed"));
  }
};

function postWorkerMessage<T extends WorkerRequest>(message: Omit<T, "requestId">): Promise<any> {
  const requestId = nextRequestId++;
  return new Promise((resolve, reject) => {
    pending.set(requestId, { resolve, reject });
    worker.postMessage({ ...message, requestId });
  });
}

export async function queryCustomers(params: CustomerQueryParams): Promise<CustomerQueryResult> {
  const payload: QueryPayload = {
    page: params.page,
    pageSize: params.pageSize,
    search: params.search ?? "",
    sortKey: params.sortKey ?? "createdAt",
    sortDir: params.sortDir ?? "desc",
    status: params.status ?? "all",
  };

  return postWorkerMessage({ type: "QUERY", payload });
}

export async function createCustomer(
  customer: Omit<Customer, "id" | "avatarColor" | "avatarInitials" | "createdAt">
): Promise<Customer> {
  return postWorkerMessage({ type: "CREATE", payload: { customer } });
}

export async function updateCustomer(
  id: string,
  updates: Partial<Omit<Customer, "id" | "avatarColor" | "avatarInitials" | "createdAt">>
): Promise<Customer> {
  return postWorkerMessage({ type: "UPDATE", payload: { id, updates } });
}

export async function deleteCustomer(id: string): Promise<void> {
  return postWorkerMessage({ type: "DELETE", payload: { id } });
}
