import { api } from './client';

// The caller's rights over their own data.

// A copy of everything the API stores about you, as a JSON file.
export async function exportAccountData(): Promise<Blob> {
    const { data } = await api.get<Blob>('/account/export', { responseType: 'blob' });
    return data;
}

// Deletes the account, its profile and the trips it owns. Can't be undone.
export async function deleteAccount(password: string): Promise<void> {
    await api.delete('/account', { data: { password } });
}
