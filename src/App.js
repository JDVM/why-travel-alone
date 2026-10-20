import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import './App.scss';
import Header from './components/Header/Header';
import Travelers from './pages/Travelers/Traveler';
import Trips from './pages/Trips/Trips'
import AddTrip from './components/AddTrip/AddTrip';
import TripDetails from './components/TripDetails/TripDetails'
import TravelerDetails from './components/TravelerDetails/TravelerDetails';
import EditTrip from './components/EditTrip/EditTrip';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Profile from './pages/Profile/Profile';
import Invitations from './pages/Invitations/Invitations';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import Footer from './components/Footer/Footer';
import Privacy from './pages/Legal/Privacy';
import Terms from './pages/Legal/Terms';
import ForgotPassword from './pages/ForgotPassword/ForgotPassword';
import ResetPassword from './pages/ResetPassword/ResetPassword';
import VerifyEmail from './pages/VerifyEmail/VerifyEmail';
import VerifyEmailBanner from './components/VerifyEmailBanner/VerifyEmailBanner';

// A page that crashes shows the error message under a working header, and
// navigating elsewhere starts the next page fresh.
function PageErrorBoundary({ children }) {
  const location = useLocation();
  return <ErrorBoundary key={location.pathname}>{children}</ErrorBoundary>;
}

// Travelers are the site's users, so everything but login, registration, the
// emailed-link pages and the legal pages needs an account.
function App() {
  return (
    <BrowserRouter>
      <Header />
      <VerifyEmailBanner />
      <PageErrorBoundary>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/Travelers" element={<ProtectedRoute><Travelers /></ProtectedRoute>} />
          <Route path="/Travelers/:id" element={<ProtectedRoute><TravelerDetails /></ProtectedRoute>} />
          <Route path="/Trips" element={<ProtectedRoute><Trips /></ProtectedRoute>} />
          <Route path="/Trips/:id" element={<ProtectedRoute><TripDetails /></ProtectedRoute>} />
          <Route path="/Trips/:id/edit" element={<ProtectedRoute><EditTrip /></ProtectedRoute>} />
          <Route path="/new" element={<ProtectedRoute><AddTrip /></ProtectedRoute>} />
          <Route path="/invitations" element={<ProtectedRoute><Invitations /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path='/*' element={<Navigate to="/Travelers" />} />
        </Routes>
      </PageErrorBoundary>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
