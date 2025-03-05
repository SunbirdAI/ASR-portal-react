import React, { useState, useCallback } from "react";
import {
  DynamicMainContainer,
  LanguageDropdown,
  ResponsiveContainer,
  ButtonContainer,
  Note,
  CloseButton,
  FeedbackContainer,
  RatingStars,
  FeedbackTextarea,
} from "./Transcription.styles";
import AudioInput from "../AudioInput";
import TranscriptionTextArea from "../TranscriptionTextArea";
import Button from "@mui/material/Button";
import { recognizeSpeech, sendFeedback } from "../../API";
import Footer from "../Footer";
import { TrackGoogleAnalyticsEvent } from "../../lib/GoogleAnalyticsUtil";

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

const Transcription = () => {
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
      setAudioSrc(URL.createObjectURL(audioData));

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
      console.log(e);
      setTextOutput("");
    }
    setIsLoading(false);
  }, [audioData, language]);

  const handleAudioLoad = useCallback((audioData) => {
    setAudioData(audioData);
    setAudioSrc(URL.createObjectURL(audioData));
  }, []);

  const onLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  const handleFeedbackSubmit = async () => {
    if (!textOutput || !transcriptionID) return;

    console.log("feed back sent.");
    console.log("Comment: " + rating);

    const feedbackValue = rating >= 4 ? "Good" : "Bad";

    console.log("User feed back: " + feedbackValue);
    console.log("Comment: " + feedback);

    // const feedbackData = {
    //   userFeedback,
    //   username: "ASR_USER",
    //   sourceText: "",
    //   transcription: textOutput,
    //   audio_url: audioSrc,
    //   transcriptionID,
    //   from: language,
    //   to: language,
    //   comment: feedback,
    // };

    // console.log("Feed back data: " + feedbackData.audio_url)

    setIsLoading(true);
    const response = sendFeedback(
      feedbackValue,
      "ASR_USER",
      language,
      textOutput,
      audioSrc,
      transcriptionID,
      feedback
    ).catch((e) => console.error("Feedback error:", e));

    // console.log("Feed back response: " + response)

    setIsLoading(false);
    if (response) {
      alert("Thank you for your feedback!");
      setFeedback("");
      setRating(0);
    }
  };

  return (
    <>
      {showNote && (
        <div>
          <Note>
            Note: Audio files used here are saved for the purpose of system
            improvement and model retraining.
            <CloseButton onClick={() => setShowNote(false)}>✖</CloseButton>
          </Note>
        </div>
      )}

      <DynamicMainContainer hasFooter={!!audioData}>
        <ResponsiveContainer>
          <h3>Step 1: Upload or Record Your Audio</h3>
          <AudioInput onAudioSubmit={handleAudioLoad} isLoading={isLoading} />

          <h3>Step 2: Select the Language of the Audio</h3>
          <LanguageDropdown onChange={onLanguageChange}>
            {sourceOptions.map((option, index) => (
              <option key={index} value={option.value}>
                {option.label}
              </option>
            ))}
          </LanguageDropdown>

          <h3>Step 3: Transcribe the Audio</h3>
          <ButtonContainer>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAudioSubmit}
              disabled={!audioData || isLoading}
            >
              Transcribe
            </Button>
          </ButtonContainer>
        </ResponsiveContainer>

        <TranscriptionTextArea
          placeholder="Recognized text will appear here"
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

        {/* Feedback Section */}
        {textOutput && (
          <FeedbackContainer>
            <h3>Feedback</h3>
            <p>Rate the transcription accuracy:</p>
            <RatingStars>
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  onClick={() => setRating(star)}
                  style={{
                    cursor: "pointer",
                    color: star <= rating ? "gold" : "gray",
                  }}
                >
                  ★
                </span>
              ))}
            </RatingStars>
            <FeedbackTextarea
              placeholder="Any comments on the transcription?"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            />
            <ButtonContainer>
              <Button
                variant="contained"
                color="primary"
                onClick={handleFeedbackSubmit}
                disabled={isLoading}
              >
                Submit Feedback
              </Button>
            </ButtonContainer>
          </FeedbackContainer>
        )}
      </DynamicMainContainer>
    </>
  );
};

export default Transcription;
