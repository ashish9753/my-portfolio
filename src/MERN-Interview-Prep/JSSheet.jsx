import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../sheet-app/components/Footer';

const revisionSections = [
  {
    title: '🔹 1. Basics',
    questions: [
      { q: 'What is JavaScript?', a: 'A high-level, interpreted, single-threaded programming language used for web development.' },
      { q: 'Primitive data types?', a: 'string, number, boolean, null, undefined, symbol, bigint.' },
      { q: 'var vs let vs const?', a: 'var (function-scoped), let & const (block-scoped). const cannot be reassigned.' },
      { q: 'What is hoisting?', a: 'JS moves variable and function declarations to the top of their scope before execution.' },
      { q: 'What is scope?', a: 'Accessibility of variables (global, function, block).' },
      { q: '== vs ===?', a: '== compares value (with type conversion), === compares value + type.' },
      { q: 'Truthy & falsy values?', a: 'Falsy: false, 0, "", null, undefined, NaN.' },
      { q: 'Type coercion?', a: 'Automatic type conversion by JavaScript.' },
      { q: 'What is NaN?', a: '"Not a Number" — result of invalid number operations.' },
      { q: 'undefined vs null?', a: 'undefined = variable declared but not assigned. null = intentionally empty value.' },
      { q: 'Template literal?', a: 'String using backticks — Hello ${name}.' },
      { q: 'Destructuring?', a: 'Extract values from arrays/objects into variables.' },
      { q: 'Spread operator?', a: 'Expands elements (...arr).' },
      { q: 'Rest operator?', a: 'Collects remaining values (...args).' },
      { q: 'map() vs forEach()?', a: 'map() returns new array, forEach() does not.' },
      { q: 'What is an object?', a: 'Collection of key-value pairs.' },
      { q: 'Optional chaining?', a: 'obj?.property prevents error if undefined.' },
      { q: 'What is typeof?', a: 'Operator that returns data type.' },
      { q: 'What is isNaN()?', a: 'Checks if value is NaN.' },
      { q: 'How to clone object?', a: 'Object.assign({}, obj) or {...obj}.' },
    ]
  },
  {
    title: '🔹 2. Functions',
    questions: [
      { q: 'Function declaration?', a: 'function add(){}' },
      { q: 'Function expression?', a: 'const add = function(){}' },
      { q: 'Arrow function?', a: 'const add = () => {}' },
      { q: 'Arrow vs normal function?', a: "Arrow doesn't have its own this." },
      { q: 'Callback function?', a: 'Function passed as argument.' },
      { q: 'Higher-order function?', a: 'Function that takes/returns another function.' },
      { q: 'Pure function?', a: 'Same input → same output, no side effects.' },
      { q: 'IIFE?', a: 'Immediately Invoked Function Expression.' },
      { q: 'Currying?', a: 'Function returning another function.' },
      { q: 'call() apply() bind()?', a: 'Used to control this.' },
      { q: 'Lexical scope?', a: 'Inner function can access outer variables.' },
      { q: 'Recursion?', a: 'Function calling itself.' },
      { q: 'Generator function?', a: 'function* — uses yield.' },
      { q: 'What is arguments object?', a: 'Array-like object of function arguments.' },
      { q: 'Default parameter?', a: 'function(a=10){}' },
    ]
  },
  {
    title: '🔹 3. Arrays & Objects',
    questions: [
      { q: 'slice() vs splice()?', a: "slice() doesn't modify original; splice() modifies." },
      { q: 'reduce()?', a: 'Reduces array to single value.' },
      { q: 'Remove duplicates?', a: 'new Set(arr)' },
      { q: 'Shallow copy?', a: 'Copies first level only.' },
      { q: 'Deep copy?', a: 'Copies nested objects also.' },
      { q: 'Object.keys()?', a: 'Returns array of keys.' },
      { q: 'Object.freeze()?', a: 'Prevents changes.' },
      { q: 'JSON.stringify()?', a: 'Converts object → JSON string.' },
      { q: 'JSON.parse()?', a: 'JSON string → object.' },
      { q: 'Map?', a: 'Key-value collection (any type key).' },
      { q: 'Set?', a: 'Stores unique values.' },
      { q: 'Map vs Object?', a: 'Map allows any key type; Object keys are strings.' },
      { q: 'Array.isArray()?', a: 'Checks if array.' },
      { q: 'sort()?', a: 'Sorts array (default string sort).' },
      { q: 'find()?', a: 'Returns first matching element.' },
    ]
  },
  {
    title: '🔹 4. Asynchronous JavaScript',
    questions: [
      { q: 'Synchronous?', a: 'Executes line by line.' },
      { q: 'Asynchronous?', a: 'Executes without blocking.' },
      { q: 'Callback hell?', a: 'Nested callbacks.' },
      { q: 'Promise?', a: 'Object representing future value.' },
      { q: 'Promise states?', a: 'Pending, Fulfilled, Rejected.' },
      { q: 'async/await?', a: 'Cleaner way to handle promises.' },
      { q: 'try/catch?', a: 'Error handling in async.' },
      { q: 'Event loop?', a: 'Handles async tasks in JS.' },
      { q: 'Call stack?', a: 'Executes functions.' },
      { q: 'Microtask queue?', a: 'Promise callbacks.' },
      { q: 'setTimeout?', a: 'Executes after delay.' },
      { q: 'Promise.all()?', a: 'Waits for all promises.' },
      { q: 'Promise.race()?', a: 'Returns first resolved/rejected.' },
      { q: 'fetch()?', a: 'Makes API request.' },
      { q: 'API?', a: 'Interface to communicate between systems.' },
      { q: 'Axios vs fetch?', a: 'Axios auto converts JSON & handles errors better.' },
      { q: 'Blocking code?', a: 'Stops execution.' },
      { q: 'Non-blocking code?', a: "Doesn't stop execution." },
      { q: 'What is await?', a: 'Waits for promise result.' },
      { q: 'Error handling in promises?', a: '.catch().' },
    ]
  },
  {
    title: '🔹 5. DOM & Browser',
    questions: [
      { q: 'DOM?', a: 'Document Object Model (HTML structure as object).' },
      { q: 'querySelector()?', a: 'Selects first matching element.' },
      { q: 'Event bubbling?', a: 'Event moves upward.' },
      { q: 'Event capturing?', a: 'Event moves downward.' },
      { q: 'Event delegation?', a: 'Attach event to parent.' },
      { q: 'localStorage vs sessionStorage?', a: 'localStorage persists; sessionStorage ends on tab close.' },
      { q: 'Cookies?', a: 'Small stored data in browser.' },
      { q: 'CORS?', a: 'Cross-Origin Resource Sharing policy.' },
      { q: 'Debounce?', a: 'Delay execution.' },
      { q: 'Throttle?', a: 'Limit execution rate.' },
      { q: 'preventDefault()?', a: 'Stops default behavior.' },
      { q: 'stopPropagation()?', a: 'Stops event bubbling.' },
      { q: 'window object?', a: 'Global browser object.' },
      { q: 'document object?', a: 'Represents HTML page.' },
      { q: 'BOM?', a: 'Browser Object Model.' },
    ]
  },
  {
    title: '🔹 6. Advanced JavaScript',
    questions: [
      { q: 'Closure?', a: 'Function remembers outer variables.' },
      { q: 'Prototype?', a: 'Object from which others inherit.' },
      { q: 'Prototype inheritance?', a: 'Objects inherit from prototype.' },
      { q: 'Class?', a: 'Template for objects.' },
      { q: 'Constructor?', a: 'Special method to initialize object.' },
      { q: 'Strict mode?', a: '"use strict" prevents errors.' },
      { q: 'Memory leak?', a: 'Unused memory not released.' },
      { q: 'Garbage collection?', a: 'Automatic memory cleanup.' },
      { q: 'Memoization?', a: 'Cache function results.' },
      { q: 'Polyfill?', a: 'Code to support older browsers.' },
      { q: 'Symbol?', a: 'Unique identifier.' },
      { q: 'BigInt?', a: 'Large integer type.' },
      { q: 'Nullish coalescing (??)?', a: 'Returns right side if null/undefined.' },
      { q: 'Temporal Dead Zone?', a: 'Time before let/const initialization.' },
      { q: 'Modules?', a: 'import / export.' },
      { q: 'Tree shaking?', a: 'Removes unused code.' },
      { q: 'SSR?', a: 'Server-side rendering.' },
      { q: 'Hydration?', a: 'Attach JS to SSR HTML.' },
      { q: 'Webpack?', a: 'Module bundler.' },
      { q: 'Deep clone methods?', a: 'structuredClone().' },
      { q: 'WeakMap?', a: 'Map with weak references.' },
      { q: 'WeakSet?', a: 'Set with weak references.' },
      { q: 'typeof null?', a: '"object" (JS bug).' },
      { q: 'Is JS single-threaded?', a: 'Yes (with event loop for async).' },
      { q: 'What is JavaScript engine?', a: 'Executes JS code (e.g., Chrome V8).' },
    ]
  },
];

