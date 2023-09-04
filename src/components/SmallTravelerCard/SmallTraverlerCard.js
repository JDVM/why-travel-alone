import React from "react";
import "./SmallTravelerCard.scss";
import placeHolderImage from "../../assets/images/placeholder_image.png";
import { Link, useParams} from "react-router-dom";
import axios from "axios";

function SmallTravelerCard({ travelers }) {
    const API_URL = process.env.REACT_APP_API_URL;
    const PORT = process.env.REACT_APP_API_PORT;
    const { id } = useParams()
    console.log("traveler props", travelers)
    if (travelers === undefined) {
        return <p>Loading...</p>;
    }

    const handleDelete = async (userId) => {
        await axios.delete(`${API_URL}:${PORT}/travelers/${id}/${userId}`)
            .then(() => {
                window.location.reload();
            });

        console.log(`Removed User ${userId} from trip`);
    }

    return (
        <div className="small-traveler-card">
            {travelers.map((t) => {
                const name = `${t.first_name} ${t.last_name}`;
                const hasKids = t.has_kids === 1 ? "Yes" : "No";
                const PreferredDestinations = t.preferred_destinations
                console.log(PreferredDestinations)
                return (
                    <div className="small-traveler-card__container" key={t.user_id}>
                        <Link to={`/Travelers/${t.user_id}`}>
                            <div>
                                <img className="small-traveler-card__image" src={placeHolderImage} alt="placeholder a human profile" />
                                <section>
                                    <article>
                                        <p>Name</p>
                                        <p>{name}</p>
                                    </article>
                                    <article>
                                        <p>Type of travel</p>
                                        <p>{t.type_of_travel}</p>
                                    </article>
                                    <article>
                                        <p>Kids</p>
                                        <p>{hasKids}</p>
                                    </article>
                                    <article>
                                        <p>Special Considerations</p>
                                        <p>{t.special_considerations}</p>
                                    </article>
                                </section>
                            </div>
                        </Link>
                        <button onClick={() => handleDelete(t.user_id)}>Remove From Trip</button>
                    </div>
                );
            })}
        </div>
    )
}
export default SmallTravelerCard;

