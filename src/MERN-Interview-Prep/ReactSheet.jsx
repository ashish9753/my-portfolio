import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../sheet-app/components/Footer';
import ThemeToggle from '../sheet-app/components/ThemeToggle';

const revisionSections = [
  {
    title: '1. React Basics (1-20)',
    questions: [
      { q: 'What is React?', a: 'JavaScript library for UI.' },
      { q: 'Who developed React?', a: 'Facebook (Meta).' },
      { q: 'SPA?', a: 'Single Page Application.' },
      { q: 'Component?', a: 'Reusable UI block.' },
      { q: 'Types of components?', a: 'Functional, Class.' },
      { q: 'Functional component?', a: 'JS function returning JSX.' },
      { q: 'JSX?', a: 'HTML-like syntax in JS.' },
      { q: 'Why JSX?', a: 'Easier UI writing.' },
      { q: 'Props?', a: 'Data passed to component.' },
      { q: 'State?', a: 'Component data.' },
      { q: 'Props vs State?', a: 'Props = read-only, State = mutable.' },
      { q: 'Virtual DOM?', a: 'In-memory DOM.' },
      { q: 'Why Virtual DOM?', a: 'Faster updates.' },
      { q: 'Key in React?', a: 'Unique identifier in list.' },
      { q: 'React Fragment?', a: 'Group elements without div.' },
      { q: 'Event handling?', a: 'onClick, onChange.' },
      { q: 'Conditional rendering?', a: 'Show UI based on condition.' },
      { q: 'Lists in React?', a: 'Use map().' },
      { q: 'Controlled component?', a: 'Form controlled by state.' },
      { q: 'Uncontrolled component?', a: 'Form uses DOM.' },
    ]
  },
  {
    title: '2. Hooks (21-45)',
    questions: [
      { q: 'Hook?', a: 'Function for state/logic.' },
      { q: 'useState?', a: 'Manage state.' },
      { q: 'Syntax?', a: '[state, setState].' },
      { q: 'useEffect?', a: 'Side effects.' },
      { q: 'When useEffect runs?', a: 'After render.' },
      { q: 'Dependency array?', a: 'Controls execution.' },
      { q: 'Empty array?', a: 'Runs once.' },
      { q: 'Cleanup function?', a: 'Runs before unmount.' },
      { q: 'useContext?', a: 'Share data globally.' },
      { q: 'useRef?', a: 'Access DOM/store value.' },
      { q: 'useMemo?', a: 'Optimize calculations.' },
      { q: 'useCallback?', a: 'Optimize functions.' },
      { q: 'Custom hook?', a: 'Reusable logic.' },
      { q: 'Rules of hooks?', a: 'Top-level only.' },
      { q: 'Why hooks?', a: 'Avoid class components.' },
      { q: 'State update async?', a: 'Yes.' },
      { q: 'Batching?', a: 'Combine updates.' },
      { q: 'Re-render?', a: 'State/props change.' },
      { q: 'Infinite loop in useEffect?', a: 'Missing dependency.' },
      { q: 'Multiple useEffect?', a: 'Yes.' },
      { q: 'useLayoutEffect?', a: 'Runs before paint.' },
      { q: 'Difference useEffect vs useLayoutEffect?', a: 'Async vs sync.' },
      { q: 'useReducer?', a: 'Complex state.' },
      { q: 'Dispatch?', a: 'Send action.' },
      { q: 'Initial state?', a: 'Starting value.' },
    ]
  },
  {
    title: '3. React Routing and Forms (46-65)',
    questions: [
      { q: 'React Router?', a: 'Page navigation.' },
      { q: 'BrowserRouter?', a: 'Wrap app.' },
      { q: 'Route?', a: 'Define path.' },
      { q: 'Link?', a: 'Navigate without reload.' },
      { q: 'useNavigate?', a: 'Program navigation.' },
      { q: 'Dynamic routing?', a: '/user/:id.' },
      { q: 'Form handling?', a: 'Controlled inputs.' },
      { q: 'onChange?', a: 'Update state.' },
      { q: 'onSubmit?', a: 'Handle form submit.' },
      { q: 'Prevent default?', a: 'e.preventDefault().' },
      { q: 'Validation?', a: 'Check inputs.' },
      { q: 'Formik?', a: 'Form library.' },
      { q: 'React Hook Form?', a: 'Lightweight form lib.' },
      { q: 'Error handling?', a: 'Show messages.' },
      { q: 'Lifting state up?', a: 'Share state.' },
      { q: 'Props drilling?', a: 'Pass props deeply.' },
      { q: 'Solution?', a: 'Context API.' },
      { q: 'Nested routes?', a: 'Routes inside routes.' },
      { q: 'Redirect?', a: 'Navigate programmatically.' },
      { q: 'Lazy loading?', a: 'Load on demand.' },
    ]
  },
  {
    title: '4. Advanced React (66-85)',
    questions: [
      { q: 'Redux?', a: 'State management.' },
      { q: 'Store?', a: 'Global state.' },
      { q: 'Action?', a: 'Event object.' },
      { q: 'Reducer?', a: 'Update state.' },
      { q: 'Dispatch?', a: 'Trigger action.' },
      { q: 'Middleware?', a: 'Extra logic.' },
      { q: 'Context vs Redux?', a: 'Small vs large apps.' },
      { q: 'Memoization?', a: 'Cache results.' },
      { q: 'React.memo?', a: 'Prevent re-render.' },
      { q: 'Code splitting?', a: 'Split bundles.' },
      { q: 'Suspense?', a: 'Loading UI.' },
      { q: 'Error boundary?', a: 'Catch errors.' },
      { q: 'StrictMode?', a: 'Highlight issues.' },
      { q: 'Portals?', a: 'Render outside DOM.' },
      { q: 'Refs?', a: 'Access DOM.' },
      { q: 'ForwardRef?', a: 'Pass ref.' },
      { q: 'Higher Order Component?', a: 'Wrap component.' },
      { q: 'Render props?', a: 'Share logic.' },
      { q: 'Debouncing?', a: 'Delay function.' },
      { q: 'Throttling?', a: 'Limit calls.' },
    ]
  },
  {
    title: '5. React Interview Focus (86-100)',
    questions: [
      { q: 'Why React?', a: 'Fast, reusable.' },
      { q: 'Advantages?', a: 'Component-based, efficient.' },
      { q: 'Disadvantages?', a: 'Learning curve.' },
      { q: 'Virtual DOM vs Real DOM?', a: 'Faster vs slower.' },
      { q: 'Key importance?', a: 'Efficient updates.' },
      { q: 'State immutability?', a: 'Do not mutate directly.' },
      { q: 'Best practices?', a: 'Clean, reusable code.' },
      { q: 'Folder structure?', a: 'Organized components.' },
      { q: 'Performance optimization?', a: 'Memo, lazy.' },
      { q: 'API call?', a: 'useEffect + fetch/axios.' },
      { q: 'Axios?', a: 'HTTP client.' },
      { q: 'Environment variables?', a: '.env file.' },
      { q: 'Build?', a: 'Optimize for production.' },
      { q: 'Deployment?', a: 'Netlify, Vercel.' },
      { q: 'React vs Angular?', a: 'Library vs framework.' },
    ]
  },
];

