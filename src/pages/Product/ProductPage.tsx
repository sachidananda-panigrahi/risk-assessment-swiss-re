function BoxIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  );
}

const stats = [
  { label: "Total Products", value: "248", change: "+12 this month", up: true, color: "bg-blue-50 dark:bg-blue-500/10", iconColor: "text-blue-500" },
  { label: "Active Listings", value: "186", change: "+5 this week", up: true, color: "bg-emerald-50 dark:bg-emerald-500/10", iconColor: "text-emerald-500" },
  { label: "Categories", value: "12", change: "2 new added", up: true, color: "bg-purple-50 dark:bg-purple-500/10", iconColor: "text-purple-500" },
  { label: "Total Revenue", value: "$48.2K", change: "+8.4% vs last month", up: true, color: "bg-amber-50 dark:bg-amber-500/10", iconColor: "text-amber-500" },
];

const categories = [
  { name: "Risk Policies", count: 48, icon: "🛡️" },
  { name: "Insurance Plans", count: 36, icon: "📋" },
  { name: "Reinsurance", count: 29, icon: "🔄" },
  { name: "Assessments", count: 41, icon: "📊" },
  { name: "Compliance Kits", count: 18, icon: "✅" },
  { name: "Analytics Tools", count: 22, icon: "🔍" },
];

export default function ProductPage() {
  return (
    <div className="space-y-6 min-h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">Products</h2>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-0.5">Manage your product catalog and listings</p>
        </div>
        <button className="flex items-center gap-2 h-9 px-4 rounded-lg bg-brand-500 text-white text-sm font-medium hover:bg-brand-600 transition-colors">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
          Add Product
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800"
            style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)" }}>
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-gray-500 dark:text-gray-400">{s.label}</p>
              <span className={`w-9 h-9 rounded-xl flex items-center justify-center ${s.color} ${s.iconColor}`}>
                <BoxIcon />
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-800 dark:text-white mb-1">{s.value}</p>
            <p className="text-xs text-emerald-500 font-medium flex items-center gap-1">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="18 15 12 9 6 15"/></svg>
              {s.change}
            </p>
          </div>
        ))}
      </div>

      {/* Categories */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800"
        style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)" }}>
        <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-gray-800 dark:text-white">Product Categories</h3>
            <p className="text-xs text-gray-400 mt-0.5">Browse by category</p>
          </div>
          <button className="text-xs text-brand-500 hover:text-brand-600 font-medium transition-colors">View all</button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-0 divide-x divide-y divide-gray-100 dark:divide-gray-800">
          {categories.map((cat) => (
            <button key={cat.name}
              className="flex flex-col items-center justify-center gap-2 p-6 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group">
              <span className="text-3xl">{cat.icon}</span>
              <p className="text-xs font-semibold text-gray-700 dark:text-gray-200 text-center leading-tight">{cat.name}</p>
              <span className="text-[10px] text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">{cat.count} items</span>
            </button>
          ))}
        </div>
      </div>

      {/* Product list placeholder */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800"
        style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)" }}>
        <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-gray-800 dark:text-white">All Products</h3>
            <p className="text-xs text-gray-400 mt-0.5">248 products in catalog</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input placeholder="Search products..." className="h-8 w-48 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 pl-8 pr-3 text-xs text-gray-700 dark:text-gray-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/10" />
            </div>
          </div>
        </div>

        {/* Empty state */}
        <div className="flex flex-col items-center justify-center py-24 px-6">
          <div className="w-20 h-20 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-5">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
              <line x1="12" y1="22.08" x2="12" y2="12" />
            </svg>
          </div>
          <h4 className="text-base font-semibold text-gray-700 dark:text-gray-200 mb-2">No products yet</h4>
          <p className="text-sm text-gray-400 dark:text-gray-500 text-center max-w-xs mb-6">
            Add your first product to start managing your catalog and track performance.
          </p>
          <button className="flex items-center gap-2 h-9 px-5 rounded-lg bg-brand-500 text-white text-sm font-medium hover:bg-brand-600 transition-colors">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
            Add First Product
          </button>
        </div>
      </div>
    </div>
  );
}
