import React, { useCallback, useEffect, useState } from "react";
import { getTranscripts } from "../../API";
import { getUserFacingErrorMessage } from "../../lib/error-utils";
import StatusBanner from "../StatusBanner";
import DataTable from "../DataTable/DataTable";
import { FolderGit2, RotateCcw } from "lucide-react";

const Files = () => {
  const [transcriptData, setTranscriptData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchData = useCallback(async () => {
    setLoading(true);
    setErrorMessage("");

    try {
      const response = await getTranscripts();
      setTranscriptData(response || []);
    } catch (error) {
      setErrorMessage(
        getUserFacingErrorMessage(
          error,
          "Unable to load recent files right now."
        )
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-5">
      {/* Page Title */}
      <div className="flex items-center justify-between border-b pb-4" style={{ borderColor: "var(--color-border)" }}>
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center border"
            style={{
              background: "var(--color-pill)",
              borderColor: "var(--color-border)",
              color: "var(--color-accent)",
            }}
          >
            <FolderGit2 size={20} />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight m-0" style={{ color: "var(--color-text)" }}>
              Recent Transcriptions
            </h1>
            <p className="text-xs m-0 mt-0.5" style={{ color: "var(--color-muted)" }}>
              View, inspect and edit speech files processed on your account.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={fetchData}
          disabled={loading}
          className="px-3.5 py-2 rounded-xl text-xs font-semibold border flex items-center gap-2 transition-all hover:opacity-80"
          style={{
            borderColor: "var(--color-border)",
            background: "var(--color-surface)",
            color: "var(--color-text)",
          }}
        >
          <RotateCcw size={13} className={loading ? "animate-spin" : ""} />
          <span>Refresh</span>
        </button>
      </div>

      <StatusBanner
        type="error"
        message={errorMessage}
        onDismiss={() => setErrorMessage("")}
      />

      {/* Main Table Container */}
      <div
        className="w-full rounded-2xl border p-4 sm:p-6 transition-all"
        style={{
          background: "var(--color-surface)",
          borderColor: "var(--color-border)",
          boxShadow: "var(--color-elev-soft)",
        }}
      >
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <span
              className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin"
              style={{ borderColor: "var(--color-accent)", borderTopColor: "transparent" }}
            />
            <p className="text-xs font-medium" style={{ color: "var(--color-muted)" }}>
              Loading your files...
            </p>
          </div>
        ) : errorMessage ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3 text-center">
            <p className="text-sm font-medium" style={{ color: "var(--color-muted)" }}>
              {errorMessage}
            </p>
            <button
              type="button"
              onClick={fetchData}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-white shadow-sm"
              style={{ background: "var(--color-accent)" }}
            >
              Try Again
            </button>
          </div>
        ) : (
          <DataTable transcriptData={transcriptData} />
        )}
      </div>
    </div>
  );
};

export default Files;
