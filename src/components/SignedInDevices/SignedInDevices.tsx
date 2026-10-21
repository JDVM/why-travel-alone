import { useCallback, useEffect, useState } from 'react';
import { getSessions, signOutOtherSessions } from '../../api/auth';
import { errorMessage } from '../../api/errors';
import { Session } from '../../types';
import { describeDevice } from './describeDevice';
import { Alert, Box, Button, List, ListItem, ListItemText, Paper, Typography } from '@mui/material';

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
        <Paper component="section" variant="outlined" aria-labelledby="devices-title" sx={{ p: { xs: 2, sm: 3 } }}>
            <Typography id="devices-title" component="h2" variant="h6" sx={{ fontWeight: 700 }}>
                Signed-in devices
            </Typography>
            {!sessions && !error && <Typography>Loading…</Typography>}
            {sessions && (
                <List dense>
                    {sessions.map((session) => (
                        <ListItem className="devices__item" key={session.id} disableGutters>
                            <ListItemText
                                primary={
                                    <>
                                        {describeDevice(session.user_agent)}
                                        {session.current && (
                                            <Typography component="span" variant="body2" color="primary" sx={{ fontWeight: 600 }}>
                                                {' '}
                                                <span>(this device)</span>
                                            </Typography>
                                        )}
                                    </>
                                }
                                secondary={`Signed in ${formatDate(session.created_at)}, last active ${formatDate(session.last_seen_at)}`}
                            />
                        </ListItem>
                    ))}
                </List>
            )}
            {message && <Alert severity="success" role="status" sx={{ mb: 2 }}>{message}</Alert>}
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {others > 0 && (
                <Box>
                    <Button variant="outlined" onClick={handleSignOutOthers} disabled={working}>
                        {working ? 'Signing out…' : 'Sign out other devices'}
                    </Button>
                </Box>
            )}
        </Paper>
    );
}

export default SignedInDevices;
