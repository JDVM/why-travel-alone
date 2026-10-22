import { Navigate } from 'react-router-dom';
import { LinearProgress } from '@mui/material';
import { useAuth } from '../../auth/AuthContext';
import Landing from './Landing';

// The site's address: signed-in travelers go to their trips, visitors see the
// landing page.
function Home() {
    const { isAuthenticated, loading } = useAuth();
    if (loading) {
        return <LinearProgress aria-label="Loading" />;
    }
    return isAuthenticated ? <Navigate to="/Trips" replace /> : <Landing />;
}

export default Home;
