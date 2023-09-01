import React from "react";
import "./TravelerCard.scss";
import placeHolderImage from "../../assets/images/placeholder_image.png";

function TravelerCard({ Travelers }) {
    return (
        <div>
            {Travelers.map((t) => {
                const name = `${t.first_name} ${t.last_name}`;
                const hasKids = t.has_kids === 1 ? "Yes" : "No";

                return (
                    <div key={t.id} className="traveler-card">
                        <img src={placeHolderImage} alt="placeholder a human profile" />
                        <section>
                            <article>
                                <p>Name</p>
                                <p>{name}</p>
                            </article>
                            <article>
                                <p>Destinations</p>
                                {/* Display destinations here */}
                                <p>{t.destinations.join(", ")}</p>
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
                        <div>
                            <select>
                                <option>test</option>
                                <option>test1</option>
                            </select>
                            <button>Add to trip</button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default TravelerCard;
