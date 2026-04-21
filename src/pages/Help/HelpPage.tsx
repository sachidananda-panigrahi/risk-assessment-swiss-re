import { useState } from "react";

const categories = [
  { name: "Getting Started", desc: "Onboarding, setup, account basics", icon: "🚀", count: 12 },
  { name: "Risk Assessment", desc: "How assessments work and data inputs", icon: "🛡️", count: 18 },
  { name: "Documents", desc: "Upload, annotate, and manage documents", icon: "📄", count: 9 },
  { name: "Billing & Plans", desc: "Invoices, subscriptions, upgrades", icon: "💳", count: 7 },
  { name: "Integrations", desc: "API, webhooks, third-party systems", icon: "🔌", count: 14 },
  { name: "Security & RBAC", desc: "Roles, permissions, access control", icon: "🔒", count: 11 },
];

const faqs = [
  {
    q: "How do I assign a risk assessment to a customer?",
    a: "Navigate to Customers, open the row actions menu (⋮) for any customer, and select 'Assign'. Choose an agent from the dropdown and confirm. The assignment appears in the customer's detail view immediately.",
  },
  {
    q: "What file formats are supported for document upload?",
    a: "The document workspace supports PDF, DOCX, XLSX, and image files (PNG, JPG). Maximum file size is 1 GB per document. Files are streamed in chunks for optimal performance.",
  },
  {
    q: "How does role-based access control work?",
    a: "There are three roles: Admin (full access), Agent (read, edit, assign, view documents), and Viewer (read + view documents only). Roles can be switched from the header role switcher for demo purposes.",
  },
  {
    q: "Can I export the customer data to CSV or Excel?",
    a: "Yes. From the Customers page toolbar, click 'Export' and choose your format. The export respects active search filters, so you can export filtered subsets of your 20,000-row dataset.",
  },
  {
    q: "How do I add comments or annotations to a document?",
    a: "Open a document in the Document Workspace, click the annotate icon in the toolbar, then click anywhere on the document page to drop a comment. Annotations are saved per-document per-user.",
  },
];

const tickets = [
  { id: "#TKT-0042", subject: "Document viewer not loading for large PDFs", priority: "High", status: "Open", updated: "2h ago" },
  { id: "#TKT-0041", subject: "Export button missing for Viewer role", priority: "Medium", status: "In Progress", updated: "5h ago" },
  { id: "#TKT-0040", subject: "Row actions menu closes on scroll", priority: "Low", status: "Resolved", updated: "1d ago" },
  { id: "#TKT-0039", subject: "Sort by name not persisting after page reload", priority: "Medium", status: "Resolved", updated: "2d ago" },
];

const priorityColor: Record<string, string> = {
  High: "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400",
  Medium: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",
  Low: "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400",
};

const statusColor: Record<string, string> = {
  Open: "bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400",
  "In Progress": "bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400",
  Resolved: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
};

export default function HelpPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [search, setSearch] = useState("");

  return (
    <div className="space-y-6 min-h-[calc(100vh-8rem)]">
      {/* Hero search */}
      <div className="rounded-2xl p-8 text-center"
        style={{ background: "linear-gradient(135deg, #3730a3 0%, #465fff 60%, #6366f1 100%)" }}>
        <h2 className="text-2xl font-bold text-white mb-2">How can we help you?</h2>
        <p className="text-indigo-200 text-sm mb-6">Search our knowledge base or browse categories below</p>
        <div className="relative max-w-md mx-auto">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search articles, guides, FAQs..."
            className="w-full h-11 rounded-xl bg-white pl-11 pr-4 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50 shadow-lg"
          />
        </div>
      </div>

      {/* Categories */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">Browse by Category</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
          {categories.map((cat) => (
            <button key={cat.name}
              className="bg-white dark:bg-gray-900 rounded-2xl p-4 text-left border border-gray-100 dark:border-gray-800 hover:border-brand-300 dark:hover:border-brand-500 hover:shadow-md transition-all group"
              style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
              <span className="text-2xl mb-2 block">{cat.icon}</span>
              <p className="text-xs font-semibold text-gray-800 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors leading-tight mb-1">{cat.name}</p>
              <p className="text-[10px] text-gray-400 leading-tight">{cat.count} articles</p>
            </button>
          ))}
        </div>
      </div>

      {/* FAQ + Tickets row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {/* FAQ accordion */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800"
          style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)" }}>
          <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800">
            <h3 className="text-sm font-semibold text-gray-800 dark:text-white">Frequently Asked Questions</h3>
            <p className="text-xs text-gray-400 mt-0.5">Quick answers to common questions</p>
          </div>
          <div className="divide-y divide-gray-50 dark:divide-gray-800">
            {faqs.map((faq, i) => (
              <div key={i}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-start justify-between gap-3 px-5 py-4 text-left hover:bg-gray-50/60 dark:hover:bg-gray-800/40 transition-colors"
                >
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-100 leading-snug">{faq.q}</span>
                  <svg
                    width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                    strokeLinecap="round" strokeLinejoin="round"
                    className={`flex-shrink-0 mt-0.5 text-gray-400 transition-transform ${openFaq === i ? "rotate-180" : ""}`}>
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Support tickets */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800"
          style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)" }}>
          <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-gray-800 dark:text-white">Support Tickets</h3>
              <p className="text-xs text-gray-400 mt-0.5">Recent requests and their status</p>
            </div>
            <button className="flex items-center gap-1.5 h-8 px-3 rounded-lg bg-brand-500 text-white text-xs font-medium hover:bg-brand-600 transition-colors">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
              New Ticket
            </button>
          </div>
          <div className="divide-y divide-gray-50 dark:divide-gray-800">
            {tickets.map((t) => (
              <div key={t.id} className="px-5 py-4 hover:bg-gray-50/60 dark:hover:bg-gray-800/40 transition-colors">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-100 leading-snug">{t.subject}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5 font-mono">{t.id} · {t.updated}</p>
                  </div>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${statusColor[t.status]}`}>{t.status}</span>
                </div>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${priorityColor[t.priority]}`}>{t.priority}</span>
              </div>
            ))}
          </div>
          {/* CTA footer */}
          <div className="px-5 py-4 border-t border-gray-50 dark:border-gray-800 bg-gray-50/40 dark:bg-gray-800/20 rounded-b-2xl text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Can't find what you need?{" "}
              <button className="text-brand-500 hover:text-brand-600 font-medium transition-colors">Contact support →</button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
