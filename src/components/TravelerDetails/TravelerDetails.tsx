import { ReactNode, useEffect, useState } from "react";
import { Link as RouterLink, useParams } from "react-router-dom";
import { Alert, Avatar, Box, Button, Chip, Container, Link, Paper, Stack, TextField, Typography } from "@mui/material";
import PageHeader from "../PageHeader/PageHeader";
import { picForIndex } from "../../data/profilePics";
import { getTraveler } from "../../api/travelers";
import { getTrips, inviteTraveler } from "../../api/trips";
import { errorMessage } from "../../api/errors";
import { useAuth } from "../../auth/AuthContext";
import { Traveler, TripSummary } from "../../types";

function Detail({ label, children }: { label: string; children: ReactNode }) {
    return (
        <Box>
            <Typography variant="overline" color="text.secondary" component="h3" sx={{ lineHeight: 1.5 }}>
                {label}
            </Typography>
            {children}
        </Box>
    );
}

function TravelerDetails() {
    const [travelerDetails, setTravelerDetails] = useState<Traveler | null>(null);
    const [ownedTrips, setOwnedTrips] = useState<TripSummary[]>([]);
    const [selectedTripId, setSelectedTripId] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [inviteMessage, setInviteMessage] = useState<string | null>(null);
    const [inviteError, setInviteError] = useState<string | null>(null);
    const { id = "" } = useParams();
    const { account } = useAuth();
    const isMe = account?.traveler != null && String(account.traveler.user_id) === id;

    useEffect(() => {
        getTraveler(id)
            .then(setTravelerDetails)
            .catch((err) => {
                console.error(err);
                setError("Unable to load traveler data.");
            });

        // Only trips you own can be used to invite someone.
        getTrips()
            .then((trips) => setOwnedTrips(trips.filter((trip) => trip.is_owner)))
            .catch((err) => console.error(err));
    }, [id]);

    if (!travelerDetails) {
        return (
            <Container maxWidth="md" sx={{ py: 3 }}>
                <PageHeader title="Traveler Profile" back />
                {error ? <Alert severity="error">{error}</Alert> : <Typography>Loading traveler data, please wait…</Typography>}
            </Container>
        );
    }

    const name = `${travelerDetails.first_name} ${travelerDetails.last_name}`;
    const preferredDestinations = travelerDetails.preferred_destinations ?? [];

    const handleInvite = async () => {
        setInviteMessage(null);
        setInviteError(null);
        if (!selectedTripId) {
            setInviteError("Choose one of your trips first.");
            return;
        }
        try {
            await inviteTraveler(selectedTripId, id);
            setInviteMessage(`Invitation sent. ${travelerDetails.first_name} will see it on their Invitations page.`);
        } catch (err) {
            // e.g. 409 "Traveler has already been invited".
            setInviteError(errorMessage(err, "Unable to send the invitation."));
        }
    };

    return (
        <Container maxWidth="md" sx={{ py: 3 }}>
            <PageHeader title="Traveler Profile" back />
            <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 }, mb: 3 }}>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={3} sx={{ alignItems: { xs: "center", sm: "flex-start" } }}>
                    <Avatar src={picForIndex(travelerDetails.user_id)} alt="" sx={{ width: 120, height: 120 }} />
                    <Stack spacing={2} sx={{ flexGrow: 1, width: "100%" }}>
                        <Typography component="h2" variant="h5" sx={{ fontWeight: 700 }}>{name}</Typography>
                        <Detail label="Type of travel">
                            <Typography>{travelerDetails.type_of_travel || "Not set"}</Typography>
                        </Detail>
                        <Detail label="Preferred Destinations">
                            {preferredDestinations.length > 0 ? (
                                <Stack direction="row" spacing={0.5} sx={{ flexWrap: "wrap", rowGap: 0.5 }}>
                                    {preferredDestinations.map((destination) => (
                                        <Chip key={destination} label={destination} size="small" />
                                    ))}
                                </Stack>
                            ) : (
                                <Typography>None yet</Typography>
                            )}
                        </Detail>
                        {/* Private fields: the API only sends them when you may see them. */}
                        {"has_kids" in travelerDetails && (
                            <Detail label="Kids">
                                <Typography>{travelerDetails.has_kids ? "Yes" : "No"}</Typography>
                            </Detail>
                        )}
                        {"special_considerations" in travelerDetails && (
                            <Detail label="Special Considerations">
                                <Typography>{travelerDetails.special_considerations || "None"}</Typography>
                            </Detail>
                        )}
                    </Stack>
                </Stack>
            </Paper>

            {!isMe && (
                <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 } }}>
                    <Typography component="h2" variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                        Invite {travelerDetails.first_name}
                    </Typography>
                    {ownedTrips.length > 0 ? (
                        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ alignItems: { sm: "center" } }}>
                            {/* A native select: the browser tests pick the trip by its id. */}
                            <TextField
                                id="tripSelect"
                                select
                                label="Invite to one of your trips"
                                value={selectedTripId}
                                onChange={(e) => setSelectedTripId(e.target.value)}
                                slotProps={{ select: { native: true }, inputLabel: { shrink: true } }}
                                sx={{ flexGrow: 1 }}
                            >
                                <option value="">Select a Trip</option>
                                {ownedTrips.map((trip) => (
                                    <option key={trip.trip_id} value={trip.trip_id}>{trip.trip_name}</option>
                                ))}
                            </TextField>
                            <Button variant="contained" onClick={handleInvite}>Send invite</Button>
                        </Stack>
                    ) : (
                        <Typography>
                            <Link component={RouterLink} to="/new">Create a trip</Link> to invite {travelerDetails.first_name} to it.
                        </Typography>
                    )}
                    {inviteMessage && (
                        <Alert severity="success" sx={{ mt: 2 }}>{inviteMessage}</Alert>
                    )}
                    {inviteError && (
                        <Alert severity="error" sx={{ mt: 2 }}>{inviteError}</Alert>
                    )}
                </Paper>
            )}
        </Container>
    );
}

export default TravelerDetails
