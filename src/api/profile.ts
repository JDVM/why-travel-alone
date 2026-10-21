import axios from 'axios';
import { api, toBool, Wire } from './client';
import { Profile, ProfileInput, TypeOfTravel } from '../types';

type WireProfile = Wire<Profile, 'has_kids' | 'special_considerations_consent'>;

function normalizeProfile(raw: WireProfile): Profile {
    return {
        ...raw,
        has_kids: toBool(raw.has_kids),
        special_considerations_consent: toBool(raw.special_considerations_consent),
    };
}

// Your profile, or null for an older account that doesn't have one yet.
export async function getProfile(): Promise<Profile | null> {
    try {
        const { data } = await api.get<WireProfile>('/profile');
        return normalizeProfile(data);
    } catch (err) {
        if (axios.isAxiosError(err) && err.response?.status === 404) {
            return null;
        }
        throw err;
    }
}

// Replaces the whole profile.
export async function updateProfile(input: ProfileInput): Promise<Profile> {
    const { data } = await api.put<WireProfile>('/profile', input);
    return normalizeProfile(data);
}

export async function getTypesOfTravel(): Promise<TypeOfTravel[]> {
    const { data } = await api.get<TypeOfTravel[]>('/types-of-travel');
    return data;
}
