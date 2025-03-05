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
          fullWidth
        >
          Good Transcription
        </Button>
        <Button
          disabled={rated || transcription === ''}
          variant={rating === 2 ? "contained" : "outlined"}
          endIcon={<ThumbDown />}
          onClick={() => setShowDialog(true)}
          fullWidth
        >
          Bad Transcription
        </Button>
      </div>
      {showAlert && <Alert severity="success">Thanks for the feedback</Alert>}
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
            fullWidth
          />
          <TextField
            label="Username"
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            variant="outlined"
            fullWidth
          />
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleSubmit(false)}
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