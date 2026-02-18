import { TextArea, TextAreaShell } from "./TranscriptionTextArea.styles";
import React from "react";
import LinearProgress from "@mui/material/LinearProgress";

const TranscriptionTextArea = ({
    placeholder,
    text,
    setText,
    isLoading,
}) => {

  return (
    <TextAreaShell>
      {isLoading && (
        <LinearProgress
          color="inherit"
          sx={{
            mb: 2,
            borderRadius: "999px",
            backgroundColor: "var(--color-pill)",
            "& .MuiLinearProgress-bar": {
              backgroundColor: "var(--color-accent)",
            },
          }}
        />
      )}
      <TextArea
        placeholder={placeholder}
        readOnly={true}
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="text-area-class"
      />
    </TextAreaShell>
  );
};

export default TranscriptionTextArea;
