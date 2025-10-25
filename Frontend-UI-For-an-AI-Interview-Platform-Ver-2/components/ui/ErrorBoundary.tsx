import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-screen flex flex-col items-center justify-center bg-slate-900 text-white p-4">
            <div className="glass-card shadow-glass-glow text-center w-full max-w-lg p-8">
                <svg className="mx-auto text-red-500 w-16 h-16 mb-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                <h1 className="text-2xl font-bold mb-2">Oops! Something Went Wrong</h1>
                <p className="text-slate-300 mb-6">
                    We've encountered an unexpected error. Please try refreshing the page or clicking the button below.
                </p>
                <button
                    onClick={() => window.location.reload()}
                    className="btn-primary"
                >
                    Refresh Page
                </button>
            </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
