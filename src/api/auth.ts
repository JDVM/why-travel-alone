import { api } from './client';
import { Account, AuthResponse } from '../types';

export async function login(email: string, password: string): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>('/auth/login', { email, password });
    return data;
}

export interface Registration {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    // The API refuses to create an account without it.
    accept_terms: boolean;
}

// Creates the account and its traveler profile.
export async function register(registration: Registration): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>('/auth/register', registration);
    return data;
}

export async function getMe(): Promise<Account> {
    const { data } = await api.get<Account>('/auth/me');
    return data;
}
