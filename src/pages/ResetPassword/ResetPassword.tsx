import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { useLinkToken } from '../../auth/useLinkToken';
import { resetPassword } from '../../api/auth';
import { errorMessage } from '../../api/errors';
import '../../auth/auth.scss';

const MIN_PASSWORD_LENGTH = 8;

// Opened from the link in the password-reset email.
function ResetPassword() {
    const token = useLinkToken();
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        if (password.length < MIN_PASSWORD_LENGTH) {
            setError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
            return;
        }
        if (password !== confirm) {
            setError("The passwords don't match.");
            return;
        }

        setSubmitting(true);
        try {
            await resetPassword(token as string, password);
            // Every session was signed out, including this browser's.
            logout('Your password has been changed. Log in with your new password.');
            navigate('/login', { replace: true });
        } catch (err) {
            setError(errorMessage(err, 'Unable to change your password. Please try again.'));
            setSubmitting(false);
        }
    };

    if (!token) {
        return (
            <div className="auth">
                <h1 className="auth__title">Choose a new password</h1>
                <p className="auth__error">This link is missing its code.</p>
                <p className="auth__switch">
                    <Link to="/forgot-password">Ask for a new link</Link>
                </p>
            </div>
        );
    }

    return (
        <div className="auth">
            <h1 className="auth__title">Choose a new password</h1>
            <form className="auth__form" onSubmit={handleSubmit}>
                <label className="auth__label" htmlFor="password">
                    New password
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
                <label className="auth__label" htmlFor="confirm">
                    Confirm new password
                    <input
                        id="confirm"
                        className="auth__input"
                        type="password"
                        value={confirm}
                        onChange={(e) => setConfirm(e.target.value)}
                        autoComplete="new-password"
                        required
                    />
                </label>
                {error && <p className="auth__error">{error}</p>}
                <button className="auth__button" type="submit" disabled={submitting}>
                    {submitting ? 'Saving…' : 'Change password'}
                </button>
            </form>
            {error && (
                <p className="auth__switch">
                    Link expired? <Link to="/forgot-password">Ask for a new one</Link>
                </p>
            )}
        </div>
    );
}

export default ResetPassword;
