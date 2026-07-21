import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import ThemeToggle from '../components/ThemeToggle';

const revisionSections = [
  {
    title: '1. Basic HTML (1-20)',
    questions: [
      { q: 'What is HTML?', a: 'Markup language for creating web pages.' },
      { q: 'HTML stands for?', a: 'HyperText Markup Language.' },
      { q: 'What is a tag?', a: 'Keyword inside < > (e.g., <p>).' },
      { q: 'What is an element?', a: 'Tag + content.' },
      { q: 'Tag vs Element?', a: 'Tag = <p>, Element = <p>Hello</p>.' },
      { q: 'What is an attribute?', a: 'Extra info inside tag (e.g., id="x").' },
      { q: 'Basic structure?', a: 'html -> head -> body.' },
      { q: 'DOCTYPE?', a: 'Defines HTML version.' },
      { q: 'What is the <html> tag?', a: 'Root element.' },
      { q: '<head> vs <body>?', a: 'Head = metadata, Body = visible content.' },
      { q: 'What is <title>?', a: 'Page title in browser tab.' },
      { q: 'Heading tags?', a: '<h1> to <h6>.' },
      { q: 'What is <p> tag?', a: 'Paragraph.' },
      { q: 'What is <br>?', a: 'Line break.' },
      { q: '<br> vs <hr>?', a: 'Break vs horizontal line.' },
      { q: '<strong> vs <b>?', a: 'Semantic vs visual bold.' },
      { q: '<em> vs <i>?', a: 'Semantic vs italic.' },
      { q: 'Comment syntax?', a: '<!-- comment -->.' },
      { q: 'How to write comments?', a: '<!-- text -->.' },
      { q: 'Semantic tags?', a: 'Meaningful tags like <header>.' },
    ]
  },
  {
    title: '2. Text and Formatting (21-35)',
    questions: [
      { q: 'What is <span>?', a: 'Inline container.' },
      { q: '<div> vs <span>?', a: 'Block vs inline.' },
      { q: 'What is <pre>?', a: 'Preserves spaces.' },
      { q: 'What is <code>?', a: 'Displays code.' },
      { q: 'What is <blockquote>?', a: 'Long quote.' },
      { q: 'What is <mark>?', a: 'Highlight text.' },
      { q: 'What is <small>?', a: 'Smaller text.' },
      { q: '<sub> and <sup>?', a: 'Subscript / superscript.' },
      { q: 'What is <abbr>?', a: 'Abbreviation.' },
      { q: 'What is <cite>?', a: 'Reference title.' },
      { q: 'What is <bdo>?', a: 'Text direction.' },
      { q: 'What is <address>?', a: 'Contact info.' },
      { q: 'What is <time>?', a: 'Date/time.' },
      { q: '<ins> and <del>?', a: 'Inserted / deleted text.' },
      { q: 'Inline vs block?', a: 'Inline = no new line, Block = new line.' },
    ]
  },
  {
    title: '3. Links and Media (36-50)',
    questions: [
      { q: 'What is <a> tag?', a: 'Hyperlink.' },
      { q: 'What is href?', a: 'Link URL.' },
      { q: 'What is target="_blank"?', a: 'Opens in new tab.' },
      { q: 'What is <img>?', a: 'Displays image.' },
      { q: 'What is alt?', a: 'Image description.' },
      { q: 'What is <audio>?', a: 'Audio file.' },
      { q: 'What is <video>?', a: 'Video file.' },
      { q: 'What is <source>?', a: 'Media source.' },
      { q: 'What is <iframe>?', a: 'Embed page.' },
      { q: 'Absolute vs relative URL?', a: 'Full vs local path.' },
      { q: '<figure> and <figcaption>?', a: 'Image + caption.' },
      { q: 'Image map?', a: 'Clickable areas.' },
      { q: 'What is <map>?', a: 'Defines map.' },
      { q: 'What is <track>?', a: 'Subtitles.' },
      { q: 'Lazy loading?', a: 'Load images on scroll.' },
    ]
  },
  {
    title: '4. Lists, Tables, and Forms (51-85)',
    questions: [
      { q: 'Lists?', a: 'Group items.' },
      { q: 'Types of lists?', a: 'Ordered, unordered, description.' },
      { q: 'What is <ul>?', a: 'Unordered list.' },
      { q: 'What is <ol>?', a: 'Ordered list.' },
      { q: 'What is <li>?', a: 'List item.' },
      { q: '<ul> vs <ol>?', a: 'Bullets vs numbers.' },
      { q: 'What is <dl>?', a: 'Description list.' },
      { q: '<dt> and <dd>?', a: 'Term and definition.' },
      { q: 'What is <table>?', a: 'Table structure.' },
      { q: 'What is <tr>?', a: 'Row.' },
      { q: '<td> and <th>?', a: 'Data and header.' },
      { q: 'colspan and rowspan?', a: 'Merge cells.' },
      { q: '<thead> <tbody> <tfoot>?', a: 'Table sections.' },
      { q: 'Table vs div layout?', a: 'Old vs modern layout.' },
      { q: 'What is <caption>?', a: 'Table title.' },
      { q: 'What is <form>?', a: 'User input form.' },
      { q: 'What is action?', a: 'Server URL.' },
      { q: 'What is method?', a: 'GET/POST.' },
      { q: 'GET vs POST?', a: 'URL vs body, less secure vs secure.' },
      { q: 'What is <input>?', a: 'Input field.' },
      { q: 'Input types?', a: 'text, password, email, etc.' },
      { q: 'What is name?', a: 'Field identifier.' },
      { q: 'What is placeholder?', a: 'Hint text.' },
      { q: 'What is required?', a: 'Mandatory field.' },
      { q: 'What is <label>?', a: 'Input label.' },
      { q: 'What is <textarea>?', a: 'Multi-line input.' },
      { q: '<select> and <option>?', a: 'Dropdown.' },
      { q: 'What is <button>?', a: 'Click button.' },
      { q: 'Button vs submit?', a: 'Flexible button vs simple submit.' },
      { q: 'Form validation?', a: 'Input checking.' },
      { q: 'What is pattern?', a: 'Regex validation.' },
      { q: 'What is autocomplete?', a: 'Auto-fill.' },
      { q: 'What is novalidate?', a: 'Disable validation.' },
      { q: '<fieldset> and <legend>?', a: 'Group form fields.' },
      { q: 'What is datalist?', a: 'Suggestions list.' },
    ]
  },
  {
    title: '5. HTML5 and Advanced (86-100)',
    questions: [
      { q: 'What is HTML5?', a: 'Latest HTML version.' },
      { q: 'HTML5 features?', a: 'Audio, video, semantic tags.' },
      { q: 'Semantic HTML?', a: 'Meaningful structure.' },
      { q: 'Examples of semantic tags?', a: '<header>, <footer>.' },
      { q: 'What is <header>?', a: 'Top section.' },
      { q: 'What is <footer>?', a: 'Bottom section.' },
      { q: 'What is <section>?', a: 'Page section.' },
      { q: 'What is <article>?', a: 'Independent content.' },
      { q: 'What is <nav>?', a: 'Navigation links.' },
      { q: 'What is <aside>?', a: 'Sidebar.' },
      { q: 'localStorage vs sessionStorage?', a: 'Permanent vs session.' },
      { q: 'Canvas?', a: 'Drawing graphics.' },
      { q: 'SVG?', a: 'Vector graphics.' },
      { q: 'Meta tag?', a: 'Page info.' },
      { q: 'Viewport meta?', a: 'Responsive design.' },
    ]
  },
];

