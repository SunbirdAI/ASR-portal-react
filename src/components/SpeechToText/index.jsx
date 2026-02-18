import { useCallback, useEffect, useState } from "react";
import { recognizeSpeech, sendFeedback } from "../../API";
import { TrackGoogleAnalyticsEvent } from "../../lib/GoogleAnalyticsUtil";
import AudioInput from "../AudioInput";
import Footer from "../Footer";
import TranscriptionTextArea from "../TranscriptionTextArea";
import {
  ButtonContainer,
  CloseButton,
  DynamicMainContainer,
  FeedbackContainer,
  FeedbackTextarea,
  GlassButton,
  GhostButton,
  LanguageDropdown,
  Note,
  NoteText,
  ProgressStep,
  ProgressTrack,
  RatingStars,
  ResponsiveContainer,
  ResultPanel,
  SectionHeading,
  SectionSubtext,
  StatusPill,
  StepCard,
  StepDescription,
  StepMeta,
  StepTitle,
  TranscriptToolbar,
  WorkflowPanel,
} from "./SpeechToText.styles";

const sourceOptions = [
  {
    label: "Luganda",
    value: "lug",
  },
  {
    label: "Acholi",
    value: "ach",
  },
  {
    label: "Ateso",
    value: "teo",
  },
  {
    label: "Lugbara",
    value: "lgg",
  },
  {
    label: "Runyankole",
    value: "nyn",
  },
  {
    label: "English",
    value: "eng",
  },
  {
    label: "Swahili",
    value: "swa",
  },
  {
    label: "Kinyarwanda",
    value: "kin",
  },
  {
    label: "Lusoga",
    value: "xog",
  },
  {
    label: "Lumasaba",
    value: "myx",
  },
];

