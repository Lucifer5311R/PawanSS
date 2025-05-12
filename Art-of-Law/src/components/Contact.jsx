// ## File: src/components/Contact.jsx (Using CSS Modules)

import React from 'react';
import styles from './Contact.module.css'; // Import CSS Module
// Optional: Import icons for social links
// import { FaLinkedin, FaYoutube, FaInstagram } from 'react-icons/fa';

function Contact() {
  return (
    <section id="contact" className={`section ${styles.contactSection} bg-dark`}>
      <div className="container">
        <h2 className={`section-title ${styles.contactTitle}`}>Get In Touch</h2>

        <div className={styles.contactContent}>
          <p className={styles.contactLead}>
            Have questions about our work, want to collaborate, or interested in our programs? We encourage you to reach out.
          </p>

          {/* Contact Info */}
          <div className={styles.contactInfo}>
             {/* Ideally use icons here */}
            <p>
              {/* <Icon/> */}
               <strong>Email:</strong> <a href="mailto:info@artoflaw.example">info@artoflaw.example</a>
            </p>
            {/* <p><strong>Phone:</strong> <a href="tel:+91XXXXXXXXXX">+91 XXXXXXXXXX</a></p> */}
            {/* <p><strong>Location:</strong> Bengaluru, Karnataka, India</p> */}
          </div>

          {/* Social Links */}
          <div className={styles.socialLinks}>
            {/* Replace # with actual links and use Icon components */}
            {/* <a href="#" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer"><FaLinkedin /></a> */}
            {/* <a href="#" aria-label="YouTube" target="_blank" rel="noopener noreferrer"><FaYoutube /></a> */}
            {/* <a href="#" aria-label="Instagram" target="_blank" rel="noopener noreferrer"><FaInstagram /></a> */}
            {/* Links potentially from: */}
          </div>

          {/* Optional: Placeholder for a simple form or link to a form page */}
          {/* <div className={styles.contactAction}>
             <a href="/contact-form" className="btn btn-accent">Send a Message</a>
          </div> */}

        </div>
      </div>
    </section>
  );
}

export default Contact;