import { api, toBool } from './client';
import { TripSummary, TripDetail, TripInput } from '../types';
import { normalizeTraveler } from './travelers';

export async function getTrips(): Promise<TripSummary[]> {
    const { data } = await api.get<any[]>('/trips');
    return data.map((t) => ({
        ...t,
        kid_friendly: toBool(t.kid_friendly),
        is_owner: toBool(t.is_owner),
        num_travelers: Number(t.num_travelers),
    }));
}

export async function getTrip(id: string | number): Promise<TripDetail> {
    const { data } = await api.get(`/trips/${id}`);
    return {
        ...data,
        kid_friendly: toBool(data.kid_friendly),
        is_owner: toBool(data.is_owner),
        users: Array.isArray(data.users) ? data.users.map(normalizeTraveler) : [],
    };
}

export async function createTrip(input: TripInput) {
    const { data } = await api.post('/trips/new', input);
    return data;
}

export async function updateTrip(id: string | number, input: TripInput) {
    const { data } = await api.put(`/trips/${id}`, input);
    return data;
}

export async function deleteTrip(id: string | number) {
    await api.delete(`/trips/${id}`);
}

// Owner actions on the people on a trip.
export async function inviteTraveler(tripId: string | number, userId: string | number) {
    await api.post(`/trips/${tripId}/invitations`, { user_id: userId });
}

export async function cancelInvitation(tripId: string | number, userId: string | number) {
    await api.delete(`/trips/${tripId}/invitations/${userId}`);
}

export async function removeTraveler(tripId: string | number, userId: string | number) {
    await api.delete(`/trips/${tripId}/travelers/${userId}`);
}

// A member leaving a trip they were invited to.
export async function leaveTrip(tripId: string | number) {
    await api.delete(`/trips/${tripId}/membership`);
}
