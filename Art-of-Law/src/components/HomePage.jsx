// src/components/HomePage.jsx
import React from 'react';
import Hero from './Hero';                             // Your Hero component
import Team from './Team';                             // Your Team component
import InitiativesList from './InitiativesList';       // Your InitiativesList component
import AwardsRecognition from './AwardsRecognition';   // Your AwardsRecognition component
import Contact from './Contact';                       // Your Contact component

const HomePage = ({ heroProps }) => (
  <>
    <Hero {...heroProps} />
    <section id="team"><Team /></section>
    <section id="initiatives"><InitiativesList /></section>
    <section id="recognition"><AwardsRecognition /></section>
    <section id="contact"><Contact /></section>
  </>
);
export default HomePage;