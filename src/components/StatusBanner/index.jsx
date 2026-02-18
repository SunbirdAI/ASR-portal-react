import React from "react";

const stylesByType = {
  error: {
    background: "var(--color-accent-soft)",
    border: "1px solid rgba(217, 119, 6, 0.45)",
  },
  success: {
    background: "var(--color-pill)",
    border: "1px solid var(--color-border)",
  },
  info: {
    background: "var(--color-pill)",
    border: "1px solid var(--color-border)",
  },
};

const StatusBanner = ({
  message,
  type = "info",
  className = "",
  onDismiss = null,
}) => {
  if (!message) return null;

  return (
    <div
      role={type === "error" ? "alert" : "status"}
      aria-live={type === "error" ? "assertive" : "polite"}
      className={`w-full rounded-xl px-4 py-3 text-sm text-[var(--color-text)] ${className}`}
      style={stylesByType[type] || stylesByType.info}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="m-0 leading-6">{message}</p>
        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-2 py-1 text-xs text-[var(--color-text)]"
            aria-label="Dismiss message"
          >
            Dismiss
          </button>
        )}
      </div>
    </div>
  );
};

export default StatusBanner;
