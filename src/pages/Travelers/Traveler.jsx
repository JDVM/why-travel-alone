import "./Travelers.scss"
import TravelerCard from "../../components/TravelerCard/TravelersCard"
import { useEffect, useState } from "react";
import { getTravelers } from "../../api/travelers";

function Travelers() {
    const [travelers, setTravelers] = useState();
    const [error, setError] = useState(null);

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
