import "./TripDetails.scss"
import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams, useNavigate } from "react-router-dom"
import SmallTravelerCard from "../SmallTravelerCard/SmallTraverlerCard";
import backarrow from "../../assets/images/arrow_back-24px.svg";
const API_URL = process.env.REACT_APP_API_URL;
const PORT = process.env.REACT_APP_API_PORT;

function TripDetails() {
    const { id } = useParams();
    const [tripDetails, setTripDetails] = useState(id);
    const travelersForThisTrip = tripDetails.users
    const navigate = useNavigate();
    const goBack = () => navigate(-1);

    console.log("travelers", travelersForThisTrip)

    useEffect(() => {
        axios
            .get(`${API_URL}:${PORT}/trips/${id}`)
            .then((res) => {
                const tripData = res.data;
                setTripDetails(tripData);
            })
            .catch(error => {
                console.log(error)
            });
    }, [id])
    if (!tripDetails) {
        return (
            <>
                <p>Loading Traveler Data Please Wait.</p>
            </>)
    }
    console.log(tripDetails)
    const kidFriendly = tripDetails.kid_friendly === 1 ? "Yes" : "No";
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
                        <label for="kid-friendly" className="trip-details__title">Kid Friendly</label>
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
                <SmallTravelerCard travelers={travelersForThisTrip} />
            </section>
        </div>
    )
}

export default TripDetails;