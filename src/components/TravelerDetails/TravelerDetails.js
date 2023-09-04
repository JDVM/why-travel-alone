import "./TravelerDetails.scss"
import placeholderImage from '../../assets/images/placeholder_image.png'
import { useEffect, useState} from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom"
import backarrow from "../../assets/images/arrow_back-24px.svg";

function TravelerDetails() {
    const API_URL = process.env.REACT_APP_API_URL;
    const PORT = process.env.REACT_APP_API_PORT;
    const [travelerDetails, setTravelerDetails] = useState(null);
    const [trips, setTrips] = useState([]);
    const [selectedTripId, setSelectedTripId] = useState("");
    const { id } = useParams();
    const navigate = useNavigate();
    const goBack = () => navigate(-1); 

    useEffect(() => {
        axios
            .get(`${API_URL}:${PORT}/travelers/${id}`)
            .then((res) => {
                const travelerData = res.data;
                setTravelerDetails(travelerData);
            })
            .catch(error => {
                console.log(error)
            })

        axios
            .get(`${API_URL}:${PORT}/Trips`)
            .then((res) => {
                const tripsData = res.data;
                console.log("TRIP DATA", tripsData);
                setTrips(tripsData);
            })
            .catch(error => {
                console.log(error)
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id])

    if (!travelerDetails) {
        return (
            <>
                <p>Loading Traveler Data Please Wait.</p>
            </>)
    }


    const name = `${travelerDetails.first_name} ${travelerDetails.last_name}`;
    const hasKids = travelerDetails.has_kids === 1 ? "Yes" : "No";
    const PreferredDestinations = travelerDetails.preferred_destinations

    if (!trips) {
        return (
            <>
                <p>Loading Trips Please wait</p>
            </>
        )
    }
    const handleAddToTrip = () => {
        if (!selectedTripId) {
            console.log("Please select a trip before adding.");
            return;
        }

        const addTravelerDetails = {
            user_id: id,
            trip_id: selectedTripId,
        };
        console.log("ADDED TRAVELER DETAILS", addTravelerDetails)
        console.log("SELECTED TRIP ID", selectedTripId)
        axios
            .post(`${API_URL}:${PORT}/travelers/addto`, addTravelerDetails)
            .then((res) => {
                console.log("this is the responds", res.data);
                navigate(`/trips/${selectedTripId}`)
            })
            .catch(error => {
                console.log(error);
            });
    }

    return (
        <div className="travler-details">
            <div>
                <h1>Edit Trip Details</h1>
                <img src={backarrow} alt="Back arrowkey" onClick={goBack} />
            </div>
            <img className="travel-details__image" alt="placeholder" src={placeholderImage} />
            <section>
                <article>
                    <p>Name</p>
                    <p>{name}</p>
                </article>
                <article>
                    <p>PrefereddDestinations</p>
                    <ul>
                        {PreferredDestinations.map((destination, index) => {
                            return <li key={index}>{destination}</li>;
                        })}
                    </ul>
                </article>
                <article>
                    <p>Type of travel</p>
                    <p>{travelerDetails.type_of_travel}</p>
                </article>
                <article>
                    <p>Kids</p>
                    <p>{hasKids}</p>
                </article>
                <article>
                    <p>Special Considerations</p>
                    <p>{travelerDetails.special_considerations}</p>
                </article>
            </section>
            <div>
                <label htmlFor="tripSelect">Select a Trip:</label>
                <select
                    id="tripSelect"
                    value={selectedTripId}
                    onChange={(e) => setSelectedTripId(e.target.value)}
                >
                    <option value="">Select a Trip</option>
                    {trips.map((trip) => {
                        return (
                            <option key={trip.trip_id} value={trip.trip_id}> {trip.trip_name} </option>
                        )
                    })}
                </select>
                <button onClick={handleAddToTrip}>Add to Trip</button>
            </div>
        </div>
    )
}
export default TravelerDetails