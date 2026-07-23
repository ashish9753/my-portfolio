import React, { useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import About from './components/About.jsx';
import Education from './components/Education.jsx';
import Certificates from './components/Certificates.jsx';
import Skills from './components/Skills.jsx';
import Projects from './components/Projects.jsx';
import Contact from './components/Contact.jsx';
import Footer from './components/Footer.jsx';
import SheetApp from './sheet-app/SheetApp.jsx';
import { trackVisit } from './utils/trackVisit.js';
import { getStoredPortfolioTheme, storePortfolioTheme } from './utils/portfolioTheme.js';

const BASE_TITLE = 'Ashish Sharma';
const PAGE_TITLES = {
  '/': 'Full Stack Developer Portfolio',
  '/sheet': 'DSA Sheet Dashboard',
  '/sheet/login': 'Login',
  '/sheet/signup': 'Signup',
  '/sheet/admin': 'Admin Console',
  '/sheet/Sorting': 'Sorting Sheet',
  '/sheet/Array': 'Array Sheet',
  '/sheet/Binary Search': 'Binary Search Sheet',
  '/sheet/String': 'String Sheet',
  '/sheet/LinkedList': 'LinkedList Sheet',
  '/sheet/BitManipulation': 'BitManipulation Sheet',
  '/sheet/StackAndQueues': 'Stack And Queues Sheet',
  '/sheet/SlidingWindow': 'Sliding Window Sheet',
  '/sheet/BinaryTrees': 'Binary Trees Sheet',
  '/sheet/BinarySearchTrees': 'Binary Search Trees Sheet',
  '/sheet/Heaps': 'Heaps Sheet',
  '/sheet/Greedy': 'Greedy Sheet',
  '/sheet/Graphs': 'Graphs Sheet',
  '/sheet/DP': 'DP Sheet',
  '/sheet/Recursion': 'Recursion Sheet',
  '/sheet/System Design': 'System Design Sheet',
  '/sheet/Computer Networks': 'Computer Networks Sheet',
  '/sheet/Operating System': 'Operating System Sheet',
  '/sheet/DBMS': 'DBMS Sheet',
  '/sheet/DevOps': 'DevOps Sheet',
  '/sheet/OOPS': 'OOPS Sheet',
  '/sheet/Software Engineering': 'Software Engineering Sheet',
  '/sheet/HTML': 'HTML Sheet',
  '/sheet/CSS': 'CSS Sheet',
  '/sheet/JavaScript': 'JavaScript Sheet',
  '/sheet/MongoDB': 'MongoDB Sheet',
  '/sheet/React': 'React Sheet',
  '/sheet/NodeJS': 'NodeJS Sheet',
  '/sheet/MySQL': 'MySQL Sheet',
  '/sheet/PostgreSQL': 'PostgreSQL Sheet'
};

const HASH_TITLES = {
  about: 'About',
  education: 'Education',
  certificates: 'Certificates',
  skills: 'Skills',
  projects: 'Projects',
  contact: 'Contact'
};

function formatPathTitle(pathname) {
  const lastSegment = decodeURIComponent(pathname.split('/').filter(Boolean).pop() || '');
  return lastSegment
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function getDocumentTitle(location) {
  if (location.pathname === '/' && location.hash) {
    const hashTitle = HASH_TITLES[location.hash.slice(1)];
    if (hashTitle) return `${hashTitle} | ${BASE_TITLE}`;
  }

  const decodedPath = decodeURIComponent(location.pathname);
  const pageTitle = PAGE_TITLES[decodedPath] || formatPathTitle(decodedPath);
  return pageTitle ? `${pageTitle} | ${BASE_TITLE}` : BASE_TITLE;
}

// Portfolio Homepage Component
function Portfolio() {
  const location = useLocation();
  const [theme, setTheme] = useState(() => getStoredPortfolioTheme());

  // Apply light mode by toggling `portfolio-light` on <html>. The cleanup
  // removes it on unmount so navigating to the DSA sheet app (a different
  // route) never inherits the portfolio's light override layer.
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('portfolio-light', theme === 'light');
    storePortfolioTheme(theme);
    return () => root.classList.remove('portfolio-light');
  }, [theme]);

  const toggleTheme = () => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));

  useEffect(() => {
    if (location.hash) {
      setTimeout(() => {
        const id = location.hash.replace('#', '');
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 300);
    } else {
      window.scrollTo(0, 0);
    }
  }, [location]);

  return (
    <motion.div 
      className="App bg-black text-white min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <Navbar theme={theme} onToggleTheme={toggleTheme} />
      <Hero />
      <About />
      <Education />
      <Certificates />
      <Skills />
      <Projects />
      <Contact />
      <Footer />
    </motion.div>
  );
}

function App() {
  const location = useLocation();

  useEffect(() => {
    document.title = getDocumentTitle(location);
  }, [location]);

  // Count every page view, including client-side navigation between routes.
  // Keyed on pathname alone so scrolling to a #hash isn't counted as a visit.
  useEffect(() => {
    trackVisit(location.pathname);
  }, [location.pathname]);

  return (
    <Routes>
      {/* Portfolio Routes */}
      <Route path="/" element={<Portfolio />} />
      
      {/* Sheet App Routes */}
      <Route path="/sheet/*" element={<SheetApp />} />
    </Routes>
  );
}

export default App;
