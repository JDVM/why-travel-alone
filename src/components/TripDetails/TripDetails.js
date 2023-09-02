import "./TripDetails.scss"
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom"
import SmallTravelerCard from "../SmallTravelerCard/SmallTraverlerCard";
const API_URL = process.env.REACT_APP_API_URL;
const PORT = process.env.REACT_APP_API_PORT;

function TripDetails() {
    const { id } = useParams();
    const [tripDetails, setTripDetails] = useState(id);
    const travelersForThisTrip = tripDetails.users

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
        <div>
            <p>{tripDetails.trip_name}</p>
            <p>Trip Duration</p>
            <p>{tripDetails.trip_length} days</p>
            <div>
                <p>Destination</p>
                <p>{tripDetails.destination}</p>

            </div>
            <label>Kid Friendly<p>{kidFriendly}</p></label>
            <p>{tripDetails.notes}</p>
            <section>
                <SmallTravelerCard travelers={travelersForThisTrip} />
            </section>
        </div>
    )
}

export default TripDetails;