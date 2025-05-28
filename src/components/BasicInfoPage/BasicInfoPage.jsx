import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import './BasicInfoPage.css';
// Optimized profile image import
import profileImageFromFile from '../../assets/images/pawan_ss_profile.jpg';
// Import icons from 'react-icons/fa'
import { 
  FaBalanceScale, 
  FaChalkboardTeacher, 
  FaComments, 
  FaQuoteLeft, 
  FaNewspaper, 
  FaVideo, 
  FaLinkedin, 
  FaInstagram, 
  FaYoutube,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaArrowRight,
  FaDownload,
  FaPodcast,
  FaCalendarAlt,
  FaClock
} from 'react-icons/fa';

const BasicInfoPage = ({ onNavigateToExplorer }) => {
  const { scrollYProgress } = useScroll();
  
  // State for contact form
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [formStatus, setFormStatus] = useState({
    message: '',
    type: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Image loading state for optimized image loading
  const [imageLoaded, setImageLoaded] = useState(false);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  // Handle form submission
const handleSubmit = async (e) => {
  // Don't prevent default - let the form submit to Formspree
  // e.preventDefault();
  
  setIsSubmitting(true);
  
  // Validate form
  if (!formData.name || !formData.email || !formData.message) {
    e.preventDefault(); // Prevent submission if validation fails
    setFormStatus({
      message: 'Please fill in all required fields',
      type: 'error'
    });
    setIsSubmitting(false);
    return;
  }
  
  // Form will be submitted to Formspree
  // We'll handle the form reset and UI updates
  setTimeout(() => {
    setFormStatus({
      message: 'Thank you for your message! I will get back to you soon.',
      type: 'success'
    });
    
    // Reset form after successful submission
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
    
    setIsSubmitting(false);
  }, 2000); // Delay to allow form submission to complete
};

  // Animation variants
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
        ease: "easeInOut",
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
        ease: "easeOut"
      }
    },
  };

  // Content data
  const expertiseAreas = [
    {
      icon: <FaBalanceScale />,
      title: "AI Governance & Law",
      description: "Pioneering frameworks for responsible AI development and navigating complex legal landscapes in the digital age. Ensuring ethical considerations are at the forefront of technological advancement.",
      details: [
        "AI Ethics & Bias Mitigation Strategies",
        "Data Privacy & Protection Frameworks",
        "Cybersecurity Law & Digital Compliance",
        "Regulatory Frameworks for Emerging Technologies",
      ],
    },
    {
      icon: <FaChalkboardTeacher />,
      title: "Motivational Speaking & Workshops",
      description: "Inspiring diverse audiences to unlock their potential, embrace innovation, and achieve impactful results through dynamic keynotes and interactive workshops tailored to your organization's needs.",
      details: [
        "Leadership Development & Innovation Programs",
        "Career Advancement & Professional Growth Talks",
        "Corporate Training on Digital Transformation",
        "Public Speaking on Tech Ethics & Society",
      ],
    },
    {
      icon: <FaComments />,
      title: "Interview & Career Consulting",
      description: "Providing strategic guidance, personalized coaching, and proven techniques to help individuals excel in critical interviews and build fulfilling, high-impact careers in competitive industries.",
      details: [
        "Advanced Interview Preparation & Coaching",
        "Professional Brand Development & Positioning",
        "Strategic Salary & Benefits Negotiation",
        "Career Transition & Growth Planning",
      ],
    },
  ];

  const featuredInsights = [
    {
      icon: <FaNewspaper />,
      title: "The Evolving Landscape of AI Regulation: Global Perspectives",
      type: "Research Article",
      link: "#", // Replace with actual links
      image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
      snippet: "An in-depth analysis of emerging AI governance frameworks across major jurisdictions and their implications for businesses, innovators, and society at large.",
      tags: ["AI Law", "Global Policy", "Ethics", "Compliance"],
      readTime: "12 min read",
      date: "May 15, 2023"
    },
    {
      icon: <FaVideo />,
      title: "Mastering the Art of High-Stakes Interviews: Psychology & Strategy",
      type: "Masterclass Video",
      link: "#",
      image: "https://images.unsplash.com/photo-1560439514-4e9645039924?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
      snippet: "Discover advanced psychological techniques and strategic frameworks to excel in career-defining interviews, negotiate effectively, and present your authentic professional narrative.",
      tags: ["Career Growth", "Psychology", "Executive Coaching"],
      readTime: "45 min video",
      date: "April 3, 2023"
    },
    {
      icon: <FaQuoteLeft />,
      title: "Ethical AI in Recruitment: Eliminating Algorithmic Bias",
      type: "Industry Whitepaper",
      link: "#",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
      snippet: "A comprehensive framework for organizations to identify, mitigate, and prevent algorithmic bias in AI-powered recruitment tools, with practical implementation guidelines and case studies.",
      tags: ["AI Ethics", "HR Tech", "DEI", "Talent Acquisition"],
      readTime: "18 min read",
      date: "June 22, 2023"
    },
    {
      icon: <FaPodcast />,
      title: "The Future of Legal Practice in the Age of AI",
      type: "Podcast Interview",
      link: "#",
      image: "https://images.unsplash.com/photo-1589903308904-1010c2294adc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
      snippet: "Exploring how artificial intelligence is transforming legal services, from contract analysis to predictive justice, and what it means for the future of legal professionals.",
      tags: ["Legal Tech", "AI Innovation", "Future of Law"],
      readTime: "32 min listen",
      date: "March 10, 2023"
    }
  ];
  return (
    <motion.div
      className="basic-info-scroll-container"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {/* Section 1: Hero Introduction */}
      <section className="hero-section-minimal">
        <div className="hero-content-split">
          <motion.div 
            className="hero-text-content" 
            initial={{opacity:0, x: -50}} 
            animate={{opacity:1, x:0}} 
            transition={{duration:0.8, delay:0.2}}
          >
            <h2 className="hero-greeting">Hey, I am</h2>
            <h1 className="hero-main-name">Pawan SS</h1>
            <p className="hero-core-roles">
              Interview Consultant | Founder of AICyberLex.Nexus and Art of Law
            </p>
            <p className="hero-secondary-roles">
              Pioneering the Intersection of AI Ethics, Legal Innovation, and Human Potential
            </p>
            <p className="hero-brief-intro">
              Dedicated to shaping a future where technology and humanity thrive together through ethical innovation, legal expertise, and impactful leadership in the digital age.
            </p>
            
            {/* Call-to-Action Buttons */}
            <div className="hero-cta-buttons">
              <motion.a 
                href="#contact-section" 
                className="cta-button primary-cta"
                whileHover={{ scale: 1.05, boxShadow: "0px 5px 15px rgba(var(--gold-accent-rgb), 0.4)" }}
                whileTap={{ scale: 0.95 }}
              >
                Get in Touch <FaArrowRight style={{ marginLeft: '8px' }} />
              </motion.a>
              <motion.a 
                href="#" 
                className="cta-button secondary-cta"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Download CV <FaDownload style={{ marginLeft: '8px' }} />
              </motion.a>
            </div>
            
            <div className="hero-social-icons">
              <motion.a 
                href="https://www.linkedin.com/in/pawanss?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="LinkedIn" 
                whileHover={{y:-2, color: "var(--gold-accent)"}}
              >
                <FaLinkedin />
              </motion.a>
              <motion.a 
                href="https://www.instagram.com/pawan.ss/" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="Instagram" 
                whileHover={{y:-2, color: "var(--gold-accent)"}}
              >
                <FaInstagram />
              </motion.a>
              <motion.a 
                href="http://www.youtube.com/@pawanss" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="YouTube" 
                whileHover={{y:-2, color: "var(--gold-accent)"}}
              >
                <FaYoutube />
              </motion.a>
            </div>
            <motion.a 
              href="#expertise-section" 
              className="scroll-prompt" 
              initial={{opacity:0}} 
              animate={{opacity:1}} 
              transition={{delay:1.2, duration:0.5}}
            >
              Discover My Focus Areas <span className="arrow-down">&darr;</span>
            </motion.a>
          </motion.div>

          <motion.div 
            className="hero-image-container" 
            initial={{opacity:0, scale:0.8}} 
            animate={{opacity:1, scale:1}} 
            transition={{duration:0.8, delay:0.4}}
          >
            {/* Optimized Profile Image with loading state */}
            <div className="hero-image-placeholder">
              {!imageLoaded && <div className="image-loading-placeholder"></div>}
              <img 
                src={profileImageFromFile} 
                alt="Pawan SS" 
                className={`hero-profile-img ${imageLoaded ? 'loaded' : ''}`}
                onLoad={() => setImageLoaded(true)}
                loading="eager"
                width="400"
                height="400"
              />
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
        viewport={{ once: true, amount: 0.1 }}
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
  viewport={{ once: true, amount: 0.1 }}
>
  <h2 className="section-title">Featured Insights</h2>
  <p className="insights-subtitle">Explore my latest thoughts on technology, law, and professional development</p>
  
  <div className="insights-cards-container">
    {featuredInsights.map((insight, index) => (
      <motion.a 
        href={insight.link} 
        target="_blank" 
        rel="noopener noreferrer" 
        key={index} 
        className="insight-card-link-wrapper" 
        variants={cardVariants}
        whileHover={{ 
          scale: 1.03, 
          y: -10,
          transition: { duration: 0.3 }
        }}
      >
        <div className="insight-card">
          <div className="insight-card-image-container">
            <img 
              src={insight.image} 
              alt={insight.title} 
              className="insight-image-actual" 
              loading="lazy"
              width="600"
              height="400"
            />
            <span className="insight-card-icon">{insight.icon}</span>
            <div className="insight-card-overlay">
              <span className="insight-view-more">Read More</span>
            </div>
          </div>
          <div className="insight-card-content">
            <div className="insight-meta">
              <span className="insight-type">{insight.type}</span>
              <div className="insight-details">
                <span className="insight-date"><FaCalendarAlt /> {insight.date}</span>
                <span className="insight-read-time"><FaClock /> {insight.readTime}</span>
              </div>
            </div>
            <h4>{insight.title}</h4>
            <p className="insight-snippet">{insight.snippet}</p>
            <div className="insight-tags">
              {insight.tags && insight.tags.map(tag => 
                <span key={tag} className="tag">{tag}</span>
              )}
            </div>
            <span className="insight-link">Continue Reading &rarr;</span>
          </div>
        </div>
      </motion.a>
    ))}
  </div>
  
  <motion.div 
    className="insights-cta"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.5, duration: 0.5 }}
    viewport={{ once: true }}
  >
    <p>Looking for more content on specific topics?</p>
    <motion.a 
      href="#" 
      className="cta-button secondary-cta"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      View All Insights
    </motion.a>
  </motion.div>
