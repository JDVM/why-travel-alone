import "./TravelerCard.scss"

function TravelerCard() {
    return (
        <div className="travler-card">
            <img src="/" />
            <section>
                <article>
                    <p>Name</p>
                    <p></p>
                </article>
                <article>
                    <p>Destinations</p>
                    <p></p>
                </article>
                <article>
                    <p>Kids</p>
                   <input type="radial"></input>
                </article>
                <article>
                    <p>Realationship Status</p>
                    <p></p>
                </article>
            </section>
            <div>
                <select>
                    |<option>test</option>
                    |<option>test1</option>
                </select>
                <button>Add to trip</button>
            </div>
        </div>
    )
}
export default TravelerCard