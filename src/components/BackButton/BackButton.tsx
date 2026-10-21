import { useNavigate } from 'react-router-dom';
import backarrow from '../../assets/images/arrow_back-24px.svg';
import './BackButton.scss';

// Goes back to the previous page. A real button, so it works with the
// keyboard and screen readers (the arrow image used to be clickable only with
// a mouse).
function BackButton() {
    const navigate = useNavigate();
    return (
        <button type="button" className="back-button" onClick={() => navigate(-1)} aria-label="Go back">
            <img className="back-button__icon" src={backarrow} alt="" />
        </button>
    );
}

export default BackButton;
