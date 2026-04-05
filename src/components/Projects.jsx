import React, { useState, useEffect } from 'react';
import { FiGithub, FiExternalLink, FiCode, FiEye, FiFilter, FiX } from 'react-icons/fi';
import { FaReact, FaNodeJs, FaPython } from 'react-icons/fa';
import { SiTailwindcss, SiMongodb, SiExpress, SiFirebase, SiNextdotjs } from 'react-icons/si';

const ProjectImageSlider = ({ images, title }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!images || images.length <= 1) return;

    const intervalId = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);

    return () => clearInterval(intervalId);
  }, [images]);

  if (!images || images.length === 0) return null;

  return (
    <img
      src={images[currentIndex]}
      alt={title}
      className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
      onError={(e) => {
        e.target.style.display = 'none';
        if (e.target.parentElement) {
          e.target.parentElement.innerHTML = '<div class="flex items-center justify-center h-full bg-gray-800 text-gray-400"><span>Image not found</span></div>';
        }
      }}
    />
  );
};

const Projects = () => {
  const [filter, setFilter] = useState('All');
  const [selectedProject, setSelectedProject] = useState(null);

  const projects = [
    {
      id: 1,
      title: 'Account Management System',
      category: 'Full Stack',
      description: 'A comprehensive account management system for Shyam Veneer company with team collaboration and business operations.',
      longDescription: 'Developed and sold a complete account management system for Shyam Veneer company. The system handles business operations, team management, financial tracking, inventory management, and client relations. Built with modern technologies to ensure scalability and performance.',
      image: '/Accounting.png',
      technologies: [
        { name: 'React', icon: FaReact, color: '#61DAFB' },
        { name: 'Node.js', icon: FaNodeJs, color: '#339933' },
        { name: 'MongoDB', icon: SiMongodb, color: '#47A248' },
        { name: 'Express', icon: SiExpress, color: '#FFFFFF' },
        { name: 'Tailwind', icon: SiTailwindcss, color: '#06B6D4' }
      ],
      github: 'https://github.com/ashish9753/Shyam-Veneer-Frontend',
      live: 'https://www.shyamveneer.com/',
      features: [
        'Account Management Dashboard',
        'Team Collaboration Tools',
        'Financial Tracking & Reports',
        'Inventory Management',
        'Client Relationship Management',
        'Business Analytics',
        'User Role Management',
        'Responsive Design'
      ]
    },
    {
      id: 2,
      title: 'DSA Practice Sheet – Full-Stack Interview Platform',
      category: 'Full Stack',
      description: 'Full-stack MERN DSA practice platform with real-time progress tracking, activity heatmap, and interview prep sheets.',
      longDescription: 'Engineered a full-stack MERN platform enabling structured DSA learning and real-time progress tracking, improving user consistency. Designed a scalable architecture (MongoDB, Express.js, React.js, Node.js) with Tailwind CSS, implemented secure JWT-based authentication and role-based access, and built advanced features like problem tracking, level-based progression from Bronze to Grandmaster, and a GitHub-style activity heatmap to boost engagement.',
      image: '/Sheet/Sheet1.png',
      images: [
        '/Sheet/Sheet1.png',
        '/Sheet/Sheet2.png',
        '/Sheet/Sheet3.png',
        '/Sheet/Sheet4.png'
      ],
      technologies: [
        { name: 'React', icon: FaReact, color: '#61DAFB' },
        { name: 'Node.js', icon: FaNodeJs, color: '#339933' },
        { name: 'MongoDB', icon: SiMongodb, color: '#47A248' },
        { name: 'Express', icon: SiExpress, color: '#FFFFFF' },
        { name: 'Tailwind', icon: SiTailwindcss, color: '#06B6D4' }
      ],
      github: 'https://github.com/ashish9753/my-portfolio/tree/main/src/sheet-app',
      live: 'https://ashishdev.com/sheet',
      features: [
        'Full-stack MERN platform for structured DSA learning',
        'Scalable architecture with MongoDB, Express.js, React.js, Node.js, and Tailwind CSS',
        'Secure JWT-based authentication and role-based access',
        'Real-time progress tracking with series-wise statistics',
        'Problem tracking and level-based progression (Bronze to Grandmaster)',
        'GitHub-style activity heatmap and streak tracking',
        'Core CS and MERN interview preparation sheets',
        'Responsive dashboard with performance analytics'
      ]
    }
  ];

  const categories = ['All', 'Full Stack', 'Frontend', 'Backend'];

  const filteredProjects = filter === 'All' 
    ? projects 
    : projects.filter(project => project.category === filter);

  return (
    <section id="projects" className="py-20 bg-[#101010]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div>
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-gradient">
              Featured Projects
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-green-500 mx-auto rounded-full mb-6"></div>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Here are some of the projects I've worked on. Each one represents a unique challenge and learning experience.
            </p>
          </div>

          {/* Filter Buttons */}
          <div 
            className="flex justify-center mb-12"
          >
            <div className="flex flex-wrap justify-center gap-4 bg-black/30 p-2 rounded-xl border border-gray-700">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setFilter(category)}
                  className={`px-4 py-2 rounded-lg transition-all duration-300 flex items-center space-x-2 ${
                    filter === category
                      ? 'bg-gradient-to-r from-blue-500 to-green-500 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-gray-700'
                  }`}
                >
                  <FiFilter size={16} />
                  <span>{category}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Projects Grid */}
          <div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
              {filteredProjects.map((project, index) => (
                <div
                  key={project.id}
                  className="bg-black/50 rounded-xl overflow-hidden border border-gray-700 hover:border-gray-600 transition-all duration-300 group"
                >
                  {/* Project Image */}
                  <div className="relative overflow-hidden h-48 bg-gray-800">
                    {project.images && project.images.length > 0 ? (
                      <ProjectImageSlider images={project.images} title={project.title} />
                    ) : (
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.parentElement.innerHTML = '<div class=\"flex items-center justify-center h-full bg-gray-800 text-gray-400\"><span>Image not found</span></div>';
                        }}
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* Action Buttons */}
                    <div className="absolute bottom-4 left-4 right-4 flex justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button
                        onClick={() => setSelectedProject(project)}
                        className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors duration-200"
                      >
                        <FiEye size={18} />
                      </button>
                      <div className="flex space-x-2">
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors duration-200"
                        >
                          <FiGithub size={18} />
                        </a>
                        <a
                          href={project.live}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors duration-200"
                        >
                          <FiExternalLink size={18} />
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Project Content */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-3 py-1 bg-gradient-to-r from-blue-500/20 to-green-500/20 text-blue-400 text-xs rounded-full border border-blue-500/30">
                        {project.category}
                      </span>
                      <FiCode className="text-gray-500" />
                    </div>

                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-gradient transition-colors duration-300">
                      {project.title}
                    </h3>

                    <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                      {project.description}
                    </p>

                    {/* Technologies */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.technologies.slice(0, 3).map((tech, techIndex) => (
                        <div
                          key={tech.name}
                          className="flex items-center space-x-1 px-2 py-1 bg-gray-800 rounded-md text-xs text-gray-300"
                        >
                          <tech.icon style={{ color: tech.color }} />
                          <span>{tech.name}</span>
                        </div>
                      ))}
                      {project.technologies.length > 3 && (
                        <div className="px-2 py-1 bg-gray-800 rounded-md text-xs text-gray-400">
                          +{project.technologies.length - 3}
                        </div>
                      )}
                    </div>

                    {/* Links */}
                    <div className="flex space-x-3">
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-1 text-gray-400 hover:text-white transition-colors duration-200 text-sm"
                      >
                        <FiGithub size={16} />
                        <span>Code</span>
                      </a>
                      <a
                        href={project.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-1 text-gray-400 hover:text-white transition-colors duration-200 text-sm"
                      >
                        <FiExternalLink size={16} />
                        <span>Live Demo</span>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Project Detail Modal */}
      {selectedProject && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedProject(null)}
        >
          <div
            className="bg-gray-900 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-700"
            onClick={(e) => e.stopPropagation()}
          >
              {/* Modal Header */}
              <div className="relative bg-gray-800 h-64 overflow-hidden rounded-t-xl">
                {selectedProject.images && selectedProject.images.length > 0 ? (
                  <ProjectImageSlider images={selectedProject.images} title={selectedProject.title} />
                ) : (
                  <img
                    src={selectedProject.image}
                    alt={selectedProject.title}
                    className="w-full h-64 object-cover object-center rounded-t-xl"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentElement.innerHTML = '<div class=\"flex items-center justify-center h-64 bg-gray-800 text-gray-400 rounded-t-xl\"><span>Image not found</span></div>';
                    }}
                  />
                )}
                <button
                  onClick={() => setSelectedProject(null)}
                  className="absolute top-4 right-4 p-2 bg-black/50 backdrop-blur-sm rounded-full text-white hover:bg-black/70 transition-colors duration-200"
                >
                  <FiX size={20} />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-3xl font-bold text-white">{selectedProject.title}</h3>
                  <span className="px-3 py-1 bg-gradient-to-r from-blue-500/20 to-green-500/20 text-blue-400 text-sm rounded-full border border-blue-500/30">
                    {selectedProject.category}
                  </span>
                </div>

                <p className="text-gray-300 mb-6 leading-relaxed">
                  {selectedProject.longDescription}
                </p>

                {/* Technologies Used */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-white mb-3">Technologies Used</h4>
                  <div className="flex flex-wrap gap-3">
                    {selectedProject.technologies.map((tech) => (
                      <div
                        key={tech.name}
                        className="flex items-center space-x-2 px-4 py-2 bg-gray-800 rounded-lg border border-gray-700"
                      >
                        <tech.icon style={{ color: tech.color }} size={20} />
                        <span className="text-gray-300">{tech.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Key Features */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-white mb-3">Key Features</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {selectedProject.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2 text-gray-300">
                        <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-green-500 rounded-full"></div>
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-4">
                  <a
                    href={selectedProject.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-gray-700 to-gray-600 text-white rounded-lg hover:from-gray-600 hover:to-gray-500 transition-all duration-200"
                  >
                    <FiGithub size={20} />
                    <span>View Code</span>
                  </a>
                  <a
                    href={selectedProject.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                  >
                    <FiExternalLink size={20} />
                    <span>Live Demo</span>
                  </a>
                </div>
              </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Projects;