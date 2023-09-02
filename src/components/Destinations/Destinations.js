import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
const API_URL = process.env.REACT_APP_API_URL;
const PORT = process.env.REACT_APP_API_PORT;

import "./Destinations.scss"

function Destinations() {
    const [destination, setDestination] = useState(null)
    useEffect(() => {
        axios
        .get(`${API_URL}:${PORT}/destination`)
        .then((res) => {
            const destinationData = res.data;
            setDestination(destinationData);
        })
        .catch(error => {
            console.log(error)
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);

if (!destination) {
    return (
        <>
            <p>Loading destination Data Please Wait.</p>
        </>)
}

    
return (
    <select>
        <option>Asia</option>
        <option>Latin America</option>
        <option>North America</option>
        <option>Europe</option>
    </select>
)
}

export default Destinations