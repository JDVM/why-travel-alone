import "./TravelerDetails.scss"

function TravelerDetails({ travelerDetails }) {
    console.log(travelerDetails)
    const name = `${travelerDetails.first_name} ${travelerDetails.last_name}`
    let hasKids = "no"
    if (travelerDetails.has_kids === 1) {
        hasKids = "Yes"
    } 

    return (
        <div className="travler-details">
            <img src="/" />
            <section>
                <article>
                    <p>Name</p>
                    <p>{name}</p>
                </article>
                <article>
                    <p>PrefereddDestinations</p>
                    <p></p>
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