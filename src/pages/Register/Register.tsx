import { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../auth/AuthContext';
import '../../auth/auth.scss';

const MIN_PASSWORD_LENGTH = 8;

function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
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

        setSubmitting(true);
        try {
            await register(email, password);
            navigate('/Trips');
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
