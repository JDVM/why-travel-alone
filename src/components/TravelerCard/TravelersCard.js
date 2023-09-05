import React from "react";
import "./TravelerCard.scss";

import { Link } from "react-router-dom";

const profilepic = [
    {
        picture: "/userprofilepictures/1.jpg"
    },
    {
        picture: "/userprofilepictures/2.jpg"
    },
    {
        picture: "/userprofilepictures/3.jpg"
    },
    {
        picture: "/userprofilepictures/4.jpg"
    },
    {
        picture: "/userprofilepictures/5.jpg"
    },
    {
        picture: "/userprofilepictures/6.jpg"
    },
    {
        picture: "/userprofilepictures/7.jpg"
    },
    {
        picture: "/userprofilepictures/8.jpg"
    },
    {
        picture: "/userprofilepictures/9.jpg"
    },
    {
        picture: "/userprofilepictures/10.jpg"
    },
    {
        picture: "/userprofilepictures/11.jpg"
    },
    {
        picture: "/userprofilepictures/12.jpg"
    },
    {
        picture: "/userprofilepictures/13.jpg"
    },
    {
        picture: "/userprofilepictures/14.jpg"
    },
    {
        picture: "/userprofilepictures/15.jpg"
    },
    {
        picture: "/userprofilepictures/16.jpg"
    },
    {
        picture: "/userprofilepictures/17.jpg"
    },
    {
        picture: "/userprofilepictures/18.jpg"
    },
    {
        picture: "/userprofilepictures/19.jpg"
    },
    {
        picture: "/userprofilepictures/20.jpg"
    },
    {
        picture: "/userprofilepictures/21.jpg"
    },
    {
        picture: "/userprofilepictures/23.jpg"
    },
    {
        picture: "/userprofilepictures/24.jpg"
    },
    {
        picture: "/userprofilepictures/25.jpg"
    },
    {
        picture: "/userprofilepictures/26.jpg"
    },
    {
        picture: "/userprofilepictures/27.jpg"
    },
    {
        picture: "/userprofilepictures/28.jpg"
    },
    {
        picture: "/userprofilepictures/29.jpg"
    },
    {
        picture: "/userprofilepictures/30.jpg"
    },
    {
        picture: "/userprofilepictures/31.jpg"
    },
    {
        picture: "/userprofilepictures/31.jpg"
    }
]

function TravelerCard({ travelers }) {
console.log("profilePic",profilepic.length)
    console.log("traveler", travelers.length)

    if (travelers === undefined) {
        return <p>Loading...</p>;
    }
    return (
        <div className="traveler-card">
            {travelers.map((t, i) => {
                const name = `${t.first_name} ${t.last_name}`;
                const hasKids = t.has_kids === 1 ? "Yes" : "No";
                const PreferredDestinations = t.preferred_destinations
                console.log(PreferredDestinations)
                return (
                    <Link className="traveler-card__container" key={t.user_id} to={`/Travelers/${t.user_id}`}>
                        <img className="traveler-card__image" src={profilepic[i].picture} alt="placeholder a human profile" />
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
                                    {PreferredDestinations.map((destination, index) => {
                                        return <li className="traveler-card__text " key={index}>{destination}</li>;
                                    })}
                                </ul>
                            </article>
                            <article className="traveler-card__info-container">
                                <h3 className="traveler-card__title">Kids</h3>
                                <p className="traveler-card__text">{hasKids}</p>
                            </article>
                            <article className="traveler-card__info-container">
                                <h3 className="traveler-card__title">Special Considerations</h3>
                                <p className="traveler-card__text">{t.special_considerations}</p>
                            </article>
                        </section>
                    </Link>
                );
            })}
        </div>
    );
}

export default TravelerCard;
