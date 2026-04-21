const stats = [
  { label: "Monthly Revenue", value: "$124.5K", change: "+14.2%", up: true },
  { label: "Annual Revenue", value: "$1.38M", change: "+9.6%", up: true },
  { label: "Active Subscriptions", value: "3,241", change: "+231 this month", up: true },
  { label: "Avg. Deal Size", value: "$38.4K", change: "-2.1%", up: false },
];

const revenueMonths = [
  { month: "Jan", value: 65 },
  { month: "Feb", value: 72 },
  { month: "Mar", value: 58 },
  { month: "Apr", value: 84 },
  { month: "May", value: 91 },
  { month: "Jun", value: 78 },
  { month: "Jul", value: 95 },
  { month: "Aug", value: 88 },
  { month: "Sep", value: 102 },
  { month: "Oct", value: 97 },
  { month: "Nov", value: 115 },
  { month: "Dec", value: 124 },
];

const streams = [
  { name: "Premium Policies", amount: "$54,200", pct: 44, color: "#465fff" },
  { name: "Reinsurance", amount: "$28,100", pct: 23, color: "#22c55e" },
  { name: "Consulting", amount: "$21,800", pct: 17, color: "#f59e0b" },
  { name: "Digital Services", amount: "$20,400", pct: 16, color: "#8b5cf6" },
];

const transactions = [
  { id: "TXN-0091", client: "Allianz Group", type: "Premium Policy", amount: "+$12,400", date: "Apr 18, 2026", status: "Completed" },
  { id: "TXN-0090", client: "Munich Re", type: "Reinsurance", amount: "+$8,750", date: "Apr 17, 2026", status: "Completed" },
  { id: "TXN-0089", client: "Zurich Insurance", type: "Consulting", amount: "+$4,200", date: "Apr 16, 2026", status: "Pending" },
  { id: "TXN-0088", client: "AXA", type: "Digital Services", amount: "+$6,100", date: "Apr 15, 2026", status: "Completed" },
  { id: "TXN-0087", client: "Generali", type: "Premium Policy", amount: "+$9,300", date: "Apr 14, 2026", status: "Processing" },
];

const maxVal = Math.max(...revenueMonths.map((m) => m.value));

export default function IncomePage() {
  return (
    <div className="space-y-6 min-h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">Income</h2>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-0.5">Track revenue streams and financial performance</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-1.5 h-9 px-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-600 dark:text-gray-300 hover:border-gray-300 transition-colors">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            This Year
          </button>
          <button className="flex items-center gap-2 h-9 px-4 rounded-lg bg-brand-500 text-white text-sm font-medium hover:bg-brand-600 transition-colors">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Export
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800"
            style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)" }}>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{s.label}</p>
            <p className="text-2xl font-bold text-gray-800 dark:text-white mb-1">{s.value}</p>
            <p className={`text-xs font-semibold flex items-center gap-1 ${s.up ? "text-emerald-500" : "text-red-400"}`}>
              {s.up
                ? <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="18 15 12 9 6 15"/></svg>
                : <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>
              }
              {s.change}
            </p>
          </div>
        ))}
      </div>

      {/* Chart + Streams row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Bar chart */}
        <div className="xl:col-span-2 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5"
          style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)" }}>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-sm font-semibold text-gray-800 dark:text-white">Monthly Revenue</h3>
              <p className="text-xs text-gray-400 mt-0.5">Jan – Dec 2026</p>
            </div>
            <span className="text-xs bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2.5 py-1 rounded-full font-semibold">+14.2% YoY</span>
          </div>
          {/* Bar chart */}
          <div className="flex items-end gap-1.5 h-40">
            {revenueMonths.map((m) => (
              <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full rounded-t-md transition-all"
                  style={{
                    height: `${(m.value / maxVal) * 100}%`,
                    background: m.month === "Dec" ? "#465fff" : "rgba(70,95,255,0.18)",
                  }}
                />
                <span className="text-[9px] text-gray-400">{m.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue streams */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5"
          style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)" }}>
          <h3 className="text-sm font-semibold text-gray-800 dark:text-white mb-1">Revenue Streams</h3>
          <p className="text-xs text-gray-400 mb-5">This month breakdown</p>
          <div className="space-y-4">
            {streams.map((s) => (
              <div key={s.name}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{s.name}</span>
                  <span className="text-xs font-semibold text-gray-800 dark:text-white">{s.amount}</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-gray-100 dark:bg-gray-800">
                  <div className="h-full rounded-full" style={{ width: `${s.pct}%`, backgroundColor: s.color }} />
                </div>
                <p className="text-[10px] text-gray-400 mt-0.5">{s.pct}% of total</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Transactions table */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800"
        style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)" }}>
        <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-gray-800 dark:text-white">Recent Transactions</h3>
            <p className="text-xs text-gray-400 mt-0.5">Latest 5 income entries</p>
          </div>
          <button className="text-xs text-brand-500 hover:text-brand-600 font-medium transition-colors">View all</button>
        </div>
        <div>
          {/* Col headers */}
          <div className="flex items-center px-5 py-2.5 bg-gray-50/60 dark:bg-gray-800/30 border-b border-gray-100 dark:border-gray-800">
            <div className="flex-[1.5] text-[10px] font-semibold uppercase tracking-wide text-gray-400">TXN ID</div>
            <div className="flex-[2] text-[10px] font-semibold uppercase tracking-wide text-gray-400">Client</div>
            <div className="flex-[2] text-[10px] font-semibold uppercase tracking-wide text-gray-400 hidden sm:block">Type</div>
            <div className="flex-[1] text-[10px] font-semibold uppercase tracking-wide text-gray-400 hidden md:block">Date</div>
            <div className="flex-[1] text-[10px] font-semibold uppercase tracking-wide text-gray-400">Amount</div>
            <div className="flex-[1] text-[10px] font-semibold uppercase tracking-wide text-gray-400">Status</div>
          </div>
          {transactions.map((t) => (
            <div key={t.id} className="flex items-center px-5 py-3.5 border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50/60 dark:hover:bg-gray-800/40 transition-colors last:border-0">
              <div className="flex-[1.5]">
                <span className="text-xs font-mono text-brand-500">{t.id}</span>
              </div>
              <div className="flex-[2]">
                <span className="text-sm font-medium text-gray-800 dark:text-gray-100">{t.client}</span>
              </div>
              <div className="flex-[2] hidden sm:block">
                <span className="text-xs text-gray-500 dark:text-gray-400">{t.type}</span>
              </div>
              <div className="flex-[1] hidden md:block">
                <span className="text-xs text-gray-400">{t.date}</span>
              </div>
              <div className="flex-[1]">
                <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">{t.amount}</span>
              </div>
              <div className="flex-[1]">
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold
                  ${t.status === "Completed" ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
                  : t.status === "Pending" ? "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400"
                  : "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400"}`}>
                  {t.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
