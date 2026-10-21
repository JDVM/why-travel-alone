import { useCallback, useEffect, useState } from 'react';
import { getSessions, signOutOtherSessions } from '../../api/auth';
import { errorMessage } from '../../api/errors';
import { Session } from '../../types';
import { describeDevice } from './describeDevice';
import './SignedInDevices.scss';

function formatDate(value: string): string {
    return new Date(value).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

// The browsers and devices signed in to the account, with a way to sign out
// all but this one (e.g. after using a shared computer).
function SignedInDevices() {
    const [sessions, setSessions] = useState<Session[] | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [working, setWorking] = useState(false);

    const load = useCallback(() => {
        getSessions()
            .then(setSessions)
            .catch((err) => setError(errorMessage(err, 'Unable to load your signed-in devices.')));
    }, []);

    useEffect(() => {
        load();
    }, [load]);

    const handleSignOutOthers = async () => {
        setWorking(true);
        setError(null);
        setMessage(null);
        try {
            const ended = await signOutOtherSessions();
            setMessage(ended === 1 ? 'Signed out 1 other device.' : `Signed out ${ended} other devices.`);
            load();
        } catch (err) {
            setError(errorMessage(err, 'Unable to sign out your other devices. Please try again.'));
        } finally {
            setWorking(false);
        }
    };

    const others = sessions ? sessions.filter((session) => !session.current).length : 0;

    return (
        <section className="devices" aria-labelledby="devices-title">
            <h2 id="devices-title" className="devices__title">Signed-in devices</h2>
            {!sessions && !error && <p className="devices__text">Loading…</p>}
            {sessions && (
                <ul className="devices__list">
                    {sessions.map((session) => (
                        <li className="devices__item" key={session.id}>
                            <span className="devices__name">
                                {describeDevice(session.user_agent)}
                                {session.current && <span className="devices__current"> (this device)</span>}
                            </span>
                            <span className="devices__dates">
                                Signed in {formatDate(session.created_at)}, last active {formatDate(session.last_seen_at)}
                            </span>
                        </li>
                    ))}
                </ul>
            )}
            {message && <p className="devices__text" role="status">{message}</p>}
            {error && <p className="devices__error">{error}</p>}
            {others > 0 && (
                <button type="button" className="devices__button" onClick={handleSignOutOthers} disabled={working}>
                    {working ? 'Signing out…' : 'Sign out other devices'}
                </button>
            )}
        </section>
    );
}

export default SignedInDevices;
