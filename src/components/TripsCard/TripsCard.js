import { Link } from "react-router-dom"
import "./TripsCard.scss"
function TripsCard({ trips }) {
    console.log("trips prop", trips)

    return (
        <div className="trips-card">
            {trips.map((data) => {
                const kidFriendly = data.kid_friendly === 1 ? "Yes" : "No";

                return (
                    <Link className="trips-card__container"to={`/Trips/${data.trip_id}`} key={data.trip_id}>
                            <div className="trips-card__title-container">
                                <h1 className="trips-card__main-title">{data.trip_name}</h1>
                            </div>
                            <div className="trips-card__info-container">
                                <div className="trips-card__information">
                                    <h3 className="trips-card__title">Number of travelers</h3>
                                    <p className="trips-card__text">{data.num_travelers}</p>
                                </div>
                                <div className="trips-card__information">
                                    <h3 className="trips-card__title">Destination</h3>
                                    <p className="trips-card__text">{data.destination}</p>
                                </div>
                                <div className="trips-card__information">
                                    <h3 className="trips-card__title">Kid Friendly</h3>
                                    <p className="trips-card__text">{kidFriendly}</p>
                                </div>
                                <div className="trips-card__information--description">
                                    <h3 className="trips-card__title">Description/notes</h3>
                                    <p className="trips-card__description">{data.notes}</p>
                                </div>
                            </div>
                    </Link>
                );
            })}
        </div>
    );
}

export default TripsCard