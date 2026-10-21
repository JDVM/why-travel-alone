import React from "react";
import "./TravelerCard.scss";
import { Link } from "react-router-dom";
import { picForIndex } from "../../data/profilePics";

function TravelerCard({ travelers }) {
    if (travelers === undefined) {
        return <p>Loading...</p>;
    }
    return (
        <div className="traveler-card">
            {travelers.map((t, i) => {
                const name = `${t.first_name} ${t.last_name}`;
                const hasKids = t.has_kids ? "Yes" : "No";
                const preferredDestinations = t.preferred_destinations || [];
                return (
                    <Link className="traveler-card__container" key={t.user_id} to={`/Travelers/${t.user_id}`}>
                        <img className="traveler-card__image" src={picForIndex(i)} alt="" />
                        <section className="traveler-card__information">
                            <article className="traveler-card__info-container">
                                <h3 className="traveler-card__title">Name</h3>
                                <p className="traveler-card__text">{name}</p>
                            </article>
                            <article className="traveler-card__info-container">
                                <h3 className="traveler-card__title">Type of travel</h3>
                                <p className="traveler-card__text">{t.type_of_travel}</p>
                            </article>
                            <article className="traveler-card__info-container">
                                <h3 className="traveler-card__title">Destinations</h3>
                                <ul className="traveler-card__list">
                                    {preferredDestinations.map((destination, index) => {
                                        return <li className="traveler-card__text " key={index}>{destination}</li>;
                                    })}
                                </ul>
                            </article>
                            {/* Private fields: the API only sends them when you may see them. */}
                            {"has_kids" in t && (
                                <article className="traveler-card__info-container">
                                    <h3 className="traveler-card__title">Kids</h3>
                                    <p className="traveler-card__text">{hasKids}</p>
                                </article>
                            )}
                            {"special_considerations" in t && (
                                <article className="traveler-card__info-container">
                                    <h3 className="traveler-card__title">Special Considerations</h3>
                                    <p className="traveler-card__text">{t.special_considerations}</p>
                                </article>
                            )}
                        </section>
                    </Link>
                );
            })}
        </div>
    );
}

export default TravelerCard;
