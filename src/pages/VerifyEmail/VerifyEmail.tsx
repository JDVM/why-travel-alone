import { useEffect, useRef, useState } from 'react';
import { Typography } from '@mui/material';
import { useAuth } from '../../auth/AuthContext';
import { useLinkToken } from '../../auth/useLinkToken';
import { verifyEmail } from '../../api/auth';
import { errorMessage } from '../../api/errors';
import { AuthError, AuthLink, AuthNotice, AuthPage, AuthSwitch } from '../../auth/AuthPage';

type Status = 'verifying' | 'verified' | 'failed';

// Opened from the link in the verification email, signed in or not.
function VerifyEmail() {
    const token = useLinkToken();
    const { isAuthenticated, refreshAccount } = useAuth();
    const [status, setStatus] = useState<Status>(token ? 'verifying' : 'failed');
    const [error, setError] = useState<string | null>(token ? null : 'This link is missing its code.');
    // The token works once, so don't send it twice (React runs effects twice
    // in development).
    const sent = useRef(false);

    useEffect(() => {
        if (!token || sent.current) {
            return;
        }
        sent.current = true;
        verifyEmail(token)
            .then(() => setStatus('verified'))
            .catch((err) => {
                setError(errorMessage(err, 'Unable to confirm your email. Please try again.'));
                setStatus('failed');
            });
    }, [token]);

    // Update the banner once the address is confirmed. refreshAccount changes
    // whenever the account does, so the ref keeps this to a single refresh.
    const refreshed = useRef(false);
    useEffect(() => {
        if (status === 'verified' && isAuthenticated && !refreshed.current) {
            refreshed.current = true;
            refreshAccount().catch(() => {});
        }
    }, [status, isAuthenticated, refreshAccount]);

    return (
        <AuthPage title="Confirm your email">
            {status === 'verifying' && <Typography role="status">Confirming your email address…</Typography>}
            {status === 'verified' && (
                <>
                    <AuthNotice>Thanks, your email address is confirmed.</AuthNotice>
                    <AuthSwitch>
                        {isAuthenticated ? <AuthLink to="/Trips">Go to your trips</AuthLink> : <AuthLink to="/login">Log in</AuthLink>}
                    </AuthSwitch>
                </>
            )}
            {status === 'failed' && (
                <>
                    <AuthError>{error}</AuthError>
                    <AuthSwitch>
                        {isAuthenticated
                            ? 'Use "Send a new link" at the top of the page to get another one.'
                            : <>Log in to get a new link. <AuthLink to="/login">Log in</AuthLink></>}
                    </AuthSwitch>
                </>
            )}
        </AuthPage>
    );
}

export default VerifyEmail;
