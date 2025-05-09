// src/components/common/SiteFooter/SiteFooter.jsx
import React from 'react';
import './SiteFooter.css';

const SiteFooter = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="site-footer-minimal">
      <p>&copy; {currentYear} Pawan SS. All ideas interconnected.</p>
    </footer>
  );
};
export default SiteFooter;    