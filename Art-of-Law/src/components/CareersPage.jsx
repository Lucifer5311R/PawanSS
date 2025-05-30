// src/components/CareersPage.jsx
import React, { useEffect, useRef } from 'react';
import styles from './CareersPage.module.css';
import ProjectNyay from './ProjectNyay';
import InternSection from './InternSection';

const CareersPage = () => {
  const pageTitleRef = useRef(null);
  const introContentRef = useRef(null);
  const projectNyayRef = useRef(null);
  const internSectionRef = useRef(null);
  const generalInfoRef = useRef(null);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1, // Trigger when 10% of the element is visible
    };

    const observerCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add(styles.visible);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    const elementsToObserve = [
      pageTitleRef.current,
      introContentRef.current,
      projectNyayRef.current,
      internSectionRef.current,
      generalInfoRef.current,
    ];

    elementsToObserve.forEach(el => {
      if (el) observer.observe(el);
    });

    return () => {
      elementsToObserve.forEach(el => {
        if (el) observer.unobserve(el);
      });
    };
  }, []);

  return (
    <div className={styles.careersPageContainer}>
      {/* Enhanced Page Header */}
      <header className={styles.pageHeader}>
        <div className="container">
          <h1 ref={pageTitleRef} className={`${styles.pageTitle} ${styles.animatedElement}`}>
            <span>Shape the Future</span>
            <span>of Law with Us</span>
          </h1>
          <div ref={introContentRef} className={`${styles.introContent} ${styles.animatedElement} ${styles.delay1}`}>
            <p>
              At Art of Law, we are dedicated to fostering legal talent, promoting innovative educational
              initiatives, and providing opportunities for aspiring legal minds to grow and contribute.
              Explore our programs and meet the individuals shaping the future of legal accessibility.
            </p>
          </div>
        </div>
      </header>

      {/* Project Nyay Section - wrapped for animation */}
      <div ref={projectNyayRef} className={`${styles.subSectionWrapper} ${styles.animatedElement} ${styles.delay2}`}>
        <ProjectNyay />
      </div>

      {/* Visual Separator (Optional) */}
      <div className={styles.sectionSeparator}></div>

      {/* Interns Section - wrapped for animation */}
      <div ref={internSectionRef} className={`${styles.subSectionWrapper} ${styles.animatedElement} ${styles.delay2}`}>
        <InternSection />
      </div>

      {/* Visual Separator (Optional) */}
      <div className={styles.sectionSeparator}></div>

      {/* General Career Info - wrapped for animation */}
      <div className="container">
        <div ref={generalInfoRef} className={`${styles.generalCareerInfo} ${styles.animatedElement} ${styles.delay2}`}>
          <h2>General Applications</h2>
          <p>
            While specific roles are listed as they become available, we are always open to hearing
            from passionate individuals. If you believe you can contribute to Art of Law's mission,
            please feel free to send your resume and a cover letter to:
            <a href="mailto:careers@artoflaw.example.com"> careers@artoflaw.example.com</a> (replace with actual email).
          </p>
        </div>
      </div>
    </div>
  );
};

export default CareersPage;