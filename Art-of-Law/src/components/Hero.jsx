import React from 'react';
import styles from './Hero.module.css'; // Import the CSS Module

function Hero() {
  return (
    // Apply classes from the imported 'styles' object
    <section id="hero" className={`${styles.heroSection} bg-light`}>
      <div className={`container ${styles.heroContainer}`}>
        <h1 className={styles.heroTitle}>Art of Law</h1>
        <p className={styles.heroSubtitle}>
          Fostering legal awareness and empowering communities through practical education and social impact initiatives.
        </p>
        <div className={styles.heroActions}>
          <a href="#initiatives" className={`btn btn-primary ${styles.heroBtn}`}>Explore Initiatives</a>
          <a href="#contact" className={`btn btn-outline ${styles.heroBtn}`}>Contact Us</a> {/* Added an outline button style - define in module */}
        </div>
      </div>
    </section>
  );
}

export default Hero;