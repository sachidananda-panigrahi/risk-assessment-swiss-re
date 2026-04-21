import { useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router";
import { useRbac } from "../../context/RbacContext";
import type { Customer } from "../../data/customers";

interface RowActionsMenuProps {
  customer: Customer;
  onEdit: (customer: Customer) => void;
  onDelete: (customer: Customer) => void;
  onAssign: (customer: Customer) => void;
}

export default function RowActionsMenu({ customer, onEdit, onDelete, onAssign }: RowActionsMenuProps) {
  const [open, setOpen] = useState(false);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
  const btnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { can } = useRbac();

  // Position menu relative to button using fixed coords
  const handleOpen = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!open && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setMenuPos({
        top: rect.bottom + 4,
        left: rect.right - 160, // menu width 160px, align right edge
      });
    }
    setOpen((v) => !v);
  };

  // Outside click closes menu
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      const clickedBtn = btnRef.current?.contains(target);
      const clickedMenu = menuRef.current?.contains(target);
      if (!clickedBtn && !clickedMenu) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  // Close on scroll
  useEffect(() => {
    if (!open) return;
    const handler = () => setOpen(false);
    window.addEventListener("scroll", handler, true);
    return () => window.removeEventListener("scroll", handler, true);
  }, [open]);

  const menu = open ? createPortal(
    <div
      ref={menuRef}
      style={{ position: "fixed", top: menuPos.top, left: menuPos.left, zIndex: 9999 }}
      className="w-40 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-xl py-1 overflow-hidden"
    >
      {can("customers:edit") && (
        <button
          onClick={() => { setOpen(false); onEdit(customer); }}
          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
          Edit
        </button>
      )}
      {can("customers:assign") && (
        <button
          onClick={() => { setOpen(false); onAssign(customer); }}
          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="8.5" cy="7" r="4" />
            <polyline points="17 11 19 13 23 9" />
          </svg>
          Assign
        </button>
      )}
      <button
        onClick={() => { setOpen(false); navigate(`/customers/${customer.id}/documents`); }}
        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
        </svg>
        View Documents
      </button>
      {can("customers:delete") && (
        <>
          <div className="my-1 border-t border-gray-100 dark:border-gray-700" />
          <button
            onClick={() => { setOpen(false); onDelete(customer); }}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
              <path d="M10 11v6M14 11v6M9 6V4h6v2" />
            </svg>
            Delete
          </button>
        </>
      )}
    </div>,
    document.body
  ) : null;

  return (
    <>
      <button
        ref={btnRef}
        onClick={handleOpen}
        className="flex items-center justify-center w-7 h-7 rounded-md text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-600 transition-colors"
        aria-label="Row actions"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="12" cy="5" r="1.5" />
          <circle cx="12" cy="12" r="1.5" />
          <circle cx="12" cy="19" r="1.5" />
        </svg>
      </button>
      {menu}
    </>
  );
}
