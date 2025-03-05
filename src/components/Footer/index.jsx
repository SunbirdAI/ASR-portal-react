import React from 'react';
import ContentCopy from '@mui/icons-material/ContentCopy';
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

const Footer = ({ audioSrc, text, copyToClipboard, copySuccess, id }) => (
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
                onClick={copyToClipboard}
                disabled={!text}
                endIcon={<ContentCopy />}
                size="small"
            >
                <TextNav>Copy Text</TextNav>
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
