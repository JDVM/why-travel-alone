import "./TravelerDetails.scss"
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import BackButton from "../BackButton/BackButton";
import { picForIndex } from "../../data/profilePics";
import { getTraveler } from "../../api/travelers";
import { getTrips, inviteTraveler } from "../../api/trips";
import { errorMessage } from "../../api/errors";
import { useAuth } from "../../auth/AuthContext";

function TravelerDetails() {
    const [travelerDetails, setTravelerDetails] = useState(null);
    const [ownedTrips, setOwnedTrips] = useState([]);
    const [selectedTripId, setSelectedTripId] = useState("");
    const [error, setError] = useState(null);
    const [inviteMessage, setInviteMessage] = useState(null);
    const [inviteError, setInviteError] = useState(null);
    const { id } = useParams();
    const { account } = useAuth();
    const isMe = account && account.traveler && String(account.traveler.user_id) === String(id);

    useEffect(() => {
        getTraveler(id)
            .then(setTravelerDetails)
            .catch((err) => {
                console.error(err);
                setError("Unable to load traveler data.");
            });

        // Only trips you own can be used to invite someone.
        getTrips()
            .then((trips) => setOwnedTrips(trips.filter((trip) => trip.is_owner)))
            .catch((err) => console.error(err));
    }, [id]);

    if (!travelerDetails) {
        return error ? <p>{error}</p> : <p>Loading traveler data, please wait…</p>;
    }

    const name = `${travelerDetails.first_name} ${travelerDetails.last_name}`;
    const hasKids = travelerDetails.has_kids ? "Yes" : "No";
    const preferredDestinations = travelerDetails.preferred_destinations || [];

    const handleInvite = async () => {
        setInviteMessage(null);
        setInviteError(null);
        if (!selectedTripId) {
            setInviteError("Choose one of your trips first.");
            return;
        }
        try {
            await inviteTraveler(selectedTripId, id);
            setInviteMessage(`Invitation sent. ${travelerDetails.first_name} will see it on their Invitations page.`);
        } catch (err) {
            // e.g. 409 "Traveler has already been invited".
            setInviteError(errorMessage(err, "Unable to send the invitation."));
        }
    }

    return (
        <div className="traveler-details">
            <section className="traveler-details__container">
                <div className="traveler-details__title-container">
                    <BackButton />
                    <h1 className="traveler-details__main-title">Traveler Profile</h1>
                </div>

                <img className="traveler-details__image" alt="" src={picForIndex(0)} />
                <section className="traveler-details__information-container">
                    <article className="traveler-details__information">
                        <h3 className="traveler-details__title">Name</h3>
                        <p className="traveler-details__text">{name}</p>
                    </article>
                    <article className="traveler-details__information">
                        <h3 className="traveler-details__title">Preferred Destinations</h3>
                        <ul className="traveler-details__list traveler-details__text">
                            {preferredDestinations.map((destination, index) => {
                                return <li key={index}>{destination}</li>;
                            })}
                        </ul>
                    </article>
                    <article className="traveler-details__information">
                        <h3 className="traveler-details__title">Type of travel</h3>
                        <p className="traveler-details__text">{travelerDetails.type_of_travel}</p>
                    </article>
                    {/* Private fields: the API only sends them when you may see them. */}
                    {"has_kids" in travelerDetails && (
                        <article className="traveler-details__information">
                            <h3 className="traveler-details__title">Kids</h3>
                            <p className="traveler-details__text">{hasKids}</p>
                        </article>
                    )}
                    {"special_considerations" in travelerDetails && (
                        <article className="traveler-details__information">
                            <h3 className="traveler-details__title">Special Considerations</h3>
                            <p className="traveler-details__text">{travelerDetails.special_considerations}</p>
                        </article>
                    )}
                </section>
                {!isMe && (
                    <div className="traveler-details__input-container">
                        {ownedTrips.length > 0 ? (
                            <>
                                <label className="traveler-details__title" htmlFor="tripSelect">Invite to one of your trips:</label>
                                <select
                                    className="traveler-details__input"
                                    id="tripSelect"
                                    value={selectedTripId}
                                    onChange={(e) => setSelectedTripId(e.target.value)}
                                >
                                    <option value="">Select a Trip</option>
                                    {ownedTrips.map((trip) => {
                                        return (
                                            <option key={trip.trip_id} value={trip.trip_id}> {trip.trip_name} </option>
                                        )
                                    })}
                                </select>
                                <button className="traveler-details__button" type="button" onClick={handleInvite}>Send invite</button>
                            </>
                        ) : (
                            <p className="traveler-details__text">Create a trip to invite {travelerDetails.first_name} to it.</p>
                        )}
                        {inviteMessage && <p className="traveler-details__message">{inviteMessage}</p>}
                        {inviteError && <p className="traveler-details__error">{inviteError}</p>}
                    </div>
                )}
            </section>
        </div>
    )
}
export default TravelerDetails
