// src/App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet, Link } from 'react-router-dom';

// Your other component imports
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import MyBookings from './components/MyBookings';
import OrganizerBookings from './components/OrganizerBookings';
import SlotBooking from './components/SlotBooking';
import OrganizerAvailability from './components/OrganizerAvailability';
import InitiativeDetails from './components/InitiativeDetails';
import DisclaimerModal from './components/DisclaimerModal';
import CareersPage from './components/CareersPage';
import WhatsAppLauncher from './components/WhatsAppLauncher'; // <<<--- UPDATED IMPORT

import { AuthProvider, useAuth } from './AuthContext.jsx';
import './index.css';

// UserProtectedRoute and OrganizerProtectedRoute remain the same
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
  const [showDisclaimer, setShowDisclaimer] = useState(false);

  useEffect(() => {
    const disclaimerAccepted = localStorage.getItem('disclaimerAccepted');
    if (disclaimerAccepted !== 'true') {
      setShowDisclaimer(true);
      if (document.body) document.body.style.overflow = 'hidden';
    }
  }, []);

  const handleAgreeToDisclaimer = () => {
    localStorage.setItem('disclaimerAccepted', 'true');
    setShowDisclaimer(false);
    if (document.body) document.body.style.overflow = '';
  };

  const toggleLoginModal = (type = 'login', show = true) => {
    setFormType(type);
    setShowLoginForm(show);
  };
  const heroModalProps = { showLoginForm, formType, setShowLoginForm, setFormType };

  if (showDisclaimer) {
    return <DisclaimerModal onAgree={handleAgreeToDisclaimer} />;
  }

  // Define your WhatsApp contacts here
  const artOfLawContacts = [
    { name: "Advocate Pawan SS", number: "919900001367", message: "Hello Advocate Pawan, I need legal assistance." }, // Replace with actual number
    { name: "Advocate Kamal Adithya K", number: "919095626118", message: "Hello Advocate Kamal, I have a query." }, // Replace with actual number
    // Add more contacts if needed
    // { name: "General Enquiries", number: "91GeneralNumber", message: "Hello Art of Law, I have a general question."}
  ];

  return (
    <div className="art-of-law-app">
      <Navbar onToggleLoginModal={toggleLoginModal} />
      <Routes>
        <Route path="/" element={<HomePage heroProps={heroModalProps} />} />
        <Route path="/initiative/:initiativeName" element={<InitiativeDetails />} />
        <Route path="/careers" element={<CareersPage />} />

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
      <WhatsAppLauncher contacts={artOfLawContacts} /> {/* <<<--- UPDATED COMPONENT AND PROPS */}
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