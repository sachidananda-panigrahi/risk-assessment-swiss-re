import { useState } from "react";
import { Link, useParams } from "react-router";
import DocumentViewer from "../../components/documents/DocumentViewer";
import type { DocFile } from "../../components/documents/DocumentViewer";
import { generateCustomers } from "../../data/customers";

// Generate mock documents for a customer
function mockDocs(customerId: string): DocFile[] {
  const seed = customerId.charCodeAt(customerId.length - 1) % 4;
  const base: DocFile[] = [
    { id: `${customerId}-doc-1`, name: "Claims_Assessment_Report.pdf", sizeMB: 245, pages: 48 },
    { id: `${customerId}-doc-2`, name: "Policy_Document_2024.pdf", sizeMB: 892, pages: 312 },
    { id: `${customerId}-doc-3`, name: "Risk_Evaluation_Form.pdf", sizeMB: 67, pages: 12 },
    { id: `${customerId}-doc-4`, name: "Supporting_Evidence.pdf", sizeMB: 456, pages: 89 },
  ];
  return base.slice(0, seed + 2);
}

function FileIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  );
}

function BackIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

const ALL_CUSTOMERS = generateCustomers(20000);

export default function DocumentWorkspacePage() {
  const { id } = useParams<{ id: string }>();
  const customer = ALL_CUSTOMERS.find((c) => c.id === id);
  const docs = mockDocs(id ?? "default");
  const [activeDoc, setActiveDoc] = useState<DocFile>(docs[0]);

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col -m-6">
      {/* Workspace header */}
      <div className="flex items-center gap-4 px-6 py-3 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 flex-shrink-0">
        <Link
          to="/customers"
          className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
        >
          <BackIcon />
          Customers
        </Link>
        <span className="text-gray-300 dark:text-gray-600">/</span>
        <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
          {customer?.name ?? id}
        </span>
        <span className="text-gray-300 dark:text-gray-600">/</span>
        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Documents</span>

        <div className="ml-auto flex items-center gap-2">
          {customer && (
            <div className="flex items-center gap-2">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-semibold text-white"
                style={{ backgroundColor: customer.avatarColor }}
              >
                {customer.avatarInitials}
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-300">{customer.name}</span>
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium
                  ${customer.status === "Active"
                    ? "bg-success-50 text-success-700 dark:bg-success-500/15 dark:text-success-400"
                    : "bg-error-50 text-error-700 dark:bg-error-500/15 dark:text-error-400"
                  }`}
              >
                {customer.status}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Document list panel */}
        <div className="w-64 border-r border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 flex flex-col flex-shrink-0">
          <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Documents ({docs.length})
            </p>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {docs.map((doc) => (
              <button
                key={doc.id}
                onClick={() => setActiveDoc(doc)}
                className={`w-full flex items-start gap-3 px-3 py-3 rounded-xl text-left transition-colors
                  ${activeDoc.id === doc.id
                    ? "bg-brand-50 dark:bg-brand-500/10 border border-brand-100 dark:border-brand-500/20"
                    : "hover:bg-gray-50 dark:hover:bg-gray-800 border border-transparent"
                  }`}
              >
                <span className={`mt-0.5 ${activeDoc.id === doc.id ? "text-brand-500" : "text-gray-400 dark:text-gray-500"}`}>
                  <FileIcon />
                </span>
                <div className="min-w-0 flex-1">
                  <p className={`text-xs font-medium truncate ${activeDoc.id === doc.id ? "text-brand-700 dark:text-brand-300" : "text-gray-700 dark:text-gray-200"}`}>
                    {doc.name}
                  </p>
                  <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">
                    {doc.sizeMB >= 1000 ? `${(doc.sizeMB / 1000).toFixed(1)} GB` : `${doc.sizeMB} MB`} · {doc.pages} pages
                  </p>
                  <div className="flex items-center gap-1 mt-1.5">
                    <span className="inline-flex items-center gap-0.5 text-[10px] font-medium text-success-600 dark:text-success-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-success-500" />
                      Available
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Storage info */}
          <div className="p-4 border-t border-gray-100 dark:border-gray-800">
            <p className="text-[11px] text-gray-400 dark:text-gray-500 mb-2">Storage used</p>
            <div className="h-1.5 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
              <div className="h-full w-3/5 rounded-full bg-brand-500" />
            </div>
            <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1.5">
              {docs.reduce((s, d) => s + d.sizeMB, 0).toLocaleString()} MB of 2,048 MB
            </p>
          </div>
        </div>

        {/* Viewer panel */}
        <div className="flex-1 overflow-hidden bg-gray-50 dark:bg-gray-950">
          {activeDoc && <DocumentViewer doc={activeDoc} key={activeDoc.id} />}
        </div>
      </div>
    </div>
  );
}
