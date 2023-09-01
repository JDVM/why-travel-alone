import "./TripsCard.scss"
function TripsCard({ trips }) {
    console.log(trips)
    return (
        trips.map((data) => (
            <div key={data.trip_id}>
                <div>
                    <p>Trip Name</p>
                    <p>{data.trip_name}</p>
                </div>
                <div>
                    <p>Number of travelers title</p>
                    <p>{data.num_travelers}</p>
                    <p>Destination title</p>
                    <p>{data.destination}</p>
                    <p>Description/notes</p>
                    <p>{data.notes}</p>
                </div>
            </div>
        ))
    )
}

export default TripsCard