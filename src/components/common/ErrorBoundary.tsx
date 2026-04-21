import { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // In production, send to error reporting service
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.error("[ErrorBoundary]", error, info.componentStack);
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="flex flex-col items-center justify-center min-h-[200px] p-8 text-center">
          <div className="w-12 h-12 rounded-2xl bg-error-50 dark:bg-error-500/15 flex items-center justify-center mx-auto mb-4">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" strokeWidth="2.5" />
            </svg>
          </div>
          <p className="text-sm font-semibold text-gray-800 dark:text-white mb-1">Something went wrong</p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mb-4 max-w-xs">
            {this.state.error?.message ?? "An unexpected error occurred."}
          </p>
          <button
            onClick={this.handleRetry}
            className="px-4 py-2 rounded-lg bg-brand-500 text-white text-sm font-medium hover:bg-brand-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
