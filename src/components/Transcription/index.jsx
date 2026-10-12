import React, { useMemo, useState } from "react";
import SpeechToText from "../SpeechToText";
import TextToSpeech from "../TextToSpeech";
import { Mic, Volume2, Globe2 } from "lucide-react";

const MODE_CONFIG = [
  {
    id: "stt",
    label: "Speech to Text",
    badge: "51 African Languages",
    icon: Mic,
    description: "Transcribe spoken audio into high-accuracy text with per-segment timestamps.",
  },
  {
    id: "tts",
    label: "Text to Speech",
    badge: "Multilingual Voice",
    icon: Volume2,
    description: "Synthesize natural, human-like voice audio from written African language text.",
  },
];

const Transcription = () => {
  const [activeMode, setActiveMode] = useState("stt");

  const activeModeConfig = useMemo(
    () => MODE_CONFIG.find((mode) => mode.id === activeMode),
    [activeMode]
  );

  const handleTabKeyDown = (event) => {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    event.preventDefault();
    const currentIndex = MODE_CONFIG.findIndex((mode) => mode.id === activeMode);
    const nextIndex =
      event.key === "ArrowRight"
        ? (currentIndex + 1) % MODE_CONFIG.length
        : (currentIndex - 1 + MODE_CONFIG.length) % MODE_CONFIG.length;

    setActiveMode(MODE_CONFIG[nextIndex].id);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-6">
      {/* Platform Title Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-5" style={{ borderColor: "var(--color-border)" }}>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span
              className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border"
              style={{
                borderColor: "var(--color-border)",
                background: "var(--color-pill)",
                color: "var(--color-accent)",
              }}
            >
              <Globe2 size={12} />
              <span>Sunbird AI Speech Platform</span>
            </span>
          </div>
          <h1
            className="text-2xl sm:text-3xl font-bold tracking-tight m-0"
            style={{ color: "var(--color-text)" }}
          >
            Speech Studio
          </h1>
          <p
            className="text-xs sm:text-sm m-0 mt-1"
            style={{ color: "var(--color-muted)" }}
          >
            {activeModeConfig?.description}
          </p>
        </div>

        {/* Tab Switcher */}
        <div
          role="tablist"
          aria-label="Speech Studio Tools"
          className="p-1 rounded-2xl flex items-center gap-1 border self-start sm:self-auto"
          style={{
            background: "var(--color-pill)",
            borderColor: "var(--color-border)",
          }}
        >
          {MODE_CONFIG.map((mode) => {
            const Icon = mode.icon;
            const isActive = activeMode === mode.id;
            return (
              <button
                key={mode.id}
                id={`tab-${mode.id}`}
                role="tab"
                type="button"
                tabIndex={isActive ? 0 : -1}
                aria-selected={isActive}
                aria-controls={`panel-${mode.id}`}
                onClick={() => setActiveMode(mode.id)}
                onKeyDown={handleTabKeyDown}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all duration-150 outline-none ${
                  isActive
                    ? "shadow-sm scale-[1.01]"
                    : "hover:opacity-80"
                }`}
                style={{
                  background: isActive ? "var(--color-surface)" : "transparent",
                  color: isActive ? "var(--color-text)" : "var(--color-muted)",
                  border: isActive ? "1px solid var(--color-border)" : "1px solid transparent",
                }}
              >
                <Icon
                  size={15}
                  style={{ color: isActive ? "var(--color-accent)" : "currentColor" }}
                />
                <span>{mode.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Studio Panel: Keep both mounted so tab switching never resets user state */}
      <div className="w-full">
        <div
          id="panel-stt"
          role="tabpanel"
          aria-labelledby="tab-stt"
          className={activeMode === "stt" ? "block animate-fadeIn" : "hidden"}
        >
          <SpeechToText />
        </div>

        <div
          id="panel-tts"
          role="tabpanel"
          aria-labelledby="tab-tts"
          className={activeMode === "tts" ? "block animate-fadeIn" : "hidden"}
        >
          <TextToSpeech />
        </div>
      </div>
    </div>
  );
};

export default Transcription;
