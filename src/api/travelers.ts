import { api, toBool, Wire } from './client';
import { Traveler } from '../types';

// preferred_destinations arrives from JSON_ARRAYAGG: sometimes a JSON string,
// and it yields [null] when a traveler has no destinations. Parse and drop the
// nulls so the UI never renders an empty list item.
//
// has_kids is only present when the API lets you see it; keep it absent
// otherwise, so the UI can tell "hidden" apart from "no".
export type WireTraveler = Wire<Traveler, 'has_kids' | 'preferred_destinations'>;

export function normalizeTraveler(raw: WireTraveler): Traveler {
    const { has_kids, preferred_destinations, ...rest } = raw;
    let prefs = preferred_destinations;
    if (typeof prefs === 'string') {
        try {
            prefs = JSON.parse(prefs);
        } catch {
            prefs = [];
        }
    }

    const traveler: Traveler = {
        ...rest,
        preferred_destinations: Array.isArray(prefs) ? prefs.filter((p): p is string => typeof p === 'string') : [],
    };
    if ('has_kids' in raw) {
        traveler.has_kids = toBool(has_kids);
    }
    return traveler;
}

export async function getTravelers(): Promise<Traveler[]> {
    const { data } = await api.get<WireTraveler[]>('/travelers');
    return data.map(normalizeTraveler);
}

export async function getTraveler(id: string | number): Promise<Traveler> {
    const { data } = await api.get<WireTraveler>(`/travelers/${id}`);
    return normalizeTraveler(data);
}
