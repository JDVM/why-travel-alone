import { api } from './client';
import { Account, AuthResponse, Session } from '../types';

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

// Confirms the email address with the token from the emailed link.
export async function verifyEmail(token: string): Promise<void> {
    await api.post('/auth/verify-email', { token });
}

// Emails a new verification link to the signed-in account.
export async function resendVerification(): Promise<void> {
    await api.post('/auth/resend-verification');
}

// Emails a reset link if an account uses this address. The answer is the same
// either way.
export async function forgotPassword(email: string): Promise<void> {
    await api.post('/auth/forgot-password', { email });
}

// Sets a new password with the token from the emailed link.
export async function resetPassword(token: string, password: string): Promise<void> {
    await api.post('/auth/reset-password', { token, password });
}

// Ends this browser's session.
export async function logout(): Promise<void> {
    await api.post('/auth/logout');
}

// The browsers and devices signed in to the account.
export async function getSessions(): Promise<Session[]> {
    const { data } = await api.get<Session[]>('/auth/sessions');
    return data;
}

// Signs out every browser and device except this one. Resolves to how many.
export async function signOutOtherSessions(): Promise<number> {
    const { data } = await api.delete<{ ended: number }>('/auth/sessions');
    return data.ended;
}
