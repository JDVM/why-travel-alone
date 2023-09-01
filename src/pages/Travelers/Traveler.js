import "./Travelers.scss"
import TravelerCard from "../../components/TravelerCard/TravelersCard"
import { useEffect, useState } from "react";
import axios from "axios";

function Travelers() {
    const API_URL = process.env.REACT_APP_API_URL;
    const PORT = process.env.REACT_APP_API_PORT;
    const [travelers, setTravelers] = useState();


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
    }, []);

   
    if (travelers === undefined) {
        return <p>Loading...</p>;
    }


    return (
        <>
            <TravelerCard travelers={travelers} />
        </>
    )
}

export default Travelers