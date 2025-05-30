// ## File: src/components/AwardsRecognition.jsx (Using CSS Modules)

import React from 'react';
import styles from './AwardsRecognition.module.css'; // Import CSS Module

// Placeholder Icon - Replace later
const AwardIcon = () => <span className={styles.awardIcon}>&#127942;</span>; // Example trophy icon

function AwardsRecognition() {
  const awardsData = [
    {
      id: 1,
      title: 'Millennium Ocean Prize',
      detail: 'Recognized by UNAI for Jalamitra Projects innovative work in environmental law.',
      randomInfo: 'This prestigious award highlights the projects global impact on marine conservation and policy innovation. It was presented at a high-level UN conference.',
    },
    {
      id: 2,
      title: 'Project Nyayam \u00A0UNAI',
      detail: 'UNAI recognition for impactful legal initiatives.',
      randomInfo: 'Project Nyayam is a student-led legal outreach initiative under the United Nations Academic Impact aimed at promoting legal awareness and access to justice among all Rooted in the belief that justice should be accessible to all,  especially for marginalized communities.',
    },
    {
      id: 5,
      title: 'Baazigar Recognition',
      detail: 'Awarded for outstanding achievement under the “Baazigar” title.',
      randomInfo: 'The "Baazigar" recognition likely celebrates a remarkable achievement in the “University Business Fair Bazigar 2024” - Showcased innovative business and legal strategies, inspiring students to merge law and entrepreneurship.',
    },
    {
      id: 4,
      title: 'Best Coordination Award',
      detail: 'Awarded for exemplary coordination and leadership.',
      randomInfo: 'This award acknowledges exceptional teamwork and organizational skills demonstrated in a specific event or project.',
    },
    {
      id: 6,
      title: 'Highest Community Service Award',
      detail: 'Recognized for exceptional contribution to community welfare.',
      randomInfo: 'This award honors exceptional dedication to serving the community through volunteer work and impactful initiatives. ',
    },
    {
      id: 3,
      title: 'Student of the Year (2025)',
      detail: 'Awarded by CHRIST (Deemed to be University), School of Law, for overall excellence.',
      randomInfo: 'This award recognizes overall academic, extracurricular, and leadership excellence within the School of Law.',
    },
  ];

  return (
    <section id="recognition" className="section">
      <div className="container">
        <h2 className="section-title">Awards & Recognition</h2>

        <div className={styles.awardsGrid}>
          {awardsData.map((award) => (
            <div key={award.id} className={styles.awardItem}>
              <AwardIcon />
              <h3 className={styles.awardTitle}>{award.title}</h3>
              <p className={styles.awardDetail}>
                {award.detail}
                {award.randomInfo && <div className={styles.awardRandomInfo}>{award.randomInfo}</div>}
              </p>
              {/* Details from:, Mentioned in list: */}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default AwardsRecognition;