const totalQuestions = revisionSections.reduce((s, sec) => s + sec.questions.length, 0);

function HTMLSheet({ auth, setAuth }) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [openAnswers, setOpenAnswers] = useState({});
  const [collapsedSections, setCollapsedSections] = useState(
    () => revisionSections.reduce((acc, _, i) => ({ ...acc, [i]: true }), {})
  );
  const questionRefs = useRef({});

  const [lastRead, setLastRead] = useState(() => {
    try { return JSON.parse(localStorage.getItem('html_revision_last_read')) || null; }
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
        localStorage.setItem('html_revision_last_read', JSON.stringify(data));
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
    localStorage.removeItem('html_revision_last_read');
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
            <Link to="/sheet" className="text-orange-400 hover:text-orange-300 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <div>
              <h1 className="text-2xl font-bold leading-tight">
                <span className="text-orange-400">HTML</span> Revision
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
            className="w-full bg-[#141414] border border-[#2a2a2a] rounded-xl px-5 py-4 pl-12 pr-11 text-white placeholder-gray-600 focus:outline-none focus:border-orange-400/60 transition-colors text-base"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors text-lg leading-none">x</button>
          )}
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Total Questions', value: totalQuestions, color: 'text-orange-400' },
            { label: 'Revealed', value: revealedCount, color: 'text-emerald-400' },
            { label: 'Topics', value: revisionSections.length, color: 'text-sky-400' },
          ].map(s => (
            <div key={s.label} className="bg-[#111] border border-[#1f1f1f] rounded-xl p-6 text-center">
              <div className={`text-4xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-sm text-gray-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {lastRead && (
          <div className="flex items-center justify-between bg-orange-400/8 border border-orange-400/30 rounded-xl px-4 py-3 gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-orange-400 text-base flex-shrink-0">Pinned</span>
              <div className="min-w-0">
                <p className="text-xs text-gray-500 mb-0.5">Last read · {lastRead.sectionTitle}</p>
                <p className="text-sm font-medium text-white truncate">{lastRead.question}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button onClick={jumpToLastRead} className="px-3 py-1.5 bg-orange-400 hover:bg-orange-300 text-black text-xs font-bold rounded-lg transition-colors">Resume</button>
              <button onClick={clearLastRead} className="text-gray-600 hover:text-gray-400 text-sm transition-colors">x</button>
            </div>
          </div>
        )}

        {q && filteredSections.length === 0 && (
          <div className="text-center py-16 text-gray-600">
            <div className="text-4xl mb-3">No Match</div>
            <p className="text-sm">No questions match <span className="text-gray-400">"{searchQuery}"</span></p>
            <button onClick={() => setSearchQuery('')} className="mt-3 text-orange-400 text-xs hover:underline">Clear search</button>
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
                  <span className="text-orange-400 font-bold text-lg">{section.title}</span>
                  <span className="text-sm text-gray-500 bg-[#1a1a1a] px-2.5 py-0.5 rounded-full">{section.questions.length}Q</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-px bg-[#1f1f1f] w-20 hidden sm:block" />
                  <svg className={`w-4 h-4 text-orange-400/60 transition-transform duration-200 ${isCollapsed ? '' : 'rotate-180'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                            ? 'bg-orange-400/[0.06] border-orange-400/20'
                            : isLastRead
                            ? 'border-orange-400/15'
                            : 'border-[#161616]'
                        }`}
                      >
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => toggleAnswer(key, item.q, section.title)}
                            className="flex-1 flex items-center justify-between px-2 py-5 text-left hover:bg-white/[0.03] transition-colors rounded"
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              {isLastRead && <span className="text-orange-400 text-xs flex-shrink-0">Pin</span>}
                              <span className={`text-[17px] leading-snug ${isLastRead ? 'text-orange-200' : 'text-gray-200'}`}>{item.q}</span>
                            </div>
                            <svg className={`w-3.5 h-3.5 text-gray-600 flex-shrink-0 ml-3 transition-transform duration-200 ${isOpen ? 'rotate-180 text-orange-400' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                            <p className="text-[16px] text-orange-300/80 px-2 pb-1 leading-relaxed">
                              <span className="text-orange-500 mr-1">Answer:</span>{item.a}
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

export default HTMLSheet;
