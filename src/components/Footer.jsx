import React from 'react';
import { motion } from 'framer-motion';
import { FiHeart, FiGithub, FiLinkedin, FiMail, FiArrowUp } from 'react-icons/fi';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const socialLinks = [
    { icon: FiGithub, href: 'https://github.com/ashish9753', label: 'GitHub' },
    { icon: FiLinkedin, href: 'https://www.linkedin.com/in/ashish2208/', label: 'LinkedIn' },
    { icon: FiMail, href: 'mailto:ashishs8927@gmail.com', label: 'Email' }
  ];

  const quickLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Skills', href: '#skills' },
    { name: 'Projects', href: '#projects' },
    { name: 'Contact', href: '#contact' }
  ];

  return (
    <footer className="bg-gray-900 border-t border-gray-800">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo & Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold text-gradient mb-4">Ashish Sharma.</h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              Full Stack Developer passionate about creating exceptional digital experiences. 
              Always learning, always coding, always improving.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-400 hover:text-white hover:border-gray-600 hover:bg-gray-700 transition-all duration-300"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <social.icon size={16} />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <motion.li
                  key={link.name}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <a
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      document.querySelector(link.href)?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="text-gray-400 hover:text-white transition-colors duration-200 text-sm block py-1"
                  >
                    {link.name}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <h4 className="text-lg font-semibold text-white mb-4">Get in Touch</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-2">
                <FiMail className="text-blue-400" />
                <a
                  href="mailto:ashis@example.com"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  ashishs8927@gmail.com
                </a>
              </div>
              <p className="text-gray-400">
                Punjab, IN
              </p>
              <p className="text-gray-400">
                Available for freelance work
              </p>
            </div>
            
            {/* Status Badge */}
            <motion.div
              className="mt-4 inline-flex items-center space-x-2 px-3 py-2 bg-green-500/10 border border-green-500/30 rounded-full"
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-green-400 text-xs font-medium">Available for work</span>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <motion.p
              className="text-gray-400 text-sm mb-4 md:mb-0 flex items-center"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              © {currentYear} Ashish. Made with{' '}
              <motion.span
                className="mx-1"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
              >
                <FiHeart className="text-red-500" />
              </motion.span>{' '}
              using React & Tailwind CSS
            </motion.p>

            <motion.button
              onClick={scrollToTop}
              className="p-3 bg-gradient-to-r from-blue-500 to-green-500 rounded-full text-white hover:shadow-lg transition-all duration-300 group"
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.9 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <FiArrowUp className="group-hover:-translate-y-1 transition-transform duration-200" />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-green-500/5 rounded-full blur-3xl"></div>
      </div>
    </footer>
  );
};

export default Footer;