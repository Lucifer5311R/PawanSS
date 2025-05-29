// ## File: src/components/InitiativesList.jsx (Using CSS Modules)

import React from 'react';
import styles from './InitiativesList.module.css'; // Import the CSS Module
import { Link } from 'react-router-dom'; // Assuming you'll use React Router

// Placeholder for icons - replace with actual icons later
const PlaceholderIcon = () => <span style={{ marginRight: '8px', color: 'var(--secondary-color)' }}>&#9733;</span>; // Example star

// Dummy data for initiative details
const initiativeDetails = {
  'Legal Training Sessions and Legal Hackathon': {
    description: 'Our legal training sessions are designed to equip individuals with essential legal knowledge and practical skills. The legal hackathon fosters innovation in the legal tech space, encouraging participants to develop solutions for real-world legal challenges. This initiative aims to bridge the gap between legal theory and practice, empowering the next generation of legal professionals and informed citizens. We cover topics ranging from basic legal rights to more advanced areas of law, tailored to different experience levels. The hackathon provides a platform for collaboration and the application of legal principles to technology.',
    image: 'https://via.placeholder.com/150/771796/fff?Text=Legal+Training', // Placeholder image URL
  },
  'Legal Career Counseling': {
    description: 'Navigating the legal profession can be complex. Our legal career counseling provides personalized guidance to aspiring and current legal professionals. We offer advice on educational paths, career options within law, resume building, interview skills, and networking strategies. Our experienced counselors help individuals identify their strengths and interests to make informed decisions about their legal careers. Whether you are a student considering law school or a seasoned professional looking for a career change, our counseling services are here to support you in achieving your professional goals in the legal field.',
    image: 'https://via.placeholder.com/150/64b0f2/fff?Text=Career+Counseling', // Placeholder image URL
  },
  'Project ICSSR Research': {
    description: 'Project ICSSR Research is dedicated to conducting in-depth social science research focused on critical societal issues. Our current projects address inequality, access to education, and labor rights. Through rigorous research methodologies, we aim to provide evidence-based insights that can inform policy and drive positive social change. We collaborate with academics and practitioners to ensure our research is both relevant and impactful. Our findings are disseminated through publications, conferences, and community engagement to contribute to a more just and equitable society. Details of specific research projects and their outcomes are available on request.',
    image: 'https://via.placeholder.com/150/a18635/fff?Text=ICSSR+Research', // Placeholder image URL
  },
  'All India Bar Exam Classes': {
    description: 'Preparing for the All India Bar Examination (AIBE) requires focused effort and the right resources. Our initiative offers preparatory classes and study materials designed to help candidates successfully pass the AIBE. We cover the syllabus comprehensively, provide practice tests, and offer guidance on exam-taking strategies. Our experienced instructors ensure that students are well-prepared to demonstrate their legal knowledge and analytical skills required for enrollment as advocates in India. Join our classes to enhance your preparation and increase your chances of success in the AIBE.',
    image: 'https://via.placeholder.com/150/d35400/fff?Text=AIBE+Classes', // Placeholder image URL
  },
  'Environmental Law Program': {
    description: 'Our Environmental Law Program is committed to raising awareness and promoting the understanding of legal frameworks related to environmental protection. Through workshops, seminars, and field visits, we educate participants on key environmental laws, conservation principles, and sustainable practices. This program aims to empower individuals and communities to become stewards of the environment and to advocate for its protection through legal means. We explore topics such as pollution control, biodiversity conservation, and climate change law, fostering a greater appreciation for the legal aspects of environmental sustainability.',
    image: 'https://via.placeholder.com/150/2ecc71/fff?Text=Env+Law', // Placeholder image URL
  },
  'National Conference': {
    description: 'We recently hosted a National Conference in collaboration with CHRIST University, focusing on the empowerment of the unorganized working sector. This conference brought together experts, policymakers, and practitioners to discuss the challenges faced by unorganized workers and to explore potential legal and social solutions. Key themes included labor rights, social security, and policy interventions aimed at improving the livelihoods of this significant segment of the workforce. The outcomes of the conference are being compiled into a report to inform future initiatives and policy recommendations in this crucial area.',
    image: 'https://via.placeholder.com/150/3498db/fff?Text=Conference', // Placeholder image URL
  },
};

function InitiativesList() {
  return (
    <section id="initiatives" className="section bg-light">
      <div className="container">
        <h2 className="section-title">Initiatives & Programs</h2>

        <div className={styles.initiativesGrid}>
          {Object.keys(initiativeDetails).map((title) => (
            <Link
              to={`/initiative/${title.replace(/ /g, '-')}`} // Basic URL structure
              key={title}
              className={styles.initiativeCard}
            >
              {/* <PlaceholderIcon /> Replace with actual Icon component */}
              <h3 className={styles.cardTitle}>{title}</h3>
              <p className={styles.cardText}>{initiativeDetails[title].description.substring(0, 80)}...</p> {/* Shortened description */}
              {/* Based on item from: */}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default InitiativesList;

// ## File: src/components/InitiativeDetails.jsx

import React from 'react';
import { useParams } from 'react-router-dom';
import styles from './InitiativeDetails.module.css'; // Create this CSS module
import { Link } from 'react-router-dom';
import { initiativeDetails } from './InitiativesList'; // Import the data

function InitiativeDetails() {
  const { initiativeName } = useParams();
  const formattedName = initiativeName.replace(/-/g, ' ');
  const details = initiativeDetails[formattedName];

  if (!details) {
    return (
      <div className="container">
        <h2>Initiative Not Found</h2>
        <Link to="/initiatives">Back to Initiatives</Link>
      </div>
    );
  }

  return (
    <section className={`section ${styles.detailsSection}`}>
      <div className="container">
        <div className={styles.detailsCard}>
          <h2 className={styles.detailsTitle}>{formattedName}</h2>
          <img src={details.image} alt={formattedName} className={styles.detailsImage} />
          <p className={styles.detailsDescription}>{details.description}</p>
          <Link to="/initiatives" className={styles.backLink}>Back to Initiatives</Link>
        </div>
      </div>
    </section>
  );
}

export default InitiativeDetails;