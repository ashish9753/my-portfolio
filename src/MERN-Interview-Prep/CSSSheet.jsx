import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../sheet-app/components/Footer';

const revisionSections = [
  {
    title: '1. CSS Basics (1-20)',
    questions: [
      { q: 'What is CSS?', a: 'Styles HTML elements.' },
      { q: 'CSS stands for?', a: 'Cascading Style Sheets.' },
      { q: 'Types of CSS?', a: 'Inline, Internal, External.' },
      { q: 'Inline CSS?', a: 'Inside tag (style="").' },
      { q: 'Internal CSS?', a: 'Inside <style>.' },
      { q: 'External CSS?', a: 'Separate .css file.' },
      { q: 'Selector?', a: 'Targets elements.' },
      { q: 'Class selector?', a: '.class' },
      { q: 'ID selector?', a: '#id' },
      { q: 'Universal selector?', a: '*' },
      { q: 'Element selector?', a: 'p, h1' },
      { q: 'Group selector?', a: 'h1, p' },
      { q: 'Specificity?', a: 'Priority of styles.' },
      { q: 'Inline vs ID vs Class?', a: 'Inline > ID > Class.' },
      { q: 'Box model?', a: 'margin, border, padding, content.' },
      { q: 'Margin?', a: 'Outer space.' },
      { q: 'Padding?', a: 'Inner space.' },
      { q: 'Border?', a: 'Edge of element.' },
      { q: 'Display property?', a: 'block, inline, none.' },
      { q: 'Position?', a: 'static, relative, absolute, fixed.' },
    ]
  },
  {
    title: '2. CSS Layout and Flexbox (21-40)',
    questions: [
      { q: 'Flexbox?', a: '1D layout system.' },
      { q: 'display: flex?', a: 'Enables flexbox.' },
      { q: 'justify-content?', a: 'Horizontal alignment.' },
      { q: 'align-items?', a: 'Vertical alignment.' },
      { q: 'flex-direction?', a: 'row/column.' },
      { q: 'gap?', a: 'Space between items.' },
      { q: 'Grid?', a: '2D layout.' },
      { q: 'display: grid?', a: 'Enables grid.' },
      { q: 'grid-template-columns?', a: 'Define columns.' },
      { q: 'grid-template-rows?', a: 'Define rows.' },
      { q: 'z-index?', a: 'Layer order.' },
      { q: 'overflow?', a: 'Handle extra content.' },
      { q: 'float?', a: 'Align left/right.' },
      { q: 'clear?', a: 'Clear float.' },
      { q: 'visibility?', a: 'Hide/show.' },
      { q: 'opacity?', a: 'Transparency.' },
      { q: 'max-width?', a: 'Maximum width.' },
      { q: 'min-height?', a: 'Minimum height.' },
      { q: 'vh/vw?', a: 'Viewport units.' },
      { q: 'Responsive design?', a: 'Works on all screens.' },
    ]
  },
  {
    title: '3. CSS Advanced (41-60)',
    questions: [
      { q: 'Pseudo-class?', a: ':hover, :focus.' },
      { q: 'Pseudo-element?', a: '::before, ::after.' },
      { q: 'position: absolute?', a: 'Relative to parent.' },
      { q: 'position: fixed?', a: 'Fixed on screen.' },
      { q: 'position: sticky?', a: 'Sticky scroll.' },
      { q: 'transition?', a: 'Smooth change.' },
      { q: 'transform?', a: 'Rotate/scale/move.' },
      { q: 'animation?', a: 'Keyframe animation.' },
      { q: '@media?', a: 'Responsive rules.' },
      { q: 'rem vs em?', a: 'Root vs parent size.' },
      { q: 'overflow: hidden?', a: 'Hide overflow.' },
      { q: 'display: none?', a: 'Remove element.' },
      { q: 'inline-block?', a: 'Inline + size.' },
      { q: 'cursor?', a: 'Pointer style.' },
      { q: 'object-fit?', a: 'Image fitting.' },
      { q: 'box-sizing?', a: 'border-box/content-box.' },
      { q: 'calc()?', a: 'Dynamic values.' },
      { q: 'var()?', a: 'CSS variables.' },
      { q: 'filter?', a: 'Blur/brightness.' },
      { q: 'backdrop-filter?', a: 'Blur background.' },
    ]
  },
  {
    title: '4. Tailwind CSS (61-80)',
    questions: [
      { q: 'Tailwind CSS?', a: 'Utility-first framework.' },
      { q: 'Utility class?', a: 'Small reusable class.' },
      { q: 'Example?', a: 'p-4, bg-blue-500.' },
      { q: 'Flex in Tailwind?', a: 'flex.' },
      { q: 'Centering?', a: 'justify-center items-center.' },
      { q: 'Padding in Tailwind?', a: 'p-4.' },
      { q: 'Margin in Tailwind?', a: 'm-4.' },
      { q: 'Text color in Tailwind?', a: 'text-red-500.' },
      { q: 'Background in Tailwind?', a: 'bg-green-500.' },
      { q: 'Border radius in Tailwind?', a: 'rounded.' },
      { q: 'Shadow in Tailwind?', a: 'shadow-lg.' },
      { q: 'Width in Tailwind?', a: 'w-full.' },
      { q: 'Height in Tailwind?', a: 'h-screen.' },
      { q: 'Grid in Tailwind?', a: 'grid grid-cols-3.' },
      { q: 'Gap in Tailwind?', a: 'gap-4.' },
      { q: 'Responsive in Tailwind?', a: 'md:text-lg.' },
      { q: 'Hover in Tailwind?', a: 'hover:bg-red-500.' },
      { q: 'Focus in Tailwind?', a: 'focus:outline-none.' },
      { q: 'Dark mode in Tailwind?', a: 'dark:bg-black.' },
      { q: 'Font size in Tailwind?', a: 'text-xl.' },
    ]
  },
  {
    title: '5. CSS vs Tailwind (81-100)',
    questions: [
      { q: 'CSS vs Tailwind?', a: 'CSS = custom, Tailwind = utility classes.' },
      { q: 'Speed?', a: 'Tailwind faster.' },
      { q: 'Flexbox CSS?', a: 'display: flex.' },
      { q: 'Flexbox Tailwind?', a: 'flex.' },
      { q: 'Center CSS?', a: 'justify-content: center.' },
      { q: 'Center Tailwind?', a: 'justify-center.' },
      { q: 'Padding CSS?', a: 'padding: 16px.' },
      { q: 'Padding Tailwind?', a: 'p-4.' },
      { q: 'Color CSS?', a: 'color: red.' },
      { q: 'Color Tailwind?', a: 'text-red-500.' },
      { q: 'Responsive CSS?', a: '@media.' },
      { q: 'Responsive Tailwind?', a: 'md:, lg:.' },
      { q: 'Hover CSS?', a: ':hover.' },
      { q: 'Hover Tailwind?', a: 'hover:.' },
      { q: 'Reusability?', a: 'Tailwind higher.' },
      { q: 'Customization?', a: 'CSS more flexible.' },
      { q: 'File size?', a: 'Tailwind optimized.' },
      { q: 'Learning curve?', a: 'Tailwind easier.' },
      { q: 'Best for?', a: 'Tailwind = fast UI.' },
      { q: 'When use CSS?', a: 'Complex custom design.' },
    ]
  },
];

