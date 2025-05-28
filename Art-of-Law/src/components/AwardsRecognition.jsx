import React, { useEffect, useRef } from 'react';
import styles from './AwardsRecognition.module.css'; // Import CSS Module

// Custom Award Icon Component with Animation
const AwardIcon = ({ icon }) => {
  return (
    <div className={styles.iconWrapper}>
      <span className={styles.awardIcon}>{icon}</span>
    </div>
  );
};

const awardIcons = {
  millennium: '🌊', // Ocean-related
  unai: '🌍', // Global/UN related
  student: '🏆', // Trophy
  coordination: '🤝', // Handshake/Coordination
  baazigar: '⭐', // Star/Excellence
};

function AwardsRecognition() {
  const sectionRef = useRef(null);
  const awardsRef = useRef([]);
  
  // Initialize refs array
  awardsRef.current = [];
  const addToRefs = (el) => {
    if (el && !awardsRef.current.includes(el)) {
      awardsRef.current.push(el);
    }
  };
  
  useEffect(() => {
    // Observer for section entrance animation
    const sectionObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add(styles.visible);
          sectionObserver.unobserve(entry.target);
        }
      },
      { threshold: 0.2 }
    );
    
    // Observer for individual award items
    const awardObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add(styles.visible);
            }, index * 150);
            awardObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    
    // Observe section
    if (sectionRef.current) {
      sectionObserver.observe(sectionRef.current);
    }
    
    // Observe each award item
    awardsRef.current.forEach((award) => {
      if (award) {
        awardObserver.observe(award);
      }
    });
    
    return () => {
      if (sectionRef.current) sectionObserver.unobserve(sectionRef.current);
      awardsRef.current.forEach((award) => {
        if (award) awardObserver.unobserve(award);
      });
    };
  }, []);

  return (
    <section id="recognition" className={`section ${styles.awardsSection}`} ref={sectionRef}>
      <div className="container">
        <h2 className={`section-title ${styles.sectionTitle}`}>Awards & Recognition</h2>

        <div className={styles.awardsGrid}>

          {/* Award Item 1 */}
          <div className={styles.awardItem} ref={addToRefs}>
            <AwardIcon icon={awardIcons.millennium} />
            <h3 className={styles.awardTitle}>Millennium Ocean Prize</h3>
            <p className={styles.awardDetail}>UN Academic Impact recognition for the Jalamitra Project's innovative approach to environmental law and sustainability.</p>
          </div>

          {/* Award Item 2 */}
          <div className={styles.awardItem} ref={addToRefs}>
            <AwardIcon icon={awardIcons.unai} />
            <h3 className={styles.awardTitle}>Project Njaayam - UNAI</h3>
            <p className={styles.awardDetail}>Recognition from the United Nations Academic Impact (Details pending).</p>
          </div>

          {/* Award Item 3 */}
          <div className={styles.awardItem} ref={addToRefs}>
            <AwardIcon icon={awardIcons.student} />
            <h3 className={styles.awardTitle}>Student of the Year (2025)</h3>
            <p className={styles.awardDetail}>Awarded to Pawan SS by CHRIST University School of Law for overall excellence.</p>
          </div>

          {/* Award Item 4 */}
          <div className={styles.awardItem} ref={addToRefs}>
            <AwardIcon icon={awardIcons.coordination} />
            <h3 className={styles.awardTitle}>Best Coordination Award</h3>
            <p className={styles.awardDetail}>Recognition for outstanding coordination efforts (Context details pending).</p>
          </div>

          {/* Award Item 5 */}
          <div className={styles.awardItem} ref={addToRefs}>
            <AwardIcon icon={awardIcons.baazigar} />
            <h3 className={styles.awardTitle}>Baazigar Recognition</h3>
            <p className={styles.awardDetail}>Specific recognition or award titled "Baazigar" (Context details pending).</p>
          </div>

        </div>
      </div>
    </section>
  );
}

export default AwardsRecognition;