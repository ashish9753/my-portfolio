import React from 'react';

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
  return (
    <section id="certificates" className="py-20 bg-[#101010]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
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
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {certificates.map((item) => (
            <div
              key={item.title + item.period}
              className="rounded-2xl border border-emerald-500/20 bg-[#020617]/80 shadow-[0_12px_30px_rgba(0,0,0,0.6)] overflow-hidden"
            >
              <div className="relative">
                <img
                  src={`/Certificates/${encodeURIComponent(item.image)}`}
                  alt={item.title}
                  loading="lazy"
                  className="h-44 sm:h-48 w-full object-cover object-center"
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
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
                    <span>View credential</span>
                  </a>
                  <span className="text-[10px] sm:text-xs text-gray-500">Official verification link</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Certificates;
