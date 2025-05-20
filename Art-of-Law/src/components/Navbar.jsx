import React, { useState, useEffect, useCallback } from 'react';
import styles from './Navbar.module.css';
import logoIcon from '/images/Logo.png'; // Path relative to public folder

// SVG for Menu Icon (Elegant Three Lines)
const MenuIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.menuIconSVG}>
    <line x1="3" y1="6" x2="21" y2="6" stroke="currentColor" strokeWidth="1.5"/>
    <line x1="3" y1="12" x2="21" y2="12" stroke="currentColor" strokeWidth="1.5"/>
    <line x1="3" y1="18" x2="21" y2="18" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
);

// SVG for Close Icon (Elegant X)
const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.menuIconSVG}>
    <line x1="5.70711" y1="5" x2="19" y2="18.2929" stroke="currentColor" strokeWidth="1.5"/>
    <line x1="5" y1="18.2929" x2="18.2929" y2="5" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
);

function Navbar({ onToggleLoginModal }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen(prev => !prev);
  }, []);

  const handleScroll = useCallback(() => {
    setIsScrolled(window.scrollY > 20);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  const closeMenuAndScroll = useCallback((selector) => {
    setIsMenuOpen(false);
    setTimeout(() => {
      const element = document.querySelector(selector);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  }, []);

  const handleLoginRegisterClick = useCallback(() => {
    setIsMenuOpen(false);
    if (onToggleLoginModal) {
      onToggleLoginModal('login', true);
    }
  }, [onToggleLoginModal]);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  return (
    <nav className={`${styles.navbar} ${isScrolled ? styles.scrolled : ''} ${isMenuOpen ? styles.menuActiveBackground : ''}`}>
      <div className={styles.navContainer}>
        <a href="#hero" className={styles.logoLink} onClick={() => closeMenuAndScroll('#hero')} aria-label="Art of Law Home">
          <img src={logoIcon} alt="Art of Law Icon" className={styles.logo} />
        </a>

        {/* Desktop Navigation Links */}
        <div className={styles.navLinksDesktop}>
          <a href="#team" onClick={() => closeMenuAndScroll('#team')}>Our Team</a>
          <a href="#initiatives" onClick={() => closeMenuAndScroll('#initiatives')}>Initiatives</a>
          <a href="#recognition" onClick={() => closeMenuAndScroll('#recognition')}>Recognition</a>
          <a href="#contact" onClick={() => closeMenuAndScroll('#contact')}>Contact</a>
        </div>

        <div className={styles.navActions}>
          <button onClick={handleLoginRegisterClick} className={`${styles.navButton} ${styles.loginRegisterBtn}`}>
            Login / Register
          </button>
          <button
            className={styles.menuToggle}
            onClick={toggleMenu}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
            aria-controls="mobileNavMenu"
          >
            {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {/* Mobile Overlay Menu */}
      <div id="mobileNavMenu" className={`${styles.navMenuMobileOverlay} ${isMenuOpen ? styles.active : ''}`}>
        <a href="#hero" onClick={() => closeMenuAndScroll('#hero')}>Home</a>
        <a href="#team" onClick={() => closeMenuAndScroll('#team')}>Our Team</a>
        <a href="#initiatives" onClick={() => closeMenuAndScroll('#initiatives')}>Initiatives</a>
        <a href="#recognition" onClick={() => closeMenuAndScroll('#recognition')}>Recognition</a>
        <a href="#contact" onClick={() => closeMenuAndScroll('#contact')}>Contact</a>
        <button onClick={handleLoginRegisterClick} className={`${styles.navButton} ${styles.loginRegisterBtnMobile}`}>
          Login / Register
        </button>
      </div>
    </nav>
  );
}

export default Navbar;