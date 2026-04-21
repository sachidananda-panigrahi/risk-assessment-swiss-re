import { useEffect, useRef, useState } from "react";
import MetricCards from "../../components/dashboard/MetricCards";
import type { Customer } from "../../data/customers";
import type { SortKey, SortDir } from "../../api/customersApi";
import VirtualizedCustomerTable from "../../components/customers/VirtualizedCustomerTable";
import { useCustomersQuery } from "../../hooks/useCustomersQuery";
import { useDebounce } from "../../hooks/useDebounce";

function SearchIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

export default function Home() {
  // ── Query state ──────────────────────────────────────────────────────────
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("createdAt");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);

  // ── Modal state ──────────────────────────────────────────────────────────
  const [editTarget, setEditTarget] = useState<Customer | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Customer | null>(null);
  const [assignTarget, setAssignTarget] = useState<Customer | null>(null);

  // ── Sort dropdown ────────────────────────────────────────────────────────
  const [sortOpen, setSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);
  const debSearch = useDebounce(search, 300);

  // Reset to page 1 on filter/sort change
  useEffect(() => { setPage(1); }, [debSearch, sortKey, sortDir, pageSize]);

  useEffect(() => {
    if (!sortOpen) return;
    const h = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) setSortOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [sortOpen]);

  // ── API call ─────────────────────────────────────────────────────────────
  const { result, loading } = useCustomersQuery({
    page,
    pageSize,
    search: debSearch,
    sortKey,
    sortDir,
  });

  const handleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  return (
    <div className="space-y-6">
      {/* Merged metric cards panel */}
      <MetricCards />

      {/* Full customer grid */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
        {/* Toolbar */}
        <div className="flex items-center gap-4 px-5 py-4 border-b border-gray-100 dark:border-gray-800 flex-wrap">
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-bold text-gray-800 dark:text-white">All Customers</h3>
            <p className="text-xs font-medium text-emerald-500 mt-0.5">
              {result ? `${result.grandTotal.toLocaleString()} Active Members` : "Loading…"}
            </p>
          </div>

          {/* Search */}
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

          {/* Sort by */}
          <div ref={sortRef} className="relative flex-shrink-0">
            <button
              onClick={() => setSortOpen((v) => !v)}
              className="flex items-center gap-1 h-9 px-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-600 dark:text-gray-300 hover:border-gray-300 transition-colors"
            >
              <span className="text-xs text-gray-400">Sort by:</span>
              <span className="font-medium capitalize">{sortKey === "createdAt" ? "Newest" : sortKey}</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
            </button>
            {sortOpen && (
              <div className="absolute right-0 top-10 z-50 w-40 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-lg py-1 overflow-hidden">
                {(["createdAt", "name", "company", "country", "status"] as SortKey[]).map((key) => (
                  <button key={key} onClick={() => { setSortKey(key); setSortDir("asc"); setSortOpen(false); }}
                    className={`w-full text-left px-3 py-2 text-sm transition-colors
                      ${sortKey === key ? "text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-500/10 font-medium" : "text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"}`}>
                    {key === "createdAt" ? "Newest first" : key.charAt(0).toUpperCase() + key.slice(1)}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Table */}
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
          onPageSizeChange={(s) => { setPageSize(s); setPage(1); }}
          onEdit={setEditTarget}
          onDelete={setDeleteTarget}
          onAssign={setAssignTarget}
          containerHeight={500}
        />
      </div>

      {/* Edit modal */}
      {editTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setEditTarget(null)}>
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-md mx-4 p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Edit Customer</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Name</label>
                <input defaultValue={editTarget.name} className="w-full h-9 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-500/20" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Company</label>
                <input defaultValue={editTarget.company} className="w-full h-9 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-500/20" />
              </div>
            </div>
            <div className="flex gap-3 mt-6 justify-end">
              <button onClick={() => setEditTarget(null)} className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">Cancel</button>
              <button onClick={() => setEditTarget(null)} className="px-4 py-2 rounded-lg bg-brand-500 text-white text-sm font-medium hover:bg-brand-600 transition-colors">Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setDeleteTarget(null)}>
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-sm mx-4 p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-50 dark:bg-red-500/15 mx-auto mb-4">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/>
              </svg>
            </div>
            <h3 className="text-base font-semibold text-gray-800 dark:text-white text-center mb-2">Delete Customer</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-6">Remove <strong>{deleteTarget.name}</strong>? This cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteTarget(null)} className="flex-1 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 transition-colors">Cancel</button>
              <button onClick={() => setDeleteTarget(null)} className="flex-1 py-2 rounded-lg bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Assign modal */}
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
              <button onClick={() => setAssignTarget(null)} className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 transition-colors">Cancel</button>
              <button onClick={() => setAssignTarget(null)} className="px-4 py-2 rounded-lg bg-brand-500 text-white text-sm font-medium hover:bg-brand-600 transition-colors">Assign</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
