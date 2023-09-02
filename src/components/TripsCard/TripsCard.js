import { Link } from "react-router-dom"
import "./TripsCard.scss"
function TripsCard({ trips }) {
    console.log("trips prop", trips)

    return (
        <>
            {trips.map((data) => {
                const kidFriendly = data.kid_friendly === 1 ? "Yes" : "No";

                return (
                    <Link to={`/Trips/${data.trip_id}`} key={data.trip_id}>
                        <div className="trips-card">
                            <div>
                                <p>Trip Name</p>
                                <p>{data.trip_name}</p>
                            </div>
                            <div>
                                <p>Number of travelers title</p>
                                <p>{data.num_travelers}</p>
                                <p>Destination title</p>
                                <p>{data.destination}</p>
                                <p>Kid Friendly</p>
                                <p>{kidFriendly}</p>
                                <p>Description/notes</p>
                                <p>{data.notes}</p>
                            </div>
                        </div>
                    </Link>
                );
            })}
        </>
    );
}

export default TripsCard