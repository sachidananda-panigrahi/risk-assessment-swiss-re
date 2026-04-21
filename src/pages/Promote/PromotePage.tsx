const stats = [
  { label: "Active Campaigns", value: "8", change: "+2 this month", up: true, badge: "bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400" },
  { label: "Total Impressions", value: "1.24M", change: "+18.3%", up: true, badge: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400" },
  { label: "Conversions", value: "4,821", change: "+11.7%", up: true, badge: "bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400" },
  { label: "Avg. ROI", value: "312%", change: "+28% vs last quarter", up: true, badge: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400" },
];

const campaigns = [
  {
    name: "Q2 Risk Awareness Drive",
    type: "Email",
    status: "Active",
    budget: "$8,400",
    spent: "$5,120",
    spentPct: 61,
    impressions: "284K",
    conversions: 1204,
    color: "#465fff",
  },
  {
    name: "SME Insurance Outreach",
    type: "Social",
    status: "Active",
    budget: "$6,200",
    spent: "$2,980",
    spentPct: 48,
    impressions: "198K",
    conversions: 892,
    color: "#22c55e",
  },
  {
    name: "Reinsurance Partner Blast",
    type: "Direct Mail",
    status: "Paused",
    budget: "$4,500",
    spent: "$4,500",
    spentPct: 100,
    impressions: "42K",
    conversions: 318,
    color: "#f59e0b",
  },
  {
    name: "Digital Broker Acquisition",
    type: "PPC",
    status: "Active",
    budget: "$12,000",
    spent: "$7,240",
    spentPct: 60,
    impressions: "716K",
    conversions: 2407,
    color: "#8b5cf6",
  },
];

const channels = [
  { name: "Email", impressions: "284K", cvr: "5.2%", icon: "✉️" },
  { name: "Social Media", impressions: "198K", cvr: "4.1%", icon: "📱" },
  { name: "PPC / Search", impressions: "716K", cvr: "3.8%", icon: "🔎" },
  { name: "Direct Mail", impressions: "42K", cvr: "2.9%", icon: "📬" },
];

const statusColor: Record<string, string> = {
  Active: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
  Paused: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",
  Ended: "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400",
};

export default function PromotePage() {
  return (
    <div className="space-y-6 min-h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">Promotions</h2>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-0.5">Manage campaigns, channels, and marketing ROI</p>
        </div>
        <button className="flex items-center gap-2 h-9 px-4 rounded-lg bg-brand-500 text-white text-sm font-medium hover:bg-brand-600 transition-colors">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
          New Campaign
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800"
            style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)" }}>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-gray-500 dark:text-gray-400">{s.label}</p>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${s.badge}`}>Live</span>
            </div>
            <p className="text-2xl font-bold text-gray-800 dark:text-white mb-1">{s.value}</p>
            <p className="text-xs text-emerald-500 font-medium flex items-center gap-1">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="18 15 12 9 6 15"/></svg>
              {s.change}
            </p>
          </div>
        ))}
      </div>

      {/* Channels row */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800"
        style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)" }}>
        <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800">
          <h3 className="text-sm font-semibold text-gray-800 dark:text-white">Channel Performance</h3>
          <p className="text-xs text-gray-400 mt-0.5">Impressions and conversion rate by channel</p>
        </div>
        <div className="grid grid-cols-2 xl:grid-cols-4 divide-x divide-y xl:divide-y-0 divide-gray-100 dark:divide-gray-800">
          {channels.map((ch) => (
            <div key={ch.name} className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">{ch.icon}</span>
                <span className="text-sm font-semibold text-gray-800 dark:text-white">{ch.name}</span>
              </div>
              <div className="space-y-1">
                <div>
                  <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-0.5">Impressions</p>
                  <p className="text-lg font-bold text-gray-800 dark:text-white">{ch.impressions}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-0.5">CVR</p>
                  <p className="text-sm font-semibold text-brand-500">{ch.cvr}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Campaigns */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800"
        style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)" }}>
        <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-gray-800 dark:text-white">Active Campaigns</h3>
            <p className="text-xs text-gray-400 mt-0.5">Budget utilisation and performance</p>
          </div>
          <button className="text-xs text-brand-500 hover:text-brand-600 font-medium transition-colors">View all</button>
        </div>
        <div className="divide-y divide-gray-50 dark:divide-gray-800">
          {campaigns.map((c) => (
            <div key={c.name} className="px-5 py-4 hover:bg-gray-50/60 dark:hover:bg-gray-800/40 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0 mt-1" style={{ backgroundColor: c.color }} />
                  <div>
                    <p className="text-sm font-semibold text-gray-800 dark:text-white leading-tight">{c.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{c.type} · {c.impressions} impressions</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className="text-right hidden sm:block">
                    <p className="text-xs text-gray-400">Conversions</p>
                    <p className="text-sm font-semibold text-gray-800 dark:text-white">{c.conversions.toLocaleString()}</p>
                  </div>
                  <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${statusColor[c.status]}`}>{c.status}</span>
                </div>
              </div>
              {/* Budget bar */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-1.5 rounded-full bg-gray-100 dark:bg-gray-800">
                  <div className="h-full rounded-full transition-all" style={{ width: `${c.spentPct}%`, backgroundColor: c.color }} />
                </div>
                <span className="text-[10px] text-gray-400 whitespace-nowrap">{c.spent} / {c.budget}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
