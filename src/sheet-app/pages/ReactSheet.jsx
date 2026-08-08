import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import ThemeToggle from '../components/ThemeToggle';

const revisionSections = [
  {
    title: '1. React Basics (1-20)',
    questions: [
      { q: 'What is React?', a: 'React is a JavaScript library used to build interactive user interfaces, such as pages, forms, and dashboards.' },
      { q: 'Who developed React?', a: 'React was created by Facebook, now called Meta.' },
      { q: 'SPA?', a: 'SPA means Single Page Application. It changes the content on the page without fully reloading the browser.' },
      { q: 'Component?', a: 'A component is a small, reusable piece of the UI. For example: a Navbar, Button, or Product Card.' },
      { q: 'Types of components?', a: 'React has functional components and class components. Modern React mainly uses functional components.' },
      { q: 'Functional component?', a: 'It is a JavaScript function that returns JSX, which React displays on the screen.' },
      { q: 'JSX?', a: 'JSX lets you write HTML-like code inside JavaScript. It makes React UI code easier to read.' },
      { q: 'Why JSX?', a: 'JSX keeps the UI and its JavaScript logic together, making components easier to write and understand.' },
      { q: 'Props?', a: 'Props are values passed from a parent component to a child component. A child should not change them.' },
      { q: 'State?', a: 'State is data a component remembers and can update, such as a counter value or form input.' },
      { q: 'Props vs State?', a: 'Props come from the parent and are read-only. State belongs to the component and can change over time.' },
      { q: 'Virtual DOM?', a: 'The Virtual DOM is React’s lightweight copy of the page structure. React compares changes here before updating the real page.' },
      { q: 'Why Virtual DOM?', a: 'It helps React update only the parts of the page that changed, instead of rebuilding the whole page.' },
      { q: 'Key in React?', a: 'A key is a unique value for each item in a list. It helps React identify which item changed, was added, or was removed.' },
      { q: 'React Fragment?', a: 'A Fragment groups multiple elements without adding an extra div to the page. You can write it as <>...</>.' },
      { q: 'Event handling?', a: 'React handles user actions with props such as onClick and onChange.' },
      { q: 'Conditional rendering?', a: 'It means showing different UI based on a condition, for example showing “Login” only when a user is logged out.' },
      { q: 'Lists in React?', a: 'Use JavaScript map() to turn an array of data into a list of React elements.' },
      { q: 'Controlled component?', a: 'A controlled form input gets its value from React state, so React is in charge of the input value.' },
      { q: 'Uncontrolled component?', a: 'An uncontrolled input keeps its value in the DOM itself. You usually read it with a ref when needed.' },
    ]
  },
  {
    title: '2. Hooks (21-45)',
    questions: [
      { q: 'Hook?', a: 'A Hook is a special React function that lets functional components use features like state, effects, and shared data.' },
      { q: 'useState?', a: 'useState lets a component remember a value and update the screen when that value changes.' },
      { q: 'Syntax?', a: 'useState returns two values: [state, setState]. The first is the current value; the second updates it.' },
      { q: 'useEffect?', a: 'useEffect runs code after React updates the screen. Use it for work like API calls, timers, or event listeners.' },
      { q: 'When useEffect runs?', a: 'It runs after the component renders. Its dependency array decides when it runs again.' },
      { q: 'Dependency array?', a: 'The dependency array is the second value in useEffect. It tells React which values should trigger the effect again.' },
      { q: 'Empty array?', a: 'An empty array [] means the effect runs once when the component first appears.' },
      { q: 'Cleanup function?', a: 'A cleanup function removes work created by an effect, such as a timer or event listener, when the component leaves the page.' },
      { q: 'useContext?', a: 'useContext lets components share data, such as theme or logged-in user details, without passing props through every level.' },
      { q: 'useRef?', a: 'useRef keeps a value between renders without causing a re-render. It is often used to access an input or another DOM element.' },
      { q: 'useMemo?', a: 'useMemo saves the result of an expensive calculation and recalculates it only when its dependencies change.' },
      { q: 'useCallback?', a: 'useCallback saves a function reference so it is not recreated on every render unless its dependencies change.' },
      { q: 'Custom hook?', a: 'A custom hook is your own reusable function that combines React hooks, such as useFetch or useWindowSize.' },
      { q: 'Rules of hooks?', a: 'Call hooks only at the top level of a React component or custom hook, never inside loops, conditions, or regular functions.' },
      { q: 'Why hooks?', a: 'Hooks let functional components use state, effects, context, and reusable logic without writing class components.' },
      { q: 'Are state updates asynchronous?', a: 'React schedules state updates, so the new value may not be available immediately in the same function. Use a functional update when the next state depends on the previous state.' },
      { q: 'What is batching?', a: 'Batching groups multiple state updates into one render to improve performance.' },
      { q: 'What causes a re-render?', a: 'A component re-renders when its state changes, its parent renders, or its consumed context changes. New props usually arrive when the parent renders.' },
      { q: 'What causes an infinite loop in useEffect?', a: 'It usually happens when an effect updates state and that update changes one of the effect’s dependencies on every render.' },
      { q: 'Can we use multiple useEffect hooks?', a: 'Yes. Use separate effects for unrelated tasks so each effect stays easy to understand and clean up.' },
      { q: 'What is useLayoutEffect?', a: 'useLayoutEffect runs after DOM changes but before the browser paints. It is useful for measuring or adjusting layout without visible flicker.' },
      { q: 'useEffect vs useLayoutEffect?', a: 'useEffect runs after the browser paints; useLayoutEffect runs before paint and can block it. Prefer useEffect unless layout measurement is required.' },
      { q: 'What is useReducer?', a: 'useReducer manages state with a reducer function and actions. It is useful when state has several related values or complex update rules.' },
      { q: 'What is dispatch?', a: 'dispatch sends an action to a reducer. The reducer uses that action to calculate and return the next state.' },
      { q: 'What is initial state?', a: 'Initial state is the value a state hook uses on the component’s first render.' },
    ]
  },
  {
    title: '3. React Routing and Forms (46-65)',
    questions: [
      { q: 'What is React Router?', a: 'React Router is a library for showing different components based on the URL in a React application.' },
      { q: 'What is BrowserRouter?', a: 'BrowserRouter wraps the app and uses the browser History API to keep the UI and URL in sync.' },
      { q: 'What is a Route?', a: 'A Route connects a URL path to the React element that should be displayed.' },
      { q: 'What is Link?', a: 'Link changes routes without a full page reload, so client-side navigation stays fast.' },
      { q: 'What is useNavigate?', a: 'useNavigate returns a function for navigation from code, such as after login or form submission.' },
      { q: 'What is dynamic routing?', a: 'Dynamic routing uses URL parameters such as /users/:id. Read the value with useParams().' },
      { q: 'How are forms handled in React?', a: 'Forms are commonly handled with controlled inputs: store each value in state and update it with onChange.' },
      { q: 'What does onChange do?', a: 'onChange runs when an input value changes. It is commonly used to copy the new value into state.' },
      { q: 'What does onSubmit do?', a: 'onSubmit runs when a form is submitted, including by clicking its submit button or pressing Enter.' },
      { q: 'Why use preventDefault?', a: 'event.preventDefault() stops the browser’s normal form submission and page reload so React can handle it.' },
      { q: 'What is form validation?', a: 'Validation checks that input values meet requirements before submitting and shows useful error messages when they do not.' },
      { q: 'What is Formik?', a: 'Formik is a form library that helps manage values, validation, errors, and submission.' },
      { q: 'What is React Hook Form?', a: 'React Hook Form is a form library that uses refs and hooks to manage forms with fewer re-renders.' },
      { q: 'How do you handle form errors?', a: 'Store or receive validation errors and display a clear message near the related field.' },
      { q: 'What is lifting state up?', a: 'Move shared state to the nearest common parent, then pass the value and update function to its children.' },
      { q: 'What is prop drilling?', a: 'Prop drilling means passing props through several components that do not use them just to reach a deeply nested child.' },
      { q: 'How can prop drilling be avoided?', a: 'Use component composition first; for widely shared data, use Context or a state-management library.' },
      { q: 'What are nested routes?', a: 'Nested routes display child routes inside a parent route, usually through React Router’s Outlet component.' },
      { q: 'How do you redirect in React Router?', a: 'Render Navigate for a declarative redirect, or call the function returned by useNavigate for a programmatic redirect.' },
      { q: 'What is lazy loading?', a: 'Lazy loading downloads a component only when it is needed, reducing the initial JavaScript bundle.' },
    ]
  },
  {
    title: '4. Advanced React (66-85)',
    questions: [
      { q: 'What is Redux?', a: 'Redux is a predictable state-management library that keeps shared state in one store and updates it through actions and reducers.' },
      { q: 'What is a Redux store?', a: 'The store holds the application state and provides methods to read state, dispatch actions, and subscribe to updates.' },
      { q: 'What is an action?', a: 'An action is a plain object that describes what happened. It must have a type and may include extra data in a payload.' },
      { q: 'What is a reducer?', a: 'A reducer is a pure function that receives the current state and an action, then returns the next state without mutating the old state.' },
      { q: 'What does dispatch do in Redux?', a: 'dispatch sends an action to the store, which runs the reducer and notifies subscribed UI when state changes.' },
      { q: 'What is Redux middleware?', a: 'Middleware runs between dispatch and the reducer. It is used for logging, async work, and other side effects.' },
      { q: 'Context vs Redux?', a: 'Context is good for simple, infrequently changing shared values. Redux offers stronger tools for large or complex state and predictable updates.' },
      { q: 'What is memoization?', a: 'Memoization reuses a previous result when its inputs have not changed, avoiding unnecessary work.' },
      { q: 'What is React.memo?', a: 'React.memo can skip re-rendering a component when its props are unchanged. It is a performance optimization, not a guarantee.' },
      { q: 'What is code splitting?', a: 'Code splitting divides the JavaScript bundle into smaller files that can be loaded only when needed.' },
      { q: 'What is Suspense?', a: 'Suspense displays fallback UI while a supported child is waiting, commonly with lazy-loaded components or Suspense-enabled data sources.' },
      { q: 'What is an error boundary?', a: 'An error boundary catches rendering errors in its child tree and shows fallback UI. It does not catch event-handler or most async errors.' },
      { q: 'What is StrictMode?', a: 'StrictMode adds development-only checks and may run logic extra times to reveal unsafe side effects. It does not affect production output.' },
      { q: 'What are portals?', a: 'Portals render React children into a different DOM node while keeping them in the same React tree. They are useful for modals and tooltips.' },
      { q: 'What are refs?', a: 'Refs hold a mutable value without causing a render and can point to DOM elements for focus, measurement, or scrolling.' },
      { q: 'What is forwardRef?', a: 'forwardRef lets a component receive a ref from its parent and pass it to a child DOM node. In React 19, ref can also be passed as a prop.' },
      { q: 'What is a Higher-Order Component?', a: 'A Higher-Order Component is a function that takes a component and returns an enhanced component. Hooks are usually preferred for sharing logic today.' },
      { q: 'What are render props?', a: 'Render props share behavior by passing a function prop that returns UI. Custom hooks are often a simpler modern alternative.' },
      { q: 'What is debouncing?', a: 'Debouncing waits until events stop for a set time before running a function, such as delaying search until typing pauses.' },
      { q: 'What is throttling?', a: 'Throttling limits a function to run at most once per interval, which is useful for scroll or resize events.' },
    ]
  },
  {
    title: '5. React Interview Focus (86-100)',
    questions: [
      { q: 'Why use React?', a: 'React makes complex UIs easier to build with reusable components, declarative rendering, and a large ecosystem.' },
      { q: 'What are React’s advantages?', a: 'Its main advantages are reusable components, one-way data flow, efficient UI updates, strong tooling, and a large community.' },
      { q: 'What are React’s disadvantages?', a: 'React covers the UI layer, so projects must choose routing and other tools. Its ecosystem and frequent changes can also increase the learning curve.' },
      { q: 'Virtual DOM vs Real DOM?', a: 'The real DOM is the browser’s page tree. React uses an in-memory representation to calculate the smallest set of real DOM updates needed.' },
      { q: 'Why are keys important?', a: 'Stable, unique keys help React match list items between renders so it preserves the correct state and updates efficiently. Avoid array indexes when item order can change.' },
      { q: 'What is state immutability?', a: 'Do not directly change existing state objects or arrays. Create a new value so React can detect the update reliably.' },
      { q: 'What are React best practices?', a: 'Keep components focused, use stable keys, avoid unnecessary state and effects, keep state close to where it is used, and reuse logic with hooks.' },
      { q: 'How should a React project be structured?', a: 'Group related components, hooks, tests, and styles by feature. Use a consistent structure that stays easy to navigate as the app grows.' },
      { q: 'How do you optimize React performance?', a: 'Measure first, then reduce unnecessary renders, keep state local, virtualize long lists, lazy-load code, and memoize only expensive work.' },
      { q: 'How do you call an API in React?', a: 'Use fetch or a request library in an event handler or effect, and handle loading, success, error, and request cancellation states.' },
      { q: 'What is Axios?', a: 'Axios is an HTTP client with convenient JSON handling, interceptors, request configuration, and error handling.' },
      { q: 'How are environment variables used?', a: 'Store environment-specific public configuration in env files and read it through the build tool, such as import.meta.env in Vite. Never put secrets in frontend code.' },
      { q: 'What is a production build?', a: 'A production build creates optimized static files, usually minified and split into efficient bundles, ready to deploy.' },
      { q: 'How is a React app deployed?', a: 'Build the app, upload the output to a static host or server, and configure fallback routing so client-side URLs load correctly.' },
      { q: 'React vs Angular?', a: 'React is mainly a UI library with flexible tool choices. Angular is a full framework with built-in routing, dependency injection, forms, and stronger conventions.' },
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
              <span className="text-cyan-400 text-base flex-shrink-0">📍</span>
              <div className="min-w-0">
                <p className="text-xs text-gray-500 mb-0.5">Last read · {lastRead.sectionTitle}</p>
                <p className="text-sm font-medium text-white truncate">{lastRead.question}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button onClick={jumpToLastRead} className="px-3 py-1.5 bg-cyan-400 hover:bg-cyan-300 text-black text-xs font-bold rounded-lg transition-colors">Resume →</button>
              <button onClick={clearLastRead} className="text-gray-600 hover:text-gray-400 text-sm transition-colors">✕</button>
            </div>
          </div>
        )}

        {q && filteredSections.length === 0 && (
          <div className="text-center py-16 text-gray-600">
            <div className="text-4xl mb-3">🔍</div>
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
                              {isLastRead && <span className="text-cyan-400 text-xs flex-shrink-0">📌</span>}
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
