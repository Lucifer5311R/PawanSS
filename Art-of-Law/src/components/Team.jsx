import React from 'react';
import styles from './Team.module.css'; // Import the CSS Module

function Team() {
  return (
    <section id="team" className="section">
      <div className="container">
        <h2 className="section-title">Our Team</h2>

        <div className={styles.teamGrid}>

          {/* Team Member 1 Card */}
          <div className={styles.teamMemberCard}>
            <img
              src="/images/pawan-ss.jpg" // Ensure image is in public/images/
              alt="Advocate Pawan SS"
              className={styles.teamMemberImage}
              // Image cited from:
            />
            <h3 className={styles.teamMemberName}>Advocate Pawan SS</h3>
            <p className={styles.teamMemberRole}>
              Environmental Advocate, Social Researcher, Legal Educator
            </p>
            <p className={styles.teamMemberBio}>
              Dedicated to legal education, environmental sustainability, and access to justice. Leader of the award-winning Jalamitra Project.
              {/* */}
            </p>
            {/* Add social/profile links if available */}
            {/* <div className={styles.teamMemberLinks}> <a href="#">LinkedIn</a> </div> */}
          </div>

          {/* Team Member 2 Card */}
          <div className={styles.teamMemberCard}>
            <img
              src="/images/kamal-k.jpg" // Ensure image is in public/images/
              alt="Advocate Kamal Adithya K"
              className={styles.teamMemberImage}
              // Image cited from:
            />
            <h3 className={styles.teamMemberName}>Advocate Kamal Adithya K</h3>
            <p className={styles.teamMemberRole}>
              Co-founder, Legal Professional
               {/* */}
            </p>
            <p className={styles.teamMemberBio}>
              Co-founder of Art of Law, focused on practical legal application and social research. Experienced in civil/criminal law and court procedures.
               {/* */}
            </p>
             {/* Add social/profile links if available */}
             {/* <div className={styles.teamMemberLinks}> <a href="#">LinkedIn</a> </div> */}
          </div>

          {/* Add more team cards here */}

        </div>
      </div>
    </section>
  );
}

export default Team;
