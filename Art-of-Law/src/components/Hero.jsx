// src/components/Hero.jsx
import React, { useEffect, useState, useCallback } from 'react';
import styles from './Hero.module.css'; //
import BrandLogo from '/images/Logo.png'; // Ensure path is correct from public folder
import { useAuth } from '../AuthContext.jsx'; // Path to your AuthContext

// Thematic award card data
const awardData = [
  { id: 1, title: 'Justice', icon: '⚖️' },
  { id: 2, title: 'Knowledge', icon: '📚' },
  { id: 3, title: 'Insight', icon: '💡' },
];

// Case types (as provided by you)
const caseTypes = [
    { category: "Criminal Law", subcases: ["Theft / Robbery / Burglary", "Murder / Attempt to Murder", "Assault / Bodily Harm", "Sexual Offenses", "Cyber Crime", "Drug-Related Offenses", "Domestic Violence", "Bail Matters", "White Collar Crimes"] },
    { category: "Civil & Property Disputes", subcases: ["Property Ownership Disputes", "Landlord-Tenant Issues", "Contract Breach", "Personal Injury / Tort Claims", "Motor Accident Claims (MACT)", "Consumer Complaints", "Real Estate Disputes", "Injunction Applications"] },
    { category: "Family & Matrimonial Law", subcases: ["Divorce Proceedings", "Child Custody & Visitation Rights", "Alimony / Maintenance Claims", "Domestic Violence (in family context)", "Adoption & Guardianship", "Property Division in Family"] },
    { category: "Corporate & Commercial Law", subcases: ["Company Registration / Compliance", "Business Contract Drafting / Review", "Partnership Disputes", "Employment Contracts", "Commercial Litigation", "Arbitration / Mediation", "Intellectual Property (IP)"] },
    { category: "Labour & Employment Law", subcases: ["Wrongful Termination", "Wage / Salary Disputes", "Workplace Harassment", "Employment Agreement Disputes", "Labour Union Issues", "Provident Fund / Gratuity Issues"] },
    { category: "Specialized & Regulatory Law", subcases: ["Taxation (Income Tax, GST, etc.)", "Environmental Law", "Service Law", "Constitutional Law / PIL / Writ Petitions", "Banking & Finance Law", "Education Law"] }
];


