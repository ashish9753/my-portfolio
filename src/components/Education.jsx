import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const educationItems = [
  {
    period: 'Aug 2023 - Present',
    degree: 'Bachelor of Technology - Computer Science and Engineering',
    institution: 'Lovely Professional University',
    location: 'Phagwara, Punjab',
    detail: 'CGPA: 7.18 (till current semester)',
    status: 'current'
  },
  {
    period: 'Apr 2020 - Mar 2022',
    degree: 'Matriculation',
    institution: 'Jeeva Jyoti Hr. Sec. School',
    location: 'Banapura, Madhya Pradesh',
    detail: 'Percentage: 70.8%',
    status: 'completed'
  },
  {
    period: 'Apr 2018 - Mar 2020',
    degree: 'Intermediate',
    institution: 'Jeeva Jyoti Hr. Sec. School',
    location: 'Banapura, Madhya Pradesh',
    detail: 'Percentage: 78.3%',
    status: 'completed'
  }
];

const Education = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, threshold: 0.2 });

  return (
    <section id="education" className="py-20 bg-black">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="text-center mb-14"
        >
          <p className="text-sm tracking-[0.25em] text-blue-400 uppercase mb-4">
            Education
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            Formal Learning Journey
          </h2>
          <p className="max-w-2xl mx-auto text-gray-400 text-sm sm:text-base">
            Formal studies ensure I understand both the theoretical and practical sides of
            building technology-led solutions.
          </p>
        </motion.div>

        <div className="relative">
          {/* Vertical line */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-blue-500/60 via-gray-700 to-green-500/60 transform -translate-x-1/2" />

          {/* Rising green spark when section comes into view */}
          {isInView && (
            <motion.div
              className="hidden md:block absolute left-1/2 top-1/2 -translate-x-1/2"
              initial={{ y: 260, opacity: 0 }}
              animate={{ y: -230, opacity: 1 }}
              transition={{ duration: 1.8, ease: 'easeOut' }}
            >
              <div className="relative flex flex-col items-center">
                <div className="w-[2px] h-32 bg-gradient-to-t from-emerald-400/0 via-emerald-400/70 to-emerald-300" />
                <div className="absolute -top-1 w-3 h-3 rounded-full bg-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.9)]" />
                <div className="absolute -top-1 w-6 h-6 rounded-full bg-emerald-400/20 blur-md" />
              </div>
            </motion.div>
          )}

          <div className="space-y-10 md:space-y-16">
            {educationItems.map((item, index) => {
              const isLeft = index % 2 === 1;
              const isCurrent = item.status === 'current';

              return (
                <motion.div
                  key={item.institution + item.period}
                  initial={{ opacity: 0, x: isLeft ? -60 : 60 }}
                  animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: isLeft ? -60 : 60 }}
                  transition={{ duration: 0.7, delay: index * 0.15 }}
                  className="relative flex flex-col md:grid md:grid-cols-2 md:gap-10"
                >
                  {/* Connector + dot */}
                  <div
                    className={`hidden md:flex items-center justify-center relative ${
                      isLeft ? 'order-2' : 'order-1'
                    }`}
                  >
                    {/* Status dot: starts gray, then turns blue/green after spark */}
                    <div className="relative flex items-center justify-center">
                      {/* Base gray dot (initial state) */}
                      <span className="relative w-3 h-3 rounded-full bg-gray-500 ring-2 ring-gray-400 shadow-[0_0_0_4px_rgba(15,23,42,0.8)]" />

                      {/* Colored animated state appears after spark animation */}
                      {isInView && (
                        isCurrent ? (
                          <>
                            <motion.span
                              className="absolute h-7 w-7 rounded-full bg-blue-500/70 opacity-0"
                              animate={{ opacity: 0.7, x: [-6, 6, -6] }}
                              transition={{ delay: 1.8, duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
                            />
                            <motion.span
                              className="absolute w-3 h-3 rounded-full bg-blue-400 ring-2 ring-blue-500/70"
                              initial={{ scale: 0.8, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ delay: 1.8, duration: 0.4, ease: 'easeOut' }}
                            />
                          </>
                        ) : (
                          <>
                            <motion.span
                              className="absolute inline-flex h-5 w-5 rounded-full bg-emerald-500/60 opacity-0"
                              animate={{ opacity: 0.6 }}
                              transition={{ delay: 1.8, duration: 0.4, ease: 'easeOut' }}
                            />
                            <motion.span
                              className="absolute w-3 h-3 rounded-full bg-emerald-400 ring-2 ring-emerald-500/60"
                              initial={{ scale: 0.8, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ delay: 1.8, duration: 0.4, ease: 'easeOut' }}
                            />
                          </>
                        )
                      )}
                    </div>
                  </div>

                  {/* Card */}
                  <div
                    className={`md:max-w-md ${
                      isLeft ? 'md:order-1 md:text-right md:ml-auto' : 'md:order-2 md:mr-auto'
                    }`}
                  >
                    <div className="bg-[#0b0f19] rounded-2xl border border-white/5 shadow-[0_18px_45px_rgba(0,0,0,0.6)] px-6 py-6 sm:px-8 sm:py-7">
                      <div className="flex items-center justify-between text-[11px] text-gray-400 mb-3">
                        <span className="inline-flex items-center gap-2 font-medium tracking-wide uppercase">
                          <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/30">
                            {item.period}
                          </span>
                        </span>
                        <span className="hidden sm:inline text-xs text-gray-500">
                          {item.location}
                        </span>
                      </div>

                      <h3 className="text-xl sm:text-2xl font-semibold text-white mb-1">
                        {item.institution}
                      </h3>
                      <p className="text-xs sm:text-sm font-medium tracking-wide text-gray-400 mb-3 uppercase">
                        {item.degree}
                      </p>
                      <p className="text-sm text-gray-300">{item.detail}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Education;