const totalQuestions = revisionSections.reduce((s, sec) => s + sec.questions.length, 0);

function ReactSheet({ auth, setAuth }) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [openAnswers, setOpenAnswers] = useState({});
  const [collapsedSections, setCollapsedSections] = useState(
    () => revisionSections.reduce((acc, _, i) => ({ ...acc, [i]: true }), {})
  );
  const questionRefs = useRef({});

  const [lastRead, setLastRead] = useState(() => {
    try { return JSON.parse(localStorage.getItem('react_revision_last_read')) || null; }
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
        localStorage.setItem('react_revision_last_read', JSON.stringify(data));
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
    localStorage.removeItem('react_revision_last_read');
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
            <Link to="/sheet" className="text-cyan-400 hover:text-cyan-300 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <div>
              <h1 className="text-2xl font-bold leading-tight">
                <span className="text-cyan-400">ReactJS</span> Revision
              </h1>
              <p className="text-xs text-gray-500">{totalQuestions} questions · {revisionSections.length} sections</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
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
            className="w-full bg-[#141414] border border-[#2a2a2a] rounded-xl px-5 py-4 pl-12 pr-11 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-400/60 transition-colors text-base"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors text-lg leading-none">x</button>
          )}
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Total Questions', value: totalQuestions, color: 'text-cyan-400' },
            { label: 'Revealed', value: revealedCount, color: 'text-emerald-400' },
            { label: 'Topics', value: revisionSections.length, color: 'text-sky-300' },
          ].map(s => (
            <div key={s.label} className="bg-[#111] border border-[#1f1f1f] rounded-xl p-6 text-center">
              <div className={`text-4xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-sm text-gray-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {lastRead && (
          <div className="flex items-center justify-between bg-cyan-400/8 border border-cyan-400/30 rounded-xl px-4 py-3 gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-cyan-400 text-base flex-shrink-0">Pinned</span>
              <div className="min-w-0">
                <p className="text-xs text-gray-500 mb-0.5">Last read · {lastRead.sectionTitle}</p>
                <p className="text-sm font-medium text-white truncate">{lastRead.question}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button onClick={jumpToLastRead} className="px-3 py-1.5 bg-cyan-400 hover:bg-cyan-300 text-black text-xs font-bold rounded-lg transition-colors">Resume</button>
              <button onClick={clearLastRead} className="text-gray-600 hover:text-gray-400 text-sm transition-colors">x</button>
            </div>
          </div>
        )}

        {q && filteredSections.length === 0 && (
          <div className="text-center py-16 text-gray-600">
            <div className="text-4xl mb-3">No Match</div>
            <p className="text-sm">No questions match <span className="text-gray-400">"{searchQuery}"</span></p>
            <button onClick={() => setSearchQuery('')} className="mt-3 text-cyan-400 text-xs hover:underline">Clear search</button>
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
                  <span className="text-cyan-400 font-bold text-lg">{section.title}</span>
                  <span className="text-sm text-gray-500 bg-[#1a1a1a] px-2.5 py-0.5 rounded-full">{section.questions.length}Q</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-px bg-[#1f1f1f] w-20 hidden sm:block" />
                  <svg className={`w-4 h-4 text-cyan-400/60 transition-transform duration-200 ${isCollapsed ? '' : 'rotate-180'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                            ? 'bg-cyan-400/[0.06] border-cyan-400/20'
                            : isLastRead
                            ? 'border-cyan-400/15'
                            : 'border-[#161616]'
                        }`}
                      >
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => toggleAnswer(key, item.q, section.title)}
                            className="flex-1 flex items-center justify-between px-2 py-5 text-left hover:bg-white/[0.03] transition-colors rounded"
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              {isLastRead && <span className="text-cyan-400 text-xs flex-shrink-0">Pin</span>}
                              <span className={`text-[17px] leading-snug ${isLastRead ? 'text-cyan-200' : 'text-gray-200'}`}>{item.q}</span>
                            </div>
                            <svg className={`w-3.5 h-3.5 text-gray-600 flex-shrink-0 ml-3 transition-transform duration-200 ${isOpen ? 'rotate-180 text-cyan-400' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                            <p className="text-[16px] text-cyan-300/80 px-2 pb-1 leading-relaxed">
                              <span className="text-cyan-500 mr-1">Answer:</span>{item.a}
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

export default ReactSheet;
