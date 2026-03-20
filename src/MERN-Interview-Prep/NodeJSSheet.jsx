import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../sheet-app/components/Footer';

const revisionSections = [
  {
    title: '1. Node.js Basics (1-20)',
    questions: [
      { q: 'What is Node.js?', a: 'JavaScript runtime for server-side.' },
      { q: 'Built on?', a: 'Chrome V8 engine.' },
      { q: 'Why Node.js?', a: 'Fast, non-blocking.' },
      { q: 'Single-threaded?', a: 'Yes (event loop based).' },
      { q: 'Blocking vs Non-blocking?', a: 'Wait vs async execution.' },
      { q: 'Event-driven?', a: 'Uses events and callbacks.' },
      { q: 'NPM?', a: 'Node Package Manager.' },
      { q: 'Package.json?', a: 'Project metadata.' },
      { q: 'Module?', a: 'Reusable code file.' },
      { q: 'Built-in modules?', a: 'fs, http, path.' },
      { q: 'require()?', a: 'Import module.' },
      { q: 'module.exports?', a: 'Export module.' },
      { q: 'REPL?', a: 'Interactive shell.' },
      { q: 'Global objects?', a: '__dirname, process.' },
      { q: 'process?', a: 'Info about app.' },
      { q: '__dirname?', a: 'Current folder path.' },
      { q: '__filename?', a: 'Current file path.' },
      { q: 'Environment variables?', a: 'Config values.' },
      { q: '.env file?', a: 'Store variables.' },
      { q: 'console.log()?', a: 'Output data.' },
    ]
  },
  {
    title: '2. Core Concepts (21-40)',
    questions: [
      { q: 'Event loop?', a: 'Handles async tasks.' },
      { q: 'Callback?', a: 'Function after task.' },
      { q: 'Callback hell?', a: 'Nested callbacks.' },
      { q: 'Promise?', a: 'Async handling.' },
      { q: 'States of Promise?', a: 'Pending, fulfilled, rejected.' },
      { q: 'Async/await?', a: 'Cleaner async code.' },
      { q: 'Error handling?', a: 'try-catch.' },
      { q: 'Stream?', a: 'Data flow.' },
      { q: 'Types of streams?', a: 'Readable, writable.' },
      { q: 'Buffer?', a: 'Binary data.' },
      { q: 'fs module?', a: 'File system.' },
      { q: 'http module?', a: 'Create server.' },
      { q: 'path module?', a: 'File paths.' },
      { q: 'os module?', a: 'OS info.' },
      { q: 'url module?', a: 'URL parsing.' },
      { q: 'Middleware?', a: 'Function between request-response.' },
      { q: 'Thread pool?', a: 'Handles heavy tasks.' },
      { q: 'Cluster?', a: 'Multiple processes.' },
      { q: 'Child process?', a: 'Run another process.' },
      { q: 'Worker threads?', a: 'Multi-threading support.' },
    ]
  },
  {
    title: '3. Express.js (41-65)',
    questions: [
      { q: 'Express.js?', a: 'Node web framework.' },
      { q: 'Why Express?', a: 'Simplifies server code.' },
      { q: 'App?', a: 'Express instance.' },
      { q: 'app.listen()?', a: 'Start server.' },
      { q: 'Routing?', a: 'URL handling.' },
      { q: 'GET method?', a: 'Fetch data.' },
      { q: 'POST method?', a: 'Send data.' },
      { q: 'PUT method?', a: 'Update data.' },
      { q: 'DELETE method?', a: 'Remove data.' },
      { q: 'Middleware?', a: 'Runs before response.' },
      { q: 'Types of middleware?', a: 'Built-in, custom, third-party.' },
      { q: 'req object?', a: 'Request data.' },
      { q: 'res object?', a: 'Response data.' },
      { q: 'next()?', a: 'Move to next middleware.' },
      { q: 'Router?', a: 'Modular routes.' },
      { q: 'express.json()?', a: 'Parse JSON.' },
      { q: 'Static files?', a: 'express.static().' },
      { q: 'Error middleware?', a: 'Handle errors.' },
      { q: 'CORS?', a: 'Cross-origin access.' },
      { q: 'Body parser?', a: 'Parse request body.' },
      { q: 'REST API?', a: 'Standard API design.' },
      { q: 'Status codes?', a: '200, 404, 500.' },
      { q: 'Query params?', a: 'req.query.' },
      { q: 'Route params?', a: 'req.params.' },
      { q: 'Headers?', a: 'req.headers.' },
    ]
  },
  {
    title: '4. Database and Auth (66-85)',
    questions: [
      { q: 'MongoDB?', a: 'NoSQL database.' },
      { q: 'Mongoose?', a: 'MongoDB ORM.' },
      { q: 'Schema?', a: 'Structure of data.' },
      { q: 'Model?', a: 'Collection interface.' },
      { q: 'CRUD?', a: 'Create, Read, Update, Delete.' },
      { q: 'find()?', a: 'Get data.' },
      { q: 'save()?', a: 'Store data.' },
      { q: 'updateOne()?', a: 'Update record.' },
      { q: 'deleteOne()?', a: 'Delete record.' },
      { q: 'Indexing?', a: 'Faster queries.' },
      { q: 'Authentication?', a: 'Verify user.' },
      { q: 'Authorization?', a: 'Access control.' },
      { q: 'JWT?', a: 'Token-based auth.' },
      { q: 'bcrypt?', a: 'Password hashing.' },
      { q: 'Session?', a: 'Server-side auth.' },
      { q: 'Cookies?', a: 'Store data.' },
      { q: 'Secure cookies?', a: 'HTTP-only.' },
      { q: 'Helmet?', a: 'Security middleware.' },
      { q: 'Rate limiting?', a: 'Prevent abuse.' },
      { q: 'Env security?', a: 'Hide secrets.' },
    ]
  },
  {
    title: '5. Advanced Node (86-100)',
    questions: [
      { q: 'Why Node is fast?', a: 'Non-blocking I/O.' },
      { q: 'Scalability?', a: 'Handles many requests.' },
      { q: 'Microservices?', a: 'Small services.' },
      { q: 'Monolith?', a: 'Single app.' },
      { q: 'Logging?', a: 'Track events.' },
      { q: 'PM2?', a: 'Process manager.' },
      { q: 'Clustering?', a: 'Use multiple CPUs.' },
      { q: 'EventEmitter?', a: 'Handle events.' },
      { q: 'Streams vs Buffer?', a: 'Continuous vs chunk.' },
      { q: 'Security best practices?', a: 'Validate input.' },
      { q: 'Error handling?', a: 'Central middleware.' },
      { q: 'Async best practice?', a: 'Avoid blocking.' },
      { q: 'API testing?', a: 'Postman.' },
      { q: 'Deployment?', a: 'Render, AWS.' },
      { q: 'Node vs PHP?', a: 'Async vs sync.' },
    ]
  },
];

