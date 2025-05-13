import React, { useEffect, useState } from 'react';
import styles from './Hero.module.css'; // Import the CSS Module

// Award card data for background animation
const awardData = [
  {
    id: 1,
    title: 'Millennium Ocean Prize',
    icon: '🌊',
  },
  {
    id: 2,
    title: 'Project Njaayam - UNAI',
    icon: '🌍',
  },
  {
    id: 3,
    title: 'Student of the Year',
    icon: '🏆',
  },
  {
    id: 4,
    title: 'Coordination Excellence',
    icon: '🤝',
  },
  {
    id: 5,
    title: 'Baazigar Award',
    icon: '⭐',
  },
];

// Case type options for the registration form
const caseTypes = [
  {
    category: "Criminal Law",
    subcases: [
      "Theft / Robbery / Burglary",
      "Murder / Attempt to Murder",
      "Assault / Bodily Harm",
      "Sexual Offenses",
      "Cyber Crime",
      "Drug-Related Offenses",
      "Domestic Violence",
      "Bail Matters",
      "White Collar Crimes"
    ]
  },
  {
    category: "Civil & Property Disputes",
    subcases: [
      "Property Ownership Disputes",
      "Landlord-Tenant Issues",
      "Contract Breach",
      "Personal Injury / Tort Claims",
      "Motor Accident Claims (MACT)",
      "Consumer Complaints",
      "Real Estate Disputes",
      "Injunction Applications"
    ]
  },
  {
    category: "Family & Matrimonial Law",
    subcases: [
      "Divorce Proceedings",
      "Child Custody & Visitation Rights",
      "Alimony / Maintenance Claims",
      "Domestic Violence (in family context)",
      "Adoption & Guardianship",
      "Property Division in Family"
    ]
  },
  {
    category: "Corporate & Commercial Law",
    subcases: [
      "Company Registration / Compliance",
      "Business Contract Drafting / Review",
      "Partnership Disputes",
      "Employment Contracts",
      "Commercial Litigation",
      "Arbitration / Mediation",
      "Intellectual Property (IP)"
    ]
  },
  {
    category: "Labour & Employment Law",
    subcases: [
      "Wrongful Termination",
      "Wage / Salary Disputes",
      "Workplace Harassment",
      "Employment Agreement Disputes",
      "Labour Union Issues",
      "Provident Fund / Gratuity Issues"
    ]
  },
  {
    category: "Specialized & Regulatory Law",
    subcases: [
      "Taxation (Income Tax, GST, etc.)",
      "Environmental Law",
      "Service Law",
      "Constitutional Law / PIL / Writ Petitions",
      "Banking & Finance Law",
      "Education Law"
    ]
  }
];

