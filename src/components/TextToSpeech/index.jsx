import React, { useEffect, useState } from "react";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import LinearProgress from "@mui/material/LinearProgress";
import TextField from "@mui/material/TextField";
import { generateSpeech, getSpeechVoices } from "../../API";
import { getUserFacingErrorMessage } from "../../lib/error-utils";
import {
  DEFAULT_TTS_LANGUAGE,
  getTtsLanguage,
  TTS_LANGUAGE_OPTIONS,
} from "../../lib/tts-languages";
import {
  ButtonContainer,
  DynamicMainContainer,
  GlassButton,
  GhostButton,
  ProgressStep,
  ProgressTrack,
  ResponsiveContainer,
  ResultPanel,
  SectionHeading,
  SectionSubtext,
  StatusPill,
  StepCard,
  StepDescription,
  StepMeta,
  StepTitle,
  WorkflowPanel,
} from "../SpeechToText/SpeechToText.styles";
import {
  AudioPreview,
  CharacterCounter,
  FieldGroup,
  FieldHint,
  FieldLabel,
  LoadingMeta,
  LoadingNotice,
  LoadingTitle,
  PlaceholderCard,
  SpeakerSelect,
  TtsTextArea,
} from "./TextToSpeech.styles";
import StatusBanner from "../StatusBanner";

const MAX_TEXT_LENGTH = 600;
const filterLanguageOptions = createFilterOptions({
  stringify: (option) => `${option.label} ${option.value}`,
});
const SYNTHESIS_PROGRESS_STAGES = [
  {
    minSeconds: 0,
    progress: 30,
    title: "Stage 1 of 3: Sending text",
    message: "Submitting your text, language, and voice to the service.",
  },
  {
    minSeconds: 8,
    progress: 65,
    title: "Stage 2 of 3: Synthesizing voice",
    message: "The model is generating speech audio.",
  },
  {
    minSeconds: 20,
    progress: 92,
    title: "Stage 3 of 3: Finalizing audio",
    message: "Still working. Cold starts can make this step take longer.",
  },
];

const getActiveProgressStage = (elapsedSeconds, stages) =>
  stages.reduce((activeStage, stage) => {
    if (elapsedSeconds >= stage.minSeconds) {
      return stage;
    }
    return activeStage;
  }, stages[0]);

const formatVoiceLabel = (voice, index) => {
  const source = voice.split("_")[0]?.toUpperCase() || "TTS";
  return `${source} voice ${index + 1} (${voice})`;
};

