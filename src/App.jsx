// src/App.jsx
import React, { useState, useEffect } from 'react';
import './App.css';
import { AnimatePresence } from 'framer-motion';

import EntryPortal from './components/EntryPortal/EntryPortal.jsx';
import BasicInfoPage from './components/BasicInfoPage/BasicInfoPage.jsx';
import ContinuumExplorer from './components/ContinuumExplorer/ContinuumExplorer.jsx';
import SiteFooter from './components/common/SiteFooter/SiteFooter.jsx';
// import SiteNavbar from './components/common/SiteNavbar/SiteNavbar.jsx';

function App() {
  const [appState, setAppState] = useState('entryPortal');

  const handlePortalExit = () => {
    setAppState('basicInfo');
  };

  const handleNavigateToExplorer = () => {
    setAppState('continuumExplorer');
  };

  // NEW: Handler to go back to the Basic Info Page
  const handleReturnToInfo = () => {
    setAppState('basicInfo');
  };

  useEffect(() => {
    if (appState === 'entryPortal') {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [appState]);

  return (
    <div className={`app-container app-state-${appState}`}>
      <AnimatePresence mode="wait">
        {appState === 'entryPortal' && (
          <EntryPortal key="entryPortal" onPortalExit={handlePortalExit} />
        )}

        {appState === 'basicInfo' && (
          <BasicInfoPage key="basicInfo" onNavigateToExplorer={handleNavigateToExplorer} />
        )}

        {appState === 'continuumExplorer' && (
          <React.Fragment key="continuumExplorerFragment">
            {/* <SiteNavbar /> Uncomment when ready and pass onReturnToInfo if needed */}
            <ContinuumExplorer onReturnToInfo={handleReturnToInfo} /> {/* Pass the handler here */}
            <SiteFooter />
          </React.Fragment>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;