const SpeechToText = () => {
  const [language, setLanguage] = useState("lug");
  const [textOutput, setTextOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [audioSrc, setAudioSrc] = useState("");
  const [audioData, setAudioData] = useState(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const [showNote, setShowNote] = useState(true);
  const [feedback, setFeedback] = useState(""); // Feedback comments
  const [rating, setRating] = useState(0); // Rating for transcription accuracy
  const [transcriptionID, setTranscriptionID] = useState(null); // Store transcription ID
  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    return () => {
      if (audioSrc) {
        URL.revokeObjectURL(audioSrc);
      }
    };
  }, [audioSrc]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(textOutput);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 3000);
    } catch (err) {
      console.error("Failed to copy!", err);
    }
  };

  const handleAudioSubmit = useCallback(async () => {
    if (!audioData) return;

    TrackGoogleAnalyticsEvent(
      "Transcriptions",
      "Transcription Requested",
      "Transcribe Button"
    );
    setIsLoading(true);
    try {
      const transcript = await recognizeSpeech(audioData, language, language);

      if (transcript.audio_transcription) {
        TrackGoogleAnalyticsEvent(
          "Transcriptions",
          "Transcription Successful",
          "Transcribe Button"
        );
        setTranscriptionID(transcript.audio_transcription_id); // Store transcription ID
      }
      setTextOutput(transcript.audio_transcription);
    } catch (e) {
      console.error("Transcription error:", e);
      setTextOutput("");
    }
    setIsLoading(false);
  }, [audioData, language]);

  const handleAudioLoad = useCallback((audioData) => {
    setAudioData(audioData);
    const nextAudioSource = URL.createObjectURL(audioData);
    setAudioSrc((previousAudioSource) => {
      if (previousAudioSource) {
        URL.revokeObjectURL(previousAudioSource);
      }
      return nextAudioSource;
    });
  }, []);

  const onLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  const handleFeedbackSubmit = async () => {
    if (!textOutput || !transcriptionID) return;

    const feedbackValue = rating >= 4 ? "Good" : "Bad";

    setIsLoading(true);
    try {
      await sendFeedback(
        feedbackValue,
        "ASR_USER",
        language,
        textOutput,
        audioSrc,
        transcriptionID,
        feedback
      );
      alert("Thank you for your feedback!");
      setFeedback("");
      setRating(0);
      setShowFeedback(false);
    } catch (e) {
      console.error("Feedback error:", e);
    } finally {
      setIsLoading(false);
    }
  };

  const resetFlow = () => {
    setTextOutput("");
    setAudioData(null);
    setAudioSrc("");
    setTranscriptionID(null);
    setFeedback("");
    setRating(0);
    setShowFeedback(false);
  };

  const activeStep = textOutput ? 4 : audioData ? 3 : 1;

  return (
    <>
      {showNote && (
        <Note>
          <NoteText>
            Audio files used here are saved for system improvement and model
            retraining.
          </NoteText>
          <CloseButton
            aria-label="Dismiss notice"
            onClick={() => setShowNote(false)}
          >
            ✖
          </CloseButton>
        </Note>
      )}

      <ResponsiveContainer>
        <SectionHeading>Transcription Workflow</SectionHeading>
        <SectionSubtext>
          Upload audio, choose the language, and transcribe with a clean,
          guided flow.
        </SectionSubtext>
        <ProgressTrack aria-label="Transcription progress">
          <ProgressStep active={activeStep >= 1}>1. Upload audio</ProgressStep>
          <ProgressStep active={activeStep >= 2}>2. Choose language</ProgressStep>
          <ProgressStep active={activeStep >= 3}>3. Run transcription</ProgressStep>
          <ProgressStep active={activeStep >= 4}>4. Review result</ProgressStep>
        </ProgressTrack>
      </ResponsiveContainer>

      <DynamicMainContainer hasFooter={!!audioData}>
        <WorkflowPanel>
          <StepCard>
            <StepMeta>Step 1</StepMeta>
            <StepTitle>Upload or record audio</StepTitle>
            <StepDescription>
              Drag and drop an audio file, or use the microphone to capture a
              new recording.
            </StepDescription>
            <StatusPill ready={!!audioData}>
              {!!audioData ? "Audio ready" : "Awaiting audio input"}
            </StatusPill>
            <AudioInput onAudioSubmit={handleAudioLoad} isLoading={isLoading} />
          </StepCard>

          <StepCard>
            <StepMeta>Step 2</StepMeta>
            <StepTitle>Select source language</StepTitle>
            <StepDescription>
              Choose the language spoken in the audio for accurate
              transcription.
            </StepDescription>
            <LanguageDropdown
              aria-label="Select transcription language"
              onChange={onLanguageChange}
              value={language}
            >
              {sourceOptions.map((option, index) => (
                <option key={index} value={option.value}>
                  {option.label}
                </option>
              ))}
            </LanguageDropdown>
          </StepCard>

          <StepCard>
            <StepMeta>Step 3</StepMeta>
            <StepTitle>Transcribe audio</StepTitle>
            <StepDescription>
              Start transcription when your audio and language are confirmed.
            </StepDescription>
            <ButtonContainer>
              <GlassButton
                onClick={handleAudioSubmit}
                disabled={!audioData || isLoading}
              >
                {isLoading
                  ? "Transcribing..."
                  : textOutput
                  ? "Transcribe Again"
                  : "Transcribe Audio"}
              </GlassButton>
              <GhostButton
                onClick={resetFlow}
                disabled={!audioData && !textOutput}
              >
                Reset
              </GhostButton>
            </ButtonContainer>
          </StepCard>
        </WorkflowPanel>

        <ResultPanel>
          <StepCard>
            <StepMeta>Step 4</StepMeta>
            <StepTitle>Review transcription</StepTitle>
            <StepDescription>
              The recognized text appears here. Use copy and feedback tools
              after generation.
            </StepDescription>
            <TranscriptionTextArea
              placeholder="Your recognized text will appear here."
              text={textOutput}
              setText={setTextOutput}
              isLoading={isLoading}
            />
            {audioData && (
              <Footer
                audioSrc={audioSrc}
                text={textOutput}
                copyToClipboard={copyToClipboard}
                copySuccess={copySuccess}
              />
            )}
            {textOutput && (
              <>
                <TranscriptToolbar>
                  <StatusPill ready={!!textOutput}>Transcript ready</StatusPill>
                  <GhostButton onClick={() => setShowFeedback((prev) => !prev)}>
                    {showFeedback ? "Hide Feedback" : "Share Feedback"}
                  </GhostButton>
                </TranscriptToolbar>
                {showFeedback && (
                  <FeedbackContainer>
                    <StepTitle>Rate transcription accuracy</StepTitle>
                    <SectionSubtext>
                      Your feedback helps improve recognition quality.
                    </SectionSubtext>
                    <RatingStars>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          onClick={() => setRating(star)}
                          style={{
                            color:
                              star <= rating
                                ? "var(--color-accent)"
                                : "var(--color-muted)",
                          }}
                        >
                          ★
                        </span>
                      ))}
                    </RatingStars>
                    <FeedbackTextarea
                      placeholder="Add optional comments"
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                    />
                    <GlassButton onClick={handleFeedbackSubmit} disabled={isLoading}>
                      Submit Feedback
                    </GlassButton>
                  </FeedbackContainer>
                )}
              </>
            )}
          </StepCard>
        </ResultPanel>
      </DynamicMainContainer>
    </>
  );
};

export default SpeechToText;
