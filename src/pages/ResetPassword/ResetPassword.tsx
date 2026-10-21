import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, TextField } from '@mui/material';
import { useAuth } from '../../auth/AuthContext';
import { useLinkToken } from '../../auth/useLinkToken';
import { resetPassword } from '../../api/auth';
import { errorMessage } from '../../api/errors';
import { AuthError, AuthForm, AuthLink, AuthPage, AuthSwitch } from '../../auth/AuthPage';

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
            <AuthPage title="Choose a new password">
                <AuthError>This link is missing its code.</AuthError>
                <AuthSwitch>
                    <AuthLink to="/forgot-password">Ask for a new link</AuthLink>
                </AuthSwitch>
            </AuthPage>
        );
    }

    return (
        <AuthPage title="Choose a new password">
            <AuthForm onSubmit={handleSubmit}>
                <TextField
                    id="password"
                    label="New password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                    helperText={`At least ${MIN_PASSWORD_LENGTH} characters.`}
                    slotProps={{ htmlInput: { required: true, minLength: MIN_PASSWORD_LENGTH } }}
                />
                <TextField
                    id="confirm"
                    label="Confirm new password"
                    type="password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    autoComplete="new-password"
                    slotProps={{ htmlInput: { required: true } }}
                />
                {error && <AuthError>{error}</AuthError>}
                <Button variant="contained" size="large" type="submit" disabled={submitting}>
                    {submitting ? 'Saving…' : 'Change password'}
                </Button>
            </AuthForm>
            {error && (
                <AuthSwitch>
                    Link expired? <AuthLink to="/forgot-password">Ask for a new one</AuthLink>
                </AuthSwitch>
            )}
        </AuthPage>
    );
}

export default ResetPassword;
