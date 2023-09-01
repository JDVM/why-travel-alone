import React from "react";
import "./TravelerCard.scss";
import placeHolderImage from "../../assets/images/placeholder_image.png";
import { Link } from "react-router-dom";

function TravelerCard({ travelers }) {
    console.log("traveler props", travelers)
    return (
        <div className="traveler-card">
            {travelers.map((t) => {
                const name = `${t.first_name} ${t.last_name}`;
                const hasKids = t.has_kids === 1 ? "Yes" : "No";
                const PreferredDestinations = t.preferred_destinations
                // console.log(PreferredDestinations)
                return (
                    <Link to={`travelers/${t.user_id}`}>
                        <div className="traveler-card__container" key={t.user_id} >
                            <img className="traveler-card__image" src={placeHolderImage} alt="placeholder a human profile" />
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
                                    <p>Destinations</p>
                                    <ul>
                                        {PreferredDestinations.map((destination, index) => {
                                            return <li key={index}>{destination}</li>;
                                        })}

                                    </ul>
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
                );
            })}
        </div>
    );
}

export default TravelerCard;
