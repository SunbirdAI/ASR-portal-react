import { useEffect, useRef, useState } from "react";
import { Button, TextField } from "@mui/material";
import { ThumbDown, ThumbUp } from "@mui/icons-material";
import { sendFeedback } from "../../API";
import { getUserFacingErrorMessage } from "../../lib/error-utils";
import StatusBanner from "../StatusBanner";
import { styles } from "./Feedback.styles";

const Feedback = ({ sourceText, transcription, from, to }) => {
  const [rated, setRated] = useState(false);
  const [rating, setRating] = useState(0);
  const prevText = useRef();
  const [correctTranscription, setCorrectTranscription] = useState("");
  const [username, setUsername] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (prevText.current !== transcription) {
      setRated(false);
      setRating(0);
      setShowDialog(false);
      setErrorMessage("");
      setSuccessMessage("");
    }
    prevText.current = transcription;
  }, [transcription]);

  const handleSubmit = async (isGood) => {
    const feedbackType = isGood ? "Good" : "Bad";
    const languageContext =
      [from, to].filter(Boolean).join(" -> ") || "Not specified";
    const comment = isGood ? null : correctTranscription.trim() || null;

    setErrorMessage("");
    setSuccessMessage("");
    setIsSubmitting(true);

    try {
      await sendFeedback(
        feedbackType,
        username.trim() || "ANONYMOUS_USER",
        languageContext,
        transcription || sourceText || null,
        null,
        null,
        comment
      );
      setRated(true);
      setRating(isGood ? 1 : 2);
      setSuccessMessage("Thank you. Your feedback has been submitted.");
      setCorrectTranscription("");
      setShowDialog(false);
    } catch (e) {
      setErrorMessage(
        getUserFacingErrorMessage(
          e,
          "Unable to submit feedback right now. Please try again."
        )
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={styles.container}>
      <p style={styles.feedbackText}>
        Please help us improve transcription quality with your feedback.
      </p>
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
      <div className="grid grid-cols-2 gap-4">
        <Button
          variant={rating === 1 ? "contained" : "outlined"}
          disabled={rated || transcription === "" || isSubmitting}
          endIcon={<ThumbUp />}
          onClick={() => handleSubmit(true)}
          sx={{
            color: "#000",
            borderColor: "rgba(0,0,0,0.24)",
            backgroundColor: rating === 1 ? "#d97706" : "#fff",
            "&:hover": {
              backgroundColor: "#efefed",
              borderColor: "#d97706",
            },
          }}
          fullWidth
        >
          Good Transcription
        </Button>
        <Button
          disabled={rated || transcription === "" || isSubmitting}
          variant={rating === 2 ? "contained" : "outlined"}
          endIcon={<ThumbDown />}
          onClick={() => setShowDialog(true)}
          sx={{
            color: "#000",
            borderColor: "rgba(0,0,0,0.24)",
            backgroundColor: rating === 2 ? "#d97706" : "#fff",
            "&:hover": {
              backgroundColor: "#efefed",
              borderColor: "#d97706",
            },
          }}
          fullWidth
        >
          Bad Transcription
        </Button>
      </div>
      {showDialog && (
        <div className="flex flex-col gap-4 mt-4">
          <TextField
            label="Correct Transcription"
            multiline
            rows={4}
            placeholder="Enter correct Transcription"
            value={correctTranscription}
            onChange={(e) => setCorrectTranscription(e.target.value)}
            variant="outlined"
            sx={{
              "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                {
                  borderColor: "#d97706",
                },
              "& .MuiInputLabel-root.Mui-focused": {
                color: "#000",
              },
            }}
            fullWidth
          />
          <TextField
            label="Username"
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            variant="outlined"
            sx={{
              "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                {
                  borderColor: "#d97706",
                },
              "& .MuiInputLabel-root.Mui-focused": {
                color: "#000",
              },
            }}
            fullWidth
          />
          <Button
            variant="contained"
            onClick={() => handleSubmit(false)}
            disabled={isSubmitting}
            sx={{
              color: "#000",
              backgroundColor: "#ffffff",
              border: "1px solid #d97706",
              "&:hover": {
                backgroundColor: "#efefed",
              },
            }}
            fullWidth
          >
            {isSubmitting ? "Submitting..." : "Submit Feedback"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default Feedback;
