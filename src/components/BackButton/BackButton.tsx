import { useNavigate } from 'react-router-dom';
import { IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// Goes back to the previous page.
function BackButton() {
    const navigate = useNavigate();
    return (
        <IconButton onClick={() => navigate(-1)} aria-label="Go back" edge="start">
            <ArrowBackIcon />
        </IconButton>
    );
}

export default BackButton;
