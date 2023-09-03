import "./TravelerDetails.scss"
import placeholderImage from '../../assets/images/placeholder_image.png'
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom"

function TravelerDetails() {
    const API_URL = process.env.REACT_APP_API_URL;
    const PORT = process.env.REACT_APP_API_PORT;
    const [travelerDetails, setTravelerDetails] = useState();
    const [trips, setTrips] = useState();
    const { id } = useParams();
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
                console.log(tripsData);
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

    return (
        <div className="travler-details">
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
                <select>
                    {trips.map((trip) => {
                        return (
                            <option key={trip.id} value={trip.id}>{trip.trip_name}</option>
                        )
                    })}
                </select>
                <button>Add to trip</button>
            </div>
        </div>
    )
}
export default TravelerDetails