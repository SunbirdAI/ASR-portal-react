import React, { useEffect, useState } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import LinearProgress from "@mui/material/LinearProgress";
import { generateSpeech, getSpeechVoices } from "../../API";
import { getUserFacingErrorMessage } from "../../lib/error-utils";
import {
  DEFAULT_TTS_LANGUAGE,
  getTtsLanguage,
  TTS_LANGUAGE_OPTIONS,
} from "../../lib/tts-languages";
import { samplePhraseDict } from "../../constants";
import AudioPlayer from "../AudioPlayer/AudioPlayer";
import StatusBanner from "../StatusBanner";
import {
  Volume2,
  Sparkles,
  Download,
  RotateCcw,
  CheckCircle2,
  Sliders,
  Type,
} from "lucide-react";

const MAX_TEXT_LENGTH = 600;
const PREFERRED_TTS_LANG_KEY = "preferred_tts_language";

const TTS_PROGRESS_STAGES = [
  {
    minSeconds: 0,
    progress: 30,
    title: "Synthesizing text request",
    message: "Analyzing phonetic structure and intonation contours.",
  },
  {
    minSeconds: 7,
    progress: 65,
    title: "Generating natural voice audio",
    message: "Rendering multi-speaker neural audio waveform.",
  },
  {
    minSeconds: 18,
    progress: 92,
    title: "Finalizing audio stream",
    message: "Encoding output audio for streaming and download.",
  },
];

const getTtsProgressStage = (elapsed) =>
  TTS_PROGRESS_STAGES.reduce((act, st) => {
    if (elapsed >= st.minSeconds) return st;
    return act;
  }, TTS_PROGRESS_STAGES[0]);

const getLanguageSamplePhrases = (langCode) => {
  const entry = samplePhraseDict[langCode];
  if (!entry || !entry[0] || !Array.isArray(entry[0][1])) return [];
  return entry[0][1];
};

