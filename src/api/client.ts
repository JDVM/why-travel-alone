import axios from 'axios';
import { getToken, clearToken } from '../auth/token';

// Where the API is, fixed when the app is built: REACT_APP_API_BASE_URL (e.g.
// https://api.example.com), or for local development REACT_APP_API_URL plus
// REACT_APP_API_PORT.
export function apiBaseUrl(env: NodeJS.ProcessEnv = process.env): string {
    if (env.REACT_APP_API_BASE_URL) {
        return env.REACT_APP_API_BASE_URL.replace(/\/+$/, '');
    }
    return `${env.REACT_APP_API_URL}:${env.REACT_APP_API_PORT}`;
}

// One axios instance for the whole app.
export const api = axios.create({
    baseURL: apiBaseUrl(),
});

// Attach the bearer token to every request when we have one.
api.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Pages anyone can open, signed in or not.
const PUBLIC_PATHS = ['/login', '/register', '/privacy', '/terms', '/forgot-password', '/reset-password', '/verify-email'];

// On 401 the token is missing/expired: drop it and send the user to login.
// Skip the redirect on public pages: the auth pages show the error themselves
// (e.g. a failed login attempt), and the legal pages don't need an account.
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            clearToken();
            const path = window.location.pathname.toLowerCase();
            if (!PUBLIC_PATHS.some((publicPath) => path.startsWith(publicPath))) {
                window.location.assign('/login');
            }
        }
        return Promise.reject(error);
    }
);

// The API returns MySQL tinyint booleans as 0/1. Normalize to real booleans.
export const toBool = (value: unknown): boolean =>
    value === true || value === 1 || value === '1' || value === 'true';
