import "./TripDetails.scss"
import { useEffect, useState, useCallback } from "react";
import { Link, useParams, useNavigate } from "react-router-dom"
import SmallTravelerCard from "../SmallTravelerCard/SmallTraverlerCard";
import backarrow from "../../assets/images/arrow_back-24px.svg";
import { getTrip, removeTraveler, cancelInvitation, leaveTrip } from "../../api/trips";
import { errorMessage } from "../../api/errors";
import { useAuth } from "../../auth/AuthContext";

// A trip you own or are on. Owners can edit it, remove travelers and manage
// invitations; other travelers can only view it or leave.
function TripDetails() {
    const { id } = useParams();
    const [tripDetails, setTripDetails] = useState(null);
    const [error, setError] = useState(null);
    const [actionError, setActionError] = useState(null);
    const navigate = useNavigate();
    const goBack = () => navigate(-1);
    const { account } = useAuth();
    const myTravelerId = account && account.traveler ? account.traveler.user_id : null;

    const loadTrip = useCallback(() => {
        getTrip(id)
            .then(setTripDetails)
            .catch((err) => {
                console.error(err);
                setError(errorMessage(err, "Unable to load trip data."));
            });
    }, [id]);

    useEffect(() => {
        loadTrip();
    }, [loadTrip]);

    // Runs an owner or member action, then reloads the trip or reports the error.
    const act = async (action, fallback) => {
        setActionError(null);
        try {
            await action();
            loadTrip();
        } catch (err) {
            setActionError(errorMessage(err, fallback));
        }
    };

    const handleLeave = async () => {
        setActionError(null);
        try {
            await leaveTrip(id);
            navigate("/Trips");
        } catch (err) {
            setActionError(errorMessage(err, "Unable to leave the trip."));
        }
    };

    if (error) {
        return <p>{error}</p>;
    }
    if (!tripDetails) {
        return <p>Loading trip data, please wait…</p>;
    }

    const isOwner = tripDetails.is_owner;
    const kidFriendly = tripDetails.kid_friendly ? "Yes" : "No";
    const travelersForThisTrip = tripDetails.users || [];
    const removableIds = isOwner
        ? travelersForThisTrip.map((traveler) => traveler.user_id).filter((userId) => userId !== myTravelerId)
        : [];
    const invitations = tripDetails.invitations || [];

    return (
        <div className="trip-details">
            <div className="trip-details__container">
                <div className="trip-details__title-container">
                    <img className="trip-details__image" src={backarrow} alt="Back arrowkey" onClick={goBack} />
                    <h1 className="trip-details__main-title">Trip Details</h1>
                </div>
                <div className="trip-details__information-container">
                    <div className="trip-details__information">
                        <h3 className="trip-details__title">Trip Name</h3>
                        <p className="trip-details__text">{tripDetails.trip_name}</p>
                    </div>
                    <div className="trip-details__information">
                        <h4 className="trip-details__title">Trip Duration</h4>
                        <p className="trip-details__text">{tripDetails.trip_length} days</p>
                    </div>
                    <div className="trip-details__information">
                        <h4 className="trip-details__title">Destination</h4>
                        <p className="trip-details__text">{tripDetails.destination}</p>
                    </div>
                    <div className="trip-details__information">
                        <label htmlFor="kid-friendly" className="trip-details__title">Kid Friendly</label>
                        <p id="kid-friendly" className="trip-details__text">{kidFriendly}</p>
                    </div>
                    <div className="trips-card__information--description">
                        <h3 className="trip-details__title">Trip Description</h3>
                        <p className="trip-details__text">{tripDetails.notes}</p>
                    </div>
                </div>
                {isOwner ? (
                    <Link className="trip-details__button-container" to={`/Trips/${id}/edit`}>
                        <button className="trip-details__button">Edit</button>
                    </Link>
                ) : (
                    <div className="trip-details__button-container">
                        <button className="trip-details__button" type="button" onClick={handleLeave}>Leave trip</button>
                    </div>
                )}
                {actionError && <p className="trip-details__error">{actionError}</p>}
            </div>

            {isOwner && invitations.length > 0 && (
                <section className="trip-details__invitations">
                    <h2 className="trip-details__title">Invitations</h2>
                    <ul className="trip-details__invitation-list">
                        {invitations.map((invitation) => (
                            <li className="trip-details__invitation" key={invitation.user_id}>
                                <span>{invitation.first_name} {invitation.last_name}</span>
                                {invitation.status === "pending" ? (
                                    <>
                                        <span className="trip-details__invitation-status">Waiting for a reply</span>
                                        <button
                                            className="trip-details__invitation-cancel"
                                            type="button"
                                            onClick={() => act(() => cancelInvitation(id, invitation.user_id), "Unable to cancel the invitation.")}
                                        >
                                            Cancel
                                        </button>
                                    </>
                                ) : (
                                    <span className="trip-details__invitation-status">Declined</span>
                                )}
                            </li>
                        ))}
                    </ul>
                </section>
            )}

            <section>
                <SmallTravelerCard
                    travelers={travelersForThisTrip}
                    removableIds={removableIds}
                    onRemove={(traveler) => act(() => removeTraveler(id, traveler.user_id), "Unable to remove the traveler.")}
                />
            </section>
        </div>
    )
}

export default TripDetails;
