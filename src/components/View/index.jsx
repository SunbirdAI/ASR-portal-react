import React, { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { getSingleTranscript, updateTranscript } from "../../API";
import { getUserFacingErrorMessage } from "../../lib/error-utils";
import StatusBanner from "../StatusBanner";

const View = () => {
  const [edit, setEdit] = useState(false);
  const [transcriptData, setTranscriptData] = useState(null);
  const [newTranscript, setNewTranscript] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLoadingDetails, setIsLoadingDetails] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const { id } = useParams();

  const textareaRef = useRef(null);

  const fetchTranscript = useCallback(async () => {
    setIsLoadingDetails(true);
    setErrorMessage("");

    try {
      const data = await getSingleTranscript(id);
      setTranscriptData(data);
      setNewTranscript(data.transcription || "");
    } catch (error) {
      setErrorMessage(
        getUserFacingErrorMessage(
          error,
          "Unable to load this transcription right now."
        )
      );
    } finally {
      setIsLoadingDetails(false);
    }
  }, [id]);

  useEffect(() => {
    fetchTranscript();
  }, [fetchTranscript]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [newTranscript]);

  const saveTranscriptChanges = async () => {
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const update = await updateTranscript(id, newTranscript);
      setTranscriptData((previous) => ({
        ...previous,
        transcription: update?.transcription || newTranscript,
      }));
      setSuccessMessage("Changes saved successfully.");
      setEdit(false);
    } catch (error) {
      setErrorMessage(
        getUserFacingErrorMessage(error, "Unable to save changes right now.")
      );
    } finally {
      setLoading(false);
    }
  };

  if (isLoadingDetails) {
    return (
      <div className="flex items-center justify-center py-10">
        <i className="fa fa-spinner text-black fa-3x animate-spin" />
      </div>
    );
  }

  if (!transcriptData) {
    return (
      <div className="space-y-4">
        <StatusBanner
          type="error"
          message={errorMessage || "Unable to load this transcription."}
        />
        <button
          type="button"
          onClick={fetchTranscript}
          className="rounded-full px-4 py-2 text-sm font-semibold"
          style={{
            color: "var(--color-accent)",
            background: "var(--color-surface)",
            border: "1px solid var(--color-accent)",
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col space-y-6 pb-14">
        <div
          className="flex flex-col relative rounded-2xl border space-x-2 p-6"
          style={{
            background: "var(--color-surface)",
            borderColor: "var(--color-border)",
            boxShadow: "var(--color-elev-shadow)",
          }}
        >
          <StatusBanner
            type="error"
            message={errorMessage}
            onDismiss={() => setErrorMessage("")}
            className="mb-3"
          />
          <StatusBanner
            type="success"
            message={successMessage}
            onDismiss={() => setSuccessMessage("")}
            className="mb-3"
          />

          <div className="flex flex-col space-y-2">
            <div className="pr-12 lg:pr-0 relative">
              <div className="flex items-center justify-between space-x-2">
                <h1
                  className="text-3xl font-bold line-clamp-3 max-md:text-xl max-md:line-clamp-2"
                  title={transcriptData.filename}
                >
                  <span className="font-bold">{transcriptData.filename}</span>
                </h1>
                {edit ? (
                  <button
                    onClick={saveTranscriptChanges}
                    disabled={loading}
                    className="flex items-center justify-center hover:bg-[#EFEFED] rounded px-2 py-1"
                  >
                    <i
                      className={`fa ${
                        loading ? "fa-spinner animate-spin" : "fa-save"
                      } mr-2`}
                    />
                    {loading ? "Saving" : "Save"}
                  </button>
                ) : (
                  <button
                    onClick={() => setEdit(true)}
                    className="flex items-center justify-center hover:bg-[#EFEFED] rounded px-2 py-1"
                  >
                    <i className="fa fa-pencil mr-2" />
                    Edit
                  </button>
                )}
              </div>
            </div>
            <div className="italic mb-4">
              <p>
                Uploaded on: {" "}
                {new Date(transcriptData.uploaded).toLocaleString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                })}
              </p>
            </div>
          </div>

          <div className="flex flex-col space-y-4 p-4 font-gelasio text-lg max-sm:text-sm">
            {edit ? (
              <textarea
                ref={textareaRef}
                className="w-full border border-black/30 p-4 rounded-md focus:outline-sunbird-orange resize-none"
                value={newTranscript}
                onChange={(event) => setNewTranscript(event.target.value)}
              />
            ) : (
              <p>{transcriptData.transcription}</p>
            )}
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 right-0 left-0 border-t border-sunbird-orange z-50 bg-white py-2 flex items-center justify-center">
        <div className="max-w-screen-md pr-1 pl-1 mr-auto ml-auto flex justify-between items-center">
          <div className="pr-4 pl-4 md:pr-6 md:pl-6">
            <span className="font-bold text-sm line-clamp-1 text-center">
              {transcriptData.filename}
            </span>
          </div>

          <div className="md:pr-4 md:pl-4">
            <audio src={transcriptData.audio_file_url} controls />
          </div>
        </div>
      </div>
    </>
  );
};

export default View;
