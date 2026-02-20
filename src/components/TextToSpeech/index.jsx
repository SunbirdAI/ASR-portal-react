import { useEffect, useState } from "react";
import LinearProgress from "@mui/material/LinearProgress";
import { generateSpeech } from "../../API";
import { getUserFacingErrorMessage } from "../../lib/error-utils";
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

const DEFAULT_SPEAKER_ID = "248";
const MAX_TEXT_LENGTH = 600;
const SPEAKER_OPTIONS = [
  { value: "241", label: "241: Acholi (female)" },
  { value: "242", label: "242: Ateso (female)" },
  { value: "243", label: "243: Runyankore (female)" },
  { value: "245", label: "245: Lugbara (female)" },
  { value: "246", label: "246: Swahili (male)" },
  { value: "248", label: "248: Luganda (female)" },
];
const SYNTHESIS_PROGRESS_STAGES = [
  {
    minSeconds: 0,
    progress: 30,
    title: "Stage 1 of 3: Sending text",
    message: "Submitting your text and speaker choice to the service.",
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

const TextToSpeech = () => {
  const [textInput, setTextInput] = useState("");
  const [speakerId, setSpeakerId] = useState(DEFAULT_SPEAKER_ID);
  const [isLoading, setIsLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState("");
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loadingSeconds, setLoadingSeconds] = useState(0);

  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

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
      const audioBlob = await generateSpeech(safeText, speakerId);
      const nextAudioUrl = URL.createObjectURL(audioBlob);
      setAudioUrl((previousAudioUrl) => {
        if (previousAudioUrl) {
          URL.revokeObjectURL(previousAudioUrl);
        }
        return nextAudioUrl;
      });
      setMessage("Speech generated successfully.");
    } catch (error) {
      console.error(error);
      setErrorMessage(
        getUserFacingErrorMessage(
          error,
          "Unable to generate speech right now. Please try again."
        )
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
    downloadLink.click();
  };

  const handleReset = () => {
    setTextInput("");
    setSpeakerId(DEFAULT_SPEAKER_ID);
    setMessage("");
    setErrorMessage("");
    setAudioUrl((previousAudioUrl) => {
      if (previousAudioUrl) {
        URL.revokeObjectURL(previousAudioUrl);
      }
      return "";
    });
  };

  const activeStep = audioUrl ? 3 : safeText ? 2 : 1;
  const currentProgressStage = getActiveProgressStage(
    loadingSeconds,
    SYNTHESIS_PROGRESS_STAGES
  );

  return (
    <>
      <ResponsiveContainer>
        <SectionHeading>Speech Synthesis Workflow</SectionHeading>
        <SectionSubtext>
          Write text, pick a speaker voice, and generate production-ready audio.
        </SectionSubtext>
        <ProgressTrack aria-label="Text-to-speech progress">
          <ProgressStep active={activeStep >= 1}>1. Write text</ProgressStep>
          <ProgressStep active={activeStep >= 2}>2. Select voice</ProgressStep>
          <ProgressStep active={activeStep >= 3}>3. Generate audio</ProgressStep>
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
            <StepTitle>Select speaker voice</StepTitle>
            <StepDescription>
              Choose a speaker profile for voice generation.
            </StepDescription>
            <FieldGroup>
              <FieldLabel htmlFor="tts-speaker-id">Speaker</FieldLabel>
              <SpeakerSelect
                id="tts-speaker-id"
                value={speakerId}
                onChange={(event) => setSpeakerId(event.target.value)}
              >
                {SPEAKER_OPTIONS.map((speaker) => (
                  <option key={speaker.value} value={speaker.value}>
                    {speaker.label}
                  </option>
                ))}
              </SpeakerSelect>
              <FieldHint>
                Default speaker is <strong>248: Luganda (female)</strong>.
              </FieldHint>
            </FieldGroup>

            <StatusPill ready={Boolean(safeText)}>Text ready for synthesis</StatusPill>
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
              <AudioPreview controls src={audioUrl}>
                Your browser does not support the audio element.
              </AudioPreview>
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
