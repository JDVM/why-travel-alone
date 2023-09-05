import './AddTrip.scss';
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import backarrow from "../../assets/images/arrow_back-24px.svg";

const API_URL = process.env.REACT_APP_API_URL;
const PORT = process.env.REACT_APP_API_PORT;

function AddTrip() {
    const [destination, setDestination] = useState([]);
    const [tripDetails, setTripDetails] = useState({
        trip_name: "",
        kid_friendly: false,
        destination_id: "",
        trip_length: "",
        notes: ""
    });
  
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const goBack = () => navigate(-1);

    useEffect(() => {
        axios
            .get(`${API_URL}:${PORT}/destinations`)
            .then((res) => {
                const destinationData = res.data;
                setDestination(destinationData);
            })
            .catch(error => {
                console.log(error);
                setError("Failed to fetch destinations.");
            });
    }, []);

    const handleFormSubmit = (e) => {
        e.preventDefault();


        if (!tripDetails.trip_name || !tripDetails.destination_id || isNaN(tripDetails.trip_length)) {
            setError("Please fill in all required fields and ensure trip length is a valid number.");
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
            .post(`${API_URL}:${PORT}/trips/new`, updatedTripDetails)
            .then((res) => {
                console.log(res.data);
               
                navigate('/Trips')
            })
            .catch(error => {
                console.log(error);
                setError("Failed to create trip. Please try again.");
                
            });
    }

    return (
        <form className='trip-add' onSubmit={handleFormSubmit}>
            <div className='trip-add__title-container'>
                <img src={backarrow} alt="Back arrowkey" onClick={goBack} />
                <h1 className='trip-add__main-title'>Add Trip Details</h1>
            </div>
            <label className='trip-edit__title'>Trip Name </label>
            <input id="name" className='trip-edit__input' type='text' placeholder='Name of trip' value={tripDetails.trip_name} onChange={(e) => setTripDetails({ ...tripDetails, trip_name: e.target.value })} />
            <label for="length" className='trip-edit__title'>Trip Lentgh </label>
            <input id="length" className='trip-edit__input' type='text' placeholder='Length of Trip' value={tripDetails.trip_length} onChange={(e) => setTripDetails({ ...tripDetails, trip_length: e.target.value })} />
            <div className='trip-edit__destination-container'>
                <h3 className='trip-edit__title'>Destinations</h3>
                <select
                className='trip-edit__input'
                    value={tripDetails.destination_id}
                    onChange={(e) => setTripDetails({ ...tripDetails, destination_id: e.target.value })}
                >
                     <option>Select Destination</option>
                    {destination.map((place) => (
                        <option key={place.id} value={place.id}>{place.place}</option>
                    ))}
                </select>
            </div>
            <label className='trip-edit__title'>
                Kid Friendly Trip
                <input
                    type="checkbox"
                    placeholder="Kids Friendly"
                    name="kids"
                    checked={tripDetails.kid_friendly}
                    onChange={(e) => setTripDetails({ ...tripDetails, kid_friendly: e.target.checked })}
                />
            </label>
            <div className='trip-edit__description-container'>
                <h3 className='trip-edit__title'>Discription/Notes</h3>
            <textarea className='trip-edit__input' placeholder='Add travel details' value={tripDetails.notes} onChange={(e) => setTripDetails({ ...tripDetails, notes: e.target.value })}></textarea>
           </div>
           <div className='trip-edit__button-container'>
             <button className='trip-edit__button' type="submit">Create Trip</button>
           </div>
        </form>
    )
}

export default AddTrip;