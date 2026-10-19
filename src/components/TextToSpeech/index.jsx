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
      const saved = localStorage.getItem(PREFERRED_TTS_LANG_KEY);
      if (saved && getTtsLanguage(saved)) {
        return saved;
      }
      return DEFAULT_TTS_LANGUAGE;
    }
    return DEFAULT_TTS_LANGUAGE;
  });
  const [voice, setVoice] = useState("");
  const [genderFilter, setGenderFilter] = useState("all");
  const [voiceCatalog, setVoiceCatalog] = useState({});
  const [voicesData, setVoicesData] = useState({});
  const [isLoadingVoices, setIsLoadingVoices] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingSeconds, setLoadingSeconds] = useState(0);
  const [audioUrl, setAudioUrl] = useState("");
  const [generatedSpeaker, setGeneratedSpeaker] = useState("");
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
          setVoicesData(response.voices || {});
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
  const availableVoiceNames = voiceCatalog[language] || [];
  const languageVoiceObjects = voicesData[language] || [];
  const voicesToDisplay = availableVoiceNames.map((name) => {
    const detail = languageVoiceObjects.find((item) => item.name === name);
    return {
      name,
      gender: detail?.gender || null,
    };
  });
  const femaleVoiceCount = voicesToDisplay.filter((v) => v.gender === "female").length;
  const maleVoiceCount = voicesToDisplay.filter((v) => v.gender === "male").length;
  const hasMultipleGenders = femaleVoiceCount > 0 && maleVoiceCount > 0;
  const visibleVoices = voicesToDisplay.filter((v) => {
    if (genderFilter === "female") return v.gender === "female";
    if (genderFilter === "male") return v.gender === "male";
    return true;
  });
  const charsLeft = MAX_TEXT_LENGTH - textInput.length;
  const isNearLimit = charsLeft < 60;

  // Sample phrases for the current language (defaults to [] if none configured for this language)
  const samplePhrases = getLanguageSamplePhrases(language);

  const handleLanguageChange = (_e, option) => {
    if (option) {
      const nextLang = option.value;
      setLanguage(nextLang);
      setVoice("");
      setGenderFilter("all");
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

    const activeVoice = voice || (voicesToDisplay[0]?.name || "");

    try {
      const response = await generateSpeech(trimmed, { language, voice: activeVoice });
      setAudioUrl(response.audio_url);
      setGeneratedSpeaker(activeVoice);
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
    setVoice("");
    setGenderFilter("all");
    setAudioUrl("");
    setGeneratedSpeaker("");
    setErrorMessage("");
    setSuccessMessage("");
  };

  const handleDownloadAudio = () => {
    if (!audioUrl) return;
    const speakerTag = (generatedSpeaker || voice || voicesToDisplay[0]?.name || "")
      .trim()
      .replace(/\s+/g, "_");
    const a = document.createElement("a");
    a.href = audioUrl;
    a.download = speakerTag
      ? `sunbird_tts_${language}_${speakerTag}_${Date.now()}.mp3`
      : `sunbird_tts_${language}_${Date.now()}.mp3`;
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
        <div className="lg:col-span-5 flex flex-col gap-5 min-w-0">
          {/* Language & Voice Selector Card */}
          <div
            className="rounded-2xl p-4 sm:p-5 border flex flex-col gap-4 min-w-0"
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
                autoHighlight
                disableClearable
                isOptionEqualToValue={(option, value) => option.value === value.value}
                options={TTS_LANGUAGE_OPTIONS}
                getOptionLabel={(opt) => `${opt.label} (${opt.value})`}
                value={selectedLangObj}
                onChange={handleLanguageChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    size="small"
                    placeholder="Select TTS language..."
                    inputProps={{
                      ...params.inputProps,
                      autoComplete: "off",
                      enterKeyHint: "done",
                      style: {
                        fontSize: "16px", // 16px font prevents iOS Safari from automatically zooming/jumping viewport on mobile
                      },
                    }}
                  />
                )}
                renderOption={(props, option) => {
                  const optProps = { ...props };
                  delete optProps.key;
                  return (
                    <li
                      key={option.value}
                      {...optProps}
                      className="flex items-center justify-between gap-3 px-3.5 py-2.5 text-xs cursor-pointer hover:bg-amber-500/10 transition-colors"
                      style={{ color: "var(--color-text)" }}
                    >
                      <span className="font-semibold text-xs">{option.label}</span>
                      <span
                        className="font-mono text-[11px] px-1.5 py-0.5 rounded"
                        style={{
                          background: "var(--color-pill)",
                          color: "var(--color-muted)",
                        }}
                      >
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
                      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.2)",
                      marginTop: "4px",
                      maxHeight: "260px",
                    },
                  },
                  popper: {
                    modifiers: [
                      {
                        name: "preventOverflow",
                        options: {
                          boundary: "viewport",
                          padding: 8,
                        },
                      },
                      {
                        name: "flip",
                        options: {
                          fallbackPlacements: ["bottom-start", "top-start"],
                        },
                      },
                    ],
                    sx: {
                      zIndex: 1400,
                      maxWidth: "calc(100vw - 32px)",
                    },
                  },
                }}
                sx={{
                  width: "100%",
                  "& .MuiOutlinedInput-root": {
                    color: "var(--color-text)",
                    backgroundColor: "var(--color-pill)",
                    borderRadius: "0.75rem",
                    fontSize: "16px", // Prevents iOS mobile viewport zoom
                    "& fieldset": { borderColor: "var(--color-border)" },
                    "&:hover fieldset": { borderColor: "var(--color-accent)" },
                    "&.Mui-focused fieldset": { borderColor: "var(--color-accent)" },
                  },
                  "& .MuiInputBase-input": {
                    fontSize: "16px !important", // Prevents iOS mobile viewport zoom
                    color: "var(--color-text)",
                  },
                }}
              />
            </div>

            {/* Speaker Voice Selector */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium" style={{ color: "var(--color-text)" }}>
                  Speaker Voice
                </label>
                {voicesToDisplay.length > 0 && (
                  <span className="text-[11px]" style={{ color: "var(--color-muted)" }}>
                    {voicesToDisplay.length} {voicesToDisplay.length === 1 ? "voice" : "voices"} available
                  </span>
                )}
              </div>              {/* Quick Gender Filter Pills when language has both male and female voices */}
              {hasMultipleGenders && (
                <div
                  className="flex items-center gap-1.5 p-1 rounded-xl border"
                  style={{ background: "var(--color-pill)", borderColor: "var(--color-border)" }}
                >
                  <button
                    type="button"
                    onClick={() => setGenderFilter("all")}
                    className={`flex-1 py-1 px-2 rounded-lg text-xs font-medium transition-all text-center ${
                      genderFilter === "all" ? "shadow-sm font-semibold" : "hover:opacity-80"
                    }`}
                    style={{
                      background: genderFilter === "all" ? "var(--color-surface)" : "transparent",
                      color: genderFilter === "all" ? "var(--color-accent)" : "var(--color-muted)",
                    }}
                  >
                    All ({voicesToDisplay.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setGenderFilter("female")}
                    className={`flex-1 py-1 px-2 rounded-lg text-xs font-medium transition-all text-center ${
                      genderFilter === "female" ? "shadow-sm font-semibold" : "hover:opacity-80"
                    }`}
                    style={{
                      background: genderFilter === "female" ? "var(--color-surface)" : "transparent",
                      color: genderFilter === "female" ? "var(--color-accent)" : "var(--color-muted)",
                    }}
                  >
                    Female ({femaleVoiceCount})
                  </button>
                  <button
                    type="button"
                    onClick={() => setGenderFilter("male")}
                    className={`flex-1 py-1 px-2 rounded-lg text-xs font-medium transition-all text-center ${
                      genderFilter === "male" ? "shadow-sm font-semibold" : "hover:opacity-80"
                    }`}
                    style={{
                      background: genderFilter === "male" ? "var(--color-surface)" : "transparent",
                      color: genderFilter === "male" ? "var(--color-accent)" : "var(--color-muted)",
                    }}
                  >
                    Male ({maleVoiceCount})
                  </button>
                </div>
              )}

              {/* Voice Cards */}
              {visibleVoices.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[300px] overflow-y-auto pr-0.5">
                  {visibleVoices.map((v) => {
                    const isSelected = voice === v.name || (!voice && v.name === voicesToDisplay[0]?.name);
                    return (
                      <button
                        key={v.name}
                        type="button"
                        onClick={() => setVoice(v.name)}
                        className={`p-2.5 rounded-xl border text-xs transition-all flex items-center justify-between gap-2.5 text-left w-full cursor-pointer ${
                          isSelected
                            ? "shadow-sm ring-1 ring-amber-500/40"
                            : "hover:border-amber-500/30"
                        }`}
                        style={{
                          background: isSelected ? "var(--color-accent-soft)" : "var(--color-pill)",
                          borderColor: isSelected ? "var(--color-accent)" : "var(--color-border)",
                          color: "var(--color-text)",
                        }}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          {/* Avatar Circle */}
                          <div
                            className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold border transition-colors"
                            style={{
                              background: isSelected ? "var(--color-accent)" : "var(--color-surface)",
                              color: isSelected ? "#ffffff" : "var(--color-text)",
                              borderColor: isSelected ? "var(--color-accent)" : "var(--color-border)",
                            }}
                          >
                            {v.name.charAt(0)}
                          </div>

                          {/* Voice Name & Gender Indicator */}
                          <div className="flex flex-col min-w-0">
                            <span className="font-semibold text-xs leading-tight truncate">
                              {v.name}
                            </span>
                            <span
                              className="text-[10px] capitalize leading-none truncate font-normal mt-0.5"
                              style={{
                                color: isSelected ? "var(--color-accent)" : "var(--color-muted)",
                              }}
                            >
                              {v.gender ? `${v.gender} voice` : "Natural voice"}
                            </span>
                          </div>
                        </div>

                        {/* Selected Indicator */}
                        {isSelected ? (
                          <CheckCircle2
                            size={16}
                            className="shrink-0"
                            style={{ color: "var(--color-accent)" }}
                          />
                        ) : (
                          <div
                            className="w-3.5 h-3.5 rounded-full border shrink-0 opacity-40"
                            style={{ borderColor: "var(--color-muted)" }}
                          />
                        )}
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
                  {isLoadingVoices ? "Loading voices..." : "No voices available for this filter."}
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
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--color-accent)" }}>
                    Generated Audio Result
                  </span>
                  {generatedSpeaker && (
                    <span
                      className="text-[11px] font-semibold px-2 py-0.5 rounded-full border"
                      style={{
                        background: "var(--color-accent-soft)",
                        borderColor: "var(--color-accent)",
                        color: "var(--color-accent)",
                      }}
                    >
                      {generatedSpeaker}
                    </span>
                  )}
                </div>

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

              <AudioPlayer
                audioSrc={audioUrl}
                fileName={`TTS_${language}_${(generatedSpeaker || voice || voicesToDisplay[0]?.name || "output").trim().replace(/\s+/g, "_")}.mp3`}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TextToSpeech;
