import "./TripDetails.scss"
import { useEffect, useState, useCallback } from "react";
import { Link, useParams, useNavigate } from "react-router-dom"
import SmallTravelerCard from "../SmallTravelerCard/SmallTraverlerCard";
import backarrow from "../../assets/images/arrow_back-24px.svg";
import { getTrip } from "../../api/trips";

function TripDetails() {
    const { id } = useParams();
    const [tripDetails, setTripDetails] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const goBack = () => navigate(-1);

    const loadTrip = useCallback(() => {
        getTrip(id)
            .then(setTripDetails)
            .catch((err) => {
                console.error(err);
                setError("Unable to load trip data.");
            });
    }, [id]);

    useEffect(() => {
        loadTrip();
    }, [loadTrip]);

    if (error) {
        return <p>{error}</p>;
    }
    if (!tripDetails) {
        return <p>Loading trip data, please wait…</p>;
    }

    const kidFriendly = tripDetails.kid_friendly ? "Yes" : "No";
    const travelersForThisTrip = tripDetails.users || [];

    return (
        <div className="trip-details">
            <div className="trip-details__container">
                <div className="trip-details__title-container">
                    <img className="trip-details__image" src={backarrow} alt="Back arrowkey" onClick={goBack} />
                    <h1 className="trip-details__main-title">Trip Details</h1>
                </div>
                <div className="trip-details__information-container">
                    <div className="trip-details__information">
                        <h3 className="trip-details__title">Trip Name</h3>
                        <p className="trip-details__text">{tripDetails.trip_name}</p>
                    </div>
                    <div className="trip-details__information">
                        <h4 className="trip-details__title">Trip Duration</h4>
                        <p className="trip-details__text">{tripDetails.trip_length} days</p>
                    </div>
                    <div className="trip-details__information">
                        <h4 className="trip-details__title">Destination</h4>
                        <p className="trip-details__text">{tripDetails.destination}</p>
                    </div>
                    <div className="trip-details__information">
                        <label htmlFor="kid-friendly" className="trip-details__title">Kid Friendly</label>
                        <p id="kid-friendly" className="trip-details__text">{kidFriendly}</p>
                    </div>
                    <div className="trips-card__information--description">
                        <h3 className="trip-details__title">Trip Description</h3>
                        <p className="trip-details__text">{tripDetails.notes}</p>
                    </div>
                </div>
                <Link className="trip-details__button-container" to={`/Trips/${id}/edit`}>
                    <button className="trip-details__button">Edit</button>
                </Link>
            </div>
            <section>
                <SmallTravelerCard travelers={travelersForThisTrip} onRemoved={loadTrip} />
            </section>
        </div>
    )
}

export default TripDetails;
