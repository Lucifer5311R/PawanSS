// ## File: src/App.jsx (Updated)

import React, { useState } from 'react';
import Navbar from './components/Navbar'; // Import Navbar
import Hero from './components/Hero';
import Team from './components/Team';
import InitiativesList from './components/InitiativesList';
import AwardsRecognition from './components/AwardsRecognition';
import Contact from './components/Contact';
import './index.css'; // Import global styles

function App() {
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [formType, setFormType] = useState('login'); // 'login' or 'register'

  // This function will be passed to both Navbar and Hero
  const toggleLoginModal = (type = 'login', show = true) => {
    setFormType(type);
    setShowLoginForm(show);
  };

  return (
    <div className="art-of-law-app">
      <Navbar onToggleLoginModal={toggleLoginModal} />
      <Hero 
        showLoginForm={showLoginForm} 
        formType={formType}
        setShowLoginForm={setShowLoginForm} // Pass this directly
        setFormType={setFormType} // Pass this directly
        // onToggleLoginModal={toggleLoginModal} // Or pass the combined function
      />
      <Team />
      <InitiativesList />
      <AwardsRecognition />
      <Contact />
    </div>
  );
}

export default App;