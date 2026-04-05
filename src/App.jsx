import React, { useEffect } from 'react';
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

// Portfolio Homepage Component
function Portfolio() {
  const location = useLocation();

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
      <Navbar />
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