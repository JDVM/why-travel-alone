import { api, toBool } from './client';
import { Traveler } from '../types';

// preferred_destinations arrives from JSON_ARRAYAGG: sometimes a JSON string,
// and it yields [null] when a traveler has no destinations. Parse and drop the
// nulls so the UI never renders an empty list item.
export function normalizeTraveler(raw: any): Traveler {
    let prefs = raw.preferred_destinations;
    if (typeof prefs === 'string') {
        try {
            prefs = JSON.parse(prefs);
        } catch {
            prefs = [];
        }
    }
    prefs = Array.isArray(prefs) ? prefs.filter((p: unknown) => p != null) : [];

    return {
        ...raw,
        has_kids: toBool(raw.has_kids),
        preferred_destinations: prefs,
    };
}

export async function getTravelers(): Promise<Traveler[]> {
    const { data } = await api.get<any[]>('/travelers');
    return data.map(normalizeTraveler);
}

export async function getTraveler(id: string | number): Promise<Traveler> {
    const { data } = await api.get(`/travelers/${id}`);
    return normalizeTraveler(data);
}

export async function addTravelerToTrip(userId: string | number, tripId: string | number) {
    const { data } = await api.post('/travelers/addto', { user_id: userId, trip_id: tripId });
    return data;
}

export async function removeTravelerFromTrip(tripId: string | number, userId: string | number) {
    await api.delete(`/travelers/${tripId}/${userId}`);
}
