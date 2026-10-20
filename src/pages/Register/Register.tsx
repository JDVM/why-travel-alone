import { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../auth/AuthContext';
import '../../auth/auth.scss';

const MIN_PASSWORD_LENGTH = 8;

function Register() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [acceptTerms, setAcceptTerms] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);

        if (password.length < MIN_PASSWORD_LENGTH) {
            setError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
            return;
        }
        if (!acceptTerms) {
            setError('Please accept the Terms of Service and Privacy Policy to create an account.');
            return;
        }

        setSubmitting(true);
        try {
            await register({ email, password, first_name: firstName, last_name: lastName, accept_terms: acceptTerms });
            // Name now, the rest of the profile later: send new users to their profile.
            navigate('/profile', { state: { welcome: true } });
        } catch (err) {
            const message =
                axios.isAxiosError(err) && err.response?.data?.error
                    ? err.response.data.error
                    : 'Unable to register. Please try again.';
            setError(message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="auth">
            <h1 className="auth__title">Create Account</h1>
            <form className="auth__form" onSubmit={handleSubmit}>
                <label className="auth__label" htmlFor="firstName">
                    First name
                    <input
                        id="firstName"
                        className="auth__input"
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        autoComplete="given-name"
                        maxLength={255}
                        required
                    />
                </label>
                <label className="auth__label" htmlFor="lastName">
                    Last name
                    <input
                        id="lastName"
                        className="auth__input"
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        autoComplete="family-name"
                        maxLength={255}
                        required
                    />
                </label>
                <label className="auth__label" htmlFor="email">
                    Email
                    <input
                        id="email"
                        className="auth__input"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoComplete="email"
                        required
                    />
                </label>
                <label className="auth__label" htmlFor="password">
                    Password
                    <input
                        id="password"
                        className="auth__input"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="new-password"
                        minLength={MIN_PASSWORD_LENGTH}
                        required
                    />
                </label>
                <label className="auth__checkbox" htmlFor="acceptTerms">
                    <input
                        id="acceptTerms"
                        type="checkbox"
                        checked={acceptTerms}
                        onChange={(e) => setAcceptTerms(e.target.checked)}
                        required
                    />
                    <span>
                        I agree to the{' '}
                        <Link to="/terms" target="_blank" rel="noopener noreferrer">Terms of Service</Link>{' '}
                        and have read the{' '}
                        <Link to="/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</Link>.
                    </span>
                </label>
                {error && <p className="auth__error">{error}</p>}
                <button className="auth__button" type="submit" disabled={submitting}>
                    {submitting ? 'Creating account…' : 'Register'}
                </button>
            </form>
            <p className="auth__switch">
                Already have an account? <Link to="/login">Log in</Link>
            </p>
        </div>
    );
}

export default Register;
