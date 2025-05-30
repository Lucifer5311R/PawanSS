// src/components/ProjectNyay.jsx
import React from 'react';
import styles from './ProjectNyay.module.css';
// import { Link } from 'react-router-dom';

const ProjectNyay = () => {
  return (
    // This <section> can be a <div> if CareersPage provides the main <section> wrapper for it.
    // For now, keeping it as a section for modularity.
    <div id="project-nyay-subsection" className={styles.projectNyaySection}> {/* Changed id to avoid conflict if reused */}
      <div className="container"> {/* Removed redundant "section" class from here */}
        <h2 className={`section-title ${styles.subSectionTitle}`}>Project Nyay</h2> {/* Using a different style for subsection title */}
        <div className={styles.contentWrapper}>
          <div className={styles.aboutNyay}>
            <h3>Accessible Legal Education for All</h3>
            <p>
              Project Nyay is an innovative initiative by Art of Law, committed to revolutionizing
              legal education by making it accessible and affordable. We believe that understanding
              the law is a right, not a privilege.
            </p>
            <p>
              Our unique approach involves courses designed and taught by passionate law students
              and young legal professionals. This peer-to-peer learning model ensures fresh perspectives
              and relatable teaching methods. We offer a diverse range of subjects covering various
              laws and legal areas, available in both English and regional languages to cater to a
              wider audience.
            </p>
          </div>
          <div className={styles.enrollMessage}>
            <h4>Unlock Your Legal Potential!</h4>
            <p>
              Whether you're a student aspiring to enter the legal field, a professional seeking
              to understand legal nuances relevant to your work, or an individual curious about
              your rights, Project Nyay has something for you.
            </p>
            <p>
              Join our community and embark on a journey of legal discovery with courses
              that are engaging, practical, and budget-friendly.
            </p>
            <a href="#contact" className={`btn btn-primary ${styles.enrollButton}`}>
              Express Interest & Learn More
            </a>
            <p className={styles.comingSoon}>
              (Full course catalog and enrollment platform launching soon!)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectNyay;