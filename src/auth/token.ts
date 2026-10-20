// Single source of truth for where the auth token lives.
//
// We store the JWT in localStorage for MVP simplicity. Tradeoff: it is
// readable by any JS running on the page, so it is exposed to XSS. React's
// default escaping mitigates that, and swapping to an httpOnly cookie later
// only touches this file plus the API client.
const TOKEN_KEY = 'wta_token';

export function getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
    localStorage.removeItem(TOKEN_KEY);
}
