import TripsCard from "../../components/TripsCard/TripsCard"
import "./Trips.scss"
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getTrips } from "../../api/trips";

function Trips() {
    const [trips, setTrips] = useState();
    const [error, setError] = useState(null);

    useEffect(() => {
        getTrips()
            .then(setTrips)
            .catch((err) => {
                console.error(err);
                setError("Unable to load trips. Please try again.");
            });
    }, []);

    if (error) {
        return <p>{error}</p>;
    }
    if (!trips) {
        return <p>Loading trips, please wait…</p>;
    }
    // Trips are owner-scoped, so a brand-new account has none yet.
    if (trips.length === 0) {
        return (
            <div className="trips">
                <p className="trips__empty">
                    You don't have any trips yet. <Link to="/new">Create your first trip</Link>.
                </p>
            </div>
        )
    }
    return (
        <div className="trips">
            <TripsCard trips={trips} />
        </div>
    )
}

export default Trips
