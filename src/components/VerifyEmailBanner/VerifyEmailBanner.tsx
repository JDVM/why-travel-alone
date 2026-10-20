import { useState } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { resendVerification } from '../../api/auth';
import { errorMessage } from '../../api/errors';
import './VerifyEmailBanner.scss';

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
        <div className="verify-banner" role="status">
            <p className="verify-banner__text">
                Confirm your email address to invite travelers and join trips. We sent a link to{' '}
                <strong>{account.email}</strong>.
            </p>
            <button type="button" className="verify-banner__button" onClick={handleResend} disabled={sending}>
                {sending ? 'Sending…' : 'Send a new link'}
            </button>
            {message && <p className="verify-banner__text">{message}</p>}
            {error && <p className="verify-banner__error">{error}</p>}
        </div>
    );
}

export default VerifyEmailBanner;
