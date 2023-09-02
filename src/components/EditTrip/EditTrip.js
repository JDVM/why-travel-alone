import Destinations from '../Destinations/Destinations'
import './EditTrip.scss'
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
const API_URL = process.env.REACT_APP_API_URL;
const PORT = process.env.REACT_APP_API_PORT;

function AddTrip() {
    const { id } = useParams();
    const [tripDetails, setTripDetails] = useState(id);
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

    return (
        <form>
            <input type='text'placeholder='Name of trip' value={tripDetails.trip_name} />
            <input type='text'placeholder='Length of Trip' value={tripDetails.trip_length} />
            <div>
                <p>Destinations</p>
                <Destinations />
            </div>
            <label>Kids<input type='checkbox' placeholder='Kids Friendly' name="kids" /></label>
            <textarea placeholder='Add travel details' value={tripDetails.notes}></textarea>
        </form>
    )
}

export default AddTrip;