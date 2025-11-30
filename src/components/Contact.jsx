import React, { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import emailjs from '@emailjs/browser';
import { FiMail, FiPhone, FiMapPin, FiSend, FiUser, FiMessageSquare, FiCheck } from 'react-icons/fi';
import { FaGithub, FaLinkedin, FaTwitter, FaInstagram } from 'react-icons/fa';

const Contact = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, threshold: 0.3 });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: 'easeOut'
      }
    }
  };

  const contactInfo = [
    {
      icon: FiMail,
      title: 'Email',
      value: 'ashishs8927@gmail.com',
      href: 'ashishs8927@gmail.com'
    },
    {
      icon: FiPhone,
      title: 'Phone',
      value: '+91 6266928927',
      href: '+91 6266928927'
    },
    {
      icon: FiMapPin,
      title: 'Location',
      value: 'Punjab, IN',
      href: 'https://maps.google.comhttps://www.google.com/maps/place/Lovely+Professional+University/@31.255386,75.6869764,15z/data=!4m21!1m14!4m13!1m4!2m2!1d75.7039104!2d31.2475648!4e1!1m6!1m2!1s0x391a5f5e9c489cf3:0x4049a5409d53c300!2sLovely+Professional+University,+Jalandhar+-+Delhi,+Grand+Trunk+Rd,+Phagwara,+Punjab+144411!2m2!1d75.7048678!2d31.2553921!5i2!3m5!1s0x391a5f5e9c489cf3:0x4049a5409d53c300!8m2!3d31.2553921!4d75.7048678!16s%2Fm%2F02wbfhd?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D'
    }
  ];

  const socialLinks = [
    { icon: FaGithub, href: 'https://github.com/ashish9753', label: 'GitHub' },
    { icon: FaLinkedin, href: 'https://www.linkedin.com/in/ashish2208/', label: 'LinkedIn' },
    { icon: FaInstagram, href: 'https://instagram.com/ashissharma.2208', label: 'Instagram' }
  ];

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // EmailJS configuration from environment variables
      const serviceID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
      const templateID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

      // Check if EmailJS is configured
      if (!serviceID || !templateID || !publicKey) {
        throw new Error('EmailJS not configured. Please check your environment variables.');
      }

      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        subject: formData.subject,
        message: formData.message,
        to_email: 'ashishs8927@gmail.com'
      };

      // Send email using EmailJS
      await emailjs.send(serviceID, templateID, templateParams, publicKey);
      
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      
      // Reset success message after 5 seconds
      setTimeout(() => setIsSubmitted(false), 5000);
    } catch (error) {
      console.error('Failed to send email:', error);
      setIsSubmitting(false);
      
      if (error.message.includes('EmailJS not configured')) {
        alert('Contact form is not yet configured. Please contact me directly at ashishs8927@gmail.com');
      } else {
        alert('Failed to send message. Please try again or contact me directly at ashishs8927@gmail.com');
      }
    }
  };

  return (
    <section id="contact" className="py-20 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {/* Section Header */}
          <motion.div className="text-center mb-16" variants={itemVariants}>
            <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-gradient">
              Get In Touch
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-green-500 mx-auto rounded-full mb-6"></div>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              I'm always interested in new opportunities and interesting projects. 
              Let's discuss how we can work together!
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <motion.div className="space-y-8" variants={itemVariants}>
              <div>
                <h3 className="text-2xl font-bold text-white mb-6">
                  Let's Talk
                </h3>
                <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                  I'm currently available for freelance work and full-time opportunities. 
                  Whether you have a project in mind or just want to chat about technology, 
                  I'd love to hear from you.
                </p>
              </div>

              {/* Contact Details */}
              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <motion.a
                    key={info.title}
                    href={info.href}
                    className="flex items-center space-x-4 p-4 bg-gray-900/50 rounded-xl border border-gray-700 hover:border-gray-600 transition-all duration-300 group"
                    whileHover={{ scale: 1.02, x: 10 }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <div className="p-3 bg-gradient-to-r from-blue-500/20 to-green-500/20 rounded-lg group-hover:from-blue-500/30 group-hover:to-green-500/30 transition-all duration-300">
                      <info.icon className="text-xl text-blue-400" />
                    </div>
                    <div>
                      <h4 className="text-white font-medium">{info.title}</h4>
                      <p className="text-gray-400">{info.value}</p>
                    </div>
                  </motion.a>
                ))}
              </div>

              {/* Social Links */}
              <div>
                <h4 className="text-lg font-semibold text-white mb-4">Follow Me</h4>
                <div className="flex space-x-4">
                  {socialLinks.map((social, index) => (
                    <motion.a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 bg-gray-800 border border-gray-700 rounded-full text-gray-400 hover:text-white hover:border-gray-500 hover:bg-gray-700 transition-all duration-300"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      whileTap={{ scale: 0.9 }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                      transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                    >
                      <social.icon size={20} />
                    </motion.a>
                  ))}
                </div>
              </div>

              {/* Availability Status */}
              <motion.div
                className="bg-gradient-to-r from-green-500/10 to-blue-500/10 p-6 rounded-xl border border-green-500/30"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.8, delay: 1 }}
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <h4 className="text-white font-semibold">Available for Work</h4>
                </div>
                <p className="text-gray-300 text-sm">
                  I'm currently available for new projects and opportunities. 
                  Let's build something amazing together!
                </p>
              </motion.div>
            </motion.div>

            {/* Contact Form */}
            <motion.div variants={itemVariants}>
              <div className="bg-gray-900/50 p-8 rounded-xl border border-gray-700">
                <h3 className="text-2xl font-bold text-white mb-6">
                  Send Message
                </h3>

                {isSubmitted && (
                  <motion.div
                    className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg flex items-center space-x-3"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <FiCheck className="text-green-500" />
                    <span className="text-green-400">Message sent successfully! I'll get back to you soon.</span>
                  </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-2">
                        Name *
                      </label>
                      <div className="relative">
                        <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className="w-full pl-10 pr-4 py-3 bg-black/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none transition-colors duration-200"
                          placeholder="Your Name"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-2">
                        Email *
                      </label>
                      <div className="relative">
                        <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="w-full pl-10 pr-4 py-3 bg-black/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none transition-colors duration-200"
                          placeholder="your.email@example.com"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      Subject *
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-black/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none transition-colors duration-200"
                      placeholder="What's this about?"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      Message *
                    </label>
                    <div className="relative">
                      <FiMessageSquare className="absolute left-3 top-3 text-gray-500" />
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        rows="5"
                        className="w-full pl-10 pr-4 py-3 bg-black/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none transition-colors duration-200 resize-none"
                        placeholder="Tell me about your project or just say hello..."
                      ></textarea>
                    </div>
                  </div>

                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-4 px-6 rounded-lg font-medium transition-all duration-300 flex items-center justify-center space-x-3 ${
                      isSubmitting
                        ? 'bg-gray-600 cursor-not-allowed'
                        : 'bg-gradient-to-r from-blue-500 to-green-500 hover:shadow-lg transform hover:scale-[1.02]'
                    }`}
                    whileHover={!isSubmitting ? { scale: 1.02 } : {}}
                    whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <FiSend />
                        <span>Send Message</span>
                      </>
                    )}
                  </motion.button>

                  {/* Success Message */}
                  {isSubmitted && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mt-4 p-4 bg-green-500/20 border border-green-500 rounded-lg flex items-center space-x-3"
                    >
                      <FiCheck className="text-green-500 text-xl" />
                      <div>
                        <p className="text-green-500 font-medium">Message Sent Successfully!</p>
                        <p className="text-gray-300 text-sm">Thank you for reaching out. I'll get back to you soon!</p>
                      </div>
                    </motion.div>
                  )}
                </form>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;