import { api, toBool } from './client';
import { ReceivedInvitation } from '../types';

export async function getInvitations(): Promise<ReceivedInvitation[]> {
    const { data } = await api.get<any[]>('/invitations');
    return data.map((invitation) => ({ ...invitation, kid_friendly: toBool(invitation.kid_friendly) }));
}

// Returns the id of the trip you've joined.
export async function acceptInvitation(invitationId: number): Promise<number> {
    const { data } = await api.post<{ trip_id: number }>(`/invitations/${invitationId}/accept`);
    return data.trip_id;
}

export async function declineInvitation(invitationId: number) {
    await api.post(`/invitations/${invitationId}/decline`);
}
