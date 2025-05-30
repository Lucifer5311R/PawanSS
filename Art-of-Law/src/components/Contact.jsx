// ## File: src/components/Contact.jsx (Using CSS Modules)

import React, { useState } from 'react';
import styles from './Contact.module.css'; // Import CSS Module
import PaymentForm from './PaymentForm';
// Optional: Import icons for social links
import { FaLinkedin, FaYoutube, FaInstagram } from 'react-icons/fa';

function Contact() {
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [consultationType, setConsultationType] = useState('standard');
  const [consultationFee, setConsultationFee] = useState(7500);
  
  const handleConsultationTypeChange = (type, fee) => {
    setConsultationType(type);
    setConsultationFee(fee);
  };
  
  const handlePaymentClick = () => {
    setShowPaymentForm(true);
  };
  
  return (
    <section id="contact" className={`section ${styles.contactSection} bg-dark`}>
      <div className="container">
        <h2 className={`section-title ${styles.contactTitle}`}>Get In Touch</h2>

        <div className={styles.contactContent}>
          <p className={styles.contactLead}>
            Have questions about our work, want to collaborate, or interested in our legal services? We encourage you to reach out.
          </p>

          {/* Contact Info */}
          <div className={styles.contactInfo}>
             {/* Ideally use icons here */}
            <p>
              {/* <Icon/> */}
               <strong>Email:</strong> <a href="mailto:artoflaw.aol@gmail.com">artoflaw.aol@gmail.com</a>
            </p>
            <p>Pawan S.S</p>
            { <p><strong>Phone:</strong> <a href="tel:+91 9900001367">+91 9900001367</a></p> }
              <p>Kamal Adithya K</p>
              { <p><strong>Phone:</strong> <a href="tel:+91 90956 26118">+91 90956 26118</a></p> }
            { <p><strong>Location:</strong> Bengaluru, Karnataka, India</p> }
          </div>

          {/* Social Links */}
          <div className={styles.socialLinks}>
            {<a href="https://www.linkedin.com/in/pawanss/" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer"><FaLinkedin /></a>}
            {<a href="https://www.youtube.com/@artoflaw" aria-label="YouTube" target="_blank" rel="noopener noreferrer"><FaYoutube /></a>}
            {<a href="https://www.instagram.com/artoflaw.in/" aria-label="Instagram" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>}
            {/* Links potentially from: */}
          </div>

          {/* Legal Consultation Payment Section */}
          <div className={styles.supportSection}>
            <h3>Legal Consultation Services</h3>
            <p>Select a consultation type and proceed with payment to schedule your session with our legal experts.</p>
            
            {!showPaymentForm ? (
              <div className={styles.donationOptions}>
                <button 
                  className={`${styles.donationButton} ${consultationType === 'basic' ? styles.selected : ''}`}
                  onClick={() => handleConsultationTypeChange('basic', 500)}
                >
                  Basic Consultation<br /><span className={styles.feeAmount}>₹500</span>
                </button>
                <button 
                  className={`${styles.donationButton} ${consultationType === 'standard' ? styles.selected : ''}`}
                  onClick={() => handleConsultationTypeChange('standard', 1,500)}
                >
                  Standard Consultation<br /><span className={styles.feeAmount}>₹1,500</span>
                </button>
                <button 
                  className={`${styles.donationButton} ${consultationType === 'comprehensive' ? styles.selected : ''}`}
                  onClick={() => handleConsultationTypeChange('comprehensive', 2,500)}
                >
                  Comprehensive Consultation<br /><span className={styles.feeAmount}>2,500</span>
                </button>
                <button 
                  className={styles.donateNowButton}
                  onClick={handlePaymentClick}
                >
                  Proceed to Payment
                </button>
              </div>
            ) : (
              <PaymentForm amount={consultationFee} />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contact;