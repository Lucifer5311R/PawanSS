// src/components/Navbar.jsx
// ... (imports remain the same)
import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import styles from './Navbar.module.css';
import logoIcon from '/images/Logo.png'; 
import { useAuth } from '../AuthContext.jsx';

const MenuIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.menuIconSVG}>
    <line x1="3" y1="6" x2="21" y2="6" stroke="currentColor" strokeWidth="1.5"/>
    <line x1="3" y1="12" x2="21" y2="12" stroke="currentColor" strokeWidth="1.5"/>
    <line x1="3" y1="18" x2="21" y2="18" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
);

const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.menuIconSVG}>
    <line x1="5.70711" y1="5" x2="19" y2="18.2929" stroke="currentColor" strokeWidth="1.5"/>
    <line x1="5" y1="18.2929" x2="18.2929" y2="5" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
);


function Navbar({ onToggleLoginModal }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { isLoggedIn, logout, currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const toggleMenu = useCallback(() => setIsMenuOpen(prev => !prev), []);

  const handleScroll = useCallback(() => setIsScrolled(window.scrollY > 20), []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMenuOpen]);

  const handleNavClick = (path, type) => {
    setIsMenuOpen(false); // Close mobile menu on any navigation
    if (type === 'hash') {
      if (location.pathname !== '/') {
        navigate('/'); 
        setTimeout(() => { 
          const elementId = path.substring(2); 
          document.getElementById(elementId)?.scrollIntoView({ behavior: 'smooth' });
        }, 100); 
      } else {
        const elementId = path.substring(2); 
        document.getElementById(elementId)?.scrollIntoView({ behavior: 'smooth' });
      }
    } else { 
      navigate(path);
    }
  };
  
  const handleLogout = () => {
    logout(); 
    setIsMenuOpen(false);
    navigate('/'); 
  };

  const mainSectionLinks = [
    { path: "/#team", label: "Our Team", type: "hash" },
    { path: "/#initiatives", label: "Initiatives", type: "hash" },
    { path: "/#recognition", label: "Recognition", type: "hash" },
    { path: "/#contact", label: "Contact", type: "hash" },
  ];

  const dashboardLinks = [];
  if (isLoggedIn) {
    dashboardLinks.push({ path: "/my-bookings", label: "My Bookings", type: "route" });
    if (currentUser && (currentUser.role === 'organizer' || currentUser.role === 'admin')) {
      dashboardLinks.push({ path: "/organizer-dashboard", label: "Organizer Dashboard", type: "route" });
      dashboardLinks.push({ path: "/organizer-settings/availability", label: "Manage Availability", type: "route" }); // <<< NEW LINK
    }
  }
  const allNavLinks = [...mainSectionLinks, ...dashboardLinks];

  const renderNavLink = (item, isMobile = false) => {
    const clickHandler = () => handleNavClick(item.path, item.type);
    const linkClass = isMobile ? styles.mobileNavLink : styles.desktopNavLink; // Assuming these classes exist

    if (item.type === "hash") {
      // For hash links, ensure they are actual <a> tags if they are meant for same-page scrolling.
      // If handleNavClick already correctly navigates and scrolls, Link might be fine too.
      // Using <a> for direct hash behavior.
      return <a key={item.path} href={item.path} onClick={(e) => { e.preventDefault(); clickHandler(); }} className={linkClass}>{item.label}</a>;
    }
    // For route links, use React Router's Link component
    return <Link key={item.path} to={item.path} onClick={clickHandler} className={linkClass}>{item.label}</Link>;
  };


  return (
    <nav className={`${styles.navbar} ${isScrolled ? styles.scrolled : ''} ${isMenuOpen ? styles.menuActiveBackground : ''}`}>
      <div className={styles.navContainer}>
        <Link to="/" className={styles.logoLink} onClick={() => setIsMenuOpen(false)} aria-label="Art of Law Home">
          <img src={logoIcon} alt="Art of Law Icon" className={styles.logo} />
        </Link>

        <div className={styles.navLinksDesktop}>
          {allNavLinks.map(item => renderNavLink(item, false))}
        </div>

        <div className={styles.navActions}>
          {isLoggedIn ? (
            <>
              {currentUser && <span style={{marginRight: '10px', color: isScrolled || isMenuOpen ? 'var(--text-color-dark)' : 'var(--text-color-muted)' }}>Hi, {currentUser.firstName}!</span>}
              <button onClick={handleLogout} className={`${styles.navButton} ${styles.loginRegisterBtn}`}>
                Logout
              </button>
            </>
          ) : (
            <button onClick={() => { setIsMenuOpen(false); onToggleLoginModal('login', true); }} className={`${styles.navButton} ${styles.loginRegisterBtn}`}>
              Login / Register
            </button>
          )}
          <button
            className={styles.menuToggle}
            onClick={toggleMenu}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {/* Mobile Overlay Menu */}
      <div id="mobileNavMenu" className={`${styles.navMenuMobileOverlay} ${isMenuOpen ? styles.active : ''}`}>
        <Link to="/" className={styles.mobileNavLink} onClick={() => handleNavClick('/', 'route')}>Home</Link> {/* Added mobileNavLink class */}
        {allNavLinks.map(item => renderNavLink(item, true))}
        {isLoggedIn ? (
          <button onClick={handleLogout} className={`${styles.navButton} ${styles.loginRegisterBtnMobile}`}>
            Logout
          </button>
        ) : (
          <button onClick={() => { setIsMenuOpen(false); onToggleLoginModal('login', true);}} className={`${styles.navButton} ${styles.loginRegisterBtnMobile}`}>
            Login / Register
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;