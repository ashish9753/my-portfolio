import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiGithub, FiLinkedin, FiMail, FiDownload, FiArrowDown } from 'react-icons/fi';

const Hero = () => {
  const [currentRole, setCurrentRole] = useState(0);
  
  const roles = [
    "Full Stack Developer",
    "Node.js Specialist",
    "React Developer",
    "Problem Solver"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentRole((prev) => (prev + 1) % roles.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [roles.length]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 1,
        staggerChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 100, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: 'easeOut'
      }
    }
  };

  const socialLinks = [
    { icon: FiGithub, href: 'https://github.com/ashish9753', label: 'GitHub' },
    { icon: FiLinkedin, href: 'https://www.linkedin.com/in/ashish2208/', label: 'LinkedIn' },
    { icon: FiMail, href: 'ashishs8927@gmail.com', label: 'Email' }
  ];

  const scrollToNext = () => {
    const aboutSection = document.querySelector('#about');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden pt-16">
      {/* Animated background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse-slow delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse-slow delay-2000"></div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 z-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, 20, -20],
              opacity: [0.2, 1, 0.2],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      <motion.div
        className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Profile Image */}
        <motion.div
          className="mb-8"
          variants={itemVariants}
        >
          <div className="relative mx-auto w-32 h-32 sm:w-40 sm:h-40 mb-8">
            {/* Animated rings */}
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-blue-500/30"
              animate={{ scale: [1, 1.2, 1], opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-green-500/30"
              animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            />
            
            {/* Main profile container */}
            <motion.div
              className="relative w-full h-full rounded-full overflow-hidden border-4 border-gradient-to-r from-blue-500 to-green-500"
              whileHover={{ 
                scale: 1.1,
                rotateY: 10,
                transition: { duration: 0.3 }
              }}
              style={{
                background: 'linear-gradient(45deg, #3b82f6, #10b981)',
                padding: '3px'
              }}
            >
              <motion.img
                src="/profilePhoto.jpg"
                alt="Ashis Profile"
                className="w-full h-full rounded-full object-cover"
                initial={{ scale: 1.1, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                whileHover={{ scale: 1.05 }}
              />
            </motion.div>

            {/* Floating particles */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1.5 h-1.5 bg-blue-400 rounded-full"
                style={{
                  left: `${20 + (i * 60) % 80}%`,
                  top: `${30 + (i * 40) % 60}%`,
                }}
                animate={{
                  y: [-10, 10, -10],
                  opacity: [0.3, 1, 0.3],
                  scale: [0.8, 1.2, 0.8],
                }}
                transition={{
                  duration: 2 + i * 0.3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>
        </motion.div>

        {/* Greeting */}
        <motion.p
          className="text-gray-400 text-lg sm:text-xl mb-4"
          variants={itemVariants}
        >
          Hello, I'm
        </motion.p>

        {/* Name */}
        <motion.h1
          className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 text-gradient"
          variants={itemVariants}
        >
          Ashish Sharma
        </motion.h1>

        {/* Dynamic Role */}
        <motion.div
          className="mb-8 h-16 sm:h-20 flex items-center justify-center"
          variants={itemVariants}
        >
          <motion.h2
            key={currentRole}
            className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            {roles[currentRole]}
          </motion.h2>
        </motion.div>

        {/* Description */}
        <motion.p
          className="text-gray-300 text-lg sm:text-xl max-w-2xl mx-auto mb-12 leading-relaxed"
          variants={itemVariants}
        >
          I create exceptional digital experiences that combine beautiful design with
           powerful functionality. Let's build something amazing together.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
          variants={itemVariants}
        >
          <motion.a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-green-500 text-white font-medium rounded-lg hover:shadow-lg transform transition-all duration-200 hover:scale-105 group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Get In Touch
            <FiMail className="ml-2 group-hover:translate-x-1 transition-transform duration-200" />
          </motion.a>
          
          <motion.a
            href="/Ashish Sharma CV.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-8 py-4 border-2 border-gray-600 text-gray-300 font-medium rounded-lg hover:border-white hover:text-white transform transition-all duration-200 hover:scale-105 group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Download Resume
            <FiDownload className="ml-2 group-hover:translate-y-1 transition-transform duration-200" />
          </motion.a>
        </motion.div>

        {/* Social Links */}
        <motion.div
          className="flex justify-center space-x-6 mb-12"
          variants={itemVariants}
        >
          {socialLinks.map((social, index) => (
            <motion.a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 border border-gray-600 rounded-full text-gray-400 hover:text-white hover:border-white transition-all duration-200"
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
            >
              <social.icon size={20} />
            </motion.a>
          ))}
        </motion.div>

        {/* Scroll indicator */}
        <motion.button
          onClick={scrollToNext}
          className="text-gray-400 hover:text-white transition-colors duration-200"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 10, 0] }}
          transition={{ 
            opacity: { duration: 1, delay: 1.5 },
            y: { duration: 2, repeat: Infinity, ease: 'easeInOut' }
          }}
        >
          <FiArrowDown size={24} />
        </motion.button>
      </motion.div>
    </section>
  );
};

export default Hero;