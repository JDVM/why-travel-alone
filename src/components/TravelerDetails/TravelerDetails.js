import "./TravelerDetails.scss"
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"
import backarrow from "../../assets/images/arrow_back-24px.svg";
import { picForIndex } from "../../data/profilePics";
import { getTraveler, addTravelerToTrip } from "../../api/travelers";
import { getTrips } from "../../api/trips";
import { useAuth } from "../../auth/AuthContext";

function TravelerDetails() {
    const [travelerDetails, setTravelerDetails] = useState(null);
    const [trips, setTrips] = useState([]);
    const [selectedTripId, setSelectedTripId] = useState("");
    const [error, setError] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();
    const goBack = () => navigate(-1);
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        getTraveler(id)
            .then(setTravelerDetails)
            .catch((err) => {
                console.error(err);
                setError("Unable to load traveler data.");
            });

        // The trips list is owner-scoped and requires auth; only fetch it (and
        // show the "add to trip" control) when the visitor is signed in.
        if (isAuthenticated) {
            getTrips()
                .then(setTrips)
                .catch((err) => console.error(err));
        }
    }, [id, isAuthenticated]);

    if (!travelerDetails) {
        return error ? <p>{error}</p> : <p>Loading traveler data, please wait…</p>;
    }

    const name = `${travelerDetails.first_name} ${travelerDetails.last_name}`;
    const hasKids = travelerDetails.has_kids ? "Yes" : "No";
    const preferredDestinations = travelerDetails.preferred_destinations || [];

    const handleAddToTrip = () => {
        if (!selectedTripId) {
            setError("Please select a trip before adding.");
            return;
        }
        addTravelerToTrip(id, selectedTripId)
            .then(() => {
                navigate(`/Trips/${selectedTripId}`);
            })
            .catch((err) => {
                console.error(err);
                setError("Unable to add traveler to trip.");
            });
    }

    return (
        <div className="traveler-details">
            <section className="traveler-details__container">
                <div className="traveler-details__title-container">
                    <img src={backarrow} alt="Back arrowkey" onClick={goBack} />
                    <h1 className="traveler-details__main-title">Traveler Profile</h1>
                </div>

                <img className="traveler-details__image" alt="Traveler profile" src={picForIndex(0)} />
                <section className="traveler-details__information-container">
                    <article className="traveler-details__information">
                        <h3 className="traveler-details__title">Name</h3>
                        <p className="traveler-details__text">{name}</p>
                    </article>
                    <article className="traveler-details__information">
                        <h3 className="traveler-details__title">Preferred Destinations</h3>
                        <ul className="traveler-details__list traveler-details__text">
                            {preferredDestinations.map((destination, index) => {
                                return <li key={index}>{destination}</li>;
                            })}
                        </ul>
                    </article>
                    <article className="traveler-details__information">
                        <h3 className="traveler-details__title">Type of travel</h3>
                        <p className="traveler-details__text">{travelerDetails.type_of_travel}</p>
                    </article>
                    <article className="traveler-details__information">
                        <h3 className="traveler-details__title">Kids</h3>
                        <p className="traveler-details__text">{hasKids}</p>
                    </article>
                    <article className="traveler-details__information">
                        <h3 className="traveler-details__title">Special Considerations</h3>
                        <p className="traveler-details__text">{travelerDetails.special_considerations}</p>
                    </article>
                </section>
                {isAuthenticated && (
                    <div className="traveler-details__input-container">
                        <label className="traveler-details__title" htmlFor="tripSelect">Select a Trip:</label>
                        <select
                            className="traveler-details__input"
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
                        <button className="traveler-details__button" type="button" onClick={handleAddToTrip}>Add to Trip</button>
                        {error && <p className="traveler-details__error">{error}</p>}
                    </div>
                )}
            </section>
        </div>
    )
}
export default TravelerDetails
