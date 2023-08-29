import TravelerCard from "../TravelerCard/TravelersCard";
import "./TripDetails.scss"

function TripDetails() {
    return(
        <div>
            <p>Name of Trip</p>
            <p>Length of trip</p>
            <div>
                <p>Destination</p>
            </div>
            <label>Kids<input type='checkbox' placeholder='Kids Friendly' name="kids" /></label>
            <textarea placeholder='Add travel details'></textarea>
            <section>
                <TravelerCard />
            </section>
        </div>
    )
}

export default TripDetails;