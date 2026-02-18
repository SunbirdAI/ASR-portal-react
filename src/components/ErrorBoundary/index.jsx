import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    console.error("Unhandled render error:", error);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center px-4">
          <div
            className="w-full max-w-lg rounded-2xl p-6"
            style={{
              background: "var(--color-surface)",
              border: "1px solid var(--color-border)",
              boxShadow: "var(--color-elev-shadow)",
            }}
          >
            <h1 className="m-0 text-2xl">Something went wrong</h1>
            <p className="mt-3 mb-0 text-sm text-[var(--color-muted)]">
              The application encountered an unexpected error. Please refresh to
              continue.
            </p>
            <button
              type="button"
              onClick={this.handleReload}
              className="mt-5 rounded-full px-4 py-2 text-sm font-semibold"
              style={{
                color: "var(--color-accent)",
                background: "var(--color-surface)",
                border: "1px solid var(--color-accent)",
              }}
            >
              Reload App
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
