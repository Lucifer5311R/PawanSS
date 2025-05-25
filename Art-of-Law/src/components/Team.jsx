// src/components/Team.jsx
import React, { useEffect, useRef, useState } from 'react';
import styles from './Team.module.css'; //

function Team() {
  const sectionRef = useRef(null);
  const teamMembersRef = useRef([]); // To store refs to individual member cards
  const [selectedMember, setSelectedMember] = useState(null);

  // Ensure teamMembersRef.current is always an array
  if (!teamMembersRef.current) {
    teamMembersRef.current = [];
  }
  
  const addToRefs = (el) => {
    if (el && !teamMembersRef.current.includes(el)) {
      teamMembersRef.current.push(el);
    }
  };
  
  useEffect(() => {
    const sectionObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add(styles.visible);
          sectionObserver.unobserve(entry.target);
        }
      },
      { threshold: 0.2 }
    );

    const memberObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add(styles.visible);
            }, index * 200); // Staggered animation
            memberObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      sectionObserver.observe(sectionRef.current);
    }

    teamMembersRef.current.forEach((memberEl) => {
      if (memberEl) {
        memberObserver.observe(memberEl);
      }
    });

    const handleClickOutsideModal = (event) => {
      // Check if the click is outside the modal and not on a card that opens the modal
      const modalElement = document.querySelector(`.${styles.bioModal}`);
      if (modalElement && !modalElement.contains(event.target) && !event.target.closest(`.${styles.teamMemberCard}`)) {
        setSelectedMember(null);
      }
    };
    
    const handleEscKeyModal = (event) => {
      if (event.key === 'Escape') {
        setSelectedMember(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutsideModal);
    document.addEventListener('keydown', handleEscKeyModal);

    return () => {
      if (sectionRef.current) {
        sectionObserver.unobserve(sectionRef.current);
      }
      teamMembersRef.current.forEach((memberEl) => {
        if (memberEl) {
          memberObserver.unobserve(memberEl);
        }
      });
      document.removeEventListener('mousedown', handleClickOutsideModal);
      document.removeEventListener('keydown', handleEscKeyModal);
    };
  }, [selectedMember]); // Re-attach listeners if selectedMember changes, though might not be necessary for these specific listeners.

  const teamMembers = [
    {
      id: 1,
      name: 'Advocate Pawan SS',
      role: 'Environmental Advocate, Social Researcher, Legal Educator',
      shortBio: 'Dedicated to legal education, environmental sustainability, and access to justice. Leader of the award-winning Jalamitra Project.',
      fullBio: `Advocate Pawan SS is a highly accomplished legal professional... (rest of bio from your file)`, // Truncated for brevity here
      image: '/images/pawan-ss.jpg', // Ensure this image exists in your public/images folder
    },
    {
      id: 2,
      name: 'Advocate Kamal Adithya K',
      role: 'Co-founder, Legal Professional',
      shortBio: 'Co-founder of Art of Law, focused on practical legal application and social research. Experienced in civil/criminal law and court procedures.',
      fullBio: `Advocate Kamal Adithya K is a highly dedicated and accomplished legal professional... (rest of bio from your file)`, // Truncated
      image: '/images/kamal-k.jpg', // Ensure this image exists in your public/images folder
    },
  ];
  
  // Function to re-initialize refs array before mapping if needed,
  // though the current setup tries to push directly.
  // This addresses potential stale refs on re-renders if items change.
  teamMembersRef.current = [];


  const openModal = (member) => {
    setSelectedMember(member);
  };
  
  const closeModal = () => {
    setSelectedMember(null);
  };

  return (
    <div /* Removed className="section" as HomePage.jsx adds <section id="team"> */ ref={sectionRef} className={styles.teamSection}>
      <div className="container"> {/* Assuming "container" is a global class */}
        <h2 className={`section-title ${styles.sectionTitle}`}>Our Team</h2>

        <div className={styles.teamGrid}>
          {teamMembers.map((member) => (
            <div 
              key={member.id} 
              className={styles.teamMemberCard} 
              ref={addToRefs} // Add this card's DOM element to the refs array
              onClick={() => openModal(member)}
              role="button" // for accessibility
              tabIndex={0}  // for accessibility
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') openModal(member);}} // for accessibility
            >
              <div className={styles.imageContainer}>
                <img
                  src={member.image}
                  alt={member.name}
                  className={styles.teamMemberImage}
                />
                <div className={styles.imageBorder}></div> {/* For hover effect */}
              </div>
              
              <h3 className={styles.teamMemberName}>{member.name}</h3>
              <p className={styles.teamMemberRole}>{member.role}</p>
              <p className={styles.teamMemberBioShort}>{member.shortBio}</p> {/* Use a different class if style differs from full bio */}
              
              <div className={styles.readMoreButton}>
                Read Full Bio
              </div>
              
              <div className={styles.socialLinks}>
                {/* Placeholder social links - replace # with actual URLs */}
                <a href="#" className={styles.socialIcon} aria-label={`${member.name} LinkedIn`} onClick={(e) => e.stopPropagation()}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                    <rect x="2" y="9" width="4" height="12"></rect>
                    <circle cx="4" cy="4" r="2"></circle>
                  </svg>
                </a>
                <a href="#" className={styles.socialIcon} aria-label={`${member.name} Email`} onClick={(e) => e.stopPropagation()}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Biography Modal */}
      {selectedMember && (
        <div className={styles.modalOverlay} onClick={closeModal /* Close on overlay click */}>
          <div className={styles.bioModal} onClick={(e) => e.stopPropagation() /* Prevent closing when clicking inside modal */}>
            <button className={styles.closeButton} onClick={closeModal} aria-label="Close biography modal">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            
            <div className={styles.modalContent}>
              <div className={styles.modalHeader}>
                <div className={styles.modalImageContainer}>
                  <img 
                    src={selectedMember.image} 
                    alt={selectedMember.name} 
                    className={styles.modalImage} 
                  />
                </div>
                <div className={styles.modalTitleContainer}>
                  <h3 className={styles.modalTitle}>{selectedMember.name}</h3>
                  <p className={styles.modalRole}>{selectedMember.role}</p>
                </div>
              </div>

              <div className={styles.modalBody}>
                {/* Split fullBio by double newlines for paragraphs */}
                {selectedMember.fullBio.split(/\n\s*\n/).map((paragraph, i) => (
                  <p key={i} className={styles.bioParagraph} dangerouslySetInnerHTML={{ __html: paragraph.replace(/\n/g, '<br />') }}></p>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Team;