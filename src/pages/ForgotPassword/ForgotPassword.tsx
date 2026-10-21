import { useState, FormEvent } from 'react';
import { Button, TextField, Typography } from '@mui/material';
import { forgotPassword } from '../../api/auth';
import { errorMessage } from '../../api/errors';
import { AuthError, AuthForm, AuthLink, AuthNotice, AuthPage, AuthSwitch } from '../../auth/AuthPage';

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
        <AuthPage title="Reset your password">
            {sent ? (
                // The same message whether or not the account exists.
                <AuthNotice>
                    If an account uses {email}, we've sent it a link to reset the password. The link works for 1 hour.
                    Check your spam folder if it doesn't arrive.
                </AuthNotice>
            ) : (
                <AuthForm onSubmit={handleSubmit}>
                    <Typography variant="body2">
                        Enter the email address you signed up with, and we'll send you a link to choose a new password.
                    </Typography>
                    <TextField
                        id="email"
                        label="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoComplete="email"
                        slotProps={{ htmlInput: { required: true } }}
                    />
                    {error && <AuthError>{error}</AuthError>}
                    <Button variant="contained" size="large" type="submit" disabled={submitting}>
                        {submitting ? 'Sending…' : 'Send reset link'}
                    </Button>
                </AuthForm>
            )}
            <AuthSwitch>
                Remembered it? <AuthLink to="/login">Log in</AuthLink>
            </AuthSwitch>
        </AuthPage>
    );
}

export default ForgotPassword;
