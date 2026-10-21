import "./Travelers.scss"
import TravelerCard from "../../components/TravelerCard/TravelerCard"
import { useEffect, useState } from "react";
import { getTravelers } from "../../api/travelers";
import { Traveler } from "../../types";

function Travelers() {
    const [travelers, setTravelers] = useState<Traveler[]>();
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        getTravelers()
            .then(setTravelers)
            .catch((err) => {
                console.error(err);
                setError("Unable to load travelers. Please try again.");
            });
    }, []);

    if (error) {
        return <p>{error}</p>;
    }
    if (travelers === undefined) {
        return <p>Loading…</p>;
    }

    return <TravelerCard travelers={travelers} />;
}

export default Travelers
