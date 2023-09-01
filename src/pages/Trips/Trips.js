import TripsCard from "../../components/TripsCard/TripsCard"
import "./Trips.scss"
import axios from "axios";
import { useEffect, useState } from "react";
function Trips() {
    const API_URL = process.env.REACT_APP_API_URL;
    const PORT = process.env.REACT_APP_API_PORT;
    const [trips, setTrips] = useState();
    useEffect(() => {
        axios
            .get(`${API_URL}:${PORT}/Trips`)
            .then((res) => {
                const tripsData = res.data;
                console.log(tripsData);
                setTrips(tripsData);
            })
            .catch(error => {
                console.log(error)
            });
             // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    if (!trips) {
        return (
            <>
                <p>Loading Trips Please wait</p>
            </>
        )
    }
    return (
        <div className="trips">
            <TripsCard trips={trips} />
        </div>
    )
}

export default Trips