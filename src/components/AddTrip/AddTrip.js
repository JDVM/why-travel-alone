import './AddTrip.scss'
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
const API_URL = process.env.REACT_APP_API_URL;
const PORT = process.env.REACT_APP_API_PORT;

function AddTrip() {
    const [destination, setDestination] = useState(null);
    return (
        <form>
            <input type='text'placeholder='Name of trip' />
            <input type='text'placeholder='Length of Trip' />
            <div>
                <p>Destinations</p>
                {destination.map((place) => (
                    <option key={place.id}>{place.place}</option>
                ))}
            </div>
            <label>Kids<input type='checkbox' placeholder='Kids Friendly' name="kids" /></label>
            <textarea placeholder='Add travel details'></textarea>
        </form>
    )
}

export default AddTrip;