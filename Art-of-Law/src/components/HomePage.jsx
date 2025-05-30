// src/components/HomePage.jsx
import React from 'react';
import Hero from './Hero';
import Team from './Team';
import InitiativesList from './InitiativesList';
import AwardsRecognition from './AwardsRecognition'; // <<<--- ADD THIS IMPORT
// Import InternSection once created:
// import InternSection from './InternSection'; 
import Contact from './Contact';

const HomePage = ({ heroProps }) => (
  <>
    <Hero {...heroProps} />
    <section id="team"><Team /></section> {/* */}{/* <<<--- ADD PROJECT NYAY SECTION HERE */}
    <section id="initiatives"><InitiativesList /></section> {/* */}
    <section id="recognition"><AwardsRecognition /></section> {/* */}
    {/* <InternSection /> */} {/* Add Interns section here when ready */}
    <section id="contact"><Contact /></section> {/* */}
  </>
);
export default HomePage;