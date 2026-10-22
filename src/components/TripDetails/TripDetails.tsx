import { useEffect, useId, useState, useCallback, ReactNode } from "react";
import { Link as RouterLink, useParams, useNavigate } from "react-router-dom";
import {
    Alert,
    Box,
    Button,
    Container,
    List,
    ListItem,
    ListItemText,
    Paper,
    Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SmallTravelerCard from "../SmallTravelerCard/SmallTravelerCard";
import PageHeader from "../PageHeader/PageHeader";
import { getTrip, removeTraveler, cancelInvitation, leaveTrip } from "../../api/trips";
import { errorMessage } from "../../api/errors";
import { useAuth } from "../../auth/AuthContext";
import { TripDetail } from "../../types";
import { LoadingPanel } from "../Loading/Loading";

// One labelled value, grouped so assistive technology (and the browser
// tests) can find a value by its label.
function Detail({ label, children }: { label: string; children: ReactNode }) {
    const labelId = useId();
    return (
        <Box role="group" aria-labelledby={labelId}>
            <Typography id={labelId} variant="overline" color="text.secondary" component="h3" sx={{ lineHeight: 1.5 }}>
                {label}
            </Typography>
            <Typography>{children}</Typography>
        </Box>
    );
}

// A trip you own or are on. Owners can edit it, remove travelers and manage
// invitations; other travelers can only view it or leave.
function TripDetails() {
    const { id = "" } = useParams();
    const [tripDetails, setTripDetails] = useState<TripDetail | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [actionError, setActionError] = useState<string | null>(null);
    const navigate = useNavigate();
    const { account } = useAuth();
    const myTravelerId = account?.traveler?.user_id ?? null;

    const loadTrip = useCallback(() => {
        getTrip(id)
            .then(setTripDetails)
            .catch((err) => {
                console.error(err);
                setError(errorMessage(err, "Unable to load trip data."));
            });
    }, [id]);

    useEffect(() => {
        loadTrip();
    }, [loadTrip]);

    // Runs an owner or member action, then reloads the trip or reports the error.
    const act = async (action: () => Promise<void>, fallback: string) => {
        setActionError(null);
        try {
            await action();
            loadTrip();
        } catch (err) {
            setActionError(errorMessage(err, fallback));
        }
    };

    const handleLeave = async () => {
        setActionError(null);
        try {
            await leaveTrip(id);
            navigate("/Trips");
        } catch (err) {
            setActionError(errorMessage(err, "Unable to leave the trip."));
        }
    };

    if (error) {
        return (
            <Container maxWidth="md" sx={{ py: 3 }}>
                <PageHeader title="Trip Details" back />
                <Alert severity="error">{error}</Alert>
            </Container>
        );
    }
    if (!tripDetails) {
        return (
            <Container maxWidth="md" sx={{ py: 3 }}>
                <LoadingPanel label="Loading the trip" />
            </Container>
        );
    }

    const isOwner = tripDetails.is_owner;
    const travelersForThisTrip = tripDetails.users;
    const removableIds = isOwner
        ? travelersForThisTrip.map((traveler) => traveler.user_id).filter((userId) => userId !== myTravelerId)
        : [];
    const invitations = tripDetails.invitations ?? [];

    return (
        <Container maxWidth="md" sx={{ py: 3 }}>
            <PageHeader
                title="Trip Details"
                back
                actions={
                    isOwner ? (
                        <Button variant="contained" component={RouterLink} to={`/Trips/${id}/edit`} startIcon={<EditIcon />}>
                            Edit
                        </Button>
                    ) : (
                        <Button variant="outlined" color="error" onClick={handleLeave}>
                            Leave trip
                        </Button>
                    )
                }
            />
            <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 }, mb: 3 }}>
                <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" } }}>
                    <Detail label="Trip Name">{tripDetails.trip_name}</Detail>
                    <Detail label="Trip Duration">{tripDetails.trip_length} days</Detail>
                    <Detail label="Destination">{tripDetails.destination}</Detail>
                    <Detail label="Kid Friendly">{tripDetails.kid_friendly ? "Yes" : "No"}</Detail>
                </Box>
                {tripDetails.notes && (
                    <Box sx={{ mt: 2 }}>
                        <Detail label="Trip Description">{tripDetails.notes}</Detail>
                    </Box>
                )}
            </Paper>
            {actionError && <Alert severity="error" sx={{ mb: 3 }}>{actionError}</Alert>}

            {isOwner && invitations.length > 0 && (
                <Box component="section" aria-labelledby="trip-invitations" sx={{ mb: 3 }}>
                    <Typography id="trip-invitations" component="h2" variant="h6" sx={{ fontWeight: 700, mb: 1 }}>Invitations</Typography>
                    <Paper variant="outlined">
                        <List disablePadding>
                            {invitations.map((invitation, index) => (
                                <ListItem
                                    key={invitation.user_id}
                                    divider={index < invitations.length - 1}
                                    secondaryAction={
                                        invitation.status === "pending" && (
                                            <Button
                                                size="small"
                                                onClick={() => act(() => cancelInvitation(id, invitation.user_id), "Unable to cancel the invitation.")}
                                            >
                                                Cancel
                                            </Button>
                                        )
                                    }
                                >
                                    <ListItemText
                                        primary={`${invitation.first_name} ${invitation.last_name}`}
                                        secondary={invitation.status === "pending" ? "Waiting for a reply" : "Declined"}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </Paper>
                </Box>
            )}

            <Box component="section" aria-labelledby="trip-travelers">
                <Typography id="trip-travelers" component="h2" variant="h6" sx={{ fontWeight: 700, mb: 1 }}>Travelers</Typography>
                <SmallTravelerCard
                    travelers={travelersForThisTrip}
                    removableIds={removableIds}
                    onRemove={(traveler) => act(() => removeTraveler(id, traveler.user_id), "Unable to remove the traveler.")}
                />
            </Box>
        </Container>
    );
}

export default TripDetails;
