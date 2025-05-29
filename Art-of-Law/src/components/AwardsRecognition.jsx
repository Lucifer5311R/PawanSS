// ## File: src/components/AwardsRecognition.jsx (Using CSS Modules)

import React from 'react';
import styles from './AwardsRecognition.module.css'; // Import CSS Module

// Placeholder Icon - Replace later
const AwardIcon = () => <span className={styles.awardIcon}>&#127942;</span>; // Example trophy icon

function AwardsRecognition() {
  return (
    <section id="recognition" className="section">
      <div className="container">
        <h2 className="section-title">Awards & Recognition</h2>

        <div className={styles.awardsGrid}>

          {/* Award Item 1 */}
          <div className={styles.awardItem}>
            <AwardIcon />
            <h3 className={styles.awardTitle}>Millennium Ocean Prize</h3>
            <p className={styles.awardDetail}>UN Academic Impact recognition for the Jalamitra Project's innovative approach to environmental law and sustainability.</p>
             {/* Details from:, Mentioned in list: */}
          </div>

          {/* Award Item 2 */}
          <div className={styles.awardItem}>
             <AwardIcon />
            <h3 className={styles.awardTitle}>Project Nyayam - UNAI</h3>
            <p className={styles.awardDetail}>Recognition from the United Nations Academic Impact (Details pending).</p>
             {/* Mentioned in list: */}
          </div>

          {/* Award Item 5 */}
          <div className={styles.awardItem}>
             <AwardIcon />
            <h3 className={styles.awardTitle}>Baazigar Recognition</h3>
            <p className={styles.awardDetail}>Specific recognition or award titled "Baazigar" (Context details pending).</p>
            {/* Mentioned in list: */}
          </div>

           {/* Award Item 4 */}
          <div className={styles.awardItem}>
             <AwardIcon />
            <h3 className={styles.awardTitle}>Best Coordination Award</h3>
            <p className={styles.awardDetail}>Recognition for outstanding coordination efforts (Context details pending).</p>
              {/* Mentioned in list: */}
          </div>

          {/* Award Item 3 */}
          <div className={styles.awardItem}>
             <AwardIcon />
            <h3 className={styles.awardTitle}>Student of the Year (2025)</h3>

            <p className={styles.awardDetail}>Awarded to Pawan SS by CHRIST University School of Law for overall excellence.</p>
            {/* Details from: */}
          </div>

          {/* Award Item 6 */}
          <div className={styles.awardItem}>
             <AwardIcon />
            <h3 className={styles.awardTitle}>Highest community service award</h3>
            <p className={styles.awardDetail}>Recognition for outstanding coordination efforts (Context details pending).</p>
              {/* Mentioned in list: */}
          </div>

        </div>
      </div>
    </section>
  );
}

export default AwardsRecognition;