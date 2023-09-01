import "./Travelers.scss"
import { useParams, useLocation } from "react-router-dom"
import TravelerCard from "../../components/TravelerCard/TravelersCard"
import TravelerDetails from "../../components/TravelerDetails/TravelerDetails";
import { useEffect, useState } from "react";
import axios from "axios";

function Travelers() {
    const API_URL = process.env.REACT_APP_API_URL;
    const PORT = process.env.REACT_APP_API_PORT;
    const [travelers, setTravelers] = useState();
    const [travelerDetails, setTravelerDetails] = useState();
    const { id } = useParams();
    const location = useLocation();

    useEffect(() => {
        axios
            .get(`${API_URL}:${PORT}/travelers`)
            .then((res) => {
                const travelers = res.data;
                console.log(travelers);
                setTravelers(travelers);
            })
            .catch(error => {
                console.log(error)
            });

        axios
            .get(`${API_URL}:${PORT}/travelers/${id}`)
            .then((res) => {
                const travelerData = res.data;
                setTravelerDetails(travelerData);
            })
            .catch(error => {
                console.log(error)
            });
    }, []);

    console.log(travelerDetails)

    if (location.pathname.endsWith(`/${id}`))
        return (
            <>
                <TravelerDetails travelerDetails={travelerDetails} />
            </>
        )
    // i have 
    // if (!travelerDetails) {
    //     return <p>Loading...</p>;
    // }
    console.log("travelers props", travelers)
        return (
            
            <>
                <TravelerCard Travelers={travelers} />
            </>
        )
}

export default Travelers