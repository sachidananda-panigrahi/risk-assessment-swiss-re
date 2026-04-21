import type { Customer } from "../data/customers";

type SortKey = "name" | "company" | "country" | "status" | "createdAt";
type SortDir = "asc" | "desc";

interface WorkerMessage {
  type: "SORT_FILTER";
  payload: {
    data: Customer[];
    search: string;
    sortKey: SortKey;
    sortDir: SortDir;
  };
}

interface WorkerResult {
  type: "RESULT";
  data: Customer[];
}

self.onmessage = (e: MessageEvent<WorkerMessage>) => {
  const { type, payload } = e.data;

  if (type === "SORT_FILTER") {
    const { data, search, sortKey, sortDir } = payload;

    let result = data;

    if (search.trim()) {
      const q = search.toLowerCase();
      result = data.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          c.company.toLowerCase().includes(q) ||
          c.country.toLowerCase().includes(q)
      );
    }

    result = [...result].sort((a, b) => {
      const av = a[sortKey] as string;
      const bv = b[sortKey] as string;
      const cmp = av.localeCompare(bv);
      return sortDir === "asc" ? cmp : -cmp;
    });

    const response: WorkerResult = { type: "RESULT", data: result };
    self.postMessage(response);
  }
};
