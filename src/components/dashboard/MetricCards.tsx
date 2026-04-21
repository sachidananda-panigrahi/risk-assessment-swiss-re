interface MetricCard {
  label: string;
  value: string;
  change: string;
  changeType: "up" | "down";
  icon: React.ReactNode;
  avatars?: string[];
}

const metrics: MetricCard[] = [
  {
    label: "Total Customers",
    value: "5,423",
    change: "16% this month",
    changeType: "up",
    icon: (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    label: "Members",
    value: "1,893",
    change: "1% this month",
    changeType: "down",
    icon: (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
      </svg>
    ),
  },
  {
    label: "Active Now",
    value: "189",
    change: "8.5% this month",
    changeType: "up",
    icon: (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
    avatars: ["E", "J", "M", "K"],
  },
];

export default function MetricCards() {
  return (
    <div
      className="bg-white dark:bg-gray-900 rounded-2xl flex flex-col sm:flex-row"
      style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08), 0 4px 16px rgba(0,0,0,0.06)" }}
    >
      {metrics.map((metric, idx) => (
        <div
          key={metric.label}
          className={`flex-1 p-6 flex items-center gap-5
            ${idx < metrics.length - 1
              ? "border-b border-gray-100 dark:border-gray-800 sm:border-b-0 sm:border-r"
              : ""
            }`}
        >
          {/* Green circle icon */}
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: "rgba(220, 252, 231, 0.8)" }}
          >
            {metric.icon}
          </div>

          {/* Text block */}
          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-400 dark:text-gray-500 mb-1">{metric.label}</p>
            <p className="text-3xl font-bold text-gray-800 dark:text-white tracking-tight leading-none mb-1.5">
              {metric.value}
            </p>
            <p className={`text-xs font-semibold flex items-center gap-1 ${metric.changeType === "up" ? "text-emerald-500" : "text-red-400"}`}>
              {metric.changeType === "up" ? (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="18 15 12 9 6 15" /></svg>
              ) : (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9" /></svg>
              )}
              {metric.change}
            </p>
          </div>

          {/* Stacked avatars for Active Now */}
          {metric.avatars && (
            <div className="flex -space-x-2 flex-shrink-0 self-start">
              {metric.avatars.map((_, i) => (
                <div
                  key={i}
                  className="w-7 h-7 rounded-full ring-2 ring-white dark:ring-gray-900 bg-gradient-to-br from-brand-300 to-brand-600 flex items-center justify-center text-[10px] font-medium text-white"
                  style={{ zIndex: metric.avatars!.length - i }}
                >
                  {["E", "J", "M", "K"][i]}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
