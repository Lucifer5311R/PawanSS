// src/components/ContinuumExplorer/ContinuumExplorer.jsx
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import './ContinuumExplorer.css';
import { motion, AnimatePresence } from 'framer-motion'; // Using Framer Motion

// --- Sample Data for Nodes ---
const pawanSSNodes = [
  // Core Expertise
  { id: 'ai-law', label: 'AI & Law', type: 'expertise', x: 30, y: 25, size: 'large', connections: ['cybersecurity', 'data-protection', 'ai-ethics', 'thought-leadership'], contentKey: 'aiLawFull' },
  { id: 'motivational-speaking', label: 'Motivational Speaking', type: 'expertise', x: 70, y: 25, size: 'large', connections: ['leadership-dev', 'student-success', 'youtube-creator'], contentKey: 'speakingFull' },
  { id: 'interview-consulting', label: 'Interview Consulting', type: 'expertise', x: 50, y: 45, size: 'large', connections: ['student-success', 'career-coaching'], contentKey: 'interviewConsultingFull' },

  // Sub-topics & Skills
  { id: 'cybersecurity', label: 'Cybersecurity Law', type: 'sub-expertise', x: 20, y: 40, size: 'medium', connections: ['data-protection'], contentKey: 'cyberSecLaw' },
  { id: 'data-protection', label: 'Data Protection', type: 'sub-expertise', x: 40, y: 40, size: 'medium', connections: ['ai-law'], contentKey: 'dataProtectionLaw' },
  { id: 'ai-ethics', label: 'AI Ethics', type: 'topic', x: 30, y: 10, size: 'medium', connections: ['thought-leadership'], contentKey: 'aiEthicsInsights' },
  { id: 'leadership-dev', label: 'Leadership Development', type: 'topic', x: 80, y: 40, size: 'medium', contentKey: 'leadershipContent' },
  { id: 'student-success', label: 'Student Success', type: 'focus-area', x: 60, y: 60, size: 'medium', contentKey: 'studentResources' },
  { id: 'career-coaching', label: 'Career Coaching', type: 'service', x: 40, y: 60, size: 'medium', contentKey: 'careerCoachingService' },

  // Achievements & Projects
  { id: 'mcn-grant', label: 'MCN Grant Director', type: 'achievement', x: 15, y: 55, size: 'medium', connections: ['social-impact'], contentKey: 'mcnGrantDetail' },
  { id: 'dean-law-school', label: 'Dean, School of Law', type: 'milestone', x: 10, y: 20, size: 'medium', connections: ['ai-law', 'leadership-dev'], contentKey: 'deanExperience' },
  { id: 'youtube-creator', label: 'YouTube Creator (8k+)', type: 'platform', x: 85, y: 15, size: 'medium', connections: ['motivational-speaking'], contentKey: 'youtubeChannel' },
  { id: 'art-of-flow', label: 'Art of Flow (Bazigar 2nd)', type: 'project', x: 65, y: 75, size: 'medium', connections: ['entrepreneurship'], contentKey: 'artOfFlowProject' },
  { id: 'kaval-cofounder', label: 'Kaval Co-founder', type: 'project', x: 50, y: 80, size: 'medium', connections: ['entrepreneurship'], contentKey: 'kavalProject' },
  
  // More abstract concepts / personal branding
  { id: 'social-impact', label: 'Social Impact', type: 'value', x: 5, y: 70, size: 'medium', contentKey: 'socialImpactPhilosophy' },
  { id: 'entrepreneurship', label: 'Entrepreneurship', type: 'value', x: 75, y: 70, size: 'medium', contentKey: 'entrepreneurialJourney' },
  { id: 'thought-leadership', label: 'Thought Leadership', type: 'role', x: 50, y: 5, size: 'large', connections: ['ai-ethics', 'youtube-creator', 'motivational-speaking', 'ai-law'], contentKey: 'thoughtLeadershipIntro' }
];