</motion.section>

      {/* Section 4: Contact Form */}
      <motion.section
        id="contact-section"
        className="contact-section"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        <h2 className="section-title">Get in Touch</h2>
        <div className="contact-container">
          <div className="contact-info">
            <h3>Let's Connect</h3>
            <p>
              Whether you're interested in my consulting services, need a speaker for your event, or want to discuss potential collaborations, I'd love to hear from you.
            </p>
            <div className="contact-details">
              <div className="contact-detail-item">
                <span className="contact-icon"><FaEnvelope /></span>
                <span>contact@pawanss.com</span>
              </div>
              <div className="contact-detail-item">
                <span className="contact-icon"><FaPhone /></span>
                <span>+91 98765 43210</span>
              </div>
              <div className="contact-detail-item">
                <span className="contact-icon"><FaMapMarkerAlt /></span>
                <span>Bangalore, India</span>
              </div>
            </div>
          </div>
          
          <div className="contact-form-container">
  <form 
    className="contact-form" 
    action="https://formspree.io/f/mldbyjlb"
    method="POST"
    onSubmit={handleSubmit}
  >
    <div className="form-group">
      <label htmlFor="name">Name *</label>
      <input
        type="text"
        id="name"
        name="name"
        value={formData.name}
        onChange={handleInputChange}
        required
      />
    </div>
    
    <div className="form-group">
      <label htmlFor="email">Email *</label>
      <input
        type="email"
        id="email"
        name="email"
        value={formData.email}
        onChange={handleInputChange}
        required
      />
    </div>
    
    <div className="form-group">
      <label htmlFor="subject">Subject</label>
      <input
        type="text"
        id="subject"
        name="subject"
        value={formData.subject}
        onChange={handleInputChange}
      />
    </div>
    
    <div className="form-group">
      <label htmlFor="message">Message *</label>
      <textarea
        id="message"
        name="message"
        rows="5"
        value={formData.message}
        onChange={handleInputChange}
        required
      ></textarea>
    </div>
    
    <button 
      type="submit" 
      className="submit-button" 
      disabled={isSubmitting}
    >
      {isSubmitting ? 'Sending...' : 'Send Message'}
    </button>
    
    {formStatus.message && (
      <div className={`form-status ${formStatus.type}`}>
        {formStatus.message}
      </div>
    )}
  </form>
</div>
        </div>
      </motion.section>

      {/* Section 5: Continuum Invitation */}
      <motion.section
        className="continuum-invitation-section"
        variants={sectionVariants} 
        initial="hidden" 
        whileInView="visible" 
        viewport={{ once: true, amount: 0.2 }}
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