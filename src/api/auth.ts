import { api } from './client';
import { Account, AuthResponse } from '../types';

export async function login(email: string, password: string): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>('/auth/login', { email, password });
    return data;
}

export async function register(email: string, password: string): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>('/auth/register', { email, password });
    return data;
}

export async function getMe(): Promise<Account> {
    const { data } = await api.get<Account>('/auth/me');
    return data;
}
