import './EditTrip.scss'
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import backarrow from "../../assets/images/arrow_back-24px.svg";

const API_URL = process.env.REACT_APP_API_URL;
const PORT = process.env.REACT_APP_API_PORT;

function EditTrip() {
    const { id } = useParams();
    const [destination, setDestination] = useState(null);
    const [tripDetails, setTripDetails] = useState({
        trip_name: "",
        kid_friendly: false,
        destination_id: ``,
        trip_length: "",
        notes: ""
    });
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const goBack = () => navigate(-1);

    useEffect(() => {
        axios
            .get(`${API_URL}:${PORT}/trips/${id}`)
            .then((res) => {
                const tripData = res.data;
                setTripDetails({
                    ...tripDetails,
                    trip_name: tripData.trip_name,
                    kid_friendly: tripData.kid_friendly === "true",
                    destination_id: tripData.destination_id,
                    trip_length: tripData.trip_length,
                    notes: tripData.notes
                });
            })
            .catch(error => {
                console.log(error)
            });
    }, [id])

    useEffect(() => {
        axios
            .get(`${API_URL}:${PORT}/destinations`)
            .then((res) => {
                const destinationData = res.data;
                setDestination(destinationData);
            })
            .catch(error => {
                console.log(error)
            });
    }, []);

    const handleFormSubmit = (e) => {
        e.preventDefault();

        if (!tripDetails.trip_name || !tripDetails.destination_id || isNaN(tripDetails.trip_length)) {
            setError("Please fill in all required fields and ensure trip length is a valid number.");
            console.log(tripDetails.trip_length)
            console.log(tripDetails.destination_id)
            console.log(tripDetails.trip_name)
            return;
        }
        const updatedTripDetails = {
            trip_name: tripDetails.trip_name,
            kid_friendly: tripDetails.kid_friendly ? "true" : "false",
            destination_id: tripDetails.destination_id,
            trip_length: tripDetails.trip_length,
            notes: tripDetails.notes,
        };

        axios
            .put(`${API_URL}:${PORT}/trips/${id}`, updatedTripDetails)
            .then((res) => {
                console.log(res.data);
                console.log(updatedTripDetails)
                navigate('/Trips')
                
            })
            .catch(error => {
                console.log(error);
            });
    }

    if (destination === null) {
        return (
            <>
                <p>Loading Destination Data Please Wait.</p>
            </>
        )
    }

    const deleteTrip = () => {
        axios
            .delete(`${API_URL}:${PORT}/trips/${id}`)
            .then(() => {
                navigate('/Trips')
            })
    }

    return (
        <form onSubmit={handleFormSubmit}>
            <div>
                <h1>Edit Trip Details</h1>
                <img src={backarrow} alt="Back arrowkey" onClick={goBack} />
            </div>
            {error && <p className="error">{error}</p>}
            <input type='text' placeholder='Name of trip' value={tripDetails.trip_name} onChange={(e) => setTripDetails({ ...tripDetails, trip_name: e.target.value })} />
            <input type='text' placeholder='Length of Trip' value={tripDetails.trip_length} onChange={(e) => setTripDetails({ ...tripDetails, trip_length: e.target.value })} />
      
            {destination !== null && (
            <div>
                <p>Destinations</p>
                <label htmlFor="destination-select">Select a destination:</label>
                <select
                    id="destination-select"
                    value={tripDetails.destination_id}
                    onChange={(e) => setTripDetails({ ...tripDetails, destination_id: e.target.value })}
                    defaultValue={tripDetails.destination_id}
                >
                    <option>Select Destination</option>
                    {destination.map((place) => (
                        <option key={place.id} value={place.id}>{place.place}</option>
                    ))}
                </select>
            </div>
        )}
            <label>
                Kid Friendly Trip
                <input
                    type="checkbox"
                    placeholder="Kids Friendly"
                    name="kids"
                    checked={tripDetails.kid_friendly}
                    onChange={(e) => setTripDetails({ ...tripDetails, kid_friendly: e.target.checked })}
                />
            </label>
            <textarea placeholder='Add travel details' value={tripDetails.notes} onChange={(e) => setTripDetails({ ...tripDetails, notes: e.target.value })}></textarea>
            <button type="submit">Update Trip</button>
            <button onClick={deleteTrip}>Delete Trip</button>
        </form>
    )
}

export default EditTrip;