import React from "react";
import "./SmallTravelerCard.scss";
import { Link } from "react-router-dom";
import { picForIndex } from "../../data/profilePics";

// The travelers on a trip. Only the trip's owner gets Remove buttons, and
// never for themselves (removableIds excludes them).
function SmallTravelerCard({ travelers, removableIds = [], onRemove }) {
    if (travelers === undefined) {
        return <p>Loading...</p>;
    }

    const handleRemove = (e, traveler) => {
        // The button sits inside a Link; stop the click from navigating.
        e.preventDefault();
        e.stopPropagation();
        if (onRemove) {
            onRemove(traveler);
        }
    };

    return (
        <div className="small-traveler-card">
            {travelers.map((t, i) => {
                const name = `${t.first_name} ${t.last_name}`;
                const hasKids = t.has_kids ? "Yes" : "No";
                return (
                    <Link className="small-traveler-card__container" key={t.user_id} to={`/Travelers/${t.user_id}`}>
                        <img className="small-traveler-card__image" src={picForIndex(i)} alt="Traveler profile" />
                        <section className="small-traveler-card__information">
                            <article className="small-traveler-card__info-container">
                                <p className="small-traveler-card__title">Name</p>
                                <p className="small-traveler-card__text">{name}</p>
                            </article>
                            <article className="small-traveler-card__info-container">
                                <p className="small-traveler-card__title">Type of travel</p>
                                <p className="small-traveler-card__text">{t.type_of_travel}</p>
                            </article>
                            {/* Private fields: the API only sends them when you may see them. */}
                            {"has_kids" in t && (
                                <article className="small-traveler-card__info-container">
                                    <p className="small-traveler-card__title">Kids</p>
                                    <p className="small-traveler-card__text">{hasKids}</p>
                                </article>
                            )}
                            {"special_considerations" in t && (
                                <article className="small-traveler-card__info-container">
                                    <p className="small-traveler-card__title">Special Considerations</p>
                                    <p className="small-traveler-card__text">{t.special_considerations}</p>
                                </article>
                            )}
                        </section>
                        {removableIds.includes(t.user_id) && (
                            <button className="small-traveler-card__button" type="button" onClick={(e) => handleRemove(e, t)}>Remove</button>
                        )}
                    </Link>
                );
            })}
        </div>
    )
}
export default SmallTravelerCard;
