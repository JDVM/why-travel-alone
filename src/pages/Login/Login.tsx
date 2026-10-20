import { useState, FormEvent } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../auth/AuthContext';
import '../../auth/auth.scss';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const state = location.state as { accountDeleted?: boolean; passwordReset?: boolean } | null;

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        setSubmitting(true);
        try {
            await login(email, password);
            navigate('/Trips');
        } catch (err) {
            const message =
                axios.isAxiosError(err) && err.response?.data?.error
                    ? err.response.data.error
                    : 'Unable to log in. Please try again.';
            setError(message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="auth">
            <h1 className="auth__title">Log In</h1>
            {state?.accountDeleted && (
                <p className="auth__notice" role="status">
                    Your account and its data have been deleted.
                </p>
            )}
            {state?.passwordReset && (
                <p className="auth__notice" role="status">
                    Your password has been changed. Log in with your new password.
                </p>
            )}
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
                        autoComplete="current-password"
                        required
                    />
                </label>
                {error && <p className="auth__error">{error}</p>}
                <button className="auth__button" type="submit" disabled={submitting}>
                    {submitting ? 'Logging in…' : 'Log In'}
                </button>
            </form>
            <p className="auth__switch">
                <Link to="/forgot-password">Forgot your password?</Link>
            </p>
            <p className="auth__switch">
                Need an account? <Link to="/register">Register</Link>
            </p>
        </div>
    );
}

export default Login;
