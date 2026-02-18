import { useEffect, useRef, useState } from "react";
import { Alert, Button, TextField } from "@mui/material";
import { ThumbDown, ThumbUp } from "@mui/icons-material";
import { sendFeedback } from "../../API";
import { styles } from './Feedback.styles';

const Feedback = ({ sourceText, transcription, from, to }) => {
  const [rated, setRated] = useState(false);
  const [rating, setRating] = useState(0);
  const [showAlert, setShowAlert] = useState(false);
  const prevText = useRef();
  const [correctTranscription, setCorrectTranscription] = useState('');
  const [username, setUsername] = useState('');
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    if (prevText.current !== transcription) {
      setRated(false);
      setRating(0);
    }
    prevText.current = transcription;
  }, [transcription]);

  useEffect(() => {
    const timeId = setTimeout(() => {
      setShowAlert(false);
    }, 1500);
    return () => clearTimeout(timeId);
  }, [showAlert]);

  const handleSubmit = async (isGood) => {
    setRated(true);
    setRating(isGood ? 1 : 2);
    setShowAlert(true);
    try {
      await sendFeedback(isGood ? 'Good' : 'Bad', correctTranscription, username, sourceText, transcription, from, to);
      setCorrectTranscription('');
      // setUsername('');
      setShowDialog(false);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div style={styles.container}>
    <p style={styles.feedbackText}>Please help us improve the Transcription quality with your feedback.</p>
      <div className="grid grid-cols-2 gap-4">
        <Button
          variant={rating === 1 ? "contained" : "outlined"}
          disabled={rated || transcription === ''}
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
          disabled={rated || transcription === ''}
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
      {showAlert && <Alert severity="warning">Thanks for the feedback</Alert>}
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
            Submit Feedback
          </Button>
        </div>
      )}
    </div>
  );
};

export default Feedback;
