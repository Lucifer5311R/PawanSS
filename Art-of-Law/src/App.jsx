// src/App.jsx
import React, { useState, useEffect } from 'react'; // Added useEffect
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet, Link } from 'react-router-dom';

import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import MyBookings from './components/MyBookings';
import OrganizerBookings from './components/OrganizerBookings';
import SlotBooking from './components/SlotBooking';
import OrganizerAvailability from './components/OrganizerAvailability';
import InitiativeDetails from './components/InitiativeDetails';
import DisclaimerModal from './components/DisclaimerModal'; // <<<--- ADD THIS IMPORT

import { AuthProvider, useAuth } from './AuthContext.jsx';
import './index.css';

const UserProtectedRoute = () => {
  const { isLoggedIn, isLoadingAuth } = useAuth();
  if (isLoadingAuth) return <div style={{ textAlign: 'center', padding: '50px', minHeight: '60vh' }}>Loading session...</div>;
  return isLoggedIn ? <Outlet /> : <Navigate to="/" replace />;
};

const OrganizerProtectedRoute = () => {
  const { isLoggedIn, currentUser, isLoadingAuth } = useAuth();
  if (isLoadingAuth) return <div style={{ textAlign: 'center', padding: '50px', minHeight: '60vh' }}>Loading session...</div>;
  if (!isLoggedIn) return <Navigate to="/" replace />;
  if (currentUser && (currentUser.role === 'organizer' || currentUser.role === 'admin')) {
    return <Outlet />;
  }
  return <Navigate to="/unauthorized" replace />;
};

function AppContent() {
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [formType, setFormType] = useState('login');
  const [showDisclaimer, setShowDisclaimer] = useState(false); // <<<--- NEW STATE

  useEffect(() => {
    const disclaimerAccepted = localStorage.getItem('disclaimerAccepted');
    if (disclaimerAccepted !== 'true') {
      setShowDisclaimer(true);
      document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
    }
  }, []);

  const handleAgreeToDisclaimer = () => {
    localStorage.setItem('disclaimerAccepted', 'true');
    setShowDisclaimer(false);
    document.body.style.overflow = ''; // Restore scrolling
  };

  const toggleLoginModal = (type = 'login', show = true) => {
    setFormType(type);
    setShowLoginForm(show);
  };
  const heroModalProps = { showLoginForm, formType, setShowLoginForm, setFormType };

  if (showDisclaimer) {
    return <DisclaimerModal onAgree={handleAgreeToDisclaimer} />;
  }

  return (
    <div className="art-of-law-app">
      <Navbar onToggleLoginModal={toggleLoginModal} />
      <Routes>
        <Route path="/" element={<HomePage heroProps={heroModalProps} />} />
        <Route path="/initiative/:initiativeName" element={<InitiativeDetails />} />

        <Route element={<UserProtectedRoute />}>
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="/book-slot" element={<SlotBooking />} />
        </Route>

        <Route element={<OrganizerProtectedRoute />}>
          <Route path="/organizer-dashboard" element={<OrganizerBookings />} />
          <Route path="/organizer-settings/availability" element={<OrganizerAvailability />} />
        </Route>

        <Route path="/unauthorized" element={<div style={{ textAlign: 'center', padding: '50px', minHeight: '60vh' }}><h1>Unauthorized Access</h1><p>You do not have permission to view this page.</p><Link to="/">Go to Homepage</Link></div>} />
        <Route path="*" element={<div style={{ textAlign: 'center', padding: '50px', minHeight: '60vh' }}><h1>404 - Not Found</h1><p>The page you are looking for does not exist.</p><Link to="/">Go to Homepage</Link></div>} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider><AppContent /></AuthProvider>
    </Router>
  );
}
export default App;