// --- Content Details (Expanded Examples) ---
const pawanSSNodeContentDetails = {
  aiLawFull: { title: "AI & The Law: Navigating the Future", description: "Comprehensive insights into AI governance, cyber law, data privacy, and the ethical implications of artificial intelligence. Exploring frameworks for responsible AI development and deployment.", type: 'expertisePage', media: [{type: 'image', url: 'https://picsum.photos/seed/ailaw/600/400'}], links:[{label: "Read Article on AI Governance", url: "#"}] },
  speakingFull: { title: "Motivational Speaking: Ignite & Inspire", description: "Dynamic talks and workshops designed to unlock potential and drive action. Available for keynotes, corporate events, and educational institutions. Topics include resilience, leadership, and achieving breakthroughs.", type: 'servicePage', media: [{type: 'video', embedCode: '<iframe width="560" height="315" src="https://www.youtube.com/embed/dQw4w9WgXcQ" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>'}], bookingLink: "#contact" },
  interviewConsultingFull: { title: "Ace Your Interviews", description: "Personalized coaching and strategies to help you excel in any interview setting, from tech to academia. Mock interviews and feedback provided.", type: 'servicePage', contentKey: 'interviewConsultingFull' },
  cyberSecLaw: { title: "Cybersecurity Law Fundamentals", description: "Understanding the legal landscape of cybersecurity, data breach responses, and compliance requirements.", type: 'subExpertisePage' },
  dataProtectionLaw: { title: "Data Protection & Privacy", description: "Navigating GDPR, CCPA, and other data protection regulations. Best practices for data handling and privacy by design.", type: 'subExpertisePage' },
  aiEthicsInsights: { title: "Ethical Considerations in AI", description: "Exploring the moral and societal implications of artificial intelligence, bias in algorithms, and the future of AI ethics.", type: 'topicPage' },
  leadershipContent: { title: "Developing Modern Leaders", description: "Workshops and resources on effective leadership, team building, and fostering innovation in organizations.", type: 'topicPage' },
  studentResources: { title: "Resources for Student Success", description: "A collection of guides, tips, and tools to help students achieve their academic and personal goals.", type: 'focusAreaPage' },
  careerCoachingService: { title: "Strategic Career Coaching", description: "Guidance for career transitions, skill development, and achieving professional aspirations.", type: 'servicePage' },
  mcnGrantDetail: { title: "Millennium Campus Network Grant Director", description: "Led initiatives to secure and manage MCN grants, fostering social impact projects by students.", type: 'achievementPage' },
  deanExperience: { title: "Experience as Dean, School of Law", description: "Reflections and achievements during the tenure as Dean, focusing on curriculum development and institutional growth.", type: 'milestonePage' },
  youtubeChannel: { title: "Pawan SS on YouTube (8k+ Subscribers)", description: "Sharing insights on law, motivation, and personal development with a growing online community.", type: 'platformPage', links: [{label: "Visit YouTube Channel", url:"#"}] },
  artOfFlowProject: { title: "The Art of Flow (Bazigar 2nd Runner Up)", description: "A project exploring creativity and peak performance, recognized at the Bazigar innovation challenge.", type: 'projectPage' },
  kavalProject: { title: "Kaval - Co-founder", description: "Co-founded Kaval, a startup focused on [describe Kaval's mission/product briefly].", type: 'projectPage' },
  socialImpactPhilosophy: { title: "Commitment to Social Impact", description: "Driven by the belief that knowledge and action can create positive change in society.", type: 'valuePage' },
  entrepreneurialJourney: { title: "The Entrepreneurial Spirit", description: "Insights from founding and advising startups, navigating challenges, and fostering innovation.", type: 'valuePage' },
  thoughtLeadershipIntro: { title: "Shaping Perspectives", description: "Engaging in public discourse and generating new ideas at the intersection of technology, law, and human potential.", type: 'rolePage' }
};


