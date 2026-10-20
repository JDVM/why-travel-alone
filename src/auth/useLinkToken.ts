import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// The token from an emailed link (?token=...). It's read once, then removed
// from the address bar so it doesn't stay in the browser history or show up
// in screenshots.
export function useLinkToken(): string | null {
    const location = useLocation();
    const navigate = useNavigate();
    const [token] = useState(() => new URLSearchParams(location.search).get('token'));

    useEffect(() => {
        if (new URLSearchParams(location.search).has('token')) {
            navigate(location.pathname, { replace: true });
        }
    }, [location.pathname, location.search, navigate]);

    return token;
}
