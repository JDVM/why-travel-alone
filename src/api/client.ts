import axios from 'axios';
import { getToken, clearToken } from '../auth/token';

const API_URL = process.env.REACT_APP_API_URL;
const PORT = process.env.REACT_APP_API_PORT;

// One axios instance for the whole app. baseURL is assembled from the same
// env vars the old per-component calls used, so deployment config is unchanged.
export const api = axios.create({
    baseURL: `${API_URL}:${PORT}`,
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
const PUBLIC_PATHS = ['/login', '/register', '/privacy', '/terms'];

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
