import React, { useState, useEffect, useCallback } from "react";
import {
  DynamicMainContainer,
  LanguageDropdown,
  ResponsiveContainer,
  ButtonContainer,
  Note,
  CloseButton,
} from "./Transcription.styles";
import AudioInput from "../AudioInput"; // Adjust based on actual file structure
import TranscriptionTextArea from "../TranscriptionTextArea";
import Button from "@mui/material/Button";
import { recognizeSpeech } from "../../API"; // Function to convert speech to text
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
];

const Transcription = () => {
  const [language, setLanguage] = useState("lug"); // Default language for speech recognition
  const [textOutput, setTextOutput] = useState(""); // The recognized text from speech
  const [isLoading, setIsLoading] = useState(false); // Loading state for async operations
  const [audioSrc, setAudioSrc] = useState(""); // Store the audio source URL or blob
  const [audioData, setAudioData] = useState(null); // Store the audio data blob
  const [copySuccess, setCopySuccess] = useState(false);
  const [showNote, setShowNote] = useState(true);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(textOutput);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 3000);
    } catch (err) {
      console.error("Failed to copy!", err);
    }
  };

  // Handles the submission of audio data for recognition
  const handleAudioSubmit = useCallback(async () => {
    if (!audioData) return;

    TrackGoogleAnalyticsEvent(
      "Transcriptions",
      "Transcription Requested",
      "Transcribe Button"
    );
    setIsLoading(true);
    try {
      const transcript = await recognizeSpeech(audioData, language, language); // Process the audio to text
      console.log("Transcription: " + transcript);
      console.log("Language: " + language);
      setAudioSrc(URL.createObjectURL(audioData)); // Assuming audioData is a Blob

      if (transcript.audio_transcription) {
        TrackGoogleAnalyticsEvent(
          "Transcriptions",
          "Transcription Successful",
          "Transcribe Button"
        );
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

  useEffect(() => {
    console.log("Language updated to: " + language);
  }, [language]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowNote(false);
    }, 6000); // Hide the note after 10 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {showNote && (
        <Note>
          Note: Audio files used here are saved for the purpose of system improvement and model retraining.
          <CloseButton onClick={() => setShowNote(false)}>✖</CloseButton>
        </Note>
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
          ></Footer>
        )}
      </DynamicMainContainer>
    </>
  );
};

export default Transcription;
