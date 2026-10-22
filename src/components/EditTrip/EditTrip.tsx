import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Alert, Button, Container, Typography } from "@mui/material";
import PageHeader from "../PageHeader/PageHeader";
import TripForm from "../TripForm/TripForm";
import { tripFormError } from "../TripForm/tripFormError";
import { getDestinations } from "../../api/destinations";
import { getTrip, updateTrip, deleteTrip } from "../../api/trips";
import { errorMessage } from "../../api/errors";
import { Destination, TripInput } from "../../types";

function EditTrip() {
    const { id = "" } = useParams();
    const [destinations, setDestinations] = useState<Destination[] | null>(null);
    const [trip, setTrip] = useState<TripInput>({
        trip_name: "",
        kid_friendly: false,
        destination_id: "",
        trip_length: "",
        notes: ""
    });
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    // Load destinations first, then the trip. Older APIs return only the
    // destination name from GET /trips/:id, so fall back to matching the name
    // against the destinations list when destination_id is absent.
    useEffect(() => {
        let destinationsList: Destination[] = [];
        getDestinations()
            .then((list) => {
                destinationsList = list;
                setDestinations(list);
                return getTrip(id);
            })
            .then((tripData) => {
                const match = destinationsList.find((d) => d.place === tripData.destination);
                setTrip({
                    trip_name: tripData.trip_name,
                    kid_friendly: tripData.kid_friendly,
                    destination_id: tripData.destination_id ?? (match ? match.id : ""),
                    trip_length: tripData.trip_length,
                    notes: tripData.notes || "",
                });
            })
            .catch((err) => {
                console.error(err);
                setError("Unable to load trip data.");
            });
    }, [id]);

    const handleSubmit = () => {
        const invalid = tripFormError(trip);
        if (invalid) {
            setError(invalid);
            return;
        }
        updateTrip(id, trip)
            .then(() => navigate('/Trips'))
            .catch((err) => {
                console.error(err);
                setError(errorMessage(err, "Failed to update trip. Please try again."));
            });
    };

    const handleDelete = () => {
        deleteTrip(id)
            .then(() => navigate('/Trips'))
            .catch((err) => {
                console.error(err);
                setError(errorMessage(err, "Failed to delete trip. Please try again."));
            });
    };

    return (
        <Container maxWidth="sm" sx={{ py: 3 }}>
            <PageHeader title="Edit Trip Details" back />
            {destinations === null ? (
                error ? <Alert severity="error">{error}</Alert> : <Typography>Loading destination data, please wait…</Typography>
            ) : (
                <TripForm
                    trip={trip}
                    onChange={setTrip}
                    destinations={destinations}
                    submitLabel="Update Trip"
                    onSubmit={handleSubmit}
                    error={error}
                    extraActions={
                        <Button variant="outlined" color="error" onClick={handleDelete}>Delete Trip</Button>
                    }
                />
            )}
        </Container>
    );
}

export default EditTrip;
