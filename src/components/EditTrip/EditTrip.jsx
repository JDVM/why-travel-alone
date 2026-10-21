import './EditTrip.scss'
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BackButton from "../BackButton/BackButton";
import { getDestinations } from "../../api/destinations";
import { getTrip, updateTrip, deleteTrip } from "../../api/trips";
import { errorMessage } from "../../api/errors";

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
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Load destinations first, then the trip. Older APIs return only the
    // destination name from GET /trips/:id, so fall back to matching the name
    // against the destinations list when destination_id is absent.
    useEffect(() => {
        let destinationsList = [];
        getDestinations()
            .then((list) => {
                destinationsList = list;
                setDestination(list);
                return getTrip(id);
            })
            .then((tripData) => {
                const match = destinationsList.find((d) => d.place === tripData.destination);
                setTripDetails({
                    trip_name: tripData.trip_name,
                    kid_friendly: tripData.kid_friendly,
                    destination_id: tripData.destination_id ?? (match ? match.id : ""),
                    trip_length: tripData.trip_length,
                    notes: tripData.notes || "",
                });
            })
            .catch((err) => {
                console.error(err);
                setError("Unable to load trip data.");
            });
    }, [id])

    const handleFormSubmit = (e) => {
        e.preventDefault();

        if (!tripDetails.trip_name || !tripDetails.destination_id || tripDetails.trip_length === "" || isNaN(tripDetails.trip_length)) {
            setError("Please fill in all required fields and ensure trip length is a valid number.");
            return;
        }

        updateTrip(id, {
            trip_name: tripDetails.trip_name,
            kid_friendly: tripDetails.kid_friendly,
            destination_id: tripDetails.destination_id,
            trip_length: tripDetails.trip_length,
            notes: tripDetails.notes,
        })
            .then(() => {
                navigate('/Trips');
            })
            .catch((err) => {
                console.error(err);
                setError(errorMessage(err, "Failed to update trip. Please try again."));
            });
    }

    const handleDelete = () => {
        deleteTrip(id)
            .then(() => {
                navigate('/Trips');
            })
            .catch((err) => {
                console.error(err);
                setError(errorMessage(err, "Failed to delete trip. Please try again."));
            });
    }

    if (destination === null) {
        return error ? <p>{error}</p> : <p>Loading destination data, please wait…</p>;
    }

    return (
        <form className='trip-edit' onSubmit={handleFormSubmit}>
            <div className='trip-edit__title-container'>
                <BackButton />
                <h1 className='trip-edit__main-title'>Edit Trip Details</h1>
            </div>
            <label htmlFor="name" className='trip-edit__title'>Trip Name </label>
            <input className='trip-edit__input' type='text' id="name" placeholder='Name of trip' value={tripDetails.trip_name} onChange={(e) => setTripDetails({ ...tripDetails, trip_name: e.target.value })} />
            <label htmlFor="length" className='trip-edit__title'>Trip Length </label>
            <input className='trip-edit__input' type='text' id="length" placeholder='Length of Trip' value={tripDetails.trip_length} onChange={(e) => setTripDetails({ ...tripDetails, trip_length: e.target.value })} />

            <div className='trip-edit__destination-container'>
                <h3 className='trip-edit__title'>Destinations</h3>
                <select
                    className='trip-edit__input'
                    id="destination-select"
                    value={tripDetails.destination_id}
                    onChange={(e) => setTripDetails({ ...tripDetails, destination_id: e.target.value })}
                >
                    <option value="">Select Destination</option>
                    {destination.map((place) => (
                        <option key={place.id} value={place.id}>{place.place}</option>
                    ))}
                </select>
            </div>
            <label className='trip-edit__title'>
                Kid Friendly Trip
                <input
                    type="checkbox"
                    name="kids"
                    checked={tripDetails.kid_friendly}
                    onChange={(e) => setTripDetails({ ...tripDetails, kid_friendly: e.target.checked })}
                />
            </label>
            <div className='trip-edit__description-container'>
                <h3 className='trip-edit__title'>Description/Notes</h3>
                <textarea className='trip-edit__input' placeholder='Add travel details' value={tripDetails.notes} onChange={(e) => setTripDetails({ ...tripDetails, notes: e.target.value })}></textarea>
            </div>
            {error && <p className='trip-edit__error'>{error}</p>}
            <div className='trip-edit__button-container'>
                <button className='trip-edit__button' type="submit">Update Trip</button>
                <button className='trip-edit__button' type="button" onClick={handleDelete}>Delete Trip</button>
            </div>
        </form>
    )
}

export default EditTrip;
