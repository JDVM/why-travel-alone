import React from "react";
import "./SmallTravelerCard.scss";
import placeHolderImage from "../../assets/images/placeholder_image.png";
import { Link } from "react-router-dom";

function SmallTravelerCard({ travelers }) {
    console.log("traveler props", travelers)
    if (travelers === undefined) {
        return <p>Loading...</p>;
    }

    return (
        <div className="small-traveler-card">
            {travelers.map((t) => {
                const name = `${t.first_name} ${t.last_name}`;
                const hasKids = t.has_kids === 1 ? "Yes" : "No";
                const PreferredDestinations = t.preferred_destinations
                console.log(PreferredDestinations)
                return (
                    <Link to={`/Travelers/${t.user_id}`}>
                        <div className="small-traveler-card__container" key={t.user_id} >
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
                );
            })}
        </div>
    )
}
export default  SmallTravelerCard;