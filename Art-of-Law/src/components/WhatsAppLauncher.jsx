// src/components/WhatsAppLauncher.jsx
import React, { useState, useEffect, useRef } from 'react';
import styles from './WhatsAppLauncher.module.css'; // We'll rename/update the CSS file too
import { FaWhatsapp, FaTimes } from 'react-icons/fa'; // FaTimes for a close icon

const WhatsAppLauncher = ({ contacts }) => {
  const [isOpen, setIsOpen] = useState(false);
  const launcherRef = useRef(null);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  // Close popup if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (launcherRef.current && !launcherRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  if (!contacts || contacts.length === 0) {
    console.error("WhatsAppLauncher: contacts prop is missing or empty.");
    return null;
  }

  return (
    <div className={styles.whatsappLauncherContainer} ref={launcherRef}>
      {isOpen && (
        <div className={styles.contactsPopup}>
          <div className={styles.popupHeader}>
            <span>Get Quick Legal Help!</span>
            <button onClick={toggleOpen} className={styles.closePopupButton} aria-label="Close WhatsApp contacts">
              <FaTimes size={16} />
            </button>
          </div>
          <p className={styles.popupIntro}>Click on the team you want to get connected with.</p>
          <ul className={styles.contactsList}>
            {contacts.map((contact, index) => {
              const cleanPhoneNumber = contact.number.replace(/[^0-9]/g, '');
              const encodedMessage = encodeURIComponent(contact.message || "Hello, I have a query.");
              const whatsappUrl = `https://wa.me/${cleanPhoneNumber}?text=${encodedMessage}`;
              return (
                <li key={index}>
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className={styles.contactLink}>
                    <FaWhatsapp className={styles.contactIcon} />
                    <span>{contact.name}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      )}
      <button
        onClick={toggleOpen}
        className={styles.whatsappFab}
        aria-label={isOpen ? "Close WhatsApp options" : "Open WhatsApp options"}
        title="Chat with us on WhatsApp"
      >
        {isOpen ? <FaTimes size={28} /> : <FaWhatsapp size={30} />}
      </button>
    </div>
  );
};

export default WhatsAppLauncher;