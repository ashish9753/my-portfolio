import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import ThemeToggle from '../components/ThemeToggle';

const revisionSections = [
  {
    title: '1. Node.js Basics (1-20)',
    questions: [
      { q: 'What is Node.js?', a: 'Runs JavaScript outside the browser. Example: make an API server.' },
      { q: 'Built on?', a: 'Chrome’s V8 JavaScript engine. Example: it converts JS into fast machine code.' },
      { q: 'Why Node.js?', a: 'Good for many I/O requests. Example: chat app or API.' },
      { q: 'Single-threaded?', a: 'JS runs on one main thread; Node uses an event loop and workers for I/O.' },
      { q: 'Blocking vs Non-blocking?', a: 'Blocking waits; non-blocking continues. Example: readFileSync vs readFile.' },
      { q: 'Event-driven?', a: 'Code reacts to events. Example: server runs code when a request arrives.' },
      { q: 'NPM?', a: 'Node Package Manager. Example: npm install express.' },
      { q: 'Package.json?', a: 'Project details and dependencies. Example: lists express version.' },
      { q: 'Module?', a: 'Reusable file of code. Example: math.js exports add().' },
      { q: 'Built-in modules?', a: 'Modules included with Node. Example: fs, http, path.' },
      { q: 'require()?', a: 'Imports a CommonJS module. Example: const fs = require("fs").' },
      { q: 'module.exports?', a: 'Exports from a CommonJS file. Example: module.exports = add.' },
      { q: 'REPL?', a: 'Node’s interactive JS shell. Example: type node, then 2 + 2.' },
      { q: 'Global objects?', a: 'Available without importing. Example: process, __dirname, console.' },
      { q: 'process?', a: 'Info/control for the running app. Example: process.env.PORT.' },
      { q: '__dirname?', a: 'Current file’s folder path. Example: path.join(__dirname, "file.txt").' },
      { q: '__filename?', a: 'Current file’s full path. Example: log __filename for debugging.' },
      { q: 'Environment variables?', a: 'External config values. Example: PORT=3000.' },
      { q: '.env file?', a: 'Local file for environment values. Example: DB_URL=...; keep it private.' },
      { q: 'console.log()?', a: 'Prints a value to the terminal. Example: console.log("Server started").' },
    ]
  },
  {
    title: '2. Core Concepts (21-40)',
    questions: [
      { q: 'Event loop?', a: 'Lets Node handle async work without waiting. Example: serve another request while a file loads.' },
      { q: 'Callback?', a: 'Function called after a task. Example: fs.readFile(file, callback).' },
      { q: 'Callback hell?', a: 'Hard-to-read nested callbacks. Fix: use Promises or async/await.' },
      { q: 'Promise?', a: 'Object for a future async result. Example: fetchUser().then(...).' },
      { q: 'States of Promise?', a: 'Pending → fulfilled or rejected. Example: request is pending, then succeeds/fails.' },
      { q: 'Async/await?', a: 'Readable Promise syntax. Example: const user = await getUser().' },
      { q: 'Error handling?', a: 'Catch failures safely. Example: try { await work(); } catch (err) {}' },
      { q: 'Stream?', a: 'Processes data piece by piece. Example: stream a large video file.' },
      { q: 'Types of streams?', a: 'Readable, Writable, Duplex, Transform. Example: file read stream is Readable.' },
      { q: 'Buffer?', a: 'Temporary binary-data memory. Example: image bytes from a file.' },
      { q: 'fs module?', a: 'Works with files. Example: fs.readFile("note.txt", ...).' },
      { q: 'http module?', a: 'Creates an HTTP server. Example: http.createServer(handler).' },
      { q: 'path module?', a: 'Safely builds file paths. Example: path.join("src", "app.js").' },
      { q: 'os module?', a: 'Gives operating-system info. Example: os.cpus().' },
      { q: 'url module?', a: 'Reads/builds URLs. Example: new URL("https://site.com?a=1").' },
      { q: 'Middleware?', a: 'Function between request and response. Example: logs every request.' },
      { q: 'Thread pool?', a: 'Worker threads used for some heavy async tasks. Example: filesystem work.' },
      { q: 'Cluster?', a: 'Multiple Node processes share server load. Example: use all CPU cores.' },
      { q: 'Child process?', a: 'Starts another system process. Example: run a shell command with exec().' },
      { q: 'Worker threads?', a: 'Run CPU-heavy JS in parallel. Example: image calculation off the main thread.' },
    ]
  },
  {
    title: '3. Express.js (41-65)',
    questions: [
      { q: 'Express.js?', a: 'A Node framework for web servers/APIs. Example: app.get("/users", ...).' },
      { q: 'Why Express?', a: 'Makes routes and middleware simple. Example: app.post("/login", handler).' },
      { q: 'App?', a: 'Main Express application object. Example: const app = express().' },
      { q: 'app.listen()?', a: 'Starts the server on a port. Example: app.listen(3000).' },
      { q: 'Routing?', a: 'Maps URL + method to code. Example: GET /products.' },
      { q: 'GET method?', a: 'Reads data. Example: GET /users.' },
      { q: 'POST method?', a: 'Creates/sends data. Example: POST /users.' },
      { q: 'PUT method?', a: 'Replaces or updates data. Example: PUT /users/7.' },
      { q: 'DELETE method?', a: 'Removes data. Example: DELETE /users/7.' },
      { q: 'Middleware?', a: 'Runs before the route response. Example: authenticate user first.' },
      { q: 'Types of middleware?', a: 'Built-in, custom, third-party, error. Example: express.json() is built-in.' },
      { q: 'req object?', a: 'Incoming request details. Example: req.body or req.params.id.' },
      { q: 'res object?', a: 'Sends the response. Example: res.json({ ok: true }).' },
      { q: 'next()?', a: 'Passes control to next middleware. Example: logger calls next().' },
      { q: 'Router?', a: 'Groups related routes. Example: router.get("/users", ...).' },
      { q: 'express.json()?', a: 'Reads JSON request bodies. Example: POST body {"name":"A"}.' },
      { q: 'Static files?', a: 'Files served directly. Example: app.use(express.static("public")).' },
      { q: 'Error middleware?', a: 'Central place to send errors. Example: (err, req, res, next) => res.status(500).' },
      { q: 'CORS?', a: 'Controls which origins may call an API. Example: allow your frontend domain.' },
      { q: 'Body parser?', a: 'Middleware that reads the request body. Example: express.json() replaces it for JSON.' },
      { q: 'REST API?', a: 'Resource-based HTTP API. Example: GET /users, POST /users.' },
      { q: 'Status codes?', a: 'HTTP result numbers. Example: 200 OK, 404 Not Found, 500 Server Error.' },
      { q: 'Query params?', a: 'Optional URL filters. Example: /products?category=books → req.query.category.' },
      { q: 'Route params?', a: 'Values inside a route path. Example: /users/:id → req.params.id.' },
      { q: 'Headers?', a: 'Request metadata. Example: req.headers.authorization.' },
    ]
  },
  {
    title: '4. Database and Auth (66-85)',
    questions: [
      { q: 'MongoDB?', a: 'NoSQL document database. Example: user stored as { name: "Asha" }.' },
      { q: 'Mongoose?', a: 'MongoDB object-modeling library for Node. Example: User.find().' },
      { q: 'Schema?', a: 'Rules for document shape. Example: name must be a String.' },
      { q: 'Model?', a: 'Mongoose object used to query a collection. Example: User.create(data).' },
      { q: 'CRUD?', a: 'Create, Read, Update, Delete. Example: create user, find user, edit, remove.' },
      { q: 'find()?', a: 'Gets matching documents. Example: User.find({ role: "admin" }).' },
      { q: 'save()?', a: 'Saves one document. Example: await new User(data).save().' },
      { q: 'updateOne()?', a: 'Updates first matching document. Example: User.updateOne({ _id }, { name }).' },
      { q: 'deleteOne()?', a: 'Deletes first matching document. Example: User.deleteOne({ _id }).' },
      { q: 'Indexing?', a: 'Speeds up searches. Example: index email when users log in by email.' },
      { q: 'Authentication?', a: 'Proves who the user is. Example: login checks email and password.' },
      { q: 'Authorization?', a: 'Checks permission. Example: only admin can delete a user.' },
      { q: 'JWT?', a: 'Signed token carrying user claims. Example: send token in Authorization header.' },
      { q: 'bcrypt?', a: 'Secure password-hashing library. Example: bcrypt.hash(password, 10).' },
      { q: 'Session?', a: 'Server stores login state; client holds session ID. Example: express-session.' },
      { q: 'Cookies?', a: 'Small browser-stored values sent with requests. Example: session ID cookie.' },
      { q: 'Secure cookies?', a: 'Protect cookies with flags. Example: httpOnly, secure, sameSite.' },
      { q: 'Helmet?', a: 'Express security-header middleware. Example: app.use(helmet()).' },
      { q: 'Rate limiting?', a: 'Limits repeated requests. Example: 100 API requests per 15 minutes.' },
      { q: 'Env security?', a: 'Keep secrets outside code. Example: put JWT_SECRET in .env, not Git.' },
    ]
  },
  {
    title: '5. Advanced Node (86-100)',
    questions: [
      { q: 'Why Node is fast?', a: 'It avoids waiting on I/O. Example: many users can wait for DB results together.' },
      { q: 'Scalability?', a: 'Ability to handle more users/load. Example: add instances behind a load balancer.' },
      { q: 'Microservices?', a: 'Small independent services. Example: separate payment and email services.' },
      { q: 'Monolith?', a: 'One application contains all features. Example: API, auth, and payments in one project.' },
      { q: 'Logging?', a: 'Records useful app events. Example: log request errors with timestamp.' },
      { q: 'PM2?', a: 'Node process manager. Example: restarts app after a crash.' },
      { q: 'Clustering?', a: 'Runs Node in several processes. Example: one worker per CPU core.' },
      { q: 'EventEmitter?', a: 'Object that emits/listens for events. Example: emitter.on("done", handler).' },
      { q: 'Streams vs Buffer?', a: 'Stream handles data gradually; Buffer holds data in memory. Example: video stream vs image bytes.' },
      { q: 'Security best practices?', a: 'Validate input, hash passwords, use HTTPS, limit requests. Example: reject invalid email.' },
      { q: 'Error handling?', a: 'Handle errors once in Express. Example: error middleware sends a safe 500 response.' },
      { q: 'Async best practice?', a: 'Use async APIs; avoid CPU work on main thread. Example: use worker_threads for heavy calculation.' },
      { q: 'API testing?', a: 'Send test requests and check results. Example: use Postman or automated tests.' },
      { q: 'Deployment?', a: 'Put app on a hosting platform. Example: set env vars on Render or AWS.' },
      { q: 'Node vs PHP?', a: 'Both build backends; Node uses JS and event-driven I/O. Example: choose based on team and project.' },
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
