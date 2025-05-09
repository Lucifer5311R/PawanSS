// src/components/EntryPortal/EntryPortal.jsx
import React, { useState } from 'react';
import './EntryPortal.css';
// import { motion } from 'framer-motion'; // Available if you want to switch CSS animations to Framer Motion

const EntryPortal = ({ onPortalExit }) => {
  const [isExiting, setIsExiting] = useState(false);

  const handleEnterClick = () => {
    setIsExiting(true);
    // Allow time for CSS exit animation before calling onPortalExit
    // For more robust handling with Framer Motion, you'd use its onAnimationComplete prop
    setTimeout(() => {
      if (onPortalExit) {
        onPortalExit();
      }
    }, 800); // Should match the CSS animation duration for .entry-portal-section.exiting
  };

  // Example Framer Motion variants if you choose to use it:
  // const portalVariants = {
  //   initial: { opacity: 1 },
  //   exit: { 
  //     opacity: 0, 
  //     transition: { duration: 0.8, ease: [0.77, 0, 0.175, 1] }
  //   }
  // };

  // const contentVariants = {
  //   initial: { opacity: 0, y: 0 },
  //   animate: { opacity: 1, y: 0, transition: { delay: 0.3, duration: 1, ease: "easeOut" }},
  //   exit: { opacity: 0, y: -20, transition: { duration: 0.5, ease: "easeIn" }}
  // };

  return (
    // <motion.section // If using Framer Motion for the section itself
    //   id="entry-portal"
    //   className={`section entry-portal-section`} // No need for isExiting class if Framer handles it
    //   variants={portalVariants}
    //   initial="initial"
    //   exit="exit" // This would be triggered by AnimatePresence in App.jsx
    // >
    <section 
      id="entry-portal" 
      className={`section entry-portal-section ${isExiting ? 'exiting' : ''}`}
    >
      <div className="portal-background-elements">
        <div className="bg-shape shape1"></div>
        <div className="bg-shape shape2"></div>
        <div className="bg-shape shape3"></div>
        <div className="bg-particle particle1"></div>
        <div className="bg-particle particle2"></div>
        <div className="bg-particle particle3"></div>
        <div className="bg-particle particle4"></div>
      </div>
      {/* <motion.div 
        className="portal-content"
        variants={contentVariants}
        initial="initial"
        animate="animate"
        exit="exit" // If content has its own exit animation with Framer
      > */}
      <div className={`portal-content ${isExiting ? 'exiting-content' : ''}`}> {/* Added exiting-content for CSS hook */}
        <h1 className="portal-title">
          PAWAN <span className="highlight">SS</span>
        </h1>
        <p className="portal-tagline">Continuum of Ideas & Impact</p>
        <button
          className="portal-cta"
          onClick={handleEnterClick}
          aria-label="Enter the Continuum"
          disabled={isExiting} // Prevent multiple clicks during exit
        >
          Explore
        </button>
      </div>
      {/* </motion.div> */}
    </section>
    // </motion.section>
  );
};

export default EntryPortal;