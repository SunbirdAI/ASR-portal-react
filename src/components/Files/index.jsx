import React, { useCallback, useEffect, useState } from "react";
import { getTranscripts } from "../../API";
import { getUserFacingErrorMessage } from "../../lib/error-utils";
import StatusBanner from "../StatusBanner";
import DataTable from "../DataTable/DataTable";

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
    <div className="col-span-12 space-y-4">
      <div className="p-5 items-stretch">
        <div
          className="py-3 rounded-2xl border"
          style={{
            background: "var(--color-surface)",
            borderColor: "var(--color-border)",
            boxShadow: "var(--color-elev-shadow)",
          }}
        >
          <p className="text-center font-medium antialiased text-2xl">
            Recent Files
          </p>

          <div className="px-5">
            <StatusBanner
              type="error"
              message={errorMessage}
              onDismiss={() => setErrorMessage("")}
            />
          </div>

          <div className="flex items-center justify-center">
            {loading ? (
              <i className="fa fa-spinner animate-spin py-5" aria-hidden="true" />
            ) : errorMessage ? (
              <button
                type="button"
                onClick={fetchData}
                className="rounded-full px-4 py-2 text-sm font-semibold"
                style={{
                  color: "var(--color-accent)",
                  background: "var(--color-surface)",
                  border: "1px solid var(--color-accent)",
                }}
              >
                Retry
              </button>
            ) : (
              <DataTable transcriptData={transcriptData} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Files;
