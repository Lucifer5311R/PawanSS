// src/components/Navbar.jsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import styles from './Navbar.module.css';
import logoIcon from '/images/Logo.png'; //
import { useAuth } from '../AuthContext.jsx'; //

// Simple User Icon (SVG)
const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.accountIconSVG}>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const MenuIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.menuIconSVG}> {/* */}
    <line x1="3" y1="6" x2="21" y2="6" stroke="currentColor" strokeWidth="1.5"/>
    <line x1="3" y1="12" x2="21" y2="12" stroke="currentColor" strokeWidth="1.5"/>
    <line x1="3" y1="18" x2="21" y2="18" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
);

const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.menuIconSVG}> {/* */}
    <line x1="5.70711" y1="5" x2="19" y2="18.2929" stroke="currentColor" strokeWidth="1.5"/>
    <line x1="5" y1="18.2929" x2="18.2929" y2="5" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
);


function Navbar({ onToggleLoginModal }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false); //
  const [isScrolled, setIsScrolled] = useState(false); //
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const { isLoggedIn, logout, currentUser } = useAuth(); //
  const navigate = useNavigate(); //
  const location = useLocation(); //
  const accountDropdownRef = useRef(null);
  const accountIconRef = useRef(null);

  const toggleMenu = useCallback(() => setIsMenuOpen(prev => !prev), []); //
  const toggleAccountDropdown = useCallback(() => setIsAccountDropdownOpen(prev => !prev), []);

  const handleScroll = useCallback(() => setIsScrolled(window.scrollY > 20), []); //

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true }); //
    return () => window.removeEventListener('scroll', handleScroll); //
  }, [handleScroll]); //

  useEffect(() => {
    if (isMenuOpen || isAccountDropdownOpen) {
      document.body.style.overflow = 'hidden'; //
    } else {
      document.body.style.overflow = ''; //
    }
    return () => { document.body.style.overflow = ''; }; //
  }, [isMenuOpen, isAccountDropdownOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isAccountDropdownOpen &&
          accountDropdownRef.current &&
          !accountDropdownRef.current.contains(event.target) &&
          accountIconRef.current && 
          !accountIconRef.current.contains(event.target) 
         ) {
        setIsAccountDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isAccountDropdownOpen]);


  const handleNavClick = (path, type) => { //
    setIsMenuOpen(false); 
    setIsAccountDropdownOpen(false); 
    if (type === 'hash') { //
      if (location.pathname !== '/') { //
        navigate('/'); //
        setTimeout(() => { //
          const elementId = path.substring(path.startsWith('/#') ? 2 : 1);
          document.getElementById(elementId)?.scrollIntoView({ behavior: 'smooth' }); //
        }, 100); //
      } else { //
        const elementId = path.substring(path.startsWith('/#') ? 2 : 1);
        document.getElementById(elementId)?.scrollIntoView({ behavior: 'smooth' }); //
      }
    } else { //
      navigate(path); //
    }
  };

  const handleLogout = () => { //
    logout(); //
    setIsAccountDropdownOpen(false);
    setIsMenuOpen(false);
    navigate('/'); //
  };

  const handleLoginModalOpen = (type) => {
    setIsAccountDropdownOpen(false);
    setIsMenuOpen(false);
    onToggleLoginModal(type, true);
  };

  const mainSectionLinks = [
    { path: "/#team", label: "Our Team", type: "hash" }, //
    { path: "/#initiatives", label: "Initiatives", type: "hash" }, //
    { path: "/#recognition", label: "Recognition", type: "hash" }, //
    { path: "/careers", label: "Careers", type: "route" }, // <<<--- ADDED CAREERS LINK
    { path: "/#contact", label: "Contact", type: "hash" }, //
  ];

  // Links for the main navbar (excluding account specific ones that are in dropdown)
  const navBarDisplayLinks = [...mainSectionLinks];
  // If you want certain logged-in links (like My Bookings for users) to appear directly
  // in the main navbar IN ADDITION to the account dropdown, you can add them here conditionally.
  // For now, all account-related navigation is in the dropdown or mobile menu.
  // Example:
  // if (isLoggedIn && currentUser && currentUser.role !== 'organizer' && currentUser.role !== 'admin') {
  //    navBarDisplayLinks.push({ path: "/my-bookings", label: "My Bookings", type: "route" });
  // }


  const renderNavLink = (item, isMobile = false, isDropdown = false) => { //
    const clickHandler = () => handleNavClick(item.path, item.type); //
    let linkClass;
    if (isDropdown) {
      linkClass = styles.accountDropdownItemLink;
    } else if (isMobile) {
      linkClass = styles.mobileNavLink; //
    } else {
      linkClass = styles.desktopNavLink; //
    }

    if (item.type === "hash") { //
      return <a key={item.label} href={item.path} onClick={(e) => { e.preventDefault(); clickHandler(); }} className={linkClass}>{item.label}</a>; //
    }
    return <Link key={item.label} to={item.path} onClick={clickHandler} className={linkClass}>{item.label}</Link>; //
  };


  return (
    <nav className={`${styles.navbar} ${isScrolled ? styles.scrolled : ''} ${isMenuOpen || isAccountDropdownOpen ? styles.menuActiveBackground : ''}`}> {/* */}
      <div className={styles.navContainer}> {/* */}
        <Link to="/" className={styles.logoLink} onClick={() => { setIsMenuOpen(false); setIsAccountDropdownOpen(false); }} aria-label="Art of Law Home"> {/* */}
          <img src={logoIcon} alt="Art of Law Icon" className={styles.logo} /> {/* */}
        </Link>

        {/* Desktop Links */}
        <div className={styles.navLinksDesktop}> {/* */}
          {navBarDisplayLinks.map(item => renderNavLink(item, false))}
        </div>

        <div className={styles.navActions}> {/* */}
          {/* Account Icon and Dropdown */}
          <div className={styles.accountMenuContainer} ref={accountIconRef}>
            <button
              onClick={toggleAccountDropdown}
              className={styles.accountIconButton}
              aria-label="Account menu"
              aria-expanded={isAccountDropdownOpen}
            >
              <UserIcon />
              {isLoggedIn && currentUser && <span className={styles.currentUserIndicatorDot}></span>}
            </button>
            {isAccountDropdownOpen && (
              <div className={styles.accountDropdown} ref={accountDropdownRef}>
                {isLoggedIn && currentUser ? ( //
                  <>
                    <div className={styles.dropdownHeader}>Hi, {currentUser.firstName}!</div> {/* */}
                    {currentUser.role !== 'organizer' && currentUser.role !== 'admin' && ( //
                      renderNavLink({ path: "/my-bookings", label: "My Bookings", type: "route" }, false, true) //
                    )}
                    {(currentUser.role === 'organizer' || currentUser.role === 'admin') && ( //
                      <>
                        {renderNavLink({ path: "/organizer-dashboard", label: "Organizer Dashboard", type: "route" }, false, true)} {/* */}
                        {renderNavLink({ path: "/organizer-settings/availability", label: "Manage Availability", type: "route" }, false, true)} {/* */}
                      </>
                    )}
                    <button onClick={handleLogout} className={styles.accountDropdownButton}> {/* */}
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={() => handleLoginModalOpen('login')} className={styles.accountDropdownButton}>
                      Login
                    </button>
                    <button onClick={() => handleLoginModalOpen('register')} className={styles.accountDropdownButton}>
                      Register
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className={styles.menuToggle} //
            onClick={toggleMenu} //
            aria-label={isMenuOpen ? "Close menu" : "Open menu"} //
            aria-expanded={isMenuOpen} //
          >
            {isMenuOpen ? <CloseIcon /> : <MenuIcon />} {/* */}
          </button>
        </div>
      </div>

      {/* Mobile Overlay Menu */}
      <div id="mobileNavMenu" className={`${styles.navMenuMobileOverlay} ${isMenuOpen ? styles.active : ''}`}> {/* */}
        <Link to="/" className={styles.mobileNavLink} onClick={() => handleNavClick('/', 'route')}>Home</Link> {/* */}
        {mainSectionLinks.map(item => renderNavLink(item, true))}
        
        {/* Account/Auth options in mobile menu */}
        <div className={styles.mobileMenuDivider}></div> {/* Optional divider */}

        {isLoggedIn && currentUser ? ( //
          <>
            <div className={styles.mobileMenuUserGreeting}>Hi, {currentUser.firstName}!</div> {/* */}
            {currentUser.role !== 'organizer' && currentUser.role !== 'admin' && ( //
              renderNavLink({ path: "/my-bookings", label: "My Bookings", type: "route" }, true) //
            )}
            {(currentUser.role === 'organizer' || currentUser.role === 'admin') && ( //
              <>
                {renderNavLink({ path: "/organizer-dashboard", label: "Organizer Dashboard", type: "route" }, true)} {/* */}
                {renderNavLink({ path: "/organizer-settings/availability", label: "Manage Availability", type: "route" }, true)} {/* */}
              </>
            )}
            <button onClick={handleLogout} className={`${styles.navButton} ${styles.loginRegisterBtnMobile}`}> {/* */}
              Logout
            </button>
          </>
        ) : (
          <>
            <button onClick={() => handleLoginModalOpen('login')} className={`${styles.navButton} ${styles.loginRegisterBtnMobile}`}> {/* */}
              Login
            </button>
            <button onClick={() => handleLoginModalOpen('register')} className={`${styles.navButton} ${styles.loginRegisterBtnMobile}`}> {/* */}
              Register
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;