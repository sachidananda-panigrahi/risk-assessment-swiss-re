import { useEffect, useRef, useState } from "react";
import MetricCards from "../../components/dashboard/MetricCards";
import type { Customer } from "../../data/customers";
import type { SortKey, SortDir } from "../../api/customersApi";
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

const INITIAL_FORM: CustomerForm = {
  name: "",
  email: "",
  company: "",
  phone: "",
  country: "",
  status: "Active",
};

export default function Home() {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("createdAt");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
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
  const sortRef = useRef<HTMLDivElement>(null);
  const debSearch = useDebounce(search, 300);

  useEffect(() => { setPage(1); }, [debSearch, sortKey, sortDir, pageSize]);

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

  const { result, loading } = useCustomersQuery({
    page,
    pageSize,
    search: debSearch,
    sortKey,
    sortDir,
    status: "all",
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
    <div className="space-y-6">
      <MetricCards />

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
        <div className="flex flex-wrap items-center gap-4 px-5 py-4 border-b border-gray-100 dark:border-gray-800">
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-bold text-gray-800 dark:text-white">All Customers</h3>
            <p className="text-xs font-medium text-emerald-500 mt-0.5">
              {result ? `${result.grandTotal.toLocaleString()} Active Members` : "Loading…"}
            </p>
          </div>

          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center gap-2 h-9 px-4 rounded-lg bg-brand-500 text-white text-sm font-medium hover:bg-brand-600 transition-colors"
          >
            + New Customer
          </button>

          <div className="relative w-48">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              <SearchIcon />
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search…"
              className="w-full h-9 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 pl-9 pr-3 text-sm text-gray-700 dark:text-gray-200 placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-500/10 transition-all"
            />
          </div>

          <div ref={sortRef} className="relative flex-shrink-0">
            <button
              type="button"
              onClick={() => setSortOpen((v) => !v)}
              className="flex items-center gap-1 h-9 px-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-600 dark:text-gray-300 hover:border-gray-300 transition-colors"
            >
              <span className="text-xs text-gray-400">Sort by:</span>
              <span className="font-medium capitalize">{sortKey === "createdAt" ? "Newest" : sortKey}</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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
                    {key === "createdAt" ? "Newest first" : key.charAt(0).toUpperCase() + key.slice(1)}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

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
          onEdit={setEditTarget}
          onDelete={setDeleteTarget}
          onAssign={setAssignTarget}
          containerHeight={500}
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
