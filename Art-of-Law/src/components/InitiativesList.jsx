// src/components/InitiativesList.jsx
import React from 'react';
<<<<<<< HEAD
import styles from './InitiativesList.module.css'; // Import the CSS Module


// Placeholder for icons - replace with actual icons later
// Option 1: Use Unicode characters (simple, limited)
// Option 2: Use an icon library (e.g., react-icons, lucide-react) - Recommended
const PlaceholderIcon = () => <span style={{ marginRight: '8px', color: 'var(--secondary-color)' }}>&#9733;</span>; // Example star

=======
import styles from './InitiativesList.module.css'; // Import the CSS Module for InitiativesList
import { Link } from 'react-router-dom';
import { initiativeDetails } from './initiativeData'; // Import data from the new file

// Placeholder for icons - replace with actual icons later
const PlaceholderIcon = () => <span style={{ marginRight: '8px', color: 'var(--secondary-color)' }}>&#9733;</span>;
>>>>>>> 320d3d4760341f91ac7654051822043a62cbbc90

function InitiativesList() {
  return (
    <section id="initiatives" className="section bg-light">
      <div className="container">
        <h2 className="section-title">Initiatives & Programs</h2>


        <div className={styles.initiativesGrid}>
<<<<<<< HEAD


          {/* Initiative Card 1 */}
          <div className={styles.initiativeCard}>
             {/* <PlaceholderIcon /> Replace with actual Icon component */}
             <h3 className={styles.cardTitle}>Legal Training Sessions and Legal Hackathon</h3>
             <p className={styles.cardText}>Providing practical legal training to empower individuals and professionals.</p>
             {/* Based on item from: */}
          </div>


          {/* Initiative Card 2 */}
          <div className={styles.initiativeCard}>
             {/* <PlaceholderIcon /> */}
             <h3 className={styles.cardTitle}>Legal Career Counseling</h3>
             <p className={styles.cardText}>Guiding aspiring legal professionals in their career paths.</p>
              {/* Based on item from: */}
          </div>


          {/* Initiative Card 3 */}
          <div className={styles.initiativeCard}>
             {/* <PlaceholderIcon /> */}
             <h3 className={styles.cardTitle}>Project ICSSR Research</h3>
             <p className={styles.cardText}>Engaging in impactful social science research addressing inequality, education, and labor rights.</p>
              {/* Based on item from:, Details from: */}
          </div>


          {/* Initiative Card 4 */}
          <div className={styles.initiativeCard}>
             {/* <PlaceholderIcon /> */}
             <h3 className={styles.cardTitle}>All India Bar Exam Classes</h3>
             <p className={styles.cardText}>Offering preparatory classes or resources for the All India Bar Examination.</p>
              {/* Based on item from: */}
          </div>


       
          {/* Initiative Card 6 */}
          <div className={styles.initiativeCard}>
            {/* <PlaceholderIcon /> */}
            <h3 className={styles.cardTitle}>Environmental Law Program</h3>
            <p className={styles.cardText}>Promoting environmental legal awareness via workshops, seminars, and field visits.</p>
            {/* Based on info from: */}
          </div>


           {/* Initiative Card 7 */}
           <div className={styles.initiativeCard}>
            {/* <PlaceholderIcon /> */}
            <h3 className={styles.cardTitle}>National Conference</h3>
            <p className={styles.cardText}>Hosted conference on empowering the unorganized working sector with CHRIST University.</p>
             {/* Based on info from: */}
           </div>


=======
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
>>>>>>> 320d3d4760341f91ac7654051822043a62cbbc90
        </div>
      </div>
    </section>
  );
}

<<<<<<< HEAD

export default InitiativesList;
=======
export default InitiativesList;
>>>>>>> 320d3d4760341f91ac7654051822043a62cbbc90
