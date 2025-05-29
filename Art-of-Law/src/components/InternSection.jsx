// src/components/InternSection.jsx
import React, { useState } from 'react';
import styles from './InternSection.module.css';

// Sample intern data (replace with your actual data)
const internsData = [
  {
    id: 1,
    name: 'Durgadutt S B',
    university: 'Christ University, Bangalore',
    image: 'https://via.placeholder.com/150/8e44ad/ffffff?Text=Durgadutt+S+B',
    focus: 'Full Stack Development',
    testimonialShort: 'Working with Art of Law has been an incredible learning experience, providing hands-on exposure...',
    testimonialFull: 'Working with Art of Law has been an incredible learning experience, providing hands-on exposure to real-world legal challenges. The mentorship and collaborative environment are truly exceptional. I\'ve grown so much both personally and professionally.',
  },
  {
    id: 2,
    name: 'Sherly Lance',
    university: 'Christ University, Bangalore',
    image: 'https://via.placeholder.com/150/3498db/ffffff?Text=Sherly+Lance',
    focus: 'Web Development',
    testimonialShort: 'The internship exceeded my expectations. I was involved in meaningful research and community outreach...',
    testimonialFull: 'The internship at Art of Law exceeded all my expectations. I was involved in meaningful research, community outreach programs, and even got to assist in drafting legal awareness content. It\'s a fantastic place for aspiring lawyers to make a difference.',
  },
  {
    id: 3,
    name: 'Yashas R',
    university: 'Christ University, Bangalore',
    image: 'https://via.placeholder.com/150/e74c3c/ffffff?Text=Yashas+R',
    focus: 'Project Management & Development',
    testimonialShort: 'A truly rewarding experience. The team is supportive and the work is impactful. Highly recommend Art of Law...',
    testimonialFull: 'A truly rewarding experience. The team at Art of Law is incredibly supportive, and the work is genuinely impactful. I was particularly impressed by their dedication to environmental advocacy and education. Highly recommend this internship to any law student looking for practical experience.',
  },
];

const TestimonialModal = ({ intern, onClose }) => {
  if (!intern) return null;
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>&times;</button>
        <img src={intern.image} alt={intern.name} className={styles.modalImage} />
        <h3>{intern.name}</h3>
        <p className={styles.modalUniversity}>{intern.university}</p>
        <p className={styles.modalFocus}>Focus: {intern.focus}</p>
        <p className={styles.modalTestimonial}>{intern.testimonialFull}</p>
      </div>
    </div>
  );
};

const InternSection = () => {
  const [selectedIntern, setSelectedIntern] = useState(null);

  const openModal = (intern) => {
    setSelectedIntern(intern);
    document.body.style.overflow = '';
  };

  const closeModal = () => {
    setSelectedIntern(null);
    document.body.style.overflow = '';
  };

  return (
    // This <section> can be a <div> if CareersPage provides the main <section> wrapper.
    // Keeping as section for modularity.
    <div id="interns-subsection" className={styles.internSection}> {/* Changed id */}
      <div className="container"> {/* Removed redundant "section" class */}
        <h2 className={`section-title ${styles.subSectionTitle}`}>Meet Our Interns</h2>
        <p className={styles.introText}>
          Our interns are the backbone of many of our initiatives, bringing fresh perspectives,
          dedication, and a passion for law. Here are some of the talented individuals
          who have contributed to Art of Law.
        </p>
        <div className={styles.internsGrid}>
          {internsData.map((intern) => (
            <div key={intern.id} className={styles.internCard}>
              <img src={intern.image} alt={intern.name} className={styles.internImage} />
              <h3 className={styles.internName}>{intern.name}</h3>
              <p className={styles.internUniversity}>{intern.university}</p>
              <p className={styles.internFocus}>Focus: {intern.focus}</p>
              <p className={styles.testimonialShort}>"{intern.testimonialShort}"</p>
              <button onClick={() => openModal(intern)} className={styles.readMoreButton}>
                Read Full Testimonial
              </button>
            </div>
          ))}
        </div>
      </div>
      {selectedIntern && <TestimonialModal intern={selectedIntern} onClose={closeModal} />}
    </div>
  );
};

export default InternSection;