import { api, toBool } from './client';
import { Traveler } from '../types';

// preferred_destinations arrives from JSON_ARRAYAGG: sometimes a JSON string,
// and it yields [null] when a traveler has no destinations. Parse and drop the
// nulls so the UI never renders an empty list item.
//
// has_kids is only present when the API lets you see it; keep it absent
// otherwise, so the UI can tell "hidden" apart from "no".
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

    const traveler: Traveler = { ...raw, preferred_destinations: prefs };
    if ('has_kids' in raw) {
        traveler.has_kids = toBool(raw.has_kids);
    }
    return traveler;
}

export async function getTravelers(): Promise<Traveler[]> {
    const { data } = await api.get<any[]>('/travelers');
    return data.map(normalizeTraveler);
}

export async function getTraveler(id: string | number): Promise<Traveler> {
    const { data } = await api.get(`/travelers/${id}`);
    return normalizeTraveler(data);
}
