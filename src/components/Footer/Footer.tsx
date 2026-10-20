import { Link } from 'react-router-dom';
import './Footer.scss';

function Footer() {
    return (
        <footer className="footer">
            <nav className="footer__links" aria-label="Legal">
                <Link className="footer__link" to="/privacy">Privacy Policy</Link>
                <Link className="footer__link" to="/terms">Terms of Service</Link>
            </nav>
            <p className="footer__copyright">© {new Date().getFullYear()} Why Travel Alone</p>
        </footer>
    );
}

export default Footer;
