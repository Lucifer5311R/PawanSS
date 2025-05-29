// src/components/DisclaimerModal.jsx
import React from 'react';
import styles from './DisclaimerModal.module.css'; // We'll create this CSS file next
import logoIcon from '/images/Logo.png'; // Assuming your logo is here

const DisclaimerModal = ({ onAgree }) => {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <img src={logoIcon} alt="Art of Law Logo" className={styles.modalLogo} />
        <h2>Disclaimer</h2>
        <p className={styles.disclaimerIntro}>
          The Bar Council of India does not permit the solicitation of work and advertising by legal
          practitioners/advocates. By accessing our website, the user acknowledges that:
        </p>
        <ol className={styles.disclaimerList}>
          <li>
            The user wishes to gain more information about us for his/her information and use. He/she
            also acknowledges that there has been no attempt by us to advertise or solicit work.
          </li>
          <li>
            Any information obtained or downloaded by the user from our website does not lead to the
            creation of the Advocate – Client relationship between our Law Firm and the User.
          </li>
          <li>
            None of the information contained in our website amounts to any form of legal opinion or legal
            advice.
          </li>
          <li>
            Our website uses cookies to improve your user experience. By using our site, you agree to our
            use of cookies. To find out more, please see our Cookies Policy & Privacy Policy.
            (Note: You may need to add actual links to these policies if you have them).
          </li>
        </ol>
        <button onClick={onAgree} className={styles.agreeButton}>
          I Agree
        </button>
      </div>
    </div>
  );
};

export default DisclaimerModal;