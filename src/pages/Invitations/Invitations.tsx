import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert, Box, Button, Card, CardActions, CardContent, Chip, Container, Paper, Stack, Typography } from '@mui/material';
import PlaceIcon from '@mui/icons-material/Place';
import PageHeader from '../../components/PageHeader/PageHeader';
import { getInvitations, acceptInvitation, declineInvitation } from '../../api/invitations';
import { errorMessage } from '../../api/errors';
import { ReceivedInvitation } from '../../types';

function Invitations() {
    const [invitations, setInvitations] = useState<ReceivedInvitation[] | null>(null);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const load = useCallback(() => {
        getInvitations()
            .then(setInvitations)
            .catch((err) => {
                console.error(err);
                setError('Unable to load your invitations. Please try again.');
            });
    }, []);

    useEffect(() => {
        load();
    }, [load]);

    const accept = async (invitation: ReceivedInvitation) => {
        setError(null);
        try {
            const tripId = await acceptInvitation(invitation.invitation_id);
            navigate(`/Trips/${tripId}`);
        } catch (err) {
            setError(errorMessage(err, 'Unable to accept the invitation.'));
            load();
        }
    };

    const decline = async (invitation: ReceivedInvitation) => {
        setError(null);
        try {
            await declineInvitation(invitation.invitation_id);
        } catch (err) {
            setError(errorMessage(err, 'Unable to decline the invitation.'));
        }
        load();
    };

    let content;
    if (!invitations) {
        content = error ? <Alert severity="error">{error}</Alert> : <Typography>Loading invitations…</Typography>;
    } else if (invitations.length === 0) {
        content = (
            <Paper variant="outlined" sx={{ p: 4, textAlign: 'center' }}>
                <Typography>You have no invitations right now.</Typography>
            </Paper>
        );
    } else {
        content = (
            <Box component="ul" sx={{ listStyle: 'none', m: 0, p: 0, display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' } }}>
                {invitations.map((invitation) => {
                    const owner = [invitation.owner_first_name, invitation.owner_last_name].filter(Boolean).join(' ');
                    return (
                        <Card component="li" key={invitation.invitation_id} variant="outlined">
                            <CardContent>
                                <Typography component="h2" variant="h6" sx={{ fontWeight: 700 }}>
                                    {invitation.trip_name}
                                </Typography>
                                {owner && (
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                                        Invited by {owner}
                                    </Typography>
                                )}
                                <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', rowGap: 1 }}>
                                    {invitation.destination && <Chip icon={<PlaceIcon />} label={invitation.destination} size="small" />}
                                    <Chip label={`${invitation.trip_length} days`} size="small" />
                                    {invitation.kid_friendly && <Chip label="Kid friendly" size="small" variant="outlined" />}
                                </Stack>
                            </CardContent>
                            <CardActions sx={{ justifyContent: 'flex-end', px: 2, pb: 2 }}>
                                <Button onClick={() => decline(invitation)}>Decline</Button>
                                <Button variant="contained" onClick={() => accept(invitation)}>Accept</Button>
                            </CardActions>
                        </Card>
                    );
                })}
            </Box>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 3 }}>
            <PageHeader title="Invitations" />
            {invitations && error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {content}
        </Container>
    );
}

export default Invitations;
