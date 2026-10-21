import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container } from "@mui/material";
import PageHeader from "../PageHeader/PageHeader";
import TripForm from "../TripForm/TripForm";
import { tripFormError } from "../TripForm/tripFormError";
import { getDestinations } from "../../api/destinations";
import { createTrip } from "../../api/trips";
import { errorMessage } from "../../api/errors";
import { Destination, TripInput } from "../../types";

function AddTrip() {
    const [destinations, setDestinations] = useState<Destination[]>([]);
    const [trip, setTrip] = useState<TripInput>({
        trip_name: "",
        kid_friendly: false,
        destination_id: "",
        trip_length: "",
        notes: ""
    });
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        getDestinations()
            .then(setDestinations)
            .catch((err) => {
                console.error(err);
                setError("Failed to fetch destinations.");
            });
    }, []);

    const handleSubmit = () => {
        const invalid = tripFormError(trip);
        if (invalid) {
            setError(invalid);
            return;
        }
        createTrip(trip)
            .then(() => navigate('/Trips'))
            .catch((err) => {
                console.error(err);
                setError(errorMessage(err, "Failed to create trip. Please try again."));
            });
    };

    return (
        <Container maxWidth="sm" sx={{ py: 3 }}>
            <PageHeader title="Add Trip Details" back />
            <TripForm
                className="trip-add"
                trip={trip}
                onChange={setTrip}
                destinations={destinations}
                submitLabel="Create Trip"
                onSubmit={handleSubmit}
                error={error}
            />
        </Container>
    );
}

export default AddTrip;
