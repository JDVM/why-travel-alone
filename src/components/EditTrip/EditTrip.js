import './EditTrip.scss'
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useNavigate} from "react-router-dom";
import backarrow from "../../assets/images/arrow_back-24px.svg";

const API_URL = process.env.REACT_APP_API_URL;
const PORT = process.env.REACT_APP_API_PORT;

function EditTrip() {
    const { id } = useParams();
    const [destination, setDestination] = useState(null);
    const [tripDetails, setTripDetails] = useState({
        trip_name: "",
        kid_friendly: false,
        destination_id: "", 
        trip_length: "",
        notes: ""
    });
    const navigate = useNavigate();
    const goBack = () => navigate(-1); 

    const [isSubmissionSuccess, setIsSubmissionSuccess] = useState(false);

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
                setIsSubmissionSuccess(true); console.log(updatedTripDetails)
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

    return (
        <form onSubmit={handleFormSubmit}>
            <div>
                <h1>Edit Trip Details</h1>
                <img src={backarrow} alt="Back arrowkey" onClick={goBack} />
            </div>
            <input type='text' placeholder='Name of trip' value={tripDetails.trip_name} onChange={(e) => setTripDetails({ ...tripDetails, trip_name: e.target.value })} />
            <input type='text' placeholder='Length of Trip' value={tripDetails.trip_length} onChange={(e) => setTripDetails({ ...tripDetails, trip_length: e.target.value })} />
            <div>
                <p>Destinations</p>
                <select
                    value={tripDetails.destination_id}
                    onChange={(e) => setTripDetails({ ...tripDetails, destination_id: e.target.value })}
                >
                    {destination.map((place) => (
                    <option key={place.id} value={place.id}>{place.place}</option>
                ))}
                </select>
            </div>
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
        </form>
    )
}

export default EditTrip;