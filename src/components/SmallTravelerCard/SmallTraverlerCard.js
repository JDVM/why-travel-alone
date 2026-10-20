import React from "react";
import "./SmallTravelerCard.scss";
import { Link, useParams } from "react-router-dom";
import { picForIndex } from "../../data/profilePics";
import { removeTravelerFromTrip } from "../../api/travelers";

function SmallTravelerCard({ travelers, onRemoved }) {
    const { id } = useParams();

    if (travelers === undefined) {
        return <p>Loading...</p>;
    }

    const handleDelete = async (e, userId) => {
        // The button sits inside a Link; stop the click from navigating.
        e.preventDefault();
        e.stopPropagation();
        try {
            await removeTravelerFromTrip(id, userId);
            if (onRemoved) {
                onRemoved();
            }
        } catch (err) {
            console.error(err);
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
                            <article className="small-traveler-card__info-container">
                                <p className="small-traveler-card__title">Kids</p>
                                <p className="small-traveler-card__text">{hasKids}</p>
                            </article>
                            <article className="small-traveler-card__info-container">
                                <p className="small-traveler-card__title">Special Considerations</p>
                                <p className="small-traveler-card__text">{t.special_considerations}</p>
                            </article>
                        </section>
                        <button className="small-traveler-card__button" type="button" onClick={(e) => handleDelete(e, t.user_id)}>Remove</button>
                    </Link>
                );
            })}
        </div>
    )
}
export default SmallTravelerCard;