const totalQuestions = revisionSections.reduce((s, sec) => s + sec.questions.length, 0);

function JSSheet({ auth, setAuth }) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [openAnswers, setOpenAnswers] = useState({});
  const [collapsedSections, setCollapsedSections] = useState(
    () => revisionSections.reduce((acc, _, i) => ({ ...acc, [i]: true }), {})
  );
  const questionRefs = useRef({});

  const [lastRead, setLastRead] = useState(() => {
    try { return JSON.parse(localStorage.getItem('js_revision_last_read')) || null; }
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
        localStorage.setItem('js_revision_last_read', JSON.stringify(data));
      }
      return { ...prev, [key]: !prev[key] };
    });
  };

  const jumpToLastRead = () => {
    if (!lastRead) return;
    // Parse section index from key ("sIdx-qIdx") and expand that section first
    const sectionIdx = parseInt(lastRead.key.split('-')[0], 10);
    setCollapsedSections(prev => ({ ...prev, [sectionIdx]: false }));
    setOpenAnswers(prev => ({ ...prev, [lastRead.key]: true }));
    // Wait for section to render, then scroll
    setTimeout(() => {
      const el = questionRefs.current[lastRead.key];
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 80);
  };

  const clearLastRead = () => {
    setLastRead(null);
    localStorage.removeItem('js_revision_last_read');
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
      {/* Header */}
      <header className="border-b border-[#1f1f1f] bg-[#0a0a0a]/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16 py-5 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Link to="/sheet" className="text-yellow-400 hover:text-yellow-300 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <div>
              <h1 className="text-2xl font-bold leading-tight">
                <span className="text-yellow-400">JavaScript</span> Revision
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
        {/* Search */}
        <div className="relative">
          <svg className="w-4 h-4 text-gray-500 absolute left-4 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search any question or keyword..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-[#141414] border border-[#2a2a2a] rounded-xl px-5 py-4 pl-12 pr-11 text-white placeholder-gray-600 focus:outline-none focus:border-yellow-400/60 transition-colors text-base"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors text-lg leading-none">×</button>
          )}
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Total Questions', value: totalQuestions, color: 'text-yellow-400' },
            { label: 'Revealed', value: revealedCount, color: 'text-emerald-400' },
            { label: 'Topics', value: revisionSections.length, color: 'text-sky-400' },
          ].map(s => (
            <div key={s.label} className="bg-[#111] border border-[#1f1f1f] rounded-xl p-6 text-center">
              <div className={`text-4xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-sm text-gray-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Last Read Banner */}
        {lastRead && (
          <div className="flex items-center justify-between bg-yellow-400/8 border border-yellow-400/30 rounded-xl px-4 py-3 gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-yellow-400 text-base flex-shrink-0">📍</span>
              <div className="min-w-0">
                <p className="text-xs text-gray-500 mb-0.5">Last read · {lastRead.sectionTitle}</p>
                <p className="text-sm font-medium text-white truncate">{lastRead.question}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button onClick={jumpToLastRead} className="px-3 py-1.5 bg-yellow-400 hover:bg-yellow-300 text-black text-xs font-bold rounded-lg transition-colors">Resume →</button>
              <button onClick={clearLastRead} className="text-gray-600 hover:text-gray-400 text-sm transition-colors">✕</button>
            </div>
          </div>
        )}

        {/* No results */}
        {q && filteredSections.length === 0 && (
          <div className="text-center py-16 text-gray-600">
            <div className="text-4xl mb-3">🔍</div>
            <p className="text-sm">No questions match <span className="text-gray-400">"{searchQuery}"</span></p>
            <button onClick={() => setSearchQuery('')} className="mt-3 text-yellow-400 text-xs hover:underline">Clear search</button>
          </div>
        )}

        {/* Sections */}
        {filteredSections.map((section, sIdx) => {
          const originalIdx = revisionSections.findIndex(s => s.title === section.title);
          const isCollapsed = q ? false : collapsedSections[originalIdx];
          return (
            <div key={sIdx}>
              {/* Section header */}
              <button
                onClick={() => toggleSection(originalIdx)}
                className="w-full flex items-center justify-between py-4 group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-yellow-400 font-bold text-lg">{section.title}</span>
                  <span className="text-sm text-gray-500 bg-[#1a1a1a] px-2.5 py-0.5 rounded-full">{section.questions.length}Q</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-px bg-[#1f1f1f] w-20 hidden sm:block" />
                  <svg className={`w-4 h-4 text-yellow-400/60 transition-transform duration-200 ${isCollapsed ? '' : 'rotate-180'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>
              <div className="h-px bg-[#1f1f1f] mb-2" />

              {/* Questions flat list */}
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
                            ? 'bg-yellow-400/[0.06] border-yellow-400/20'
                            : isLastRead
                            ? 'border-yellow-400/15'
                            : 'border-[#161616]'
                        }`}
                      >
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => toggleAnswer(key, item.q, section.title)}
                            className="flex-1 flex items-center justify-between px-2 py-5 text-left hover:bg-white/[0.03] transition-colors rounded"
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              {isLastRead && <span className="text-yellow-400 text-xs flex-shrink-0">📌</span>}
                              <span className={`text-[17px] leading-snug ${isLastRead ? 'text-yellow-200' : 'text-gray-200'}`}>{item.q}</span>
                            </div>
                            <svg className={`w-3.5 h-3.5 text-gray-600 flex-shrink-0 ml-3 transition-transform duration-200 ${isOpen ? 'rotate-180 text-yellow-400' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                            <p className="text-[16px] text-yellow-300/80 px-2 pb-1 leading-relaxed">
                              <span className="text-yellow-500 mr-1">→</span>{item.a}
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

        {/* Search result count */}
        {q && filteredSections.length > 0 && (
          <p className="text-xs text-gray-600 text-center pt-2">{totalVisible} result{totalVisible !== 1 ? 's' : ''} for "{searchQuery}"</p>
        )}
      </div>

      <div className="pb-10" />
      <Footer />
    </div>
  );
}

export default JSSheet;
