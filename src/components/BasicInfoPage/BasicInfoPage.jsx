import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import './BasicInfoPage.css';
// Assuming you have a profile image or will use the placeholder
import profileImageFromFile from '../../assets/images/pawan_ss_profile.jpg';
// Then use: <img src={profileImageFromFile} ... />
// Import icons from 'react-icons/fa' - this is a common submodule for Font Awesome icons
import { FaBalanceScale, FaChalkboardTeacher, FaComments, FaQuoteLeft, FaNewspaper, FaVideo, FaLinkedin, FaInstagram, FaYoutube } from 'react-icons/fa';

const BasicInfoPage = ({ onNavigateToExplorer }) => {
  const { scrollYProgress } = useScroll();
  // const yValue = useTransform(scrollYProgress, [0, 1], ['0%', '5%']); // Example parallax

  const pageVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.5, ease: "easeInOut" } },
    exit: { opacity: 0, transition: { duration: 0.3, ease: "easeInOut" } },
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeInOut", // CORRECTED EASING
        staggerChildren: 0.1
      }
    },
  };

   const cardVariants = {
    hidden: { opacity: 0, y: 30, scale:0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale:1,
      transition: {
        duration: 0.5,
        ease: "easeOut" // Standard valid easing
      }
    },
  };

  const expertiseAreas = [
    {
      icon: <FaBalanceScale />,
      title: "AI Governance & Law",
      description: "Pioneering frameworks for responsible AI development and navigating complex legal landscapes in the digital age. Ensuring ethical considerations are at the forefront of technological advancement.",
      details: [
        "AI Ethics & Bias Mitigation Strategies",
        "Data Privacy & Protection (GDPR, CCPA)",
        "Cybersecurity Law & Incident Response",
        "Regulatory Compliance for AI Systems",
      ],
    },
    {
      icon: <FaChalkboardTeacher />,
      title: "Motivational Speaking & Workshops",
      description: "Inspiring diverse audiences to unlock their potential, embrace innovation, and achieve impactful results through dynamic keynotes and interactive workshops.",
      details: [
        "Leadership Development Programs",
        "Student Success & Career Guidance Talks",
        "Corporate Training on Innovation & Resilience",
        "Public Speaking on Tech & Society",
      ],
    },
    {
      icon: <FaComments />,
      title: "Interview & Career Consulting",
      description: "Providing strategic guidance, personalized coaching, and proven techniques to help individuals excel in critical interviews and build fulfilling, high-impact careers.",
      details: [
        "Mock Interview Sessions & Feedback",
        "Resume & Profile Optimization",
        "Salary Negotiation Strategies",
        "Career Transition Planning",
      ],
    },
  ];

  const featuredInsights = [
    {
      icon: <FaNewspaper />,
      title: "The Evolving Landscape of AI Regulation",
      type: "Article",
      link: "#", // Replace with actual links
      image: "https://images.unsplash.com/photo-1516199940391-7c510b01173c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
      snippet: "A deep dive into the latest global trends in AI governance and what businesses need to know to stay compliant and ethical.",
      tags: ["AI Law", "Regulation", "Ethics"]
    },
    {
      icon: <FaVideo />,
      title: "Unlocking Your Potential: A Guide to Effective Goal Setting",
      type: "Video Talk",
      link: "#",
      image: "https://images.unsplash.com/photo-1543269865-cbf427effbad?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
      snippet: "This talk explores actionable strategies for setting meaningful goals and developing the mindset required to achieve them.",
      tags: ["Motivation", "Personal Development", "Success"]
    },
    {
      icon: <FaQuoteLeft />,
      title: "Navigating Bias in AI Recruitment Tools",
      type: "Whitepaper Snippet",
      link: "#",
      image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
      snippet: "An examination of how algorithmic bias can manifest in hiring processes and practical steps for organizations to ensure fairness.",
      tags: ["AI Ethics", "HR Tech", "Bias"]
    },
  ];

  return (
    <motion.div
      className="basic-info-scroll-container" // This div will now allow its content to define its height
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {/* Section 1: Hero Introduction */}
      <section className="hero-section-minimal">
        <div className="hero-content-split">
          <motion.div className="hero-text-content" initial={{opacity:0, x: -50}} animate={{opacity:1, x:0}} transition={{duration:0.8, delay:0.2}}>
            <h2 className="hero-greeting">Hey, I am</h2>
            <h1 className="hero-main-name">Pawan SS</h1>
            <p className="hero-core-roles">
              Founder of AICyberLex.Nexus &bull; Interview Consultant
            </p>
            <p className="hero-brief-intro">
              Dedicated to shaping a future where technology and humanity thrive together through ethical innovation and impactful leadership.
            </p>
            <div className="hero-social-icons">
              <motion.a href="https://www.linkedin.com/in/pawanss?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" whileHover={{y:-2, color: "var(--gold-accent)"}}><FaLinkedin /></motion.a>
              <motion.a href="https://www.youtube.com/redirect?event=channel_description&redir_token=QUFFLUhqazhpNngxaHAzVVNheXhpVVNoR2lQY1JycS1QUXxBQ3Jtc0tuTGFrckFpMTRoVGhrUldVbVE4bnBXVGFaRGZHYkRSQUYyNm5CVTJPV25XSFpIeXpKUzZuY3NpU09Kdnhxd2dJQy1MM2w0UmhJS09QVXFnT3hNUFJyTWNUdnNoaUlEUnMwSzlfeVpWektmaUN2SVNlWQ&q=https%3A%2F%2Fwww.instagram.com%2Fpawan.ss%2F" target="_blank" rel="noopener noreferrer" aria-label="Instagram" whileHover={{y:-2, color: "var(--gold-accent)"}}><FaInstagram /></motion.a>
              <motion.a href="http://www.youtube.com/@pawanss" target="_blank" rel="noopener noreferrer" aria-label="YouTube" whileHover={{y:-2, color: "var(--gold-accent)"}}><FaYoutube /></motion.a>
            </div>
             <motion.a href="#expertise-section" className="scroll-prompt" initial={{opacity:0}} animate={{opacity:1}} transition={{delay:1.2, duration:0.5}}>
              Discover My Focus Areas <span className="arrow-down">&darr;</span>
            </motion.a>
          </motion.div>
          <motion.div className="hero-image-container" initial={{opacity:0, scale:0.8}} animate={{opacity:1, scale:1}} transition={{duration:0.8, delay:0.4}}>
            {/* <img src={profileImage} alt="Pawan SS" className="hero-profile-img" /> */}
            <div className="hero-image-placeholder">
               <img src={profileImageFromFile} alt="Pawan SS" className="hero-profile-img" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Section 2: Areas of Expertise */}
      <motion.section
        id="expertise-section"
        className="content-section expertise-highlight-section"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }} // Adjusted amount
      >
        <h2 className="section-title">My Core Pillars</h2>
        <div className="expertise-cards-container">
          {expertiseAreas.map((area, index) => (
            <motion.div key={index} className="expertise-card" variants={cardVariants}>
              <div className="expertise-card-header">
                <span className="expertise-icon">{area.icon}</span>
                <h3>{area.title}</h3>
              </div>
              <p className="expertise-description">{area.description}</p>
              {area.details && area.details.length > 0 && (
                <ul className="expertise-details-list">
                  {area.details.map((detail, i) => (
                    <li key={i}>{detail}</li>
                  ))}
                </ul>
              )}
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Section 3: Featured Insights */}
      <motion.section
        className="content-section insights-section"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }} // Adjusted amount
      >
          <h2 className="section-title">Featured Insights</h2>
          <div className="insights-cards-container">
              {featuredInsights.map((insight, index) => (
                  <motion.a href={insight.link} target="_blank" rel="noopener noreferrer" key={index} className="insight-card-link-wrapper" variants={cardVariants}>
                    <div className="insight-card">
                        <div className="insight-card-image-container">
                          <img src={insight.image} alt={insight.title} className="insight-image-actual" />
                          <span className="insight-card-icon">{insight.icon}</span>
                        </div>
                        <div className="insight-card-content">
                            <span className="insight-type">{insight.type}</span>
                            <h4>{insight.title}</h4>
                            <p className="insight-snippet">{insight.snippet}</p>
                            <div className="insight-tags">
                              {insight.tags && insight.tags.map(tag => <span key={tag} className="tag">{tag}</span>)}
                            </div>
                            <span className="insight-link">Read More &rarr;</span>
                        </div>
                    </div>
                  </motion.a>
              ))}
          </div>
      </motion.section>

      {/* Section 4: Continuum Invitation */}
      <motion.section
        className="continuum-invitation-section"
        variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} // This can be a bit higher as it's shorter
      >
        <p className="continuum-narrative">
          The story doesn't end here. My work is a dynamic tapestry of interconnected ideas, projects, and aspirations.
        </p>
        <h2 className="continuum-invite-title">Ready to see the bigger picture?</h2>
        <motion.button
          className="launch-continuum-button"
          onClick={onNavigateToExplorer}
          whileHover={{ scale: 1.03, boxShadow: "0px 5px 20px rgba(var(--gold-accent-rgb), 0.4)" }}
          whileTap={{ scale: 0.97 }}
        >
          Explore the Continuum Experiment
        </motion.button>
      </motion.section>

      <footer className="minimal-page-footer">
        <p>&copy; {new Date().getFullYear()} Pawan SS. All ideas interconnected.</p>
      </footer>
    </motion.div>
  );
};

export default BasicInfoPage;