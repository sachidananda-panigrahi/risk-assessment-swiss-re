import { memo, useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import type { Customer } from "../../data/customers";
import type { SortKey, SortDir } from "../../api/customersApi";
import RowActionsMenu from "./RowActionsMenu";

// ─── Types ───────────────────────────────────────────────────────────────────

interface VirtualizedCustomerTableProps {
  rows: Customer[];
  loading: boolean;
  // Sort (controlled)
  sortKey: SortKey;
  sortDir: SortDir;
  onSort: (key: SortKey) => void;
  // Pagination (controlled)
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  onPage: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  // Row actions
  onEdit: (c: Customer) => void;
  onDelete: (c: Customer) => void;
  onAssign: (c: Customer) => void;
  containerHeight?: number;
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function SortArrow({ active, dir }: { active: boolean; dir: SortDir }) {
  if (!active)
    return (
      <svg className="opacity-25 ml-1 flex-shrink-0" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M12 5v14M5 12l7-7 7 7" />
      </svg>
    );
  return dir === "asc" ? (
    <svg className="ml-1 text-brand-500 flex-shrink-0" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M12 19V5M5 12l7-7 7 7" />
    </svg>
  ) : (
    <svg className="ml-1 text-brand-500 flex-shrink-0" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M12 5v14M5 12l7 7 7-7" />
    </svg>
  );
}

const ROW_HEIGHT = 60;

interface VirtualRowProps {
  customer: Customer;
  onEdit: (c: Customer) => void;
  onDelete: (c: Customer) => void;
  onAssign: (c: Customer) => void;
}

const VirtualRow = memo(function VirtualRow({ customer, onEdit, onDelete, onAssign }: VirtualRowProps) {
  return (
    <div className="flex items-center border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50/60 dark:hover:bg-gray-800/40 transition-colors group px-4">
      {/* Customer Name */}
      <div className="flex-[2] min-w-0 flex items-center gap-3 py-3">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold text-white flex-shrink-0"
          style={{ backgroundColor: customer.avatarColor }}
        >
          {customer.avatarInitials}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-gray-800 dark:text-gray-100 truncate">{customer.name}</p>
        </div>
      </div>

      {/* Company */}
      <div className="flex-[1.5] min-w-0 py-3 hidden sm:block">
        <span className="text-sm text-gray-600 dark:text-gray-300 truncate block">{customer.company}</span>
      </div>

      {/* Phone */}
      <div className="flex-[1.2] min-w-0 py-3 hidden md:block">
        <span className="text-sm text-gray-600 dark:text-gray-300">{customer.phone}</span>
      </div>

      {/* Email */}
      <div className="flex-[2] min-w-0 py-3 hidden lg:block">
        <span className="text-sm text-gray-500 dark:text-gray-400 truncate block">{customer.email}</span>
      </div>

      {/* Country */}
      <div className="flex-[1.5] min-w-0 py-3 hidden xl:block">
        <span className="text-sm text-gray-600 dark:text-gray-300 truncate block">{customer.country}</span>
      </div>

      {/* Status */}
      <div className="flex-[0.8] min-w-0 py-3">
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold
          ${customer.status === "Active"
            ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
            : "bg-red-50 text-red-500 dark:bg-red-500/10 dark:text-red-400"
          }`}>
          {customer.status}
        </span>
      </div>

      {/* Actions */}
      <div className="flex-[0.4] flex justify-end py-3">
        <RowActionsMenu customer={customer} onEdit={onEdit} onDelete={onDelete} onAssign={onAssign} />
      </div>
    </div>
  );
});

// ─── Skeleton loader row ──────────────────────────────────────────────────────

function SkeletonRow({ index }: { index: number }) {
  return (
    <div className="flex items-center px-4 py-3 border-b border-gray-50 dark:border-gray-800 animate-pulse" style={{ height: ROW_HEIGHT }}>
      <div className="flex-[2] flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex-shrink-0" />
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-28" />
      </div>
      <div className="flex-[1.5] hidden sm:block"><div className={`h-3 bg-gray-200 dark:bg-gray-700 rounded ${index % 3 === 0 ? "w-20" : "w-28"}`} /></div>
      <div className="flex-[1.2] hidden md:block"><div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24" /></div>
      <div className="flex-[2] hidden lg:block"><div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-36" /></div>
      <div className="flex-[1.5] hidden xl:block"><div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16" /></div>
      <div className="flex-[0.8]"><div className="h-5 bg-gray-200 dark:bg-gray-700 rounded-full w-16" /></div>
      <div className="flex-[0.4] flex justify-end"><div className="w-7 h-7 rounded-md bg-gray-200 dark:bg-gray-700" /></div>
    </div>
  );
}

// ─── Pagination controls ──────────────────────────────────────────────────────

function PaginationBar({
  page,
  pageSize,
  total,
  totalPages,
  onPage,
  onPageSizeChange,
  loading,
}: {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  onPage: (p: number) => void;
  onPageSizeChange: (s: number) => void;
  loading: boolean;
}) {
  const start = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);

  // Build page numbers: [1] ... [page-1] [page] [page+1] ... [last]
  const pages: (number | "…")[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (page > 3) pages.push("…");
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i);
    if (page < totalPages - 2) pages.push("…");
    pages.push(totalPages);
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
      {/* Left: count + page size */}
      <div className="flex items-center gap-3">
        <span className="text-xs text-gray-400 dark:text-gray-500">
          {loading ? "Loading…" : `Showing ${start.toLocaleString()}–${end.toLocaleString()} of ${total.toLocaleString()} entries`}
        </span>
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className="h-7 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs text-gray-600 dark:text-gray-300 px-2 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
        >
          {[10, 25, 50, 100].map((s) => (
            <option key={s} value={s}>{s} / page</option>
          ))}
        </select>
      </div>

      {/* Right: page buttons */}
      <div className="flex items-center gap-1">
        {/* Prev */}
        <button
          onClick={() => onPage(page - 1)}
          disabled={page <= 1 || loading}
          className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6" /></svg>
        </button>

        {pages.map((p, i) =>
          p === "…" ? (
            <span key={`e-${i}`} className="w-7 h-7 flex items-center justify-center text-xs text-gray-400">…</span>
          ) : (
            <button
              key={p}
              onClick={() => onPage(p as number)}
              disabled={loading}
              className={`w-7 h-7 flex items-center justify-center rounded-lg text-xs font-medium transition-colors disabled:cursor-not-allowed
                ${page === p
                  ? "bg-brand-500 text-white"
                  : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700"
                }`}
            >
              {p}
            </button>
          )
        )}

        {/* Next */}
        <button
          onClick={() => onPage(page + 1)}
          disabled={page >= totalPages || loading}
          className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6" /></svg>
        </button>
      </div>
    </div>
  );
}

// ─── Column definitions ───────────────────────────────────────────────────────

const COLS: { label: string; key: SortKey; sortable: boolean; className: string }[] = [
  { label: "Customer Name", key: "name",      sortable: true,  className: "flex-[2]" },
  { label: "Company",       key: "company",   sortable: true,  className: "flex-[1.5] hidden sm:flex" },
  { label: "Phone Number",  key: "name",      sortable: false, className: "flex-[1.2] hidden md:flex" },
  { label: "Email",         key: "name",      sortable: false, className: "flex-[2] hidden lg:flex" },
  { label: "Country",       key: "country",   sortable: true,  className: "flex-[1.5] hidden xl:flex" },
  { label: "Status",        key: "status",    sortable: true,  className: "flex-[0.8]" },
];

// ─── Main component ───────────────────────────────────────────────────────────

export default function VirtualizedCustomerTable({
  rows,
  loading,
  sortKey,
  sortDir,
  onSort,
  page,
  pageSize,
  total,
  totalPages,
  onPage,
  onPageSizeChange,
  onEdit,
  onDelete,
  onAssign,
  containerHeight = 520,
}: VirtualizedCustomerTableProps) {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: loading ? pageSize : rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 5,
  });

  return (
    <div className="rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden">
      {/* Column headers */}
      <div className="flex items-center px-4 py-3 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30">
        {COLS.map((col) => (
          <button
            key={col.label}
            onClick={() => col.sortable && onSort(col.key)}
            disabled={!col.sortable}
            className={`${col.className} flex items-center gap-0.5 text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500
              ${col.sortable ? "hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer" : "cursor-default"} transition-colors`}
          >
            {col.label}
            {col.sortable && <SortArrow active={sortKey === col.key} dir={sortDir} />}
          </button>
        ))}
        <div className="flex-[0.4]" />
      </div>

      {/* Virtualised body */}
      <div
        ref={parentRef}
        style={{ height: containerHeight, overflowY: "auto" }}
        className="will-change-scroll"
      >
        <div style={{ height: loading ? containerHeight : virtualizer.getTotalSize(), position: "relative" }}>
          {loading
            ? Array.from({ length: Math.ceil(containerHeight / ROW_HEIGHT) }).map((_, i) => (
                <div key={i} style={{ position: "absolute", top: 0, left: 0, width: "100%", transform: `translateY(${i * ROW_HEIGHT}px)`, height: ROW_HEIGHT }}>
                  <SkeletonRow index={i} />
                </div>
              ))
            : rows.length === 0
            ? (
              <div className="flex flex-col items-center justify-center h-full py-20 text-center">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5" className="mb-3"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">No customers found</p>
                <p className="text-xs text-gray-400 mt-1">Try adjusting your search or filters</p>
              </div>
            )
            : virtualizer.getVirtualItems().map((vItem) => {
                const customer = rows[vItem.index];
                return (
                  <div
                    key={customer.id}
                    style={{ position: "absolute", top: 0, left: 0, width: "100%", transform: `translateY(${vItem.start}px)`, height: ROW_HEIGHT }}
                  >
                    <VirtualRow customer={customer} onEdit={onEdit} onDelete={onDelete} onAssign={onAssign} />
                  </div>
                );
              })
          }
        </div>
      </div>

      {/* Pagination */}
      <PaginationBar
        page={page}
        pageSize={pageSize}
        total={total}
        totalPages={totalPages}
        onPage={onPage}
        onPageSizeChange={onPageSizeChange}
        loading={loading}
      />
    </div>
  );
}
