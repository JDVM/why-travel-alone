import './AddTrip.scss';
import { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BackButton from "../BackButton/BackButton";
import { getDestinations } from "../../api/destinations";
import { createTrip } from "../../api/trips";
import { errorMessage } from "../../api/errors";
import { Destination, TripInput } from "../../types";

function AddTrip() {
    const [destination, setDestination] = useState<Destination[]>([]);
    const [tripDetails, setTripDetails] = useState<TripInput>({
        trip_name: "",
        kid_friendly: false,
        destination_id: "",
        trip_length: "",
        notes: ""
    });

    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        getDestinations()
            .then(setDestination)
            .catch((err) => {
                console.error(err);
                setError("Failed to fetch destinations.");
            });
    }, []);

    const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!tripDetails.trip_name || !tripDetails.destination_id || tripDetails.trip_length === "" || Number.isNaN(Number(tripDetails.trip_length))) {
            setError("Please fill in all required fields and ensure trip length is a valid number.");
            return;
        }

        createTrip({
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
                setError(errorMessage(err, "Failed to create trip. Please try again."));
            });
    }

    return (
        <form className='trip-add' onSubmit={handleFormSubmit}>
            <div className='trip-add__title-container'>
                <BackButton />
                <h1 className='trip-add__main-title'>Add Trip Details</h1>
            </div>
            <label htmlFor="name" className='trip-edit__title'>Trip Name </label>
            <input id="name" className='trip-edit__input' type='text' placeholder='Name of trip' value={tripDetails.trip_name} onChange={(e) => setTripDetails({ ...tripDetails, trip_name: e.target.value })} />
            <label htmlFor="length" className='trip-edit__title'>Trip Length </label>
            <input id="length" className='trip-edit__input' type='text' placeholder='Length of Trip' value={tripDetails.trip_length} onChange={(e) => setTripDetails({ ...tripDetails, trip_length: e.target.value })} />
            <div className='trip-edit__destination-container'>
                <h3 className='trip-edit__title'>Destinations</h3>
                <select
                    className='trip-edit__input'
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
                <button className='trip-edit__button' type="submit">Create Trip</button>
            </div>
        </form>
    )
}

export default AddTrip;
