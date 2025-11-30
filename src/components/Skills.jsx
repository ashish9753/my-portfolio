import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { 
  FaReact, 
  FaNodeJs, 
  FaJsSquare, 
  FaHtml5, 
  FaCss3Alt, 
  FaGitAlt, 
  FaPython,
  FaDatabase,
  FaAws,
  FaDocker
} from 'react-icons/fa';
import { 
  SiTailwindcss, 
  SiMongodb, 
  SiExpress, 
  SiFirebase, 
  SiTypescript,
  SiRedux,
  SiGraphql,
  SiPostgresql,
  SiKubernetes,
  SiRedis
} from 'react-icons/si';

const Skills = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, threshold: 0.3 });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.1
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

  const skillCategories = [
    {
      title: 'Frontend',
      skills: [
        { name: 'React', icon: FaReact, color: '#61DAFB', level: 95 },
        { name: 'JavaScript', icon: FaJsSquare, color: '#F7DF1E', level: 90 },
        { name: 'HTML5', icon: FaHtml5, color: '#E34F26', level: 95 },
        { name: 'CSS3', icon: FaCss3Alt, color: '#1572B6', level: 90 },
        { name: 'Tailwind', icon: SiTailwindcss, color: '#06B6D4', level: 88 },
      ]
    },
    {
      title: 'Backend',
      skills: [
        { name: 'Node.js', icon: FaNodeJs, color: '#339933', level: 88 },
        { name: 'Express', icon: SiExpress, color: '#FFFFFF', level: 85 },
      ]
    },
    {
      title: 'Database',
      skills: [
        { name: 'MongoDB', icon: SiMongodb, color: '#47A248', level: 85 },
        { name: 'PostgreSQL', icon: SiPostgresql, color: '#336791', level: 80 },
        { name: 'Firebase', icon: SiFirebase, color: '#FFCA28', level: 75 }
      ]
    },
    {
      title: 'Tools & Others',
      skills: [
        { name: 'Git', icon: FaGitAlt, color: '#F05032', level: 90 },
        { name: 'Docker', icon: FaDocker, color: '#2496ED', level: 75 },
        { name: 'AWS', icon: FaAws, color: '#FF9900', level: 70 },
      ]
    }
  ];

  return (
    <section id="skills" className="py-20 bg-black">
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
              Skills & Technologies
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-green-500 mx-auto rounded-full mb-6"></div>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Here are the technologies I work with to bring ideas to life
            </p>
          </motion.div>

          {/* Skills Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-8">
            {skillCategories.map((category, categoryIndex) => (
              <motion.div
                key={category.title}
                className="bg-gray-900/50 p-6 rounded-xl border border-gray-700 hover:border-gray-600 transition-all duration-300"
                variants={itemVariants}
                whileHover={{ y: -5 }}
              >
                <h3 className="text-xl font-bold mb-6 text-white text-center">
                  {category.title}
                </h3>
                
                <div className="space-y-4">
                  {category.skills.map((skill, skillIndex) => (
                    <motion.div
                      key={skill.name}
                      className="group"
                      initial={{ opacity: 0, x: -20 }}
                      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                      transition={{ 
                        duration: 0.6, 
                        delay: categoryIndex * 0.2 + skillIndex * 0.1 
                      }}
                    >
                      {/* Skill Header */}
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <skill.icon 
                            className="text-xl group-hover:scale-110 transition-transform duration-200" 
                            style={{ color: skill.color }}
                          />
                          <span className="text-gray-300 font-medium">
                            {skill.name}
                          </span>
                        </div>
                        <span className="text-sm text-gray-500">
                          {skill.level}%
                        </span>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full"
                          initial={{ width: 0 }}
                          animate={isInView ? { width: `${skill.level}%` } : { width: 0 }}
                          transition={{ 
                            duration: 1.5, 
                            delay: categoryIndex * 0.2 + skillIndex * 0.1 + 0.5,
                            ease: 'easeOut'
                          }}
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Learning Section */}
          <motion.div
            className="mt-16 text-center"
            variants={itemVariants}
          >
            <h3 className="text-2xl font-bold mb-6 text-white">
              Currently Learning
            </h3>
            <div className="flex flex-wrap justify-center gap-4">
              {[
                { name: 'Next.js', color: '#FFFFFF' },
                { name: 'Three.js', color: '#FFFFFF' },
                { name: 'React Native', color: '#61DAFB' },
                { name: 'Blockchain', color: '#F7931A' }
              ].map((tech, index) => (
                <motion.div
                  key={tech.name}
                  className="px-4 py-2 bg-gray-800 border border-gray-600 rounded-full text-gray-300 hover:border-gray-400 hover:text-white transition-all duration-200"
                  whileHover={{ scale: 1.05 }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
                  transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
                >
                  {tech.name}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Skill Highlights */}
          <motion.div
            className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6"
            variants={itemVariants}
          >
            {[
              {
                title: 'Full Stack Development',
                description: 'End-to-end application development from concept to deployment',
                icon: '🚀'
              },
              {
                title: 'Responsive Design',
                description: 'Creating beautiful, mobile-first designs that work on all devices',
                icon: '📱'
              },
              {
                title: 'Performance Optimization',
                description: 'Building fast, efficient applications with optimal user experience',
                icon: '⚡'
              }
            ].map((highlight, index) => (
              <motion.div
                key={highlight.title}
                className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-xl border border-gray-700 hover:border-gray-600 transition-all duration-300 text-center"
                whileHover={{ scale: 1.02, y: -5 }}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.6, delay: 1.2 + index * 0.1 }}
              >
                <div className="text-3xl mb-4">{highlight.icon}</div>
                <h4 className="text-lg font-semibold mb-3 text-white">
                  {highlight.title}
                </h4>
                <p className="text-gray-400 text-sm">
                  {highlight.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Skills;