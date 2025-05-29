// src/components/Team.jsx
import React, { useEffect, useRef, useState } from 'react';
import styles from './Team.module.css'; // Using the CSS module you provided

// Team members data (as you provided, ensure image paths are correct from your public folder)
const teamMembers = [
  {
    id: 1,
    name: 'Advocate Pawan SS',
    role: 'Environmental Advocate, Social Researcher, Legal Educator',
    shortBio: 'Dedicated to legal education, environmental sustainability, and access to justice. Leader of the award-winning Jalamitra Project.',
    fullBio: `Advocate Pawan SS is a highly accomplished legal professional, environmental advocate, and social researcher with a profound dedication to legal education, environmental sustainability, and access to justice. With a diverse background in law, policy research, and environmental restoration, he has played a pivotal role in various national and international projects, demonstrating outstanding leadership, legal acumen, and a commitment to social impact.

Pawan has been at the forefront of several transformative initiatives, notably leading the Jalamitra Project, an internationally recognized lake rejuvenation program in Karnataka, which earned the prestigious Millennium Ocean Prize under the United Nations Academic Impact Program and the Remmer Family Foundation. Competing against participants from over 230+ countries, his visionary approach to environmental law and sustainability was acknowledged on a global platform, securing a grant of USD 5,000 for further development.

With deep expertise in environmental law, social justice, jurisdictional research, and public policy, Pawan actively works towards bridging the gap between legal frameworks and sustainable development goals (SDGs). His work focuses on advocating for marginalized communities, promoting access to justice, and ensuring environmental conservation through strategic legal interventions.

Beyond his contributions to environmental law, Pawan has made significant strides in social science research through his role as Project Coordinator for the Indian Council for Social Science Research (ICSSR). Under the mentorship of Dr. Sapna S (Head of Department and Associate Dean), he is currently engaged in impactful research addressing critical socio-economic issues, including inequality, education, and labor rights in the unorganized sector. His work contributes to policy recommendations and legislative advancements aimed at fostering inclusive growth and social justice.

As Convenor of the Environmental Law Studies and Orientation Programme (2023-2024), Pawan has played an instrumental role in designing and leading initiatives that promote legal awareness, environmental education, and public engagement in sustainable development. Through workshops, seminars, and legal aid programs, he has empowered students, professionals, and communities with the knowledge and tools to navigate and influence environmental policy and legal frameworks.

Pawan's professional journey is marked by a strong commitment to research-driven policy advocacy, emphasizing climate justice, environmental governance, human rights, and legal frameworks for sustainable development. His ability to integrate law with policy, governance, and grassroots activism makes him a dynamic force in the legal and environmental sectors.

With a vision to create lasting legal and environmental impact, Advocate Pawan SS continues to drive change, empower communities, and influence policy through strategic advocacy, research, and leadership.`,
    image: '/images/pawan-ss.jpg', // Make sure this path is correct
    social: { linkedin: 'https://www.linkedin.com/in/pawanss/', email: 'artoflaw.aol@gmail.com' } // Example actual links
  },
  {
    id: 2,
    name: 'Advocate Kamal Adithya K',
    role: 'Co-founder, Legal Professional',
    shortBio: 'Co-founder of Art of Law, focused on practical legal application and social research. Experienced in civil/criminal law and court procedures.',
    fullBio: `Advocate Kamal Adithya K is a highly dedicated and accomplished legal professional, having graduated from the prestigious CHRIST (Deemed to be University) in Bengaluru. Throughout his academic and professional journey, he has consistently demonstrated a profound commitment to the field of law, showcasing a blend of academic excellence and practical expertise. He is the Co-founder of Art of Law, an innovative initiative that underscores his passion for legal education, advocacy, and the practical application of law. Through this platform, he has contributed significantly to fostering legal awareness and empowering individuals with knowledge of their rights and responsibilities.

Kamal has also served as the Project Coordinator for the Indian Council for Social Science Research (ICSSR), where he played a pivotal role in spearheading research projects aimed at addressing pressing social and legal issues. His work with ICSSR reflects his ability to bridge the gap between theoretical research and real-world legal challenges, particularly those affecting marginalized and unorganized sectors. His areas of specialization include civil and criminal law, with a particular focus on addressing the legal hurdles faced by the unorganized sector, which often lacks access to proper legal representation and resources.

Throughout his career, Kamal has gained invaluable practical experience by working with esteemed legal institutions, including the High Courts and the Supreme Court of India. This exposure has equipped him with a comprehensive understanding of judicial processes, litigation strategies, and the complexities of the Indian legal system. His hands-on experience in these institutions has further solidified his expertise and prepared him to handle complex legal matters with precision and professionalism.

In addition to his academic and professional achievements, Kamal has completed internships at several renowned law firms, including Kamal and Co., Santosh Paul Associates, and King and Partridge. These experiences have allowed him to refine his skills in legal research, drafting, client counseling, and litigation, making him a well-rounded legal professional. His internships have provided him with exposure to diverse areas of law, enabling him to develop a versatile skill set that is essential for navigating the dynamic legal landscape.

Advocate Kamal Adithya K's unwavering dedication to the legal profession, combined with his academic rigor, practical experience, and passion for justice, positions him as a promising and impactful legal professional. His strong foundation in both theoretical and applied aspects of law, coupled with his commitment to addressing societal challenges, makes him a valuable asset to the legal community and a champion for equitable access to justice.
`,
    image: '/images/kamal-k.jpg', // Make sure this path is correct
    social: { linkedin: 'https://www.linkedin.com/in/kamal-adithya-k-4974b7211/', email: 'artoflaw.aol@gmail.com' } // Example actual links
  },
];

