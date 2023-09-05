import "./TravelerDetails.scss"
import placeholderImage from '../../assets/images/placeholder_image.png'
import { useEffect, useState } from "react";
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

    const profilepic = [
        {
            picture: "/userprofilepictures/1.jpg"
        },
        {
            picture: "/userprofilepictures/2.jpg"
        },
        {
            picture: "/userprofilepictures/3.jpg"
        },
        {
            picture: "/userprofilepictures/4.jpg"
        },
        {
            picture: "/userprofilepictures/5.jpg"
        },
        {
            picture: "/userprofilepictures/6.jpg"
        },
        {
            picture: "/userprofilepictures/7.jpg"
        },
        {
            picture: "/userprofilepictures/8.jpg"
        },
        {
            picture: "/userprofilepictures/9.jpg"
        },
        {
            picture: "/userprofilepictures/10.jpg"
        },
        {
            picture: "/userprofilepictures/11.jpg"
        },
        {
            picture: "/userprofilepictures/12.jpg"
        },
        {
            picture: "/userprofilepictures/13.jpg"
        },
        {
            picture: "/userprofilepictures/14.jpg"
        },
        {
            picture: "/userprofilepictures/15.jpg"
        },
        {
            picture: "/userprofilepictures/16.jpg"
        },
        {
            picture: "/userprofilepictures/17.jpg"
        },
        {
            picture: "/userprofilepictures/18.jpg"
        },
        {
            picture: "/userprofilepictures/19.jpg"
        },
        {
            picture: "/userprofilepictures/20.jpg"
        },
        {
            picture: "/userprofilepictures/21.jpg"
        },
        {
            picture: "/userprofilepictures/23.jpg"
        },
        {
            picture: "/userprofilepictures/24.jpg"
        },
        {
            picture: "/userprofilepictures/25.jpg"
        },
        {
            picture: "/userprofilepictures/26.jpg"
        },
        {
            picture: "/userprofilepictures/27.jpg"
        },
        {
            picture: "/userprofilepictures/28.jpg"
        },
        {
            picture: "/userprofilepictures/29.jpg"
        },
        {
            picture: "/userprofilepictures/30.jpg"
        },
        {
            picture: "/userprofilepictures/31.jpg"
        },
        {
            picture: "/userprofilepictures/31.jpg"
        }
    ]
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
        <div className="traveler-details">
            <section className="traveler-details__container">
                <div className="traveler-details__title-container">
                    <img src={backarrow} alt="Back arrowkey" onClick={goBack} />
                    <h1 className="traveler-details__main-title">Traveler Profile</h1>
                </div>

                <img className="traveler-details__image" alt="placeholder" src={profilepic[0].picture} />
                <section className="traveler-details__information-container">
                    <article className="traveler-details__information">
                        <h3 className="traveler-details__title">Name</h3>
                        <p className="traveler-details__text">{name}</p>
                    </article>
                    <article className="traveler-details__information">
                        <h3 className="traveler-details__title">Prefered Destinations</h3>
                        <ul className="traveler-details__list traveler-details__text">
                            {PreferredDestinations.map((destination, index) => {
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
                <div className="traveler-details__input-container">
                    <label className="traveler-details__title" for="tripSelect">Select a Trip:</label>
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
                    <button className="traveler-details__button" onClick={handleAddToTrip}>Add to Trip</button>
                </div>
            </section>
        </div>
    )
}
export default TravelerDetails