import { useState, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { forgotPassword } from '../../api/auth';
import { errorMessage } from '../../api/errors';
import '../../auth/auth.scss';

function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [sent, setSent] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        setSubmitting(true);
        try {
            await forgotPassword(email);
            setSent(true);
        } catch (err) {
            setError(errorMessage(err, 'Unable to send the email. Please try again.'));
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="auth">
            <h1 className="auth__title">Reset your password</h1>
            {sent ? (
                // The same message whether or not the account exists.
                <p className="auth__notice" role="status">
                    If an account uses {email}, we've sent it a link to reset the password. The link works for 1 hour.
                    Check your spam folder if it doesn't arrive.
                </p>
            ) : (
                <form className="auth__form" onSubmit={handleSubmit}>
                    <p>Enter the email address you signed up with, and we'll send you a link to choose a new password.</p>
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
                    {error && <p className="auth__error">{error}</p>}
                    <button className="auth__button" type="submit" disabled={submitting}>
                        {submitting ? 'Sending…' : 'Send reset link'}
                    </button>
                </form>
            )}
            <p className="auth__switch">
                Remembered it? <Link to="/login">Log in</Link>
            </p>
        </div>
    );
}

export default ForgotPassword;
