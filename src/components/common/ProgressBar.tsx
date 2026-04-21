interface ProgressBarProps {
  value: number;       // 0–100
  label?: string;
  cancelable?: boolean;
  onCancel?: () => void;
  color?: "brand" | "success" | "warning" | "error";
}

export default function ProgressBar({ value, label, cancelable, onCancel, color = "brand" }: ProgressBarProps) {
  const colorMap = {
    brand: "bg-brand-500",
    success: "bg-success-500",
    warning: "bg-warning-500",
    error: "bg-error-500",
  };

  return (
    <div className="w-full">
      {(label || cancelable) && (
        <div className="flex items-center justify-between mb-1.5">
          {label && <span className="text-xs text-gray-500 dark:text-gray-400">{label}</span>}
          <div className="flex items-center gap-3 ml-auto">
            <span className="text-xs font-medium text-gray-600 dark:text-gray-300">{Math.round(value)}%</span>
            {cancelable && onCancel && (
              <button
                onClick={onCancel}
                className="text-xs text-error-500 hover:text-error-600 font-medium transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      )}
      <div className="h-2 w-full rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-300 ease-out ${colorMap[color]}`}
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        />
      </div>
    </div>
  );
}
