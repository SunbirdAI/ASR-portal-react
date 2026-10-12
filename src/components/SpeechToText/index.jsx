import React, { useCallback, useEffect, useRef, useState } from "react";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import LinearProgress from "@mui/material/LinearProgress";
import { recognizeSpeech, sendFeedback } from "../../API";
import { ASR_LANGUAGE_OPTIONS } from "../../lib/asr-languages";
import { TrackGoogleAnalyticsEvent } from "../../lib/GoogleAnalyticsUtil";
import { getUserFacingErrorMessage } from "../../lib/error-utils";
import AudioInput from "../AudioInput";
import AudioPlayer from "../AudioPlayer/AudioPlayer";
import TranscriptionTextArea from "../TranscriptionTextArea";
import StatusBanner from "../StatusBanner";
import {
  Sparkles,
  RotateCcw,
  CheckCircle2,
  Star,
  PlusCircle,
  FileAudio,
} from "lucide-react";

const PREFERRED_LANGUAGE_KEY = "preferred_asr_language";

const filterLanguageOptions = createFilterOptions({
  stringify: (option) =>
    `${option.label} ${option.native || ""} ${option.value} ${option.region || ""}`,
});

const TRANSCRIPTION_PROGRESS_STAGES = [
  {
    minSeconds: 0,
    progress: 30,
    title: "Uploading & Preparing Audio",
    message: "Verifying audio format and transmitting to Sunbird AI inference cluster.",
  },
  {
    minSeconds: 8,
    progress: 65,
    title: "Recognizing African Speech",
    message: "Running acoustic model and language decoder with timestamp alignment.",
  },
  {
    minSeconds: 22,
    progress: 92,
    title: "Finalizing Transcripts",
    message: "Formatting timestamps and preparing final segments.",
  },
];

const getActiveProgressStage = (elapsedSeconds) =>
  TRANSCRIPTION_PROGRESS_STAGES.reduce((activeStage, stage) => {
    if (elapsedSeconds >= stage.minSeconds) return stage;
    return activeStage;
  }, TRANSCRIPTION_PROGRESS_STAGES[0]);

const SpeechToText = () => {
  const [language, setLanguage] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(PREFERRED_LANGUAGE_KEY) || "lug";
    }
    return "lug";
  });

  const [textOutput, setTextOutput] = useState("");
  const [timestamps, setTimestamps] = useState(null);
  const [audioFileName, setAudioFileName] = useState("");
  const [audioSrc, setAudioSrc] = useState("");
  const [audioData, setAudioData] = useState(null);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [loadingSeconds, setLoadingSeconds] = useState(0);

  // Audio synchronization
  const [currentAudioTime, setCurrentAudioTime] = useState(0);
  const [seekTargetTime, setSeekTargetTime] = useState(null);

  // Status & feedback
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [transcriptionID, setTranscriptionID] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [rating, setRating] = useState(0);
  const [feedbackComment, setFeedbackComment] = useState("");
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);

  useEffect(() => {
    return () => {
      if (audioSrc) URL.revokeObjectURL(audioSrc);
    };
  }, [audioSrc]);

  useEffect(() => {
    if (!isTranscribing) {
      setLoadingSeconds(0);
      return;
    }
    const timer = setInterval(() => {
      setLoadingSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [isTranscribing]);

  // Auto-scrolling refs
  const studioRef = useRef(null);
  const transcriptSectionRef = useRef(null);

  // Auto-scroll to studio view as soon as transcribing begins
  useEffect(() => {
    if (isTranscribing && studioRef.current) {
      const timer = setTimeout(() => {
        studioRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isTranscribing]);

  // When transcript arrives/shows, smoothly scroll it into full view
  useEffect(() => {
    if (textOutput && transcriptSectionRef.current) {
      const timer = setTimeout(() => {
        transcriptSectionRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [textOutput]);

  const handleAudioLoad = useCallback((data) => {
    setAudioData(data);
    setAudioFileName(data?.name || "audio_recording.wav");
    const nextUrl = URL.createObjectURL(data);
    setAudioSrc((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return nextUrl;
    });
    setErrorMessage("");
  }, []);

  const handleLanguageChange = (_event, selectedOption) => {
    if (selectedOption) {
      setLanguage(selectedOption.value);
      localStorage.setItem(PREFERRED_LANGUAGE_KEY, selectedOption.value);
    }
  };

  const handleTranscribe = useCallback(async () => {
    if (!audioData) return;

    TrackGoogleAnalyticsEvent(
      "Transcriptions",
      "Transcription Requested",
      "Transcribe Button"
    );

    setErrorMessage("");
    setSuccessMessage("");
    setIsTranscribing(true);
    setLoadingSeconds(0);

    try {
      const response = await recognizeSpeech(audioData, language);

      if (response.audio_transcription) {
        TrackGoogleAnalyticsEvent(
          "Transcriptions",
          "Transcription Successful",
          "Transcribe Button"
        );
        setTextOutput(response.audio_transcription);
        setTimestamps(response.segments ?? null);
        setTranscriptionID(response.audio_transcription_id || null);
      } else {
        setErrorMessage(
          "No clear speech detected in this audio sample. Please test with a clearer recording."
        );
      }
    } catch (err) {
      console.error("Transcription error:", err);
      setErrorMessage(
        getUserFacingErrorMessage(
          err,
          "Unable to transcribe audio right now. Please verify your connection and try again."
        )
      );
    } finally {
      setIsTranscribing(false);
    }
  }, [audioData, language]);

  const resetAll = () => {
    setTextOutput("");
    setTimestamps(null);
    setAudioData(null);
    setAudioFileName("");
    if (audioSrc) URL.revokeObjectURL(audioSrc);
    setAudioSrc("");
    setErrorMessage("");
    setSuccessMessage("");
    setShowFeedback(false);
    setRating(0);
    setFeedbackComment("");
    setTranscriptionID(null);
  };

  const handleFeedbackSubmit = async () => {
    if (!textOutput || !transcriptionID) return;
    setIsSubmittingFeedback(true);
    try {
      await sendFeedback(
        rating >= 4 ? "Good" : "Bad",
        "ASR_USER",
        language,
        textOutput,
        audioSrc,
        transcriptionID,
        feedbackComment
      );
      setSuccessMessage("Thank you! Your feedback helps train better models.");
      setShowFeedback(false);
      setRating(0);
      setFeedbackComment("");
    } catch {
      setErrorMessage("Unable to submit feedback right now.");
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  const currentStage = getActiveProgressStage(loadingSeconds);
  const selectedLangObj =
    ASR_LANGUAGE_OPTIONS.find((l) => l.value === language) || ASR_LANGUAGE_OPTIONS[0];

  const hasResultOrInProgress = Boolean(textOutput || isTranscribing);

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Notifications */}
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

      {/* PHASE 1: Focused Intake View (When no transcript exists yet) */}
      {!hasResultOrInProgress && (
        <div className="w-full max-w-3xl mx-auto flex flex-col gap-5 transition-all duration-300">
          {/* Audio Input Card */}
          <div
            className="rounded-3xl p-6 sm:p-8 border flex flex-col gap-5"
            style={{
              background: "var(--color-surface)",
              borderColor: "var(--color-border)",
              boxShadow: "var(--color-elev-shadow)",
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base sm:text-lg font-bold m-0" style={{ color: "var(--color-text)" }}>
                  Upload or Record Speech
                </h2>
                <p className="text-xs m-0 mt-0.5" style={{ color: "var(--color-muted)" }}>
                  Select an audio file or record directly from your microphone
                </p>
              </div>

              {audioData && (
                <span
                  className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-full"
                  style={{
                    background: "var(--color-accent-soft)",
                    color: "var(--color-accent)",
                  }}
                >
                  <CheckCircle2 size={13} />
                  <span>Audio Ready</span>
                </span>
              )}
            </div>

            <AudioInput onAudioSubmit={handleAudioLoad} isLoading={isTranscribing} />

            {/* If audio was loaded, show player right here */}
            {audioSrc && (
              <div className="pt-2 border-t" style={{ borderColor: "var(--color-border)" }}>
                <AudioPlayer
                  audioSrc={audioSrc}
                  fileName={audioFileName}
                  onTimeUpdate={setCurrentAudioTime}
                />
              </div>
            )}
          </div>

          {/* Language Selection & Action Card */}
          <div
            className="rounded-3xl p-6 sm:p-7 border flex flex-col gap-4"
            style={{
              background: "var(--color-surface)",
              borderColor: "var(--color-border)",
              boxShadow: "var(--color-elev-soft)",
            }}
          >
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--color-muted)" }}>
                Source African Language
              </label>

              <Autocomplete
                autoHighlight
                disableClearable
                filterOptions={filterLanguageOptions}
                getOptionLabel={(option) => `${option.label} (${option.native || option.value})`}
                isOptionEqualToValue={(option, value) => option.value === value.value}
                onChange={handleLanguageChange}
                options={ASR_LANGUAGE_OPTIONS}
                value={selectedLangObj}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Search 51 African languages..."
                    size="small"
                  />
                )}
                renderOption={(props, option) => {
                  const optProps = { ...props };
                  delete optProps.key;
                  return (
                    <li
                      key={option.value}
                      {...optProps}
                      className="flex items-center justify-between gap-3 px-3 py-2 text-xs"
                    >
                      <div className="flex flex-col">
                        <span className="font-semibold">{option.label}</span>
                        {option.native && (
                          <span className="text-[11px]" style={{ color: "var(--color-muted)" }}>
                            {option.native} {option.region ? `· ${option.region}` : ""}
                          </span>
                        )}
                      </div>
                      <span className="font-mono text-xs px-1.5 py-0.5 rounded" style={{ background: "var(--color-pill)" }}>
                        {option.value}
                      </span>
                    </li>
                  );
                }}
                slotProps={{
                  paper: {
                    sx: {
                      color: "var(--color-text)",
                      backgroundColor: "var(--color-surface)",
                      border: "1px solid var(--color-border)",
                      borderRadius: "0.75rem",
                      boxShadow: "var(--color-elev-shadow)",
                    },
                  },
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    color: "var(--color-text)",
                    backgroundColor: "var(--color-pill)",
                    borderRadius: "0.75rem",
                    fontSize: "0.875rem",
                    "& fieldset": { borderColor: "var(--color-border)" },
                    "&:hover fieldset": { borderColor: "var(--color-accent)" },
                    "&.Mui-focused fieldset": { borderColor: "var(--color-accent)" },
                  },
                }}
              />
            </div>

            {/* Primary Action Button */}
            <button
              type="button"
              onClick={handleTranscribe}
              disabled={!audioData || isTranscribing}
              className="w-full py-3.5 px-5 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2.5 transition-all shadow-sm active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed mt-2"
              style={{
                background: "var(--color-accent)",
                color: "#ffffff",
              }}
            >
              <Sparkles size={16} />
              <span>
                Transcribe Audio in {selectedLangObj.label}
              </span>
            </button>
          </div>
        </div>
      )}

      {/* PHASE 2: Full Workspace Studio (When transcribing or transcript is available) */}
      {hasResultOrInProgress && (
        <div ref={studioRef} className="w-full max-w-3xl mx-auto flex flex-col gap-6 animate-fadeIn scroll-mt-6">
          {/* Top Control Bar: Audio Info, Player & "New Audio" Button */}
          <div
            className="rounded-3xl p-5 sm:p-6 border flex flex-col gap-4"
            style={{
              background: "var(--color-surface)",
              borderColor: "var(--color-border)",
              boxShadow: "var(--color-elev-soft)",
            }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
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
                <div className="truncate">
                  <h3 className="text-sm sm:text-base font-bold m-0 truncate" style={{ color: "var(--color-text)" }}>
                    {audioFileName || "Audio Track"}
                  </h3>
                  <div className="flex items-center gap-2 text-xs" style={{ color: "var(--color-muted)" }}>
                    <span className="font-semibold" style={{ color: "var(--color-accent)" }}>
                      {selectedLangObj.label} ({selectedLangObj.value.toUpperCase()})
                    </span>
                    <span>·</span>
                    <span>{timestamps ? `${timestamps.length} timed segments` : "Full transcript"}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 self-end sm:self-auto">
                <button
                  type="button"
                  onClick={handleTranscribe}
                  disabled={isTranscribing}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-all hover:opacity-80"
                  style={{
                    borderColor: "var(--color-border)",
                    background: "var(--color-pill)",
                    color: "var(--color-text)",
                  }}
                  title="Re-run transcription"
                >
                  <RotateCcw size={13} className={isTranscribing ? "animate-spin" : ""} />
                  <span>Re-transcribe</span>
                </button>

                <button
                  type="button"
                  onClick={resetAll}
                  disabled={isTranscribing}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all hover:opacity-90"
                  style={{
                    background: "var(--color-accent)",
                    color: "#ffffff",
                  }}
                  title="Upload another audio file"
                >
                  <PlusCircle size={14} />
                  <span>New Audio</span>
                </button>
              </div>
            </div>

            {/* Audio Waveform Player with live sync */}
            {audioSrc && (
              <div className="pt-2 border-t" style={{ borderColor: "var(--color-border)" }}>
                <AudioPlayer
                  audioSrc={audioSrc}
                  fileName={audioFileName}
                  onTimeUpdate={setCurrentAudioTime}
                  seekTime={seekTargetTime}
                />
              </div>
            )}

            {/* Progress Stage if actively transcribing */}
            {isTranscribing && (
              <div
                className="p-4 rounded-2xl border flex flex-col gap-2 mt-2"
                style={{
                  background: "var(--color-pill)",
                  borderColor: "var(--color-border)",
                }}
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold">{currentStage.title}</span>
                  <span className="font-mono">{loadingSeconds}s elapsed</span>
                </div>
                <p className="text-xs m-0" style={{ color: "var(--color-muted)" }}>
                  {currentStage.message}
                </p>
                <LinearProgress
                  variant="determinate"
                  value={currentStage.progress}
                  sx={{
                    borderRadius: "999px",
                    height: 5,
                    backgroundColor: "var(--color-surface)",
                    "& .MuiLinearProgress-bar": {
                      backgroundColor: "var(--color-accent)",
                    },
                  }}
                />
              </div>
            )}
          </div>

          {/* Transcript Box - Takes Center Stage */}
          <div ref={transcriptSectionRef} className="w-full scroll-mt-6">
            <TranscriptionTextArea
              text={textOutput}
              setText={setTextOutput}
              timestamps={timestamps}
              setTimestamps={setTimestamps}
              isLoading={isTranscribing}
              fileName={audioFileName}
              language={language}
              currentAudioTime={currentAudioTime}
              onSeekAudio={(time) => setSeekTargetTime(time)}
              placeholder="Transcribing audio with timestamps..."
            />
          </div>

          {/* Feedback Card */}
          {textOutput && (
            <div
              className="rounded-2xl p-4 border transition-all"
              style={{
                background: "var(--color-surface)",
                borderColor: "var(--color-border)",
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Star size={16} style={{ color: "var(--color-accent)" }} />
                  <span className="text-xs font-semibold" style={{ color: "var(--color-text)" }}>
                    How was this transcription accuracy?
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setShowFeedback((p) => !p)}
                  className="text-xs font-medium underline"
                  style={{ color: "var(--color-accent)" }}
                >
                  {showFeedback ? "Hide" : "Rate & Comment"}
                </button>
              </div>

              {showFeedback && (
                <div className="mt-3 flex flex-col gap-3 pt-3 border-t" style={{ borderColor: "var(--color-border)" }}>
                  <div className="flex items-center gap-2">
                    <span className="text-xs" style={{ color: "var(--color-muted)" }}>
                      Rating:
                    </span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className="p-1 text-base transition-transform hover:scale-110"
                          style={{
                            color: star <= rating ? "var(--color-accent)" : "var(--color-muted)",
                          }}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                  </div>

                  <input
                    type="text"
                    placeholder="Optional notes to improve our language models..."
                    value={feedbackComment}
                    onChange={(e) => setFeedbackComment(e.target.value)}
                    className="p-2.5 rounded-xl text-xs border outline-none"
                    style={{
                      background: "var(--color-pill)",
                      borderColor: "var(--color-border)",
                      color: "var(--color-text)",
                    }}
                  />

                  <button
                    type="button"
                    onClick={handleFeedbackSubmit}
                    disabled={isSubmittingFeedback || !rating}
                    className="self-end px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white transition-opacity"
                    style={{ background: "var(--color-accent)" }}
                  >
                    {isSubmittingFeedback ? "Sending..." : "Submit Feedback"}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default SpeechToText;