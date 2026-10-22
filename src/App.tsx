import { lazy, ReactNode, Suspense } from 'react';
import { LinearProgress } from '@mui/material';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Header from './components/Header/Header';
import Login from './pages/Login/Login';
import Home from './pages/Landing/Home';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import Footer from './components/Footer/Footer';
import VerifyEmailBanner from './components/VerifyEmailBanner/VerifyEmailBanner';
import { reloadIfStale } from './staleChunks';

// Pages load when first visited, so the first page doesn't wait for all of
// them. Login is the usual first page, so it comes with the app. If a page's
// chunk is gone after a release, the app reloads to pick up the new one.
const Travelers = lazy(reloadIfStale(() => import('./pages/Travelers/Travelers')));
const Trips = lazy(reloadIfStale(() => import('./pages/Trips/Trips')));
const AddTrip = lazy(reloadIfStale(() => import('./components/AddTrip/AddTrip')));
const TripDetails = lazy(reloadIfStale(() => import('./components/TripDetails/TripDetails')));
const TravelerDetails = lazy(reloadIfStale(() => import('./components/TravelerDetails/TravelerDetails')));
const EditTrip = lazy(reloadIfStale(() => import('./components/EditTrip/EditTrip')));
const Register = lazy(reloadIfStale(() => import('./pages/Register/Register')));
const Profile = lazy(reloadIfStale(() => import('./pages/Profile/Profile')));
const Invitations = lazy(reloadIfStale(() => import('./pages/Invitations/Invitations')));
const Privacy = lazy(reloadIfStale(() => import('./pages/Legal/Privacy')));
const Terms = lazy(reloadIfStale(() => import('./pages/Legal/Terms')));
const ForgotPassword = lazy(reloadIfStale(() => import('./pages/ForgotPassword/ForgotPassword')));
const ResetPassword = lazy(reloadIfStale(() => import('./pages/ResetPassword/ResetPassword')));
const VerifyEmail = lazy(reloadIfStale(() => import('./pages/VerifyEmail/VerifyEmail')));

// A page that crashes shows the error message under a working header, and
// navigating elsewhere starts the next page fresh.
function PageErrorBoundary({ children }: { children: ReactNode }) {
  const location = useLocation();
  return (
    <ErrorBoundary key={location.pathname}>
      <Suspense fallback={<LinearProgress aria-label="Loading page" />}>{children}</Suspense>
    </ErrorBoundary>
  );
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
          <Route path="/" element={<Home />} />
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
          <Route path='/*' element={<Navigate to="/" replace />} />
        </Routes>
      </PageErrorBoundary>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
