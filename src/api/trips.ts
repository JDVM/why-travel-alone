import { api, toBool } from './client';
import { TripSummary, TripDetail, TripInput } from '../types';
import { normalizeTraveler } from './travelers';

export async function getTrips(): Promise<TripSummary[]> {
    const { data } = await api.get<any[]>('/trips');
    return data.map((t) => ({ ...t, kid_friendly: toBool(t.kid_friendly) }));
}

export async function getTrip(id: string | number): Promise<TripDetail> {
    const { data } = await api.get(`/trips/${id}`);
    return {
        ...data,
        kid_friendly: toBool(data.kid_friendly),
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
