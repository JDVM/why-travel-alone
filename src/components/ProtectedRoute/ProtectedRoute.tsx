import { ReactElement } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';

// Gate for authenticated-only routes. While the initial /auth/me hydration is
// in flight we show a loading state, then either the children or a redirect
// to /login.
function ProtectedRoute({ children }: { children: ReactElement }) {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return <p>Loading…</p>;
    }
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }
    return children;
}

export default ProtectedRoute;
