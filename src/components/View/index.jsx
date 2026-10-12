import React, { useCallback, useEffect, useRef, useState } from "react";
import { useParams, NavLink } from "react-router-dom";
import { getSingleTranscript, updateTranscript } from "../../API";
import { getUserFacingErrorMessage } from "../../lib/error-utils";
import StatusBanner from "../StatusBanner";
import AudioPlayer from "../AudioPlayer/AudioPlayer";
import {
  ArrowLeft,
  Edit3,
  Save,
  Check,
  Calendar,
  FileAudio,
} from "lucide-react";

const View = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [transcriptData, setTranscriptData] = useState(null);
  const [newTranscript, setNewTranscript] = useState("");
  const [isSaving, setIsSaving] = useState(false);
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
  }, [newTranscript, isEditing]);

  const saveTranscriptChanges = async () => {
    setIsSaving(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const update = await updateTranscript(id, newTranscript);
      setTranscriptData((prev) => ({
        ...prev,
        transcription: update?.transcription || newTranscript,
      }));
      setSuccessMessage("Changes saved successfully.");
      setIsEditing(false);
    } catch (error) {
      setErrorMessage(
        getUserFacingErrorMessage(error, "Unable to save changes right now.")
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoadingDetails) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <span
          className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin"
          style={{ borderColor: "var(--color-accent)", borderTopColor: "transparent" }}
        />
        <p className="text-xs font-medium" style={{ color: "var(--color-muted)" }}>
          Loading transcription...
        </p>
      </div>
    );
  }

  if (!transcriptData) {
    return (
      <div className="max-w-3xl mx-auto py-12 flex flex-col items-center gap-4 text-center">
        <StatusBanner
          type="error"
          message={errorMessage || "Unable to load this transcription."}
        />
        <button
          type="button"
          onClick={fetchTranscript}
          className="px-4 py-2 rounded-xl text-xs font-semibold text-white"
          style={{ background: "var(--color-accent)" }}
        >
          Try Again
        </button>
      </div>
    );
  }

  const uploadDate = transcriptData.uploaded
    ? new Date(transcriptData.uploaded).toLocaleString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Unknown date";

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-6">
      {/* Back button & top bar */}
      <div className="flex items-center justify-between">
        <NavLink
          to="/files"
          className="inline-flex items-center gap-1.5 text-xs font-semibold no-underline transition-colors hover:opacity-80"
          style={{ color: "var(--color-muted)" }}
        >
          <ArrowLeft size={14} />
          <span>Back to Files</span>
        </NavLink>

        {isEditing ? (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setNewTranscript(transcriptData.transcription || "");
                setIsEditing(false);
              }}
              className="px-3 py-1.5 rounded-xl text-xs font-medium border"
              style={{
                borderColor: "var(--color-border)",
                color: "var(--color-muted)",
              }}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={saveTranscriptChanges}
              disabled={isSaving}
              className="px-4 py-1.5 rounded-xl text-xs font-semibold text-white flex items-center gap-1.5 shadow-sm"
              style={{ background: "var(--color-accent)" }}
            >
              <Save size={13} />
              <span>{isSaving ? "Saving..." : "Save Changes"}</span>
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="px-3.5 py-1.5 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-all hover:opacity-85 shadow-sm"
            style={{
              borderColor: "var(--color-border)",
              background: "var(--color-surface)",
              color: "var(--color-accent)",
            }}
          >
            <Edit3 size={13} />
            <span>Edit Transcript</span>
          </button>
        )}
      </div>

      <StatusBanner
        type="error"
        message={errorMessage}
        onDismiss={() => setErrorMessage("")}
      />
      <StatusBanner
        type="success"
        message={successMessage}
        onDismiss={() => setSuccessMessage("")}
      />

      {/* Main File Header Card */}
      <div
        className="rounded-2xl p-6 border flex flex-col gap-4"
        style={{
          background: "var(--color-surface)",
          borderColor: "var(--color-border)",
          boxShadow: "var(--color-elev-soft)",
        }}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border"
              style={{
                background: "var(--color-pill)",
                borderColor: "var(--color-border)",
                color: "var(--color-accent)",
              }}
            >
              <FileAudio size={20} />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold tracking-tight m-0" style={{ color: "var(--color-text)" }}>
                {transcriptData.filename || "Untitled File"}
              </h1>
              <div className="flex items-center gap-2 mt-1 text-xs" style={{ color: "var(--color-muted)" }}>
                <Calendar size={12} />
                <span>Uploaded: {uploadDate}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Embedded Custom Audio Player */}
        {transcriptData.audio_file_url && (
          <div className="mt-2">
            <AudioPlayer
              audioSrc={transcriptData.audio_file_url}
              fileName={transcriptData.filename}
            />
          </div>
        )}
      </div>

      {/* Transcript Text Body Card */}
      <div
        className="rounded-2xl p-6 border flex flex-col gap-3 min-h-[300px]"
        style={{
          background: "var(--color-surface)",
          borderColor: "var(--color-border)",
          boxShadow: "var(--color-elev-soft)",
        }}
      >
        <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--color-muted)" }}>
          Transcription Text
        </span>

        {isEditing ? (
          <textarea
            ref={textareaRef}
            rows={10}
            value={newTranscript}
            onChange={(e) => setNewTranscript(e.target.value)}
            className="w-full p-4 rounded-xl border text-sm leading-relaxed outline-none focus:ring-2 focus:ring-amber-500/20"
            style={{
              background: "var(--color-pill)",
              borderColor: "var(--color-border)",
              color: "var(--color-text)",
            }}
          />
        ) : (
          <p
            className="text-sm sm:text-base leading-relaxed m-0 whitespace-pre-wrap font-normal"
            style={{ color: "var(--color-text)" }}
          >
            {transcriptData.transcription || "No transcription content available."}
          </p>
        )}
      </div>
    </div>
  );
};

export default View;
