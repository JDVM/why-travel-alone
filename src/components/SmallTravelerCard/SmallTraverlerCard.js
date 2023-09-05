import React from "react";
import "./SmallTravelerCard.scss";
import placeHolderImage from "../../assets/images/placeholder_image.png";
import { Link, useParams } from "react-router-dom";
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
                    <Link className="small-traveler-card__container" key={t.user_id} to={`/Travelers/${t.user_id}`}>
                        <img className="small-traveler-card__image" src={placeHolderImage} alt="placeholder a human profile" />
                        <section className="small-traveler-card__information">
                            <article className="small-traveler-card__info-container">
                                <p className="small-traveler-card__title">Name</p>
                                <p className="small-traveler-card__text">{name}</p>
                            </article>
                            <article className="small-traveler-card__info-container">
                                <p className="small-traveler-card__title">Type of travel</p>
                                <p className="small-traveler-card__text">{t.type_of_travel}</p>
                            </article>
                            <article className="small-traveler-card__info-container">
                                <p className="small-traveler-card__title">Kids</p>
                                <p className="small-traveler-card__text">{hasKids}</p>
                            </article>
                            <article className="small-traveler-card__info-container">
                                <p className="small-traveler-card__title">Special Considerations</p>
                                <p className="small-traveler-card__text">{t.special_considerations}</p>
                            </article>
                        </section>
                        <button className="small-traveler-card__button" onClick={() => handleDelete(t.user_id)}>Remove</button>
                    </Link>
                );
            })}
        </div>
    )
}
export default SmallTravelerCard;