function Hero({ showLoginForm, formType, setShowLoginForm, setFormType }) {
  const [cards, setCards] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const { login } = useAuth(); // Get the login function from context

  useEffect(() => {
    const generateCards = () => {
      const newCards = [];
      const totalCards = 3;
      for (let i = 0; i < totalCards; i++) {
        const randomAward = awardData[i % awardData.length];
        const angle = (i / totalCards) * 360 + Math.random() * 40 - 20;
        const distance = 55 + Math.random() * 10;
        const delay = Math.random() * 5;
        const scale = 0.6 + Math.random() * 0.1;
        newCards.push({
          ...randomAward, uniqueId: `${randomAward.id}-${i}`,
          style: {
            animationDelay: `${delay}s`,
            '--scale': scale,
            '--opacity': 0.7 + Math.random() * 0.2,
            '--angle': `${angle}deg`,
            '--distance': `${distance}vw`,
          },
        });
      }
      setCards(newCards);
    };
    generateCards();
  }, []);

  const handleCloseModal = useCallback(() => {
    setShowLoginForm(false);
    setError('');
    setSuccessMessage('');
    // Consider adding form reset logic here if inputs don't clear automatically
  }, [setShowLoginForm]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (showLoginForm && e.target.classList.contains(styles.modalOverlay)) {
        handleCloseModal();
      }
    };
    const handleEscKey = (e) => {
      if (showLoginForm && e.key === 'Escape') {
        handleCloseModal();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscKey);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [showLoginForm, handleCloseModal]);

  // This function is still useful if Navbar directly triggers the modal via App -> Hero props
  const internalToggleFormDisplay = (type) => {
    setFormType(type);
    setShowLoginForm(true);
    setError('');
    setSuccessMessage('');
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    if (formType === 'register' && data.regPassword !== data.confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    let payload = {};
    if (formType === 'login') {
      payload = { email: data.loginEmail, password: data.loginPassword };
    } else { // register
      payload = {
        firstName: data.firstName, lastName: data.lastName, email: data.regEmail,
        phone: data.phone, altPhone: data.altPhone || undefined, // Send undefined if empty for optional fields
        street: data.street, city: data.city, state: data.state, zip: data.zip,
        country: data.country || 'India', dob: data.dob || null,
        gender: data.gender || undefined, occupation: data.occupation || undefined, 
        govtId: data.govtId || undefined,
        password: data.regPassword, 
        // confirmPassword is only for frontend check, not usually sent if backend doesn't need it explicitly
        // However, your authController.registerUser expects it, so we send it.
        confirmPassword: data.confirmPassword 
      };
    }

    const endpoint = formType === 'login' ? '/api/auth/login' : '/api/auth/register';
    const backendUrl = 'https://art-of-law.onrender.com'; // Ensure this is your backend URL

    try {
      const response = await fetch(`${backendUrl}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await response.json(); // Always try to parse JSON

      if (response.ok && result.status === 'success') {
        // Use the login function from AuthContext to update global state and localStorage
        login(result.data.user, result.token);

        setSuccessMessage(formType === 'login' ? 'Login successful! Closing modal...' : 'Registration successful! Closing modal...');
        setTimeout(() => {
          handleCloseModal();
          // Optional: navigate to a dashboard page after successful login/registration
          // const navigate = useNavigate(); // Would need to import this
          // navigate(formType === 'login' ? '/my-bookings' : '/');
        }, 1500); // Shorter delay
      } else {
        setError(result.message || `An error occurred during ${formType}.`);
      }
    } catch (err) {
      console.error(`Error during ${formType}:`, err);
      // Check if err.message already exists, otherwise provide a generic one
      setError(err.message || `Network error or server is not responding. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="hero" className={styles.heroSection}>
      {/* Background Cards */}
      <div className={styles.cardsBackground}>
        {cards.map((card) => (
          <div key={card.uniqueId} className={styles.backgroundCard} style={card.style}>
            <div className={styles.cardIcon}>{card.icon}</div>
          </div>
        ))}
      </div>

      {/* Hero Content */}
      <div className={styles.heroContentGrid}>
        <div className={styles.heroTextPane}>
          <h1 className={styles.heroTitle}>Art of Law</h1>
          <p className={styles.heroIntroText}>
            Welcome to Art of Law. We are a legal initiative committed to spreading legal awareness, promoting access to justice, and integrating law with real-world impact. Founded by passionate legal professionals, our mission is to empower individuals with practical legal education and advocacy tools to create a just and informed society.
          </p>
          <p className={styles.heroSubtitle}>
            Illuminating Justice. Empowering Minds.
          </p>
          <div className={styles.heroActions}>
            <a href="/#initiatives" className={`btn btn-primary ${styles.heroBtn}`}>Explore Initiatives</a>
            <a href="/#contact" className={`btn btn-outline ${styles.heroBtn}`}>Contact Us</a>
            {/* This button in Hero can still trigger the modal directly if needed, 
                Navbar also triggers it via onToggleLoginModal prop passed through App */}
            <button
              onClick={() => internalToggleFormDisplay('login')}
              className={`btn btn-accent ${styles.heroBtn} ${styles.loginBtn}`}
            >
              Login / Register
            </button>
          </div>
        </div>
        <div className={styles.heroDivider}></div>
        <div className={styles.heroLogoPane}>
          <img src={BrandLogo} alt="Art of Law - P/K Logo with Tagline" className={styles.heroBrandLogo} />
        </div>
      </div>

      {/* Login/Registration Modal */}
      {showLoginForm && (
         <div className={styles.modalOverlay} onClick={(e) => { if(e.target === e.currentTarget) handleCloseModal(); /* Close on overlay click */}}>
           <div className={styles.formModal}>
             <button className={styles.closeBtn} onClick={handleCloseModal} aria-label="Close modal">&times;</button>
             <div className={styles.formTabs}>
               <button 
                 className={`${styles.tabBtn} ${formType === 'login' ? styles.activeTab : ''}`} 
                 onClick={() => { setFormType('login'); setError(''); setSuccessMessage(''); }}
               >
                 Login
               </button>
               <button 
                 className={`${styles.tabBtn} ${formType === 'register' ? styles.activeTab : ''}`} 
                 onClick={() => { setFormType('register'); setError(''); setSuccessMessage(''); }}
               >
                 Register
               </button>
             </div>

             {error && <p style={{color: 'red', textAlign: 'center', marginBottom: '1rem'}}>{error}</p>}
             {successMessage && <p style={{color: 'green', textAlign: 'center', marginBottom: '1rem'}}>{successMessage}</p>}

             {formType === 'login' ? (
                <form className={styles.loginForm} onSubmit={handleFormSubmit} noValidate>
                    <h3>Login to Your Account</h3>
                    <div className={styles.formGroup}>
                        <label htmlFor="loginEmail">Email Address</label>
                        <input type="email" id="loginEmail" name="loginEmail" required autoComplete="email" />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="loginPassword">Password</label>
                        <input type="password" id="loginPassword" name="loginPassword" required autoComplete="current-password" />
                    </div>
                    <div className={styles.formActions}>
                        <button type="submit" className={styles.submitBtn} disabled={loading}>
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                        <a href="#" className={styles.forgotPassword} onClick={(e) => {e.preventDefault(); alert('Forgot password functionality to be implemented.');}}>
                            Forgot Password?
                        </a>
                    </div>
                </form>
             ) : ( // Registration Form
                <form className={styles.registrationForm} onSubmit={handleFormSubmit} noValidate>
                    <h3>Create New Account</h3>
                    <div className={styles.formRow}>
                        <div className={styles.formGroup}><label htmlFor="firstName">First Name</label><input type="text" id="firstName" name="firstName" required autoComplete="given-name"/></div>
                        <div className={styles.formGroup}><label htmlFor="lastName">Last Name</label><input type="text" id="lastName" name="lastName" required autoComplete="family-name"/></div>
                    </div>
                    <div className={styles.formGroup}><label htmlFor="regEmail">Email Address</label><input type="email" id="regEmail" name="regEmail" required autoComplete="email"/></div>
                    <div className={styles.formGroup}><label htmlFor="phone">Phone Number</label><input type="tel" id="phone" name="phone" required autoComplete="tel"/></div>
                    <div className={styles.formGroup}><label htmlFor="altPhone">Alternate Contact (Optional)</label><input type="tel" id="altPhone" name="altPhone" autoComplete="tel-national"/></div>
                    <div className={styles.formGroup}><label htmlFor="street">Street Address</label><input type="text" id="street" name="street" required autoComplete="street-address"/></div>
                    <div className={styles.formRow}>
                        <div className={styles.formGroup}><label htmlFor="city">City</label><input type="text" id="city" name="city" required autoComplete="address-level2"/></div>
                        <div className={styles.formGroup}><label htmlFor="state">State / Province</label><input type="text" id="state" name="state" required autoComplete="address-level1"/></div>
                    </div>
                    <div className={styles.formRow}>
                        <div className={styles.formGroup}><label htmlFor="zip">ZIP / Postal Code</label><input type="text" id="zip" name="zip" required autoComplete="postal-code"/></div>
                        <div className={styles.formGroup}><label htmlFor="country">Country</label><input type="text" id="country" name="country" defaultValue="India" required autoComplete="country-name"/></div>
                    </div>
                    <div className={styles.formGroup}><label htmlFor="dob">Date of Birth (Optional)</label><input type="date" id="dob" name="dob" autoComplete="bday"/></div>
                    <div className={styles.formGroup}>
                        <label htmlFor="gender">Gender (Optional)</label>
                        <select id="gender" name="gender" autoComplete="sex">
                            <option value="">Select Gender</option><option value="male">Male</option><option value="female">Female</option><option value="other">Other</option><option value="prefer-not-to-say">Prefer not to say</option>
                        </select>
                    </div>
                    <div className={styles.formGroup}><label htmlFor="occupation">Occupation / Profession (Optional)</label><input type="text" id="occupation" name="occupation" autoComplete="organization-title"/></div>
                    <div className={styles.formGroup}><label htmlFor="govtId">National ID (Optional)</label><input type="text" id="govtId" name="govtId"/></div>
                    <div className={styles.formRow}>
                        <div className={styles.formGroup}><label htmlFor="regPassword">Password</label><input type="password" id="regPassword" name="regPassword" required autoComplete="new-password"/></div>
                        <div className={styles.formGroup}><label htmlFor="confirmPassword">Confirm Password</label><input type="password" id="confirmPassword" name="confirmPassword" required autoComplete="new-password"/></div>
                    </div>
                    {/* Optional Fields from original Hero.jsx */}
                    <div className={styles.formGroup}> <label htmlFor="caseCategory">Case Type / Area of Interest (Optional)</label> <select id="caseCategory" name="caseCategory" value={selectedCategory} onChange={handleCategoryChange}> <option value="">Select Case Category</option> {caseTypes.map((type) => <option key={type.category} value={type.category}>{type.category}</option>)} </select> </div>
                    {selectedCategory && ( <div className={styles.formGroup}> <label htmlFor="subcase">Specific Case Type (Optional)</label> <select id="subcase" name="subcase"> <option value="">Select Specific Case Type</option> {caseTypes.find(type => type.category === selectedCategory)?.subcases.map((subcase) => <option key={subcase} value={subcase}>{subcase}</option>)} </select> </div> )}
                    <div className={styles.formGroup}> <label htmlFor="referral">How Did You Hear About Us? (Optional)</label> <select id="referral" name="referral"><option value="">Select Option</option><option value="search">Search Engine</option><option value="social">Social Media</option><option value="friend">Friend/Family</option><option value="event">Event/Workshop</option><option value="advertisement">Advertisement</option><option value="other">Other</option></select> </div>
                    
                    <div className={styles.formGroup}>
                        <div className={styles.checkboxGroup}><input type="checkbox" id="terms" name="terms" required /><label htmlFor="terms">I agree to the Terms and Conditions</label></div>
                    </div>
                    <button type="submit" className={styles.submitBtn} disabled={loading}>
                        {loading ? 'Registering...' : 'Create Account'}
                    </button>
                </form>
             )}
             
           </div>
         </div>
      )}
    </section>
  );
}

export default Hero;