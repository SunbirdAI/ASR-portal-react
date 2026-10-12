import React, { useEffect, useRef, useState } from "react";
import { Mic, Square, UploadCloud } from "lucide-react";
import Swal from "sweetalert2";

const formatSeconds = (sec) => {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
};

const AudioInput = ({ onAudioSubmit, isLoading }) => {
  const [dragActive, setDragActive] = useState(false);
  const [recording, setRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const timerRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const startRecording = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      Swal.fire({
        icon: "error",
        title: "Microphone Not Supported",
        text: "Your browser does not support audio recording. Please upload an audio file instead.",
      });
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      const chunks = [];
      mediaRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunks.push(e.data);
      };

      mediaRecorder.onstop = () => {
        if (chunks.length > 0) {
          const audioBlob = new Blob(chunks, { type: "audio/wav" });
          const audioFile = new File([audioBlob], `recording_${Date.now()}.wav`, {
            type: "audio/wav",
          });
          onAudioSubmit(audioFile);
        }
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
        }
      };

      setRecordSeconds(0);
      mediaRecorder.start();
      setRecording(true);

      timerRef.current = setInterval(() => {
        setRecordSeconds((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.error("Microphone access error:", err);
      Swal.fire({
        icon: "warning",
        title: "Microphone Access Required",
        text: "Please enable microphone permission in your browser settings to record audio.",
      });
    }
  };

  const stopRecording = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
    }
    setRecording(false);
  };

  const handleValidateAndSubmitFile = (file) => {
    if (!file) return;

    if (!file.type.startsWith("audio/") && !/\.(mp3|wav|m4a|ogg|flac|aac|wma)$/i.test(file.name)) {
      Swal.fire({
        icon: "error",
        title: "Unsupported Format",
        text: "Please upload a valid audio file (.mp3, .wav, .m4a, .ogg, .flac).",
      });
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      Swal.fire({
        icon: "error",
        title: "File Too Large",
        text: "Audio files are limited to 15MB. For enterprise quotas, please contact info@sunbird.ai.",
      });
      return;
    }

    onAudioSubmit(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) handleValidateAndSubmitFile(file);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleValidateAndSubmitFile(file);
  };

  return (
    <div className="w-full flex flex-col gap-3">
      {/* Drag & Drop Zone */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !isLoading && fileInputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            fileInputRef.current?.click();
          }
        }}
        className={`relative w-full rounded-2xl border-2 border-dashed p-6 sm:p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 outline-none ${
          dragActive
            ? "border-amber-500 scale-[1.01]"
            : "hover:border-amber-500/70"
        }`}
        style={{
          background: dragActive ? "var(--color-accent-soft)" : "transparent",
          borderColor: dragActive ? "var(--color-accent)" : "var(--color-border)",
        }}
      >
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3 transition-transform group-hover:scale-110"
          style={{ background: "transparent", color: "var(--color-accent)" }}
        >
          <UploadCloud size={28} />
        </div>

        <p className="font-semibold text-sm sm:text-base m-0 mb-1" style={{ color: "var(--color-text)" }}>
          Drag & drop audio here, or <span style={{ color: "var(--color-accent)" }}>browse files</span>
        </p>

        <p className="text-xs m-0" style={{ color: "var(--color-muted)" }}>
          Supports MP3, WAV, M4A, OGG, FLAC · Up to 15MB (15 mins)
        </p>

        <input
          ref={fileInputRef}
          type="file"
          accept="audio/*,.mp3,.wav,.m4a,.ogg,.flac"
          onChange={handleFileChange}
          style={{ display: "none" }}
          disabled={isLoading}
        />
      </div>

      {/* Or Divider & Microphone Action */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-[1px]" style={{ background: "var(--color-border)" }} />
        <span className="text-xs uppercase font-medium tracking-wider" style={{ color: "var(--color-muted)" }}>
          Or Record Live
        </span>
        <div className="flex-1 h-[1px]" style={{ background: "var(--color-border)" }} />
      </div>

      {/* Recording Bar Card */}
      <div
        className="w-full rounded-2xl p-3.5 flex items-center justify-between gap-3 border transition-all"
        style={{
          background: recording ? "var(--color-accent-soft)" : "transparent",
          borderColor: recording ? "var(--color-accent)" : "var(--color-border)",
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
              recording ? "animate-pulse" : ""
            }`}
            style={{
              background: recording ? "var(--color-accent)" : "var(--color-pill)",
              color: recording ? "#ffffff" : "var(--color-text)",
            }}
          >
            {recording ? <Square size={16} fill="currentColor" /> : <Mic size={18} />}
          </div>

          <div>
            <p className="text-sm font-semibold m-0" style={{ color: "var(--color-text)" }}>
              {recording ? "Recording in progress..." : "Voice recording"}
            </p>
            <p className="text-xs m-0" style={{ color: "var(--color-muted)" }}>
              {recording
                ? `Recording time: ${formatSeconds(recordSeconds)}`
                : "Capture audio directly from your microphone"}
            </p>
          </div>
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={recording ? stopRecording : startRecording}
          disabled={isLoading}
          className="px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all active:scale-95 shadow-sm"
          style={{
            backgroundColor: recording ? "var(--color-accent)" : "transparent",
            color: recording ? "#ffffff" : "var(--color-text)",
            border: `1px solid ${recording ? "var(--color-accent)" : "var(--color-border)"}`,
          }}
        >
          {recording ? (
            <>
              <Square size={13} fill="currentColor" />
              <span>Stop & Use</span>
            </>
          ) : (
            <>
              <Mic size={14} />
              <span>Record</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default AudioInput;
