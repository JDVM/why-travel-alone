import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getInvitations, acceptInvitation, declineInvitation } from '../../api/invitations';
import { errorMessage } from '../../api/errors';
import { ReceivedInvitation } from '../../types';
import './Invitations.scss';

function Invitations() {
    const [invitations, setInvitations] = useState<ReceivedInvitation[] | null>(null);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const load = useCallback(() => {
        getInvitations()
            .then(setInvitations)
            .catch((err) => {
                console.error(err);
                setError('Unable to load your invitations. Please try again.');
            });
    }, []);

    useEffect(() => {
        load();
    }, [load]);

    const accept = async (invitation: ReceivedInvitation) => {
        setError(null);
        try {
            const tripId = await acceptInvitation(invitation.invitation_id);
            navigate(`/Trips/${tripId}`);
        } catch (err) {
            setError(errorMessage(err, 'Unable to accept the invitation.'));
            load();
        }
    };

    const decline = async (invitation: ReceivedInvitation) => {
        setError(null);
        try {
            await declineInvitation(invitation.invitation_id);
        } catch (err) {
            setError(errorMessage(err, 'Unable to decline the invitation.'));
        }
        load();
    };

    if (!invitations) {
        return <p className="invitations__status">{error ?? 'Loading invitations…'}</p>;
    }

    return (
        <div className="invitations">
            <h1 className="invitations__title">Invitations</h1>
            {error && <p className="invitations__error">{error}</p>}
            {invitations.length === 0 ? (
                <p className="invitations__empty">You have no invitations right now.</p>
            ) : (
                <ul className="invitations__list">
                    {invitations.map((invitation) => {
                        const owner = [invitation.owner_first_name, invitation.owner_last_name].filter(Boolean).join(' ');
                        return (
                            <li className="invitations__card" key={invitation.invitation_id}>
                                <h2 className="invitations__trip">{invitation.trip_name}</h2>
                                <p className="invitations__details">
                                    {invitation.destination} · {invitation.trip_length} days
                                    {invitation.kid_friendly ? ' · Kid friendly' : ''}
                                </p>
                                {owner && <p className="invitations__from">Invited by {owner}</p>}
                                <div className="invitations__actions">
                                    <button className="invitations__accept" type="button" onClick={() => accept(invitation)}>
                                        Accept
                                    </button>
                                    <button className="invitations__decline" type="button" onClick={() => decline(invitation)}>
                                        Decline
                                    </button>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}

export default Invitations;
