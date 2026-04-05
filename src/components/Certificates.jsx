import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const certificates = [
  {
    title: 'Developing Back-End Apps with Node.js and Express',
    issuer: 'IBM',
    platform: 'Coursera',
    period: 'Mar – Apr 2026',
    file: 'https://www.coursera.org/account/accomplishments/verify/C2OFPYJ8YESP',
    image: 'NodeJS_IBM_page-0001 (1).jpg'
  },
  {
    title: 'Meta React Specialization (React Basics + Advanced React)',
    issuer: 'Meta',
    platform: 'Coursera',
    period: 'Sep – Oct 2025',
    file: 'https://www.coursera.org/account/accomplishments/specialization/certificate/IN7QNO9M1GQT',
    image: 'Coursera Advanced React_page-0001.jpg'
  },
  {
    title: 'React Basics',
    issuer: 'Meta',
    platform: 'Coursera',
    period: 'Aug – Sep 2025',
    file: 'https://www.coursera.org/account/accomplishments/verify/XIOPP2FMGL4S',
    image: 'React Bassic_pages-to-jpg-0001.jpg'
  },
  {
    title: 'Cloud Computing',
    issuer: 'NPTEL (IIT Kharagpur)',
    platform: '',
    period: 'Jan – Apr 2025',
    file: 'https://archive.nptel.ac.in/content/noc/NOC25/SEM1/Ecertificates/106/noc25-cs11/Course/NPTEL25CS11S133730056504230756.pdf',
    image: 'Cloud Computing (1)_page-0001.jpg'
  }
];

const Certificates = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, threshold: 0.2 });

  return (
    <section id="certificates" className="py-20 bg-[#101010]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="mb-12 text-center"
        >
          <p className="text-xs sm:text-sm tracking-[0.25em] text-emerald-400 uppercase mb-3">
            Certificates
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3">
            Verified Learning Path
          </h2>
          <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto">
            A snapshot of courses and specializations I have completed across backend
            development, React, and cloud computing.
          </p>
        </motion.div>

        <div className="relative overflow-x-auto pb-10">
          {/* Central horizontal line */}
          <div className="absolute left-0 right-0 top-1/2 h-[2px] bg-gradient-to-r from-emerald-500/20 via-emerald-400/60 to-emerald-500/20 pointer-events-none" />

          {/* Moving glow along the line */}
          <motion.div
            className="absolute top-1/2 -mt-2 h-4 w-4 rounded-full bg-emerald-400 shadow-[0_0_18px_rgba(16,185,129,0.9)] pointer-events-none"
            initial={{ x: '-5%' }}
            animate={{ x: ['-5%', '105%', '-5%'] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          />

          <div className="min-w-max flex items-center gap-10 sm:gap-16">
            {certificates.map((item, index) => {
              const isUp = index % 2 === 0;

              return (
                <motion.div
                  key={item.title + item.period}
                  className="relative flex flex-col items-center"
                  initial={{
                    opacity: 0,
                    x: isUp ? -80 : 80,
                    y: isUp ? 40 : -40,
                    scale: 0.9,
                    rotate: isUp ? -4 : 4
                  }}
                  whileInView={{ opacity: 1, x: 0, y: 0, scale: 1, rotate: 0 }}
                  viewport={{ once: false, amount: 0.4 }}
                  transition={{ duration: 0.7, delay: index * 0.12, ease: 'easeOut' }}
                >
                  {/* Connector + dot */}
                  <div className="relative flex flex-col items-center">
                    {isUp && (
                      <motion.div
                        className="mb-4 h-12 w-[2px] bg-gradient-to-b from-emerald-400/80 to-transparent"
                        initial={{ scaleY: 0 }}
                        animate={isInView ? { scaleY: 1 } : { scaleY: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.12 }}
                      />
                    )}

                    {!isUp && (
                      <motion.div
                        className="mt-4 h-12 w-[2px] bg-gradient-to-t from-emerald-400/80 to-transparent"
                        initial={{ scaleY: 0 }}
                        animate={isInView ? { scaleY: 1 } : { scaleY: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.12 }}
                      />
                    )}

                    <motion.div
                      className="h-4 w-4 rounded-full bg-emerald-400 shadow-[0_0_16px_rgba(16,185,129,0.9)] border border-emerald-300"
                      animate={{
                        scale: [1, 1.15, 1],
                        boxShadow: [
                          '0 0 14px rgba(16,185,129,0.7)',
                          '0 0 22px rgba(16,185,129,1)',
                          '0 0 14px rgba(16,185,129,0.7)'
                        ]
                      }}
                      transition={{ duration: 1.8, repeat: Infinity, repeatDelay: 0.3 }}
                    />
                  </div>

                  {/* Card */}
                  <motion.div
                    whileHover={{ y: isUp ? -6 : 6, scale: 1.03 }}
                    className={`mt-4 w-72 sm:w-80 rounded-2xl border border-emerald-500/20 bg-[#020617]/80 shadow-[0_18px_45px_rgba(0,0,0,0.7)] backdrop-blur-md overflow-hidden ${
                      isUp ? 'origin-bottom' : 'origin-top'
                    }`}
                  >
                    <div className="relative group">
                      <img
                        src={`/Certificates/${encodeURIComponent(item.image)}`}
                        alt={item.title}
                        className="h-44 sm:h-48 w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                    </div>

                    <div className="px-5 py-4">
                      <div className="flex items-center justify-between mb-2 text-[10px] sm:text-xs text-emerald-200/90">
                        <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/40 font-semibold tracking-wide uppercase">
                          {item.period}
                        </span>
                        <span className="text-[10px] sm:text-xs text-gray-400">
                          {item.platform || 'Online Program'}
                        </span>
                      </div>

                      <h3 className="text-sm sm:text-base font-semibold text-white mb-1 line-clamp-2">
                        {item.title}
                      </h3>
                      <p className="text-[11px] sm:text-xs text-gray-400 mb-3">
                        {item.issuer}
                      </p>

                      <div className="flex items-center justify-between text-xs sm:text-sm">
                        <a
                          href={item.file}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-emerald-300 hover:text-emerald-200"
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 animate-pulse" />
                          <span>View credential</span>
                        </a>
                        <span className="text-[10px] sm:text-xs text-gray-500">Official verification link</span>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Certificates;