const ContinuumExplorer = ({ onReturnToInfo }) => {
  const [nodes, setNodes] = useState([]);
  const [activeNodeDetail, setActiveNodeDetail] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentZoom, setCurrentZoom] = useState(1);
  const [mapPosition, setMapPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  const mapViewportRef = useRef(null);

  // ... (keep all your existing useEffect, useCallback, useMemo hooks)

  const handleNodeClick = useCallback((nodeId) => {
    const nodeData = nodes.find(n => n.id === nodeId);
    if (nodeData) {
      const content = pawanSSNodeContentDetails[nodeData.contentKey] || { title: nodeData.label, description: "Content details are being prepared." };
      setActiveNodeDetail({ ...nodeData, ...content });
    } else {
      setActiveNodeDetail(null);
    }
  }, [nodes]);

  const handleCloseDetail = useCallback(() => {
    setActiveNodeDetail(null);
  }, []);

  const filteredNodes = useMemo(() => {
    if (!searchTerm.trim()) return nodes;
    const lowerSearchTerm = searchTerm.toLowerCase();
    return nodes.filter(node =>
      node.label.toLowerCase().includes(lowerSearchTerm) ||
      node.type.toLowerCase().includes(lowerSearchTerm) ||
      (pawanSSNodeContentDetails[node.contentKey]?.title?.toLowerCase().includes(lowerSearchTerm)) ||
      (pawanSSNodeContentDetails[node.contentKey]?.description?.toLowerCase().includes(lowerSearchTerm))
    );
  }, [nodes, searchTerm]);

  const handleZoom = useCallback((factor) => {
    setCurrentZoom(prevZoom => Math.max(0.3, Math.min(prevZoom * factor, 3)));
  }, []);
  
  const handlePanStart = useCallback((e) => {
    // Check if the click is on a node or control; if so, don't start panning.
    // This requires checking e.target or using event delegation.
    // For simplicity, this example doesn't include that check, but it's important for UX.
    if (e.target.closest('.node-element') || e.target.closest('.control-button') || e.target.closest('.continuum-search-input')) {
        return;
    }
    setIsDragging(true);
    setDragStart({ 
        x: e.clientX - mapPosition.x, 
        y: e.clientY - mapPosition.y 
    });
    if (mapViewportRef.current) {
        mapViewportRef.current.style.cursor = 'grabbing';
    }
  }, [mapPosition.x, mapPosition.y]);

  const handlePanMove = useCallback((e) => {
    if (!isDragging) return;
    e.preventDefault(); 
    setMapPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  }, [isDragging, dragStart.x, dragStart.y]);

  const handlePanEnd = useCallback(() => {
    setIsDragging(false);
    if (mapViewportRef.current) {
        mapViewportRef.current.style.cursor = 'grab';
    }
  }, []);

   useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handlePanMove);
      window.addEventListener('mouseup', handlePanEnd);
    } else {
      window.removeEventListener('mousemove', handlePanMove);
      window.removeEventListener('mouseup', handlePanEnd);
    }
    return () => {
      window.removeEventListener('mousemove', handlePanMove);
      window.removeEventListener('mouseup', handlePanEnd);
    };
  }, [isDragging, handlePanMove, handlePanEnd]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setNodes(pawanSSNodes);
    }, 300);
    return () => clearTimeout(timer);
  }, []);


  const nodeVariants = { /* ... your node variants ... */ };
  const detailPanelVariants = { /* ... your detail panel variants ... */ };


  return (
    <motion.section // Added motion.section for page transition
      id="continuum-explorer"
      className="section continuum-explorer-section"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="continuum-controls-bar">
        {/* NEW "Go Back" button */}
        <button
          onClick={onReturnToInfo}
          title="Return to Information"
          className="control-button return-button" // Add specific class for styling
        >
          &larr; Back to Info 
        </button>
        <input
          type="search"
          placeholder="Explore (e.g., AI, Speaking...)"
          className="continuum-search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          aria-label="Search the continuum"
        />
        <button onClick={() => handleZoom(1.2)} title="Zoom In" className="control-button zoom-button">+</button>
        <button onClick={() => handleZoom(1 / 1.2)} title="Zoom Out" className="control-button zoom-button">-</button>
        <button onClick={() => { setCurrentZoom(1); setMapPosition({x:0, y:0}); }} title="Reset View" className="control-button">Reset</button>
      </div>

      {/* ... rest of your ContinuumExplorer JSX (map viewport, SVG, nodes, detail panel) ... */}
      <div 
        className="continuum-map-viewport"
        ref={mapViewportRef}
        onMouseDown={handlePanStart}
      >
        <motion.div 
          className="continuum-map-interactive-area"
          animate={{
            x: mapPosition.x,
            y: mapPosition.y,
            scale: currentZoom
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <svg className="connections-layer" width="100%" height="100%" style={{transform: "translateZ(0)"}}>
            <defs>
              <linearGradient id="nodeConnectionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(var(--gold-accent-rgb), 0.1)" />
                <stop offset="50%" stopColor="rgba(var(--gold-accent-rgb), 0.5)" />
                <stop offset="100%" stopColor="rgba(var(--gold-accent-rgb), 0.1)" />
              </linearGradient>
               <filter id="glow">
                <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
                <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                </feMerge>
            </filter>
            </defs>
            {nodes.map(node =>
              node.connections?.map(connId => {
                const targetNode = nodes.find(n => n.id === connId);
                if (!node || !targetNode) return null; 

                const isHighlighted = searchTerm && (filteredNodes.some(fn => fn.id === node.id) || filteredNodes.some(fn => fn.id === targetNode.id));
                
                return (
                  <motion.line
                    key={`${node.id}-${connId}`}
                    x1={`${node.x}%`} y1={`${node.y}%`}
                    x2={`${targetNode.x}%`} y2={`${targetNode.y}%`}
                    stroke="url(#nodeConnectionGradient)"
                    strokeWidth={isHighlighted ? 2.5 : 1}
                    className={`connection-line ${isHighlighted ? 'highlighted' : ''}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isHighlighted ? 0.8 : 0.3 }}
                    transition={{ duration: 0.5 }}
                  />
                );
              })
            )}
          </svg>

          {nodes.map((node, index) => {
            const isVisible = filteredNodes.some(fn => fn.id === node.id) || !searchTerm.trim();
            const isSelected = activeNodeDetail?.id === node.id;

            return (
            <motion.div
              key={node.id}
              custom={index} 
              variants={nodeVariants}
              initial="initial"
              animate="animate"
              whileHover="hover"
              whileTap="tap"
              className={
                `node-element node-type-${node.type} node-size-${node.size || 'default'} 
                 ${isVisible ? 'visible' : 'dimmed'}
                 ${isSelected ? 'selected' : ''}`
              }
              style={{ 
                left: `${node.x}%`, 
                top: `${node.y}%`,
              }}
              onClick={() => handleNodeClick(node.id)}
              onKeyPress={(e) => e.key === 'Enter' && handleNodeClick(node.id)}
              tabIndex={0}
              role="button"
              aria-label={`Explore ${node.label}`}
              aria-pressed={isSelected}
            >
              <div className="node-core"></div>
              <span className="node-text-label">{node.label}</span>
            </motion.div>
          );
        })}
        </motion.div>
      </div>

      <AnimatePresence>
      {activeNodeDetail && (
        <motion.div 
          className="detail-panel-overlay" 
          onClick={handleCloseDetail}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div 
            className="detail-panel-content" 
            onClick={(e) => e.stopPropagation()} 
            variants={detailPanelVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <button className="detail-panel-close" onClick={handleCloseDetail} aria-label="Close details">×</button>
            <h2>{activeNodeDetail.title || activeNodeDetail.label}</h2>
            <p className="detail-panel-type">Type: {activeNodeDetail.type}</p>
            <div className="detail-panel-description">
              {activeNodeDetail.description || "Detailed information will be available soon."}
            </div>
            
            {activeNodeDetail.media && activeNodeDetail.media.length > 0 && (
              <div className="detail-media-section">
                <h4>Media:</h4>
                {activeNodeDetail.media.map((item, idx) => (
                  <div key={idx} className="media-item">
                    {item.type === 'image' && <img src={item.url} alt={activeNodeDetail.title || 'Related media'} />}
                    {item.type === 'video' && <div dangerouslySetInnerHTML={{ __html: item.embedCode }} />}
                  </div>
                ))}
              </div>
            )}

            {activeNodeDetail.links && activeNodeDetail.links.length > 0 && (
              <div className="detail-links-section">
                <h4>Related Links:</h4>
                <ul>
                  {activeNodeDetail.links.map((link, idx) => (
                    <li key={idx}><a href={link.url} target="_blank" rel="noopener noreferrer">{link.label}</a></li>
                  ))}
                </ul>
              </div>
            )}

            {activeNodeDetail.bookingLink && 
              <a href={activeNodeDetail.bookingLink} className="detail-cta-button" target="_blank" rel="noopener noreferrer">
                Book a Session
              </a>
            }
          </motion.div>
        </motion.div>
      )}
      </AnimatePresence>

       <div className="continuum-status-bar">
          <p>
            {searchTerm.trim() ? `Filtering for: "${searchTerm.trim()}"` : "Explore the full continuum."} 
            Found: {filteredNodes.length} node{filteredNodes.length === 1 ? '' : 's'}.
          </p>
      </div>
    </motion.section>
  );
};

export default ContinuumExplorer;