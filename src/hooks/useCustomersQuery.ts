import { useState, useEffect, useRef } from "react";
import { queryCustomers } from "../api/customersApi";
import type { CustomerQueryParams, CustomerQueryResult } from "../api/customersApi";

interface UseCustomersQueryResult {
  result: CustomerQueryResult | null;
  loading: boolean;
  error: string | null;
}

/**
 * Calls the mock customers API whenever any param changes.
 * Cancels in-flight requests via AbortController pattern (flag-based).
 */
export function useCustomersQuery(
  params: CustomerQueryParams
): UseCustomersQueryResult {
  const [result, setResult] = useState<CustomerQueryResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Use ref to track if component is still mounted / latest request
  const reqIdRef = useRef(0);

  useEffect(() => {
    const currentId = ++reqIdRef.current;
    setLoading(true);
    setError(null);

    queryCustomers(params)
      .then((data) => {
        if (reqIdRef.current !== currentId) return; // stale response — discard
        setResult(data);
        setError(null);
      })
      .catch(() => {
        if (reqIdRef.current !== currentId) return;
        setError("Failed to load customers. Please try again.");
      })
      .finally(() => {
        if (reqIdRef.current !== currentId) return;
        setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    params.page,
    params.pageSize,
    params.search,
    params.sortKey,
    params.sortDir,
    params.status,
    params.refreshKey,
  ]);

  return { result, loading, error };
}
