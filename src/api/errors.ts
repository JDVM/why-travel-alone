import axios from 'axios';

// The API's own error message (e.g. "Traveler is already on this trip"),
// falling back to a generic one when there isn't one.
export function errorMessage(err: unknown, fallback: string): string {
    if (axios.isAxiosError(err) && typeof err.response?.data?.error === 'string') {
        return err.response.data.error;
    }
    return fallback;
}