const totalQuestions = revisionSections.reduce((s, sec) => s + sec.questions.length, 0);

function CSSSheet({ auth, setAuth }) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [openAnswers, setOpenAnswers] = useState({});
  const [collapsedSections, setCollapsedSections] = useState(
    () => revisionSections.reduce((acc, _, i) => ({ ...acc, [i]: true }), {})
  );
  const questionRefs = useRef({});

  const [lastRead, setLastRead] = useState(() => {
    try { return JSON.parse(localStorage.getItem('css_revision_last_read')) || null; }
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
        localStorage.setItem('css_revision_last_read', JSON.stringify(data));
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
    localStorage.removeItem('css_revision_last_read');
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
            <Link to="/sheet" className="text-sky-400 hover:text-sky-300 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <div>
              <h1 className="text-2xl font-bold leading-tight">
                <span className="text-sky-400">CSS + TailwindCSS</span> Revision
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
            className="w-full bg-[#141414] border border-[#2a2a2a] rounded-xl px-5 py-4 pl-12 pr-11 text-white placeholder-gray-600 focus:outline-none focus:border-sky-400/60 transition-colors text-base"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors text-lg leading-none">x</button>
          )}
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Total Questions', value: totalQuestions, color: 'text-sky-400' },
            { label: 'Revealed', value: revealedCount, color: 'text-emerald-400' },
            { label: 'Topics', value: revisionSections.length, color: 'text-cyan-300' },
          ].map(s => (
            <div key={s.label} className="bg-[#111] border border-[#1f1f1f] rounded-xl p-6 text-center">
              <div className={`text-4xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-sm text-gray-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {lastRead && (
          <div className="flex items-center justify-between bg-sky-400/8 border border-sky-400/30 rounded-xl px-4 py-3 gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-sky-400 text-base flex-shrink-0">Pinned</span>
              <div className="min-w-0">
                <p className="text-xs text-gray-500 mb-0.5">Last read · {lastRead.sectionTitle}</p>
                <p className="text-sm font-medium text-white truncate">{lastRead.question}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button onClick={jumpToLastRead} className="px-3 py-1.5 bg-sky-400 hover:bg-sky-300 text-black text-xs font-bold rounded-lg transition-colors">Resume</button>
              <button onClick={clearLastRead} className="text-gray-600 hover:text-gray-400 text-sm transition-colors">x</button>
            </div>
          </div>
        )}

        {q && filteredSections.length === 0 && (
          <div className="text-center py-16 text-gray-600">
            <div className="text-4xl mb-3">No Match</div>
            <p className="text-sm">No questions match <span className="text-gray-400">"{searchQuery}"</span></p>
            <button onClick={() => setSearchQuery('')} className="mt-3 text-sky-400 text-xs hover:underline">Clear search</button>
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
                  <span className="text-sky-400 font-bold text-lg">{section.title}</span>
                  <span className="text-sm text-gray-500 bg-[#1a1a1a] px-2.5 py-0.5 rounded-full">{section.questions.length}Q</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-px bg-[#1f1f1f] w-20 hidden sm:block" />
                  <svg className={`w-4 h-4 text-sky-400/60 transition-transform duration-200 ${isCollapsed ? '' : 'rotate-180'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                            ? 'bg-sky-400/[0.06] border-sky-400/20'
                            : isLastRead
                            ? 'border-sky-400/15'
                            : 'border-[#161616]'
                        }`}
                      >
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => toggleAnswer(key, item.q, section.title)}
                            className="flex-1 flex items-center justify-between px-2 py-5 text-left hover:bg-white/[0.03] transition-colors rounded"
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              {isLastRead && <span className="text-sky-400 text-xs flex-shrink-0">Pin</span>}
                              <span className={`text-[17px] leading-snug ${isLastRead ? 'text-sky-200' : 'text-gray-200'}`}>{item.q}</span>
                            </div>
                            <svg className={`w-3.5 h-3.5 text-gray-600 flex-shrink-0 ml-3 transition-transform duration-200 ${isOpen ? 'rotate-180 text-sky-400' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                            <p className="text-[16px] text-sky-300/80 px-2 pb-1 leading-relaxed">
                              <span className="text-sky-500 mr-1">Answer:</span>{item.a}
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

export default CSSSheet;