const totalQuestions = revisionSections.reduce((s, sec) => s + sec.questions.length, 0);

function NodeJSSheet({ auth, setAuth }) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [openAnswers, setOpenAnswers] = useState({});
  const [collapsedSections, setCollapsedSections] = useState(
    () => revisionSections.reduce((acc, _, i) => ({ ...acc, [i]: true }), {})
  );
  const questionRefs = useRef({});

  const [lastRead, setLastRead] = useState(() => {
    try { return JSON.parse(localStorage.getItem('node_revision_last_read')) || null; }
    catch { return null; }
  });

  const revealedCount = Object.values(openAnswers).filter(Boolean).length;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setAuth({ isAuthenticated: false, user: null, token: null });
    navigate('/login');
  };

  const toggleAnswer = (key, question, sectionTitle) => {
    setOpenAnswers(prev => {
      const isOpening = !prev[key];
      if (isOpening) {
        const data = { key, question, sectionTitle };
        setLastRead(data);
        localStorage.setItem('node_revision_last_read', JSON.stringify(data));
      }
      return { ...prev, [key]: !prev[key] };
    });
  };

  const jumpToLastRead = () => {
    if (!lastRead) return;
    const sectionIdx = parseInt(lastRead.key.split('-')[0], 10);
    setCollapsedSections(prev => ({ ...prev, [sectionIdx]: false }));
    setOpenAnswers(prev => ({ ...prev, [lastRead.key]: true }));
    setTimeout(() => {
      const el = questionRefs.current[lastRead.key];
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 80);
  };

  const clearLastRead = () => {
    setLastRead(null);
    localStorage.removeItem('node_revision_last_read');
  };

  const toggleSection = (sIdx) => {
    setCollapsedSections(prev => ({ ...prev, [sIdx]: !prev[sIdx] }));
  };

  const q = searchQuery.toLowerCase().trim();
  const filteredSections = revisionSections.map(sec => ({
    ...sec,
    questions: q
      ? sec.questions.filter(item =>
          item.q.toLowerCase().includes(q) || item.a.toLowerCase().includes(q)
        )
      : sec.questions,
  })).filter(sec => sec.questions.length > 0);

  const totalVisible = filteredSections.reduce((s, sec) => s + sec.questions.length, 0);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <header className="border-b border-[#1f1f1f] bg-[#0a0a0a]/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16 py-5 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Link to="/sheet" className="text-lime-400 hover:text-lime-300 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <div>
              <h1 className="text-2xl font-bold leading-tight">
                <span className="text-lime-400">Node.js</span> Revision
              </h1>
              <p className="text-xs text-gray-500">{totalQuestions} questions · {revisionSections.length} sections</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-gray-400 text-sm hidden sm:block">{auth.user?.username}</span>
            <button onClick={handleLogout} className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-sm rounded-lg transition-colors">Logout</button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16 py-8 space-y-8">
        <div className="relative">
          <svg className="w-4 h-4 text-gray-500 absolute left-4 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search any question or keyword..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-[#141414] border border-[#2a2a2a] rounded-xl px-5 py-4 pl-12 pr-11 text-white placeholder-gray-600 focus:outline-none focus:border-lime-400/60 transition-colors text-base"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors text-lg leading-none">x</button>
          )}
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Total Questions', value: totalQuestions, color: 'text-lime-400' },
            { label: 'Revealed', value: revealedCount, color: 'text-emerald-400' },
            { label: 'Topics', value: revisionSections.length, color: 'text-green-300' },
          ].map(s => (
            <div key={s.label} className="bg-[#111] border border-[#1f1f1f] rounded-xl p-6 text-center">
              <div className={`text-4xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-sm text-gray-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {lastRead && (
          <div className="flex items-center justify-between bg-lime-400/8 border border-lime-400/30 rounded-xl px-4 py-3 gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-lime-400 text-base flex-shrink-0">Pinned</span>
              <div className="min-w-0">
                <p className="text-xs text-gray-500 mb-0.5">Last read · {lastRead.sectionTitle}</p>
                <p className="text-sm font-medium text-white truncate">{lastRead.question}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button onClick={jumpToLastRead} className="px-3 py-1.5 bg-lime-400 hover:bg-lime-300 text-black text-xs font-bold rounded-lg transition-colors">Resume</button>
              <button onClick={clearLastRead} className="text-gray-600 hover:text-gray-400 text-sm transition-colors">x</button>
            </div>
          </div>
        )}

        {q && filteredSections.length === 0 && (
          <div className="text-center py-16 text-gray-600">
            <div className="text-4xl mb-3">No Match</div>
            <p className="text-sm">No questions match <span className="text-gray-400">"{searchQuery}"</span></p>
            <button onClick={() => setSearchQuery('')} className="mt-3 text-lime-400 text-xs hover:underline">Clear search</button>
          </div>
        )}

        {filteredSections.map((section, sIdx) => {
          const originalIdx = revisionSections.findIndex(s => s.title === section.title);
          const isCollapsed = q ? false : collapsedSections[originalIdx];
          return (
            <div key={sIdx}>
              <button
                onClick={() => toggleSection(originalIdx)}
                className="w-full flex items-center justify-between py-4 group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lime-400 font-bold text-lg">{section.title}</span>
                  <span className="text-sm text-gray-500 bg-[#1a1a1a] px-2.5 py-0.5 rounded-full">{section.questions.length}Q</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-px bg-[#1f1f1f] w-20 hidden sm:block" />
                  <svg className={`w-4 h-4 text-lime-400/60 transition-transform duration-200 ${isCollapsed ? '' : 'rotate-180'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>
              <div className="h-px bg-[#1f1f1f] mb-2" />

              {!isCollapsed && (
                <div>
                  {section.questions.map((item, qIdx) => {
                    const key = `${originalIdx}-${qIdx}`;
                    const isOpen = openAnswers[key];
                    const isLastRead = lastRead?.key === key;
                    return (
                      <div
                        key={key}
                        ref={el => questionRefs.current[key] = el}
                        className={`border-b transition-all rounded-sm ${
                          isOpen
                            ? 'bg-[#1f3a1f] border border-lime-300/70'
                            : isLastRead
                            ? 'border-lime-400/15'
                            : 'border-[#161616]'
                        }`}
                      >
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => toggleAnswer(key, item.q, section.title)}
                            className="flex-1 flex items-center justify-between px-2 py-5 text-left hover:bg-white/[0.03] transition-colors rounded"
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              {isLastRead && <span className="text-lime-400 text-xs flex-shrink-0">Pin</span>}
                              <span className={`text-[17px] leading-snug ${isLastRead ? 'text-lime-200' : 'text-gray-200'}`}>{item.q}</span>
                            </div>
                            <svg className={`w-3.5 h-3.5 text-gray-600 flex-shrink-0 ml-3 transition-transform duration-200 ${isOpen ? 'rotate-180 text-lime-400' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                          <a
                            href={`https://chatgpt.com/?q=${encodeURIComponent(`${item.q} in short.`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Ask ChatGPT"
                            className="flex-shrink-0 p-2 mr-1 text-red-400 hover:text-red-300 hover:scale-125 transition-all duration-300 rounded animate-spin [animation-duration:6s]"
                            onClick={e => e.stopPropagation()}
                          >
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.648zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855l-5.843-3.371 2.019-1.168a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.4-.679zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.496 4.496 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5 2.603 1.497v2.999l-2.597 1.5-2.603-1.495z"/>
                            </svg>
                          </a>
                        </div>
                        {isOpen && (
                          <div className="px-1 pb-5 pt-2">
                            <p className="text-[16px] text-lime-300/80 px-2 pb-1 leading-relaxed">
                              <span className="text-lime-500 mr-1">Answer:</span>{item.a}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        {q && filteredSections.length > 0 && (
          <p className="text-xs text-gray-600 text-center pt-2">{totalVisible} result{totalVisible !== 1 ? 's' : ''} for "{searchQuery}"</p>
        )}
      </div>

      <div className="pb-10" />
      <Footer />
    </div>
  );
}

export default NodeJSSheet;
