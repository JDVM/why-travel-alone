import { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Alert, Button, Container, Link, Paper, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import TripsCard from "../../components/TripsCard/TripsCard";
import PageHeader from "../../components/PageHeader/PageHeader";
import { getTrips } from "../../api/trips";
import { TripSummary } from "../../types";

function Trips() {
    const [trips, setTrips] = useState<TripSummary[]>();
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        getTrips()
            .then(setTrips)
            .catch((err) => {
                console.error(err);
                setError("Unable to load trips. Please try again.");
            });
    }, []);

    let content;
    if (error) {
        content = <Alert severity="error">{error}</Alert>;
    } else if (!trips) {
        content = <Typography>Loading trips, please wait…</Typography>;
    } else if (trips.length === 0) {
        // Trips are owner-scoped, so a brand-new account has none yet.
        content = (
            <Paper variant="outlined" sx={{ p: 4, textAlign: "center" }}>
                <Typography>
                    You don't have any trips yet. <Link component={RouterLink} to="/new">Create your first trip</Link>.
                </Typography>
            </Paper>
        );
    } else {
        content = <TripsCard trips={trips} />;
    }

    return (
        <Container maxWidth="lg" sx={{ py: 3 }}>
            <PageHeader
                title="Your trips"
                actions={
                    <Button variant="contained" component={RouterLink} to="/new" startIcon={<AddIcon />}>
                        New trip
                    </Button>
                }
            />
            {content}
        </Container>
    );
}

export default Trips