const TextToSpeech = () => {
  const [textInput, setTextInput] = useState("");
  const [isExampleSelected, setIsExampleSelected] = useState(false);
  const [selectedExampleIndex, setSelectedExampleIndex] = useState(null);
  const [hasUserTyped, setHasUserTyped] = useState(false);
  const [language, setLanguage] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(PREFERRED_TTS_LANG_KEY) || DEFAULT_TTS_LANGUAGE;
    }
    return DEFAULT_TTS_LANGUAGE;
  });
  const [voice, setVoice] = useState("");
  const [voiceCatalog, setVoiceCatalog] = useState({});
  const [isLoadingVoices, setIsLoadingVoices] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingSeconds, setLoadingSeconds] = useState(0);
  const [audioUrl, setAudioUrl] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Load available voice catalog
  useEffect(() => {
    let isActive = true;
    const fetchVoices = async () => {
      try {
        const response = await getSpeechVoices();
        if (isActive) {
          setVoiceCatalog(response.by_language || {});
        }
      } catch (err) {
        console.error("Voices fetch error:", err);
      } finally {
        if (isActive) setIsLoadingVoices(false);
      }
    };
    fetchVoices();
    return () => {
      isActive = false;
    };
  }, []);

  // Timer
  useEffect(() => {
    if (!isGenerating) {
      setLoadingSeconds(0);
      return;
    }
    const timer = setInterval(() => {
      setLoadingSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [isGenerating]);

  const selectedLangObj = getTtsLanguage(language) || TTS_LANGUAGE_OPTIONS[0];
  const availableVoices = voiceCatalog[language] || [];
  const charsLeft = MAX_TEXT_LENGTH - textInput.length;
  const isNearLimit = charsLeft < 60;

  // Sample phrases for the current language (defaults to [] if none configured for this language)
  const samplePhrases = getLanguageSamplePhrases(language);

  const handleLanguageChange = (_e, option) => {
    if (option) {
      const nextLang = option.value;
      setLanguage(nextLang);
      setVoice("");
      setAudioUrl("");
      localStorage.setItem(PREFERRED_TTS_LANG_KEY, nextLang);

      // If user had loaded an example and hasn't manually typed custom text,
      // update textInput to the matching example phrase of the new language
      if (isExampleSelected && !hasUserTyped) {
        const nextPhrases = getLanguageSamplePhrases(nextLang);
        if (nextPhrases.length > 0) {
          const nextIndex =
            selectedExampleIndex !== null && selectedExampleIndex < nextPhrases.length
              ? selectedExampleIndex
              : 0;
          setTextInput(nextPhrases[nextIndex]);
          setSelectedExampleIndex(nextIndex);
        } else {
          // If the new language doesn't have examples, clear the example text
          setTextInput("");
          setIsExampleSelected(false);
          setSelectedExampleIndex(null);
        }
      }
    }
  };

  const handleTextChange = (e) => {
    const val = e.target.value;
    setTextInput(val);
    if (val.trim().length > 0) {
      setHasUserTyped(true);
      setIsExampleSelected(false);
      setSelectedExampleIndex(null);
    } else {
      setHasUserTyped(false);
      setIsExampleSelected(false);
      setSelectedExampleIndex(null);
    }
  };

  const handleSelectExample = (phrase, idx) => {
    setTextInput(phrase);
    setIsExampleSelected(true);
    setSelectedExampleIndex(idx);
    setHasUserTyped(false);
  };

  const handleClearExample = () => {
    setTextInput("");
    setIsExampleSelected(false);
    setSelectedExampleIndex(null);
    setHasUserTyped(false);
  };

  const handleGenerate = async () => {
    const trimmed = textInput.trim();
    if (!trimmed) {
      setErrorMessage("Please enter or select some text before generating speech.");
      return;
    }

    setIsGenerating(true);
    setErrorMessage("");
    setSuccessMessage("");
    setLoadingSeconds(0);

    try {
      const response = await generateSpeech(trimmed, { language, voice });
      setAudioUrl(response.audio_url);
      setSuccessMessage("Speech generated successfully!");
    } catch (err) {
      console.error("TTS generation error:", err);
      setErrorMessage(
        getUserFacingErrorMessage(
          err,
          "Unable to synthesize voice audio right now. Please try again."
        )
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleReset = () => {
    setTextInput("");
    setIsExampleSelected(false);
    setSelectedExampleIndex(null);
    setHasUserTyped(false);
    setAudioUrl("");
    setErrorMessage("");
    setSuccessMessage("");
  };

  const handleDownloadAudio = () => {
    if (!audioUrl) return;
    const a = document.createElement("a");
    a.href = audioUrl;
    a.download = `sunbird_tts_${language}_${Date.now()}.mp3`;
    a.target = "_blank";
    a.click();
  };

  const currentStage = getTtsProgressStage(loadingSeconds);

  return (
    <div className="w-full flex flex-col gap-6">
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Text Input & Sample phrases */}
        <div className="lg:col-span-7 flex flex-col gap-5">
          <div
            className="rounded-2xl p-5 border flex flex-col gap-3"
            style={{
              background: "var(--color-surface)",
              borderColor: "var(--color-border)",
              boxShadow: "var(--color-elev-soft)",
            }}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--color-muted)" }}>
                Step 1 · Text Input
              </span>

              {/* Live Character Counter */}
              <span
                className={`text-xs font-mono font-medium ${
                  isNearLimit ? "text-amber-500 font-bold" : ""
                }`}
                style={{ color: isNearLimit ? "var(--color-accent)" : "var(--color-muted)" }}
              >
                {textInput.length} / {MAX_TEXT_LENGTH} chars
              </span>
            </div>

            <textarea
              rows={6}
              maxLength={MAX_TEXT_LENGTH}
              value={textInput}
              onChange={handleTextChange}
              placeholder={
                samplePhrases.length > 0
                  ? `Type or paste text in ${selectedLangObj.label}, or pick an example below...`
                  : `Type or paste ${selectedLangObj.label} text to synthesize into voice...`
              }
              className="w-full p-4 rounded-xl border text-sm leading-relaxed outline-none transition-all resize-none focus:ring-2 focus:ring-amber-500/20"
              style={{
                background: "var(--color-pill)",
                borderColor: "var(--color-border)",
                color: "var(--color-text)",
              }}
            />

            {/* Quick Sample Phrase Chips - only visible when user has not typed custom text and examples exist */}
            {!hasUserTyped && samplePhrases.length > 0 && (
              <div className="flex flex-col gap-2 mt-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold" style={{ color: "var(--color-muted)" }}>
                    Try an example phrase:
                  </span>
                  {isExampleSelected && (
                    <button
                      type="button"
                      onClick={handleClearExample}
                      className="text-xs hover:underline cursor-pointer"
                      style={{ color: "var(--color-muted)" }}
                    >
                      Clear example
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {samplePhrases.slice(0, 3).map((phrase, idx) => {
                    const isSelected = isExampleSelected && selectedExampleIndex === idx;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSelectExample(phrase, idx)}
                        className={`px-2.5 py-1.5 rounded-lg text-xs text-left border transition-all hover:opacity-80 truncate max-w-full ${
                          isSelected ? "ring-2 ring-amber-500/40 font-medium" : ""
                        }`}
                        style={{
                          background: isSelected ? "var(--color-accent-soft)" : "var(--color-surface)",
                          borderColor: isSelected ? "var(--color-accent)" : "var(--color-border)",
                          color: isSelected ? "var(--color-accent)" : "var(--color-text)",
                        }}
                        title={phrase}
                      >
                        "{phrase.length > 55 ? `${phrase.slice(0, 55)}...` : phrase}"
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Voice & Generation Actions */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          {/* Language & Voice Selector Card */}
          <div
            className="rounded-2xl p-5 border flex flex-col gap-4"
            style={{
              background: "var(--color-surface)",
              borderColor: "var(--color-border)",
              boxShadow: "var(--color-elev-soft)",
            }}
          >
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--color-muted)" }}>
              Step 2 · Language & Voice
            </span>

            {/* Language Selector */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium" style={{ color: "var(--color-text)" }}>
                Language
              </label>
              <Autocomplete
                disableClearable
                options={TTS_LANGUAGE_OPTIONS}
                getOptionLabel={(opt) => `${opt.label} (${opt.value})`}
                value={selectedLangObj}
                onChange={handleLanguageChange}
                renderInput={(params) => (
                  <TextField {...params} size="small" placeholder="Select TTS language..." />
                )}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    color: "var(--color-text)",
                    backgroundColor: "var(--color-pill)",
                    borderRadius: "0.75rem",
                    fontSize: "0.875rem",
                    "& fieldset": { borderColor: "var(--color-border)" },
                  },
                }}
              />
            </div>

            {/* Speaker Voice Selector */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium" style={{ color: "var(--color-text)" }}>
                Speaker Voice
              </label>
              {availableVoices.length > 0 ? (
                <div className="grid grid-cols-2 gap-2">
                  {availableVoices.map((v, i) => {
                    const isSelected = voice === v || (!voice && i === 0);
                    return (
                      <button
                        key={v}
                        type="button"
                        onClick={() => setVoice(v)}
                        className={`p-2.5 rounded-xl border text-xs font-medium transition-all ${
                          isSelected ? "shadow-sm" : "hover:opacity-80"
                        }`}
                        style={{
                          background: isSelected ? "var(--color-accent-soft)" : "var(--color-pill)",
                          borderColor: isSelected ? "var(--color-accent)" : "var(--color-border)",
                          color: isSelected ? "var(--color-accent)" : "var(--color-text)",
                        }}
                      >
                        Voice {i + 1}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div
                  className="p-3 rounded-xl text-xs border"
                  style={{
                    background: "var(--color-pill)",
                    borderColor: "var(--color-border)",
                    color: "var(--color-muted)",
                  }}
                >
                  {isLoadingVoices ? "Loading voices..." : "Default natural neural voice"}
                </div>
              )}
            </div>

            {/* Generate Trigger */}
            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={handleGenerate}
                disabled={isGenerating || !textInput.trim()}
                className="flex-1 py-3 px-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-sm active:scale-[0.99] disabled:opacity-50"
                style={{
                  background: "var(--color-accent)",
                  color: "#ffffff",
                }}
              >
                {isGenerating ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Synthesizing... ({loadingSeconds}s)</span>
                  </>
                ) : (
                  <>
                    <Volume2 size={16} />
                    <span>Generate Speech</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleReset}
                disabled={isGenerating}
                className="py-3 px-3.5 rounded-xl text-xs font-semibold border transition-colors hover:opacity-80"
                style={{
                  borderColor: "var(--color-border)",
                  background: "var(--color-pill)",
                  color: "var(--color-muted)",
                }}
              >
                <RotateCcw size={14} />
              </button>
            </div>

            {/* Progress Bar */}
            {isGenerating && (
              <div
                className="p-3.5 rounded-xl border flex flex-col gap-2 mt-1"
                style={{
                  background: "var(--color-pill)",
                  borderColor: "var(--color-border)",
                }}
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold">{currentStage.title}</span>
                  <span className="font-mono">{loadingSeconds}s elapsed</span>
                </div>
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

          {/* Audio Output Player Card */}
          {audioUrl && (
            <div
              className="rounded-2xl p-5 border flex flex-col gap-3"
              style={{
                background: "var(--color-surface)",
                borderColor: "var(--color-border)",
                boxShadow: "var(--color-elev-soft)",
              }}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--color-accent)" }}>
                  Generated Audio Result
                </span>

                <button
                  type="button"
                  onClick={handleDownloadAudio}
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition-all hover:opacity-80"
                  style={{
                    borderColor: "var(--color-border)",
                    background: "var(--color-pill)",
                    color: "var(--color-text)",
                  }}
                >
                  <Download size={13} />
                  <span>Download MP3</span>
                </button>
              </div>

              <AudioPlayer audioSrc={audioUrl} fileName={`TTS_${language}_output.mp3`} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TextToSpeech;
