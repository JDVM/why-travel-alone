import "./TravelerDetails.scss"
import placeholderImage from '../../assets/images/placeholder_image.png'

function TravelerDetails({ travelerDetails }) {
    const name = `${travelerDetails.first_name} ${travelerDetails.last_name}`;
    const hasKids = travelerDetails.has_kids === 1 ? "Yes" : "No";
    const PreferredDestinations = travelerDetails.preferred_destinations

    return (
        <div className="travler-details">
            <img className="travel-details__image" alt="placeholder" src={placeholderImage} />
            <section>
                <article>
                    <p>Name</p>
                    <p>{name}</p>
                </article>
                <article>
                    <p>PrefereddDestinations</p>
                    <ul>
                        {PreferredDestinations.map((destination, index) => {
                            return <li key={index}>{destination}</li>;
                        })}
                    </ul>
                </article>
                <article>
                    <p>Type of travel</p>
                    <p>{travelerDetails.type_of_travel}</p>
                </article>
                <article>
                    <p>Kids</p>
                    <p>{hasKids}</p>
                </article>
                <article>
                    <p>Special Considerations</p>
                    <p>{travelerDetails.special_considerations}</p>
                </article>
            </section>
            <div>
                <select>
                    <option>trip option 1</option>
                    <option>trip option 2</option>
                </select>
                <button>Add to trip</button>
            </div>
        </div>
    )
}
export default TravelerDetails