const TextToSpeech = () => {
  const [textInput, setTextInput] = useState("");
  const [language, setLanguage] = useState(DEFAULT_TTS_LANGUAGE);
  const [voice, setVoice] = useState("");
  const [voiceCatalog, setVoiceCatalog] = useState({});
  const [isLoadingVoices, setIsLoadingVoices] = useState(true);
  const [voiceCatalogMessage, setVoiceCatalogMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState("");
  const [speechResult, setSpeechResult] = useState(null);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loadingSeconds, setLoadingSeconds] = useState(0);

  useEffect(() => {
    let isActive = true;

    const loadVoices = async () => {
      try {
        const response = await getSpeechVoices();
        if (!isActive) return;
        setVoiceCatalog(response.by_language || {});
      } catch (error) {
        console.error("Unable to load TTS voices:", error);
        if (!isActive) return;
        setVoiceCatalogMessage(
          "Voice choices could not be loaded. The service will select a voice automatically.",
        );
      } finally {
        if (isActive) {
          setIsLoadingVoices(false);
        }
      }
    };

    loadVoices();

    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    if (!isLoading) {
      setLoadingSeconds(0);
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setLoadingSeconds((previousSeconds) => previousSeconds + 1);
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [isLoading]);

  const safeText = textInput.trim();
  const selectedLanguage = getTtsLanguage(language) || TTS_LANGUAGE_OPTIONS[0];
  const availableVoices = voiceCatalog[language] || [];

  const handleLanguageChange = (_event, selectedOption) => {
    if (!selectedOption) return;
    setLanguage(selectedOption.value);
    setVoice("");
    setAudioUrl("");
    setSpeechResult(null);
    setMessage("");
  };

  const handleGenerate = async () => {
    if (!safeText) {
      setErrorMessage("Please enter text before generating speech.");
      setMessage("");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");
    setMessage("");
    setLoadingSeconds(0);

    try {
      const response = await generateSpeech(safeText, { language, voice });
      setAudioUrl(response.audio_url);
      setSpeechResult(response);
      setMessage("Speech generated successfully.");
    } catch (error) {
      console.error(error);
      setErrorMessage(
        getUserFacingErrorMessage(
          error,
          "Unable to generate speech right now. Please try again.",
        ),
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!audioUrl) return;

    const downloadLink = document.createElement("a");
    downloadLink.href = audioUrl;
    downloadLink.download = `sunbird_tts_${Date.now()}.wav`;
    downloadLink.rel = "noopener";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    downloadLink.remove();
  };

  const handleReset = () => {
    setTextInput("");
    setLanguage(DEFAULT_TTS_LANGUAGE);
    setVoice("");
    setMessage("");
    setErrorMessage("");
    setAudioUrl("");
    setSpeechResult(null);
  };

  const activeStep = audioUrl ? 3 : safeText ? 2 : 1;
  const currentProgressStage = getActiveProgressStage(
    loadingSeconds,
    SYNTHESIS_PROGRESS_STAGES,
  );
  const resultLanguage = speechResult?.language
    ? getTtsLanguage(speechResult.language)?.label || speechResult.language
    : selectedLanguage.label;
  const resultDuration = Number(speechResult?.duration_seconds);

  return (
    <>
      <ResponsiveContainer>
        <SectionHeading>Speech Synthesis Workflow</SectionHeading>
        <SectionSubtext>
          Write text, search for a language, choose a voice, and generate
          production-ready audio.
        </SectionSubtext>
        <ProgressTrack aria-label="Text-to-speech progress">
          <ProgressStep active={activeStep >= 1}>1. Write text</ProgressStep>
          <ProgressStep active={activeStep >= 2}>
            2. Select language and voice
          </ProgressStep>
          <ProgressStep active={activeStep >= 3}>
            3. Generate audio
          </ProgressStep>
        </ProgressTrack>
      </ResponsiveContainer>

      <DynamicMainContainer hasFooter={false}>
        <WorkflowPanel>
          <StepCard>
            <StepMeta>Step 1</StepMeta>
            <StepTitle>Enter text to synthesize</StepTitle>
            <StepDescription>
              Add the sentence or paragraph you want converted to speech.
            </StepDescription>
            <FieldGroup>
              <FieldLabel htmlFor="tts-text-input">Text</FieldLabel>
              <TtsTextArea
                id="tts-text-input"
                placeholder="Type text to convert into speech"
                value={textInput}
                maxLength={MAX_TEXT_LENGTH}
                onChange={(event) => setTextInput(event.target.value)}
              />
              <CharacterCounter>
                {textInput.length}/{MAX_TEXT_LENGTH}
              </CharacterCounter>
            </FieldGroup>
          </StepCard>

          <StepCard>
            <StepMeta>Step 2</StepMeta>
            <StepTitle>Select language and voice</StepTitle>
            <StepDescription>
              Search the multilingual catalog, then optionally choose a specific
              speaker voice.
            </StepDescription>
            <Autocomplete
              autoHighlight
              disableClearable
              filterOptions={filterLanguageOptions}
              getOptionLabel={(option) => option.label}
              isOptionEqualToValue={(option, value) =>
                option.value === value.value
              }
              noOptionsText="No supported language found."
              onChange={handleLanguageChange}
              openOnFocus
              options={TTS_LANGUAGE_OPTIONS}
              renderInput={(params) => (
                <TextField
                  {...params}
                  helperText={`Search ${TTS_LANGUAGE_OPTIONS.length} supported languages by name or ISO code.`}
                  label="Search language"
                  placeholder="e.g. Yoruba or yor"
                />
              )}
              renderOption={(props, option) => {
                const optionProps = { ...props };
                delete optionProps.key;

                return (
                  <li
                    key={option.value}
                    {...optionProps}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: "1rem",
                    }}
                  >
                    <span>{option.label}</span>
                    <span
                      style={{
                        color: "var(--color-muted)",
                        fontFamily: "monospace",
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
                    boxShadow: "var(--color-elev-shadow)",
                  },
                },
              }}
              sx={{
                my: 1,
                "& .MuiFormHelperText-root": {
                  color: "var(--color-muted)",
                  mx: 0,
                },
                "& .MuiInputLabel-root": {
                  color: "var(--color-muted)",
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "var(--color-accent)",
                },
                "& .MuiOutlinedInput-root": {
                  color: "var(--color-text)",
                  backgroundColor: "var(--color-surface)",
                  borderRadius: "0.75rem",
                  "& fieldset": {
                    borderColor: "var(--color-border)",
                  },
                  "&:hover fieldset": {
                    borderColor: "var(--color-accent)",
                  },
                  "&.Mui-focused": {
                    backgroundColor: "var(--color-accent-soft)",
                    boxShadow: "0 0 0 3px var(--color-focus-ring)",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "var(--color-accent)",
                  },
                },
                "& .MuiSvgIcon-root": {
                  color: "var(--color-text)",
                },
              }}
              value={selectedLanguage}
            />

            <FieldGroup>
              <FieldLabel htmlFor="tts-voice">Voice</FieldLabel>
              <SpeakerSelect
                id="tts-voice"
                value={voice}
                disabled={isLoadingVoices}
                onChange={(event) => setVoice(event.target.value)}
              >
                <option value="">
                  {isLoadingVoices
                    ? "Loading voices..."
                    : "Automatic voice (recommended)"}
                </option>
                {availableVoices.map((voiceOption, index) => (
                  <option key={voiceOption} value={voiceOption}>
                    {formatVoiceLabel(voiceOption, index)}
                  </option>
                ))}
              </SpeakerSelect>
              <FieldHint>
                {voiceCatalogMessage ||
                  (availableVoices.length
                    ? `${availableVoices.length} speaker ${
                        availableVoices.length === 1 ? "voice" : "voices"
                      } available for ${selectedLanguage.label}.`
                    : "Sunbird will select the best available voice for this language.")}
              </FieldHint>
            </FieldGroup>

            <StatusPill ready={Boolean(safeText)}>
              {safeText
                ? `${selectedLanguage.label} text ready for synthesis`
                : "Enter text to continue"}
            </StatusPill>
            <ButtonContainer>
              <GlassButton
                type="button"
                disabled={isLoading || !safeText}
                onClick={handleGenerate}
              >
                {isLoading ? "Generating..." : "Generate Speech"}
              </GlassButton>
              <GhostButton
                type="button"
                disabled={isLoading}
                onClick={handleReset}
              >
                Reset
              </GhostButton>
            </ButtonContainer>
          </StepCard>
        </WorkflowPanel>

        <ResultPanel>
          <StepCard>
            <StepMeta>Step 3</StepMeta>
            <StepTitle>Preview and export</StepTitle>
            <StepDescription>
              Review generated audio, then download the WAV file.
            </StepDescription>

            {audioUrl ? (
              <>
                <AudioPreview controls src={audioUrl}>
                  Your browser does not support the audio element.
                </AudioPreview>
                <FieldHint>
                  {resultLanguage}
                  {speechResult?.voice ? ` · ${speechResult.voice}` : ""}
                  {Number.isFinite(resultDuration)
                    ? ` · ${resultDuration.toFixed(1)}s`
                    : ""}
                </FieldHint>
              </>
            ) : (
              <PlaceholderCard>
                Generated speech will appear here after synthesis.
              </PlaceholderCard>
            )}

            {isLoading && (
              <LoadingNotice role="status" aria-live="polite">
                <LoadingTitle>{currentProgressStage.title}</LoadingTitle>
                <LoadingMeta>{currentProgressStage.message}</LoadingMeta>
                <LoadingMeta>Elapsed time: {loadingSeconds}s</LoadingMeta>
                <LinearProgress
                  variant="determinate"
                  value={currentProgressStage.progress}
                  color="inherit"
                  sx={{
                    borderRadius: "999px",
                    backgroundColor: "var(--color-surface)",
                    "& .MuiLinearProgress-bar": {
                      backgroundColor: "var(--color-accent)",
                    },
                  }}
                />
              </LoadingNotice>
            )}

            <StatusBanner
              type="error"
              message={errorMessage}
              onDismiss={() => setErrorMessage("")}
            />
            <StatusBanner
              type="success"
              message={message}
              onDismiss={() => setMessage("")}
            />

            <ButtonContainer>
              <GhostButton
                type="button"
                disabled={!audioUrl}
                onClick={handleDownload}
              >
                Download WAV
              </GhostButton>
            </ButtonContainer>
          </StepCard>
        </ResultPanel>
      </DynamicMainContainer>
    </>
  );
};

export default TextToSpeech;
