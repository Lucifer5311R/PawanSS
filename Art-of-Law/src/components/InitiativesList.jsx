// src/components/InitiativesList.jsx
import React from 'react';
import styles from './InitiativesList.module.css'; // Import the CSS Module for InitiativesList
import { Link } from 'react-router-dom';
import { initiativeDetails } from './initiativeData'; // Import data from the new file

// Placeholder for icons - replace with actual icons later
const PlaceholderIcon = () => <span style={{ marginRight: '8px', color: 'var(--secondary-color)' }}>&#9733;</span>;

function InitiativesList() {
  return (
    <section id="initiatives" className="section bg-light">
      <div className="container">
        <h2 className="section-title">Initiatives & Programs</h2>

        <div className={styles.initiativesGrid}>
          {Object.keys(initiativeDetails).map((title) => (
            <Link
              to={`/initiative/${title.replace(/\s+/g, '-').toLowerCase()}`} // URL-friendly names
              key={title}
              className={styles.initiativeCard}
            >
              {/* <PlaceholderIcon /> Replace with actual Icon component */}
              <h3 className={styles.cardTitle}>{title}</h3>
              <p className={styles.cardText}>{initiativeDetails[title].description.substring(0, 80)}...</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default InitiativesList;