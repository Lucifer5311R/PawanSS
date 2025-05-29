// ## File: src/components/AwardsRecognition.jsx (Using CSS Modules)

import React, { useState } from 'react';
import styles from './AwardsRecognition.module.css'; // Import CSS Module

// Placeholder Icon - Replace later
const AwardIcon = () => <span className={styles.awardIcon}>&#127942;</span>; // Example trophy icon

function AwardsRecognition() {
  const [expandedAward, setExpandedAward] = useState(null);

  const awardsData = [
    {
      id: 1,
      title: 'Millennium Ocean Prize',
      detail: 'UN Academic Impact recognition for the Jalamitra Project\'s innovative approach to environmental law and sustainability.',
      randomInfo: 'This prestigious award highlights the project\'s global impact on marine conservation and policy innovation. It was presented at a high-level UN conference in New York attended by several dignitaries and environmental activists.',
    },
    {
      id: 2,
      title: 'Project Nyayam - UNAI',
      detail: 'Recognition from the United Nations Academic Impact (Details pending).',
      randomInfo: 'Project Nyayam received this recognition for its contributions to promoting justice and the rule of law within academic communities. The UNAI lauded the project for its innovative use of technology to disseminate legal awareness.',
    },
    {
      id: 3,
      title: 'Student of the Year (2025)',
      detail: 'Awarded to Pawan SS by CHRIST University School of Law for overall excellence.',
      randomInfo: 'Pawan SS was recognized for outstanding academic performance, leadership qualities demonstrated as the president of the student bar association, and active participation in moot court competitions.',
    },
    {
      id: 4,
      title: 'Best Coordination Award',
      detail: 'Recognition for outstanding coordination efforts (Context details pending).',
      randomInfo: 'This award acknowledges exceptional teamwork and organizational skills demonstrated in the successful execution of the National Law Fest held earlier this year, which saw participation from over 30 law schools.',
    },
    {
      id: 5,
      title: 'Baazigar Recognition',
      detail: 'Specific recognition or award titled "Baazigar" (Context details pending).',
      randomInfo: 'The "Baazigar" recognition likely celebrates a remarkable achievement in a competitive event, possibly a debate or a quiz, where strategic thinking and quick execution led to victory. More details will follow.',
    },
    {
      id: 6,
      title: 'Highest Community Service Award',
      detail: 'Recognition for outstanding coordination efforts (Context details pending).',
      randomInfo: 'This award honors exceptional dedication to serving the community through volunteer work with local NGOs, focusing on legal aid and environmental awareness campaigns in underserved areas.',
    },
  ];

  const toggleReadMore = (awardId) => {
    setExpandedAward(expandedAward === awardId ? null : awardId);
  };

  return (
    <section id="recognition" className="section">
      <div className="container">
        <h2 className="section-title">Awards & Recognition</h2>

        <div className={styles.awardsGrid}>
          {awardsData.map((award) => (
            <div key={award.id} className={styles.awardItem}>
              <AwardIcon />
              <h3 className={styles.awardTitle}>{award.title}</h3>
              <p className={styles.awardDetail}>{award.detail}</p>
              {expandedAward === award.id && (
                <p className={styles.awardRandomInfo}>{award.randomInfo}</p>
              )}
              <button className={styles.readMoreBtn} onClick={() => toggleReadMore(award.id)}>
                {expandedAward === award.id ? 'Read Less' : 'Read More'}
              </button>
              {/* Details from:, Mentioned in list: */}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default AwardsRecognition;