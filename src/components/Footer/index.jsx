import React from 'react';
import ContentCopy from '@mui/icons-material/ContentCopy';
import FileDownloadOutlined from '@mui/icons-material/FileDownloadOutlined';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import { 
    FooterContainer, 
    AudioPlayerContainer, 
    ButtonContainer, 
    TextNav, 
    // EditButtonContainer 
} from './Footer.styles';
// import { EditNoteRounded } from '@mui/icons-material';
// import { NavLink } from 'react-router-dom';

const sharedButtonSx = {
  minHeight: 42,
  borderRadius: "999px",
  textTransform: "none",
  px: 2,
  color: "var(--color-text)",
  borderColor: "var(--color-border)",
  backgroundColor: "var(--color-pill)",
  "&:hover": {
    borderColor: "var(--color-accent)",
    backgroundColor: "var(--color-surface)",
  },
};

const Footer = ({ audioSrc, text, copyToClipboard, copySuccess, onDownload }) => (
    <FooterContainer>
        <AudioPlayerContainer>
            <AudioPlayer audioSrc={audioSrc} />
        </AudioPlayerContainer>
        {/* <EditButtonContainer>
            <NavLink to={`/files/edit/${id}`}>
                <Button
                disabled={!text}
                endIcon={<EditNoteRounded />}
                size="small"
            >
                <TextNav>Edit Text</TextNav>
            </Button>
            </NavLink>
        </EditButtonContainer> */}
        <ButtonContainer>
            <Button
                variant="outlined"
                onClick={copyToClipboard}
                disabled={!text}
                endIcon={<ContentCopy fontSize="small" />}
                size="small"
                sx={sharedButtonSx}
            >
                <TextNav>Copy</TextNav>
            </Button>
            <Button
                variant="outlined"
                onClick={onDownload}
                disabled={!text}
                endIcon={<FileDownloadOutlined fontSize="small" />}
                size="small"
                sx={sharedButtonSx}
            >
                <TextNav>Download</TextNav>
            </Button>
        </ButtonContainer>
        <Snackbar
            open={copySuccess}
            autoHideDuration={3000}
            message="Text copied!"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        />
    </FooterContainer>
);

const AudioPlayer = ({ audioSrc }) => {
    if (!audioSrc) {
        return null;
    }

    return (
        <audio controls src={audioSrc}>
            Your browser does not support the audio element.
        </audio>
    );
};

export default Footer;
