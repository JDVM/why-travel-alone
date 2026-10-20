import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { useLinkToken } from '../../auth/useLinkToken';
import { verifyEmail } from '../../api/auth';
import { errorMessage } from '../../api/errors';
import '../../auth/auth.scss';

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
        <div className="auth">
            <h1 className="auth__title">Confirm your email</h1>
            {status === 'verifying' && <p role="status">Confirming your email address…</p>}
            {status === 'verified' && (
                <>
                    <p className="auth__notice" role="status">
                        Thanks, your email address is confirmed.
                    </p>
                    <p className="auth__switch">
                        {isAuthenticated ? <Link to="/Trips">Go to your trips</Link> : <Link to="/login">Log in</Link>}
                    </p>
                </>
            )}
            {status === 'failed' && (
                <>
                    <p className="auth__error">{error}</p>
                    <p className="auth__switch">
                        {isAuthenticated
                            ? 'Use "Send a new link" at the top of the page to get another one.'
                            : <>Log in to get a new link. <Link to="/login">Log in</Link></>}
                    </p>
                </>
            )}
        </div>
    );
}

export default VerifyEmail;