function Hero() {
  const [cards, setCards] = useState([]);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [formType, setFormType] = useState('login'); // 'login' or 'register'
  const [selectedCategory, setSelectedCategory] = useState('');

  // Generate cards with specific positions on a circular path
  useEffect(() => {
    const generateCards = () => {
      const newCards = [];
      const totalCards = 15; // Total number of cards
      
      // Create cards positioned in a circular path
      for (let i = 0; i < totalCards; i++) {
        const randomAward = awardData[i % awardData.length];
        
        // Calculate position on a circular path
        // Each card is positioned at a specific angle on the circle
        const angle = (i / totalCards) * 360;
        const delay = (i / totalCards) * 30; // Staggered delay for smooth animation
        
        // Different sizes for visual interest
        const scale = 0.7 + (i % 3) * 0.2;
        
        newCards.push({
          ...randomAward,
          uniqueId: `${randomAward.id}-${i}`,
          style: {
            animationDelay: `${delay}s`,
            transform: `scale(${scale})`,
            opacity: 0.6 + (i % 3) * 0.1, // Varying opacity
          },
          angle: angle, // Store the angle for the animation
        });
      }
      
      setCards(newCards);
    };
    
    generateCards();

    // Close form when clicking outside
    const handleClickOutside = (e) => {
      if (showLoginForm && e.target.classList.contains(styles.modalOverlay)) {
        setShowLoginForm(false);
      }
    };

    // Close form when pressing Escape key
    const handleEscKey = (e) => {
      if (showLoginForm && e.key === 'Escape') {
        setShowLoginForm(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    document.addEventListener('keydown', handleEscKey);

    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [showLoginForm]);

  const toggleForm = (type) => {
    setFormType(type);
    setShowLoginForm(true);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  return (
    <section id="hero" className={styles.heroSection}>
      {/* Background animated award cards */}
      <div className={styles.cardsBackground}>
        <div className={styles.circularPath}>
          {cards.map((card) => (
            <div 
              key={card.uniqueId} 
              className={styles.backgroundCard}
              style={{
                ...card.style,
                '--card-angle': `${card.angle}deg`,
              }}
            >
              <div className={styles.cardIcon}>{card.icon}</div>
              <div className={styles.cardTitle}>{card.title}</div>
            </div>
          ))}
        </div>
      </div>
      
      <div className={styles.heroContent}>
        <div className={styles.heroContainer}>
          <h1 className={styles.heroTitle}>Art of Law</h1>
          <p className={styles.heroSubtitle}>
            Fostering legal awareness and empowering communities through practical education and social impact initiatives.
          </p>
          <div className={styles.heroActions}>
            <a href="#initiatives" className={`btn btn-primary ${styles.heroBtn}`}>Explore Initiatives</a>
            <a href="#contact" className={`btn btn-outline ${styles.heroBtn}`}>Contact Us</a>
            <button 
              onClick={() => toggleForm('login')} 
              className={`btn btn-accent ${styles.heroBtn} ${styles.loginBtn}`}
            >
              Login / Register
            </button>
          </div>
        </div>
      </div>

      {/* Login/Registration Modal */}
      {showLoginForm && (
        <div className={styles.modalOverlay}>
          <div className={styles.formModal}>
            <button className={styles.closeBtn} onClick={() => setShowLoginForm(false)}>
              &times;
            </button>
            
            <div className={styles.formTabs}>
              <button 
                className={`${styles.tabBtn} ${formType === 'login' ? styles.activeTab : ''}`}
                onClick={() => setFormType('login')}
              >
                Login
              </button>
              <button 
                className={`${styles.tabBtn} ${formType === 'register' ? styles.activeTab : ''}`}
                onClick={() => setFormType('register')}
              >
                Register
              </button>
            </div>

            {formType === 'login' ? (
              <form className={styles.loginForm}>
                <h3>Login to Your Account</h3>
                
                <div className={styles.formGroup}>
                  <label htmlFor="email">Email Address</label>
                  <input type="email" id="email" required />
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="password">Password</label>
                  <input type="password" id="password" required />
                </div>
                
                <div className={styles.formActions}>
                  <button type="submit" className={styles.submitBtn}>Login</button>
                  <a href="#" className={styles.forgotPassword}>Forgot Password?</a>
                </div>
              </form>
            ) : (
              <form className={styles.registrationForm}>
                <h3>Create New Account</h3>
                
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="firstName">First Name</label>
                    <input type="text" id="firstName" required />
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label htmlFor="lastName">Last Name</label>
                    <input type="text" id="lastName" required />
                  </div>
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="regEmail">Email Address</label>
                  <input type="email" id="regEmail" required />
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="phone">Phone Number</label>
                  <input type="tel" id="phone" required />
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="altPhone">Alternate Contact Number (Optional)</label>
                  <input type="tel" id="altPhone" />
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="street">Street Address</label>
                  <input type="text" id="street" required />
                </div>
                
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="city">City</label>
                    <input type="text" id="city" required />
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label htmlFor="state">State / Province</label>
                    <input type="text" id="state" required />
                  </div>
                </div>
                
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="zip">ZIP / Postal Code</label>
                    <input type="text" id="zip" required />
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label htmlFor="country">Country</label>
                    <input type="text" id="country" required />
                  </div>
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="dob">Date of Birth</label>
                  <input type="date" id="dob" />
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="gender">Gender (Optional)</label>
                  <select id="gender">
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer-not">Prefer not to say</option>
                  </select>
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="occupation">Occupation / Profession</label>
                  <input type="text" id="occupation" />
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="govtId">National ID / Government ID Number (Optional)</label>
                  <input type="text" id="govtId" />
                </div>
                
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="regPassword">Password</label>
                    <input type="password" id="regPassword" required />
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input type="password" id="confirmPassword" required />
                  </div>
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="caseCategory">Case Type / Area of Interest</label>
                  <select id="caseCategory" onChange={handleCategoryChange}>
                    <option value="">Select Case Category</option>
                    {caseTypes.map((type, index) => (
                      <option key={index} value={type.category}>
                        {type.category}
                      </option>
                    ))}
                  </select>
                </div>
                
                {selectedCategory && (
                  <div className={styles.formGroup}>
                    <label htmlFor="subcase">Specific Case Type</label>
                    <select id="subcase">
                      <option value="">Select Specific Case Type</option>
                      {caseTypes
                        .find(type => type.category === selectedCategory)
                        ?.subcases.map((subcase, index) => (
                          <option key={index} value={subcase}>
                            {subcase}
                          </option>
                        ))
                      }
                    </select>
                  </div>
                )}
                
                <div className={styles.formGroup}>
                  <label htmlFor="referral">How Did You Hear About Us?</label>
                  <select id="referral">
                    <option value="">Select Option</option>
                    <option value="search">Search Engine</option>
                    <option value="social">Social Media</option>
                    <option value="friend">Friend/Family</option>
                    <option value="advertisement">Advertisement</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div className={styles.formGroup}>
                  <div className={styles.checkboxGroup}>
                    <input type="checkbox" id="terms" required />
                    <label htmlFor="terms">I agree to the Terms and Conditions</label>
                  </div>
                </div>
                
                <button type="submit" className={styles.submitBtn}>Create Account</button>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

export default Hero;