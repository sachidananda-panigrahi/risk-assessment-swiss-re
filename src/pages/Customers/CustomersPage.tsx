import { useEffect, useRef, useState } from "react";
import type { Customer } from "../../data/customers";
import type { SortKey, SortDir, StatusFilter } from "../../api/customersApi";
import { createCustomer, deleteCustomer, updateCustomer } from "../../api/customersApi";
import type { CustomerForm } from "../../components/customers/types";
import CustomerFormModal from "../../components/customers/CustomerFormModal";
import CustomerDeleteModal from "../../components/customers/CustomerDeleteModal";
import VirtualizedCustomerTable from "../../components/customers/VirtualizedCustomerTable";
import { useCustomersQuery } from "../../hooks/useCustomersQuery";
import { useDebounce } from "../../hooks/useDebounce";

function SearchIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

const STATUS_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "All Status" },
  { value: "Active", label: "Active" },
  { value: "Inactive", label: "Inactive" },
];

const INITIAL_FORM: CustomerForm = {
  name: "",
  email: "",
  company: "",
  phone: "",
  country: "",
  status: "Active",
};

export default function CustomersPage() {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("createdAt");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);

  const [editTarget, setEditTarget] = useState<Customer | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Customer | null>(null);
  const [assignTarget, setAssignTarget] = useState<Customer | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [customerForm, setCustomerForm] = useState<CustomerForm>(INITIAL_FORM);
  const [saving, setSaving] = useState(false);
  const [mutationError, setMutationError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const [sortOpen, setSortOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);

  const debSearch = useDebounce(search, 300);

  useEffect(() => { setPage(1); }, [debSearch, sortKey, sortDir, status, pageSize]);

  useEffect(() => {
    if (!editTarget) return;
    setCustomerForm({
      name: editTarget.name,
      email: editTarget.email,
      company: editTarget.company,
      phone: editTarget.phone,
      country: editTarget.country,
      status: editTarget.status,
    });
    setMutationError(null);
  }, [editTarget]);

  useEffect(() => {
    if (!sortOpen) return;
    const h = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) setSortOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [sortOpen]);

  useEffect(() => {
    if (!statusOpen) return;
    const h = (e: MouseEvent) => {
      if (statusRef.current && !statusRef.current.contains(e.target as Node)) setStatusOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [statusOpen]);

  const { result, loading, error } = useCustomersQuery({
    page,
    pageSize,
    search: debSearch,
    sortKey,
    sortDir,
    status,
    refreshKey,
  });

  const handleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortDir((dir) => (dir === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const openCreate = () => {
    setCreateOpen(true);
    setCustomerForm(INITIAL_FORM);
    setEditTarget(null);
    setMutationError(null);
  };

  const handleFormChange = (field: keyof CustomerForm, value: string) => {
    setCustomerForm((prev) => ({ ...prev, [field]: value }));
  };

  const saveCustomer = async () => {
    if (saving) return;
    setSaving(true);
    setMutationError(null);

    try {
      if (editTarget) {
        await updateCustomer(editTarget.id, customerForm);
        setEditTarget(null);
      } else {
        await createCustomer(customerForm);
        setCreateOpen(false);
        setPage(1);
      }
      setRefreshKey((n) => n + 1);
    } catch (err) {
      setMutationError(err instanceof Error ? err.message : "Failed to save customer.");
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget || saving) return;
    setSaving(true);
    setMutationError(null);

    try {
      await deleteCustomer(deleteTarget.id);
      setDeleteTarget(null);
      setRefreshKey((n) => n + 1);
    } catch (err) {
      setMutationError(err instanceof Error ? err.message : "Failed to delete customer.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">All Customers</h2>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-0.5">
            {result ? `${result.grandTotal.toLocaleString()} total customers` : "Loading…"}
          </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center gap-2 h-9 px-4 rounded-lg bg-brand-500 text-white text-sm font-medium hover:bg-brand-600 transition-colors"
        >
          + New Customer
        </button>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
        <div className="flex flex-wrap items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800 gap-3">
          <div className="relative flex-1 min-w-[160px] max-w-xs">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              <SearchIcon />
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search customers…"
              className="w-full h-9 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 pl-9 pr-4 text-sm text-gray-700 dark:text-gray-200 placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-500/10 transition-all"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <div ref={statusRef} className="relative">
              <button
                type="button"
                onClick={() => setStatusOpen((v) => !v)}
                className="flex items-center gap-1.5 h-9 px-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-600 dark:text-gray-300 hover:border-gray-300 transition-colors"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14" />
                </svg>
                <span className="hidden sm:inline text-xs text-gray-400">Status:</span>
                <span className="font-medium">{STATUS_OPTIONS.find((item) => item.value === status)?.label}</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
              {statusOpen && (
                <div className="absolute right-0 top-10 z-50 w-36 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-lg py-1 overflow-hidden">
                  {STATUS_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => { setStatus(opt.value); setStatusOpen(false); }}
                      className={`w-full text-left px-3 py-2 text-sm transition-colors ${status === opt.value ? "text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-500/10 font-medium" : "text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"}`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div ref={sortRef} className="relative">
              <button
                type="button"
                onClick={() => setSortOpen((v) => !v)}
                className="flex items-center gap-1.5 h-9 px-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-600 dark:text-gray-300 hover:border-gray-300 transition-colors"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="15" y2="12" />
                  <line x1="3" y1="18" x2="9" y2="18" />
                </svg>
                <span className="hidden sm:inline text-xs text-gray-400">Sort:</span>
                <span className="font-medium capitalize">{sortKey === "createdAt" ? "Newest" : sortKey}</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
              {sortOpen && (
                <div className="absolute right-0 top-10 z-50 w-40 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-lg py-1 overflow-hidden">
                  {(["createdAt", "name", "company", "country", "status"] as SortKey[]).map((key) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => { setSortKey(key); setSortDir("asc"); setSortOpen(false); }}
                      className={`w-full text-left px-3 py-2 text-sm transition-colors ${sortKey === key ? "text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-500/10 font-medium" : "text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"}`}
                    >
                      {key === "createdAt" ? "Newest first" : key}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {error && (
          <div className="px-5 py-3 bg-red-50 dark:bg-red-500/10 border-b border-red-100 dark:border-red-500/20 text-sm text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        <VirtualizedCustomerTable
          rows={result?.data ?? []}
          loading={loading}
          sortKey={sortKey}
          sortDir={sortDir}
          onSort={handleSort}
          page={result?.page ?? page}
          pageSize={pageSize}
          total={result?.total ?? 0}
          totalPages={result?.totalPages ?? 1}
          onPage={setPage}
          onPageSizeChange={(size) => { setPageSize(size); setPage(1); }}
          onEdit={(customer) => setEditTarget(customer)}
          onDelete={(customer) => setDeleteTarget(customer)}
          onAssign={(customer) => setAssignTarget(customer)}
          containerHeight={560}
        />
      </div>

      <CustomerFormModal
        open={createOpen || Boolean(editTarget)}
        title={editTarget ? "Edit Customer" : "Create Customer"}
        form={customerForm}
        onChange={handleFormChange}
        onClose={() => { setCreateOpen(false); setEditTarget(null); setMutationError(null); }}
        onSubmit={saveCustomer}
        loading={saving}
        error={mutationError}
      />

      <CustomerDeleteModal
        open={Boolean(deleteTarget)}
        name={deleteTarget?.name ?? "customer"}
        loading={saving}
        error={mutationError}
        onClose={() => { setDeleteTarget(null); setMutationError(null); }}
        onConfirm={confirmDelete}
      />

      {assignTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setAssignTarget(null)}>
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-sm mx-4 p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-base font-semibold text-gray-800 dark:text-white mb-4">Assign Agent</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Assign <strong>{assignTarget.name}</strong> to an agent.</p>
            <select className="w-full h-9 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-500/20 mb-6">
              <option>Agent Sarah Johnson</option>
              <option>Agent Mike Davis</option>
              <option>Agent Emma Wilson</option>
            </select>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setAssignTarget(null)}
                className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setAssignTarget(null)}
                className="px-4 py-2 rounded-lg bg-brand-500 text-white text-sm font-medium hover:bg-brand-600 transition-colors"
              >
                Assign
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