function Team() {
  const sectionRef = useRef(null);
  const teamMemberCardRefs = useRef([]);
  teamMemberCardRefs.current = []; // Initialize to ensure it's an array

  const [selectedMember, setSelectedMember] = useState(null);

  const addToCardRefs = (el) => {
    if (el && !teamMemberCardRefs.current.includes(el)) {
      teamMemberCardRefs.current.push(el);
    }
  };

  // Effect for Intersection Observers (Section and Cards)
  useEffect(() => {
    const sectionObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add(styles.visible);
          sectionObserver.unobserve(entry.target);
        }
      },
      { threshold: 0.15 } // Trigger when 15% of the section is visible
    );

    if (sectionRef.current) {
      sectionObserver.observe(sectionRef.current);
    }

    const memberCardObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            // The CSS transition-delay can be set via inline style if dynamic
            // or you can rely on CSS nth-child if the number of cards is fixed.
            // For dynamic delays via JS:
            entry.target.style.transitionDelay = `${entry.target.dataset.index * 100}ms`;
            entry.target.classList.add(styles.visible);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 } // Cards become visible when 10% in view
    );

    teamMemberCardRefs.current.forEach((card) => {
      if (card) {
        memberCardObserver.observe(card);
      }
    });

    return () => {
      if (sectionRef.current && sectionObserver) {
        sectionObserver.unobserve(sectionRef.current);
      }
      teamMemberCardRefs.current.forEach(card => {
        if (card && memberCardObserver) {
          memberCardObserver.unobserve(card);
        }
      });
    };
  }, []); // Empty dependency array ensures this runs once on mount and cleans up on unmount

  // Effect for Modal event listeners (Escape key, click outside)
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape') {
        closeModal();
      }
    };

    const handleClickOutsideModal = (event) => {
      // Check if the click is on the modalOverlay itself
      if (selectedMember && event.target && event.target.classList.contains(styles.modalOverlay)) {
        closeModal();
      }
    };

    if (selectedMember) {
      document.addEventListener('keydown', handleEscKey);
      document.addEventListener('mousedown', handleClickOutsideModal);
      document.body.style.overflow = 'hidden'; // Prevent body scroll when modal is open
    } else {
      document.body.style.overflow = ''; // Restore body scroll
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
      document.removeEventListener('mousedown', handleClickOutsideModal);
      document.body.style.overflow = ''; // Ensure scroll is restored on cleanup
    };
  }, [selectedMember]); // Re-run when selectedMember changes

  const openModal = (member) => {
    setSelectedMember(member);
  };

  const closeModal = () => {
    setSelectedMember(null);
  };

  return (
    // The root element has `ref={sectionRef}` and `className={styles.teamSection}`
    // The `section` tag is appropriate here.
    // Your HomePage.jsx likely has `<section id="team"><Team /></section>`
    // So, this component's root being a div or section is fine.
    // Using <section> here makes semantic sense for the component itself.
    <section id="team-component-root" className={styles.teamSection} ref={sectionRef}>
      <div className="container">
        <h2 className={`section-title ${styles.sectionTitle}`}>Our Team</h2> {/* This will get the animated underline */}
        <div className={styles.teamGrid}>
          {teamMembers.map((member, index) => (
            <div
              key={member.id}
              className={styles.teamMemberCard} // CSS handles initial opacity:0, transform: translateY(40px)
              ref={addToCardRefs}
              data-index={index} // For staggered animation delay with JS
              onClick={() => openModal(member)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') openModal(member); }}
            >
              <div className={styles.imageContainer}>
                <img
                  src={member.image}
                  alt={member.name}
                  className={styles.teamMemberImage}
                />
                <div className={styles.imageBorder}></div>
              </div>
              <h3 className={styles.teamMemberName}>{member.name}</h3>
              <p className={styles.teamMemberRole}>{member.role}</p>
              <p className={styles.teamMemberBio}>{member.shortBio}</p>
              <div className={styles.readMoreButton} onClick={(e) => { e.stopPropagation(); openModal(member); }}>
                Read Full Bio
              </div>
              <div className={styles.socialLinks}>
                {member.social?.linkedin && (
                  <a href={member.social.linkedin} target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label={`${member.name} LinkedIn`} onClick={(e) => e.stopPropagation()}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle>
                    </svg>
                  </a>
                )}
                {member.social?.email && (
                  <a href={`mailto:${member.social.email}`} className={styles.socialIcon} aria-label={`Email ${member.name}`} onClick={(e) => e.stopPropagation()}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedMember && (
        <div className={styles.modalOverlay}> {/* onClick for overlay is now handled by useEffect */}
          <div className={styles.bioModal} onClick={(e) => e.stopPropagation()}> {/* Prevent click inside modal from closing it */}
            <button className={styles.closeButton} onClick={closeModal} aria-label="Close biography">
              {/* Using a simple 'X' for brevity, your SVG is fine too */}
              <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
            <div className={styles.modalContent}>
              <div className={styles.modalHeader}>
                <div className={styles.modalImageContainer}>
                  <img src={selectedMember.image} alt={selectedMember.name} className={styles.modalImage} />
                </div>
                <div className={styles.modalTitleContainer}>
                  <h3 className={styles.modalTitle}>{selectedMember.name}</h3>
                  <p className={styles.modalRole}>{selectedMember.role}</p>
                </div>
              </div>
              <div className={styles.modalBody}>
                {/* Ensure your fullBio has double newlines for paragraph breaks */}
                {selectedMember.fullBio.split(/\n\s*\n|\n{2,}/).map((paragraph, i) => (
                  <p key={i} className={styles.bioParagraph} dangerouslySetInnerHTML={{ __html: paragraph.trim().replace(/\n/g, '<br />') }}></p>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default Team;