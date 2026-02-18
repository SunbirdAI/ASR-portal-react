import { useMemo, useState } from "react";
import SpeechToText from "../SpeechToText";
import TextToSpeech from "../TextToSpeech";
import {
  ModeContent,
  ModeDescription,
  ModeHeader,
  ModeShell,
  ModeTab,
  ModeTabs,
  ModeTitle,
} from "./Transcription.styles";

const MODE_CONFIG = [
  {
    id: "stt",
    label: "Speech to Text",
    description: "Convert audio recordings into editable text.",
  },
  {
    id: "tts",
    label: "Text to Speech",
    description: "Generate natural speech audio from written text.",
  },
];

const Transcription = () => {
  const [activeMode, setActiveMode] = useState("stt");

  const activeModeConfig = useMemo(
    () => MODE_CONFIG.find((mode) => mode.id === activeMode),
    [activeMode]
  );

  const handleTabKeyDown = (event) => {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") {
      return;
    }
    event.preventDefault();

    const currentIndex = MODE_CONFIG.findIndex((mode) => mode.id === activeMode);
    const nextIndex =
      event.key === "ArrowRight"
        ? (currentIndex + 1) % MODE_CONFIG.length
        : (currentIndex - 1 + MODE_CONFIG.length) % MODE_CONFIG.length;

    setActiveMode(MODE_CONFIG[nextIndex].id);
  };

  return (
    <ModeShell>
      <ModeHeader>
        <ModeTitle>Speech Studio</ModeTitle>
        <ModeDescription>{activeModeConfig?.description}</ModeDescription>
      </ModeHeader>

      <ModeTabs role="tablist" aria-label="Speech tools">
        {MODE_CONFIG.map((mode) => (
          <ModeTab
            key={mode.id}
            id={`tab-${mode.id}`}
            role="tab"
            type="button"
            tabIndex={activeMode === mode.id ? 0 : -1}
            aria-selected={activeMode === mode.id}
            aria-controls={`panel-${mode.id}`}
            active={activeMode === mode.id}
            onClick={() => setActiveMode(mode.id)}
            onKeyDown={handleTabKeyDown}
          >
            {mode.label}
          </ModeTab>
        ))}
      </ModeTabs>

      <ModeContent
        id={`panel-${activeMode}`}
        role="tabpanel"
        aria-labelledby={`tab-${activeMode}`}
      >
        {activeMode === "stt" ? <SpeechToText /> : <TextToSpeech />}
      </ModeContent>
    </ModeShell>
  );
};

export default Transcription;
