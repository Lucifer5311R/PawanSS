// ## File: src/App.jsx (Final Check)

import React from 'react';
import Hero from './components/Hero';
import Team from './components/Team';
import InitiativesList from './components/InitiativesList';
import AwardsRecognition from './components/AwardsRecognition';
import Contact from './components/Contact';
import './index.css'; // Import global styles

function App() {
  return (
    <div className="art-of-law-app">
      <Hero />
      <Team />
      <InitiativesList />
      <AwardsRecognition />
      <Contact />
    </div>
  );
}

export default App;