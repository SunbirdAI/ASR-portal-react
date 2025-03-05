import { TextArea } from "./TranscriptionTextArea.styles";
import React from 'react';
import LinearProgress from '@mui/material/LinearProgress';

const TranscriptionTextArea = ({
    placeholder,
    text,
    setText,
    isLoading,
}) => {

    return (
        <TextArea
            placeholder={placeholder}
            readOnly={true}
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="text-area-class">
            {isLoading && <LinearProgress color="secondary" />}
        </TextArea>
    );
};

export default TranscriptionTextArea;
