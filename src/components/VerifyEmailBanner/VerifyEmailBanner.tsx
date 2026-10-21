import { useState } from 'react';
import { Alert, Button, Typography } from '@mui/material';
import { useAuth } from '../../auth/AuthContext';
import { resendVerification } from '../../api/auth';
import { errorMessage } from '../../api/errors';

// Reminds signed-in users with an unconfirmed email address to confirm it,
// since inviting and joining trips needs a confirmed address.
function VerifyEmailBanner() {
    const { account, refreshAccount } = useAuth();
    const [sending, setSending] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    if (!account || account.email_verified) {
        return null;
    }

    const handleResend = async () => {
        setSending(true);
        setMessage(null);
        setError(null);
        try {
            await resendVerification();
            setMessage(`Sent. Check ${account.email} for the new link.`);
            // Confirmed meanwhile, e.g. on another device: hide the banner.
            await refreshAccount();
        } catch (err) {
            setError(errorMessage(err, 'Unable to send the email. Please try again later.'));
        } finally {
            setSending(false);
        }
    };

    return (
        <Alert
            severity="warning"
            role="status"
            className="verify-banner"
            square
            sx={{ justifyContent: 'center', alignItems: 'center' }}
            action={
                <Button color="inherit" size="small" variant="outlined" onClick={handleResend} disabled={sending}>
                    {sending ? 'Sending…' : 'Send a new link'}
                </Button>
            }
        >
            <Typography variant="body2">
                Confirm your email address to invite travelers and join trips. We sent a link to{' '}
                <strong>{account.email}</strong>.
            </Typography>
            {message && <Typography variant="body2">{message}</Typography>}
            {error && <Typography variant="body2" color="error">{error}</Typography>}
        </Alert>
    );
}

export default VerifyEmailBanner;
