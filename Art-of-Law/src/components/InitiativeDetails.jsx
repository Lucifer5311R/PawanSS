// src/components/InitiativeDetails.jsx
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import styles from './InitiativeDetails.module.css'; // CSS Module for InitiativeDetails
import { initiativeDetails } from './initiativeData'; // Import data from the new file

function InitiativeDetails() {
  const { initiativeName } = useParams();
  // Find the correct key in initiativeDetails based on the URL parameter
  // This requires the keys in initiativeDetails to match the URL generation logic (lowercase, hyphenated)
  // or a more robust lookup mechanism. For now, we'll assume a direct match after formatting.
  const formattedKey = Object.keys(initiativeDetails).find(
    key => key.replace(/\s+/g, '-').toLowerCase() === initiativeName
  );
  const details = formattedKey ? initiativeDetails[formattedKey] : null;

  if (!details) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '2rem' }}>
        <h2>Initiative Not Found</h2>
        <p>The initiative you are looking for does not exist or the URL is incorrect.</p>
        <Link to="/" className={styles.backLink}>Back to Home</Link>
      </div>
    );
  }

  return (
    <section className={`section ${styles.detailsSection}`}>
      <div className="container">
        <div className={styles.detailsCard}>
          <h2 className={styles.detailsTitle}>{formattedKey}</h2>
          {details.image && <img src={details.image} alt={formattedKey} className={styles.detailsImage} />}
          <p className={styles.detailsDescription}>{details.description}</p>
          <Link to="/#initiatives" className={styles.backLink}>Back to Initiatives</Link>
        </div>
      </div>
    </section>
  );
}

export default InitiativeDetails;