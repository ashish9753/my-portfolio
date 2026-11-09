import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import ThemeToggle from '../components/ThemeToggle';

const revisionSections = [
  {
    "title": "1. Node.js Basics",
    "questions": [
      {
        "q": "What is Node.js?",
        "a": "Node.js is a JavaScript runtime environment that allows us to run JavaScript outside the browser, mainly on the server side."
      },
      {
        "q": "Node.js is built on?",
        "a": "Node.js is built on Chrome's V8 JavaScript Engine."
      },
      {
        "q": "Why do we use Node.js?",
        "a": "- Fast execution. - Non-blocking I/O. - Handles multiple requests. - Good for APIs and real-time applications."
      },
      {
        "q": "Is Node.js single-threaded?",
        "a": "Yes, its JavaScript execution is primarily single-threaded, but it uses background threads for certain operations."
      },
      {
        "q": "What is blocking vs non-blocking?",
        "a": "- Blocking: Waits for an operation to finish before executing the next operation. - Non-blocking: Allows other operations to continue without waiting."
      },
      {
        "q": "What is event-driven architecture?",
        "a": "An architecture where execution depends on events, such as requests, clicks, or completed operations."
      },
      {
        "q": "What is NPM?",
        "a": "NPM (Node Package Manager) is used to install and manage Node.js packages. Example: npm install express"
      },
      {
        "q": "What is package.json?",
        "a": "It stores project information, dependencies, scripts, and project configuration."
      },
      {
        "q": "What is a module?",
        "a": "A module is a reusable block of code that can be imported into another file."
      },
      {
        "q": "What are built-in modules?",
        "a": "Modules provided by Node.js without installing external packages. Examples: fs, http, path, os, crypto."
      },
      {
        "q": "What is require()?",
        "a": "It is used to import modules in CommonJS. const fs = require(\"fs\");"
      },
      {
        "q": "What is module.exports?",
        "a": "It is used to export functions, objects, or variables from a module. module.exports = myFunction;"
      },
      {
        "q": "What is REPL?",
        "a": "REPL stands for Read, Evaluate, Print, Loop. It allows us to execute JavaScript commands directly in the terminal."
      },
      {
        "q": "What are global objects?",
        "a": "Objects available throughout a Node.js application without importing them. Examples: console, process, setTimeout, Buffer."
      },
      {
        "q": "What is process?",
        "a": "It provides information and control over the currently running Node.js process. console.log(process.env.PORT);"
      },
      {
        "q": "What is __dirname?",
        "a": "It gives the absolute directory path of the current file (in CommonJS)."
      },
      {
        "q": "What is __filename?",
        "a": "It gives the absolute path of the current file (in CommonJS)."
      },
      {
        "q": "What are environment variables?",
        "a": "Variables used to store configuration values, such as database URLs, ports, and API keys."
      },
      {
        "q": "What is a .env file?",
        "a": "A file used to store environment variables. Example: PORT=5000 MONGO_URI=mongodb://localhost:27017/test"
      },
      {
        "q": "What is console.log()?",
        "a": "It is used to print messages or values to the console."
      }
    ]
  },
  {
    "title": "2. Node.js Core Concepts",
    "questions": [
      {
        "q": "What is the Event Loop?",
        "a": "The Event Loop manages asynchronous operations and allows Node.js to handle multiple tasks without blocking the main JavaScript thread. Simplified flow JavaScript Code Call Stack Event Loop Callback Queue / Microtask Queue"
      },
      {
        "q": "What is a callback?",
        "a": "A function passed as an argument to another function and executed later. setTimeout(() => { console.log(\"Hello\"); }, 1000);"
      },
      {
        "q": "What is callback hell?",
        "a": "Nested callbacks that make code difficult to read and maintain."
      },
      {
        "q": "What is a Promise?",
        "a": "A Promise represents the eventual success or failure of an asynchronous operation."
      },
      {
        "q": "What are the three states of a Promise?",
        "a": "1. Pending 2. Fulfilled 3. Rejected"
      },
      {
        "q": "What is async/await?",
        "a": "It is a cleaner way to handle Promises and write asynchronous code. const data = await fetchData();"
      },
      {
        "q": "How do you handle errors in Node.js?",
        "a": "Using try...catch, .catch(), and Express error-handling middleware. try { const data = await getData(); } catch (error) { console.log(error.message); }"
      },
      {
        "q": "What is a Stream?",
        "a": "A stream processes data in small chunks instead of loading everything into memory."
      },
      {
        "q": "What are the types of streams?",
        "a": "- Readable – Reads data. - Writable – Writes data. - Duplex – Reads and writes data. - Transform – Modifies data while processing."
      },
      {
        "q": "What is Buffer?",
        "a": "Buffer is used to handle binary data, such as images, files, and network packets."
      },
      {
        "q": "What is the fs module?",
        "a": "The File System module is used to read, write, update, and delete files."
      },
      {
        "q": "What is the http module?",
        "a": "It is a built-in module used to create HTTP servers and handle requests and responses."
      },
      {
        "q": "What is the path module?",
        "a": "It helps work with file and directory paths."
      },
      {
        "q": "What is the os module?",
        "a": "It provides information about the operating system, CPU, and memory."
      },
      {
        "q": "What is the url module?",
        "a": "It helps parse and work with URLs."
      },
      {
        "q": "What is the Thread Pool?",
        "a": "A group of background threads used by Node.js (through libuv) for certain operations like file system tasks and cryptographic operations."
      },
      {
        "q": "What is Cluster?",
        "a": "Cluster allows us to create multiple Node.js processes that can share server ports and utilize multiple CPU cores."
      },
      {
        "q": "What is Child Process?",
        "a": "It allows Node.js to create and communicate with other processes."
      },
      {
        "q": "What are Worker Threads?",
        "a": "They allow JavaScript to run in parallel threads, especially for CPU-intensive tasks."
      },
      {
        "q": "Difference between Worker Threads and Cluster?",
        "a": "Worker Threads\tCluster Multiple threads\tMultiple processes Share memory when configured\tSeparate process memory Useful for CPU-heavy tasks\tUseful for scaling servers"
      }
    ]
  },
  {
    "title": "3. Express.js",
    "questions": [
      {
        "q": "What is Express.js?",
        "a": "Express.js is a lightweight Node.js framework used to build web servers and REST APIs."
      },
      {
        "q": "Why do we use Express.js?",
        "a": "It simplifies routing, middleware, request handling, and API development."
      },
      {
        "q": "What is an Express application?",
        "a": "It is an application instance created using express(). const app = express();"
      },
      {
        "q": "What is app.listen()?",
        "a": "It starts the Express server on a specified port. app.listen(5000);"
      },
      {
        "q": "What is routing?",
        "a": "Routing defines how an application responds to different URLs and HTTP methods."
      },
      {
        "q": "What is GET?",
        "a": "Used to retrieve data from the server."
      },
      {
        "q": "What is POST?",
        "a": "Used to send data and commonly create new resources."
      },
      {
        "q": "What is PUT?",
        "a": "Used to replace an existing resource."
      },
      {
        "q": "What is PATCH?",
        "a": "Used to partially update an existing resource."
      },
      {
        "q": "What is DELETE?",
        "a": "Used to delete a resource."
      },
      {
        "q": "What is middleware?",
        "a": "Middleware is a function that executes during the request-response cycle. It can access req, res, and next."
      },
      {
        "q": "What are the types of middleware?",
        "a": "- Application-level middleware. - Router-level middleware. - Built-in middleware. - Third-party middleware. - Error-handling middleware."
      },
      {
        "q": "What is req?",
        "a": "req represents the incoming client request and contains data such as body, params, query, and headers."
      },
      {
        "q": "What is res?",
        "a": "res represents the server response and is used to send data back to the client."
      },
      {
        "q": "What is next()?",
        "a": "It passes control to the next middleware in the request-response cycle."
      },
      {
        "q": "What is Express Router?",
        "a": "It helps organize routes into separate files and modules. const router = express.Router();"
      },
      {
        "q": "What is express.json()?",
        "a": "It is built-in middleware that parses incoming JSON request data and makes it available in req.body. app.use(express.json());"
      },
      {
        "q": "What is express.urlencoded()?",
        "a": "It parses incoming URL-encoded form data. app.use(express.urlencoded({ extended: true }));"
      },
      {
        "q": "What are static files?",
        "a": "Files such as images, CSS, JavaScript, and PDFs that are served directly to clients. app.use(express.static(\"public\"));"
      },
      {
        "q": "What is error-handling middleware?",
        "a": "Middleware used to handle application errors centrally. app.use((err, req, res, next) => { res.status(500).json({ message: err.message }); });"
      },
      {
        "q": "What is CORS?",
        "a": "CORS (Cross-Origin Resource Sharing) controls whether a browser allows requests from different origins."
      },
      {
        "q": "What is Body Parser?",
        "a": "Body-parser is middleware used to parse incoming request bodies. Express now provides built-in JSON and URL-encoded parsers."
      },
      {
        "q": "What is a REST API?",
        "a": "REST API is an architectural style for communication between clients and servers using HTTP methods."
      },
      {
        "q": "What are HTTP status codes?",
        "a": "Code\tMeaning 200\tOK 201\tCreated 400\tBad Request 401\tUnauthorized 403\tForbidden 404\tNot Found 500\tInternal Server Error"
      },
      {
        "q": "What are req.params, req.query, req.body, headers, and cookies?",
        "a": "Property\tPurpose\tExample req.params\tURL path data\t/users/10 req.query\tURL query data\t/users?page=1 req.body\tRequest body data\tEmail, password req.headers\tRequest metadata\tAuthorization token req.cookies\tBrowser cookies\tSession token"
      }
    ]
  },
  {
    "title": "4. Database & Authentication",
    "questions": [
      {
        "q": "What is MongoDB?",
        "a": "MongoDB is a NoSQL database that stores data in flexible, JSON-like documents (BSON format)."
      },
      {
        "q": "What is Mongoose?",
        "a": "Mongoose is an ODM (Object Data Modeling) library used to interact with MongoDB in Node.js."
      },
      {
        "q": "What is a Schema?",
        "a": "A schema defines the structure, fields, and validation rules of a document. const userSchema = new mongoose.Schema({ name: String, email: String });"
      },
      {
        "q": "What is a Model?",
        "a": "A model is created from a schema and provides methods to interact with a MongoDB collection. const User = mongoose.model(\"User\", userSchema);"
      },
      {
        "q": "What is CRUD?",
        "a": "CRUD represents four basic database operations: - Create – Insert data. - Read – Fetch data. - Update – Modify data. - Delete – Remove data."
      },
      {
        "q": "What is find()?",
        "a": "It retrieves multiple documents matching a condition. User.find({ name: \"Ashish\" });"
      },
      {
        "q": "What is findOne()?",
        "a": "It retrieves the first document matching a condition."
      },
      {
        "q": "What is findById()?",
        "a": "It retrieves a document using its MongoDB ID."
      },
      {
        "q": "What is save()?",
        "a": "It saves a new document or persists changes to an existing Mongoose document. const user = new User({ name: \"Ashish\" }); await user.save();"
      },
      {
        "q": "What is updateOne()?",
        "a": "It updates the first document matching a given condition."
      },
      {
        "q": "What is deleteOne()?",
        "a": "It deletes the first document matching a given condition."
      },
      {
        "q": "What is indexing in MongoDB?",
        "a": "Indexing improves query performance by helping MongoDB find data faster."
      },
      {
        "q": "What is Authentication?",
        "a": "Authentication verifies the identity of a user. Example: Login using email and password."
      },
      {
        "q": "What is Authorization?",
        "a": "Authorization determines what an authenticated user is allowed to access. Example: Only admins can delete users."
      },
      {
        "q": "What is JWT?",
        "a": "JWT (JSON Web Token) is a token used to securely transmit claims between parties. It is commonly used for authentication."
      },
      {
        "q": "What are the parts of JWT?",
        "a": "JWT has three parts: 1. Header 2. Payload 3. Signature"
      },
      {
        "q": "What is bcrypt?",
        "a": "Bcrypt is a library used to securely hash passwords before storing them in a database. const hashedPassword = await bcrypt.hash(password, 10);"
      },
      {
        "q": "What is Session-based authentication?",
        "a": "The server stores session information and usually sends a session ID to the client through a cookie."
      },
      {
        "q": "What are Cookies?",
        "a": "Cookies are small pieces of data stored in the browser and sent with matching HTTP requests."
      },
      {
        "q": "What is a Secure Cookie?",
        "a": "A cookie with the Secure flag is sent only over HTTPS. Other important cookie flags: - HttpOnly: Prevents JavaScript from accessing the cookie. - SameSite: Controls cross-site cookie sending."
      }
    ]
  },
  {
    "title": "5. Advanced Node.js & Backend Concepts",
    "questions": [
      {
        "q": "Why is Node.js fast?",
        "a": "Because it uses Google's V8 engine, asynchronous I/O, and an event-driven architecture."
      },
      {
        "q": "What is Scalability?",
        "a": "Scalability is the ability of an application to handle increasing users and workloads."
      },
      {
        "q": "What are Microservices?",
        "a": "An architecture where an application is divided into small, independent services."
      },
      {
        "q": "What is Monolithic Architecture?",
        "a": "An architecture where all application components are developed and deployed as one unit."
      },
      {
        "q": "What is Logging?",
        "a": "Logging means recording application activities, errors, and important events for debugging and monitoring. Examples: Winston, Morgan."
      },
      {
        "q": "What is PM2?",
        "a": "PM2 is a process manager used to run, monitor, and restart Node.js applications."
      },
      {
        "q": "What is EventEmitter?",
        "a": "EventEmitter is a built-in Node.js class used to create, emit, and listen for custom events. const EventEmitter = require(\"events\"); const event = new EventEmitter(); event.on(\"message\", () => { console.log(\"Event received\"); }); event.emit(\"message\");"
      },
      {
        "q": "Difference between Stream and Buffer?",
        "a": "Stream\tBuffer Processes data in chunks\tStores binary data Memory efficient for large files\tHolds data in memory Useful for file streaming\tUseful for binary data"
      },
      {
        "q": "What are Node.js security best practices?",
        "a": "- Validate user input. - Hash passwords using bcrypt. - Use HTTPS. - Keep secrets in environment variables. - Use Helmet and rate limiting. - Prevent SQL/NoSQL injection."
      },
      {
        "q": "How should we handle errors in asynchronous code?",
        "a": "Use try...catch with async/await and forward errors to centralized error middleware."
      },
      {
        "q": "What are asynchronous best practices?",
        "a": "- Avoid unnecessary blocking operations. - Use async/await. - Handle Promise rejections. - Use Promise.all() for independent parallel operations."
      },
      {
        "q": "What is API Testing?",
        "a": "API testing checks whether APIs work correctly, including responses, status codes, validation, and errors. Tools: Postman, Thunder Client, Jest, Supertest."
      },
      {
        "q": "What is Deployment?",
        "a": "Deployment means making an application available on a server so users can access it. Examples: VPS, AWS, Render."
      },
      {
        "q": "What is the difference between Node.js and PHP?",
        "a": "Node.js\tPHP JavaScript runtime\tServer-side programming language Uses V8 engine\tUses PHP runtime Event-driven, non-blocking I/O\tSupports different execution models Commonly used with Express\tCommonly used with Laravel"
      },
      {
        "q": "What is the difference between Node.js and Express.js?",
        "a": "- Node.js is a JavaScript runtime environment. - Express.js is a framework built on Node.js for developing web applications and APIs."
      }
    ]
  }
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
