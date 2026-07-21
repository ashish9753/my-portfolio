import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import ThemeToggle from '../components/ThemeToggle';

const lldSections = [
  {
    title: '✅ Step 1: Object-Oriented Programming',
    questions: [
      { q: 'Encapsulation?', a: '' },
      { q: 'Abstraction?', a: '' },
      { q: 'Inheritance?', a: '' },
      { q: 'Polymorphism?', a: '' },
      { q: 'SOLID Principles?', a: '' },
    ]
  },
  {
    title: '✅ Step 2: Design Patterns',
    questions: [
      { q: 'Creational Patterns (Singleton, Factory, etc.)?', a: '' },
      { q: 'Structural Patterns (Proxy, Bridge, etc.)?', a: '' },
      { q: 'Behavioral Patterns (Strategy, Command, Observer, etc.)?', a: '' },
    ]
  },
  {
    title: '✅ Step 3: Concurrency & Thread Safety',
    questions: [
      { q: 'Thread-safe injection?', a: '' },
      { q: 'Locking mechanisms?', a: '' },
      { q: 'Producer–Consumer problem?', a: '' },
      { q: 'Race conditions & synchronization?', a: '' },
    ]
  },
  {
    title: '✅ Step 4: UML Diagrams',
    questions: [
      { q: 'Class Diagram?', a: '' },
      { q: 'Sequence Diagram?', a: '' },
      { q: 'Use Case Diagram?', a: '' },
      { q: 'Activity Diagram?', a: '' },
    ]
  },
  {
    title: '✅ Step 5: APIs',
    questions: [
      { q: 'API Design?', a: '' },
      { q: 'Request/Response object modeling?', a: '' },
      { q: 'Versioning & extensibility?', a: '' },
      { q: 'Clean Code Principles: DRY, SRP, etc.?', a: '' },
      { q: 'Avoiding God Classes?', a: '' },
    ]
  },
  {
    title: '✅ Step 6: Common LLD Problems',
    questions: [
      { q: 'Design a Tic-Tac-Toe or Chess game?', a: '' },
      { q: 'Design a Splitwise App?', a: '' },
      { q: 'Design a Parking Lot?', a: '' },
      { q: 'Design an Elevator System with multiple lifts?', a: '' },
      { q: 'Design a Notification System?', a: '' },
      { q: 'Design a Food Delivery App?', a: '' },
      { q: 'Design a Movie Ticket Booking System?', a: '' },
      { q: 'Design a URL Shortener?', a: '' },
      { q: 'Design a Logging Framework?', a: '' },
      { q: 'Design a Rate Limiter?', a: '' },
    ]
  },
];

const revisionSections = [
  {
    title: '📘 Step 1: Fundamentals',
    questions: [
      { q: 'Serverless vs Serverful?', a: 'Serverless: Cloud provider manages servers automatically (AWS Lambda). Serverful: We manage servers ourselves (Node.js on EC2 / VPS).' },
      { q: 'Horizontal vs Vertical Scaling?', a: 'Vertical Scaling: Increase power of one machine (CPU/RAM). Horizontal Scaling: Add more machines/servers.' },
      { q: 'What are Threads?', a: 'A thread is the smallest unit of execution inside a process. Multiple threads allow parallel tasks.' },
      { q: 'What are Pages?', a: 'A page is a fixed-size block of memory used in virtual memory management.' },
      { q: 'How does the Internet work?', a: 'Client → DNS resolves domain → request sent via HTTP/HTTPS over TCP/IP → server processes → response returned.' },
    ]
  },
  {
    title: '📘 Step 2: Databases',
    questions: [
      { q: 'SQL vs NoSQL Databases?', a: 'SQL: Relational, structured tables, ACID. NoSQL: Non-relational, flexible schema, high scalability. Example: MySQL vs MongoDB.' },
      { q: 'In-memory Databases?', a: 'Databases storing data in RAM for very fast access. Example: Redis, Memcached.' },
      { q: 'Data Replication & Migration?', a: 'Copying data to multiple servers for fault tolerance and high availability.' },
      { q: 'Data Partitioning?', a: 'Splitting database into smaller parts to improve performance.' },
      { q: 'Sharding?', a: 'Horizontal partitioning where different servers store different data portions.' },
    ]
  },
  {
    title: '📘 Step 3: Consistency vs Availability',
    questions: [
      { q: 'Data Consistency & its levels?', a: 'All users see same data at the same time. Levels: Strong, Eventual, Causal.' },
      { q: 'Isolation & its levels?', a: 'Control how transactions interact. Levels: Read Uncommitted, Read Committed, Repeatable Read, Serializable.' },
      { q: 'CAP Theorem?', a: 'A distributed system can guarantee only two of three: Consistency, Availability, Partition Tolerance.' },
    ]
  },
  {
    title: '📘 Step 4: Cache',
    questions: [
      { q: 'What is Cache? (Redis, Memcached)', a: 'Temporary storage to speed up data retrieval. Examples: Redis, Memcached.' },
      { q: 'Write Policies: Write-back, Write-through & Write-around?', a: 'Write-through: Write to cache + DB simultaneously. Write-back: Write to cache first, DB later. Write-around: Write directly to DB.' },
      { q: 'Replacement Policies: LFU, LRU, Segmented LRU etc.?', a: 'How cache removes old data: LRU (Least Recently Used), LFU (Least Frequently Used), SLRU (Segmented LRU).' },
      { q: 'Content Delivery Networks (CDNs)?', a: 'Distributed servers delivering content from nearest location. Example: Cloudflare.' },
    ]
  },
  {
    title: '📘 Step 5: Networking',
    questions: [
      { q: 'TCP vs UDP?', a: 'TCP: Reliable, connection-oriented. UDP: Fast, connectionless. Examples: TCP → HTTP, UDP → Streaming.' },
      { q: 'What is HTTP (1/2/3) & HTTPS?', a: 'HTTP = protocol for web communication. HTTPS = HTTP + SSL encryption. Versions: HTTP/1.1, HTTP/2 (multiplexing), HTTP/3 (QUIC).' },
      { q: 'WebSockets?', a: 'Protocol for real-time bidirectional communication. Example: chat apps.' },
      { q: 'WebRTC & Video Streaming?', a: 'Technology for real-time video/audio communication in browsers. Example: Zoom, Meet.' },
    ]
  },
  {
    title: '📘 Step 6: Load Balancers',
    questions: [
      { q: 'Load Balancing Algorithms (Stateless & Stateful)?', a: 'Round Robin, Least Connections, IP Hash.' },
      { q: 'Consistent Hashing?', a: 'Distributes requests across servers while minimizing redistribution when nodes change.' },
      { q: 'Proxy & Reverse Proxy?', a: 'Proxy: client-side intermediary. Reverse Proxy: server-side traffic manager (Nginx).' },
      { q: 'Rate Limiting?', a: 'Limit number of requests per user to prevent abuse.' },
    ]
  },
  {
    title: '📘 Step 7: Message Queues',
    questions: [
      { q: 'Asynchronous Processing (Kafka, RabbitMQ)?', a: 'Tasks processed in background using queues. Examples: Kafka, RabbitMQ.' },
      { q: 'Publisher-Subscriber Model?', a: 'Publisher sends message → multiple subscribers receive it.' },
    ]
  },
  {
    title: '📘 Step 8: Monoliths vs Microservices',
    questions: [
      { q: 'Why Microservices?', a: 'Independent services → easier scaling and deployment.' },
      { q: 'Concept of "Single Point of Failure"?', a: 'If one component fails and system stops, it\'s a SPOF.' },
      { q: 'Avoiding Cascading Failures?', a: 'Failure in one service triggers failures in others.' },
      { q: 'Containerization (Docker)?', a: 'Package application + dependencies together. Example: Docker.' },
      { q: 'Migrating to Microservices?', a: 'Break monolith into independent services gradually.' },
    ]
  },
  {
    title: '📘 Step 9: Monitoring & Logging',
    questions: [
      { q: 'Logging Events & Monitoring Metrics?', a: 'Track system events and performance. Tools: ELK stack, Prometheus, Grafana.' },
      { q: 'Anomaly Detection?', a: 'Detect unusual system behavior automatically.' },
    ]
  },
  {
    title: '📘 Step 10: Security',
    questions: [
      { q: 'Tokens for Authentication?', a: 'Authentication using JWT tokens.' },
      { q: 'SSO & OAuth?', a: 'SSO: login once access multiple apps. OAuth: secure third-party authorization.' },
      { q: 'Access Control Lists & Rule Engines?', a: 'Permissions using roles and policies. Example: RBAC.' },
      { q: 'Encryption?', a: 'Protect data using cryptography. Examples: AES (symmetric), RSA (asymmetric).' },
    ]
  },
  {
    title: '📘 Step 11: System Design Tradeoffs',
    questions: [
      { q: 'Push vs Pull Architecture?', a: 'Push → server sends updates. Pull → client requests updates.' },
      { q: 'Consistency vs Availability?', a: 'Strong consistency reduces availability in distributed systems.' },
      { q: 'SQL vs NoSQL Databases?', a: 'SQL → structured & consistent. NoSQL → scalable & flexible.' },
      { q: 'Memory vs Latency?', a: 'More memory (cache) → lower latency.' },
      { q: 'Throughput vs Latency?', a: 'Higher throughput may increase latency.' },
      { q: 'Accuracy vs Latency?', a: 'Faster systems may sacrifice accuracy.' },
    ]
  },
  {
    title: '📘 Step 12: Practice, Practice, Practice',
    questions: [
      { q: 'Design YouTube?', a: '' },
      { q: 'Design Twitter?', a: '' },
      { q: 'Design WhatsApp?', a: '' },
      { q: 'Design Uber?', a: '' },
      { q: 'Design Amazon?', a: '' },
      { q: 'Design Dropbox / Google Drive?', a: '' },
      { q: 'Design Netflix?', a: '' },
      { q: 'Design Instagram?', a: '' },
      { q: 'Design Zoom?', a: '' },
      { q: 'Design Booking.com / Airbnb?', a: '' },
    ]
  },
];

const totalHLDQuestions = revisionSections.reduce((s, sec) => s + sec.questions.length, 0);
const totalLLDQuestions = lldSections.reduce((s, sec) => s + sec.questions.length, 0);
const totalQuestions = totalHLDQuestions + totalLLDQuestions;

function SystemDesignSheet({ auth, setAuth }) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [openAnswers, setOpenAnswers] = useState({});
  const [hldOpen, setHldOpen] = useState(false);
  const [lldOpen, setLldOpen] = useState(false);
  const [collapsedSections, setCollapsedSections] = useState(
    () => revisionSections.reduce((acc, _, i) => ({ ...acc, [i]: true }), {})
  );
  const [collapsedLLDSections, setCollapsedLLDSections] = useState(
    () => lldSections.reduce((acc, _, i) => ({ ...acc, [i]: true }), {})
  );
  const questionRefs = useRef({});

  const [lastRead, setLastRead] = useState(() => {
    try { return JSON.parse(localStorage.getItem('systemdesign_revision_last_read')) || null; }
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
        localStorage.setItem('systemdesign_revision_last_read', JSON.stringify(data));
      }
      return { ...prev, [key]: !prev[key] };
    });
  };

  const jumpToLastRead = () => {
    if (!lastRead) return;
    const parts = lastRead.key.split('-');
    const isLLD = parts[0] === 'lld';
    const sectionIdx = parseInt(parts[1], 10);
    if (isLLD) {
      setLldOpen(true);
      setCollapsedLLDSections(prev => ({ ...prev, [sectionIdx]: false }));
    } else {
      setHldOpen(true);
      setCollapsedSections(prev => ({ ...prev, [sectionIdx]: false }));
    }
    setOpenAnswers(prev => ({ ...prev, [lastRead.key]: true }));
    setTimeout(() => {
      const el = questionRefs.current[lastRead.key];
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 80);
  };

  const clearLastRead = () => {
    setLastRead(null);
    localStorage.removeItem('systemdesign_revision_last_read');
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

  const filteredLLDSections = lldSections.map(sec => ({
    ...sec,
    questions: q
      ? sec.questions.filter(item =>
          item.q.toLowerCase().includes(q) || item.a.toLowerCase().includes(q)
        )
      : sec.questions,
  })).filter(sec => sec.questions.length > 0);

  const totalVisible = filteredSections.reduce((s, sec) => s + sec.questions.length, 0)
    + filteredLLDSections.reduce((s, sec) => s + sec.questions.length, 0);

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
                <span className="text-yellow-400">System Design</span> Guide [HLD + LLD]
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
            { label: 'Topics', value: revisionSections.length + lldSections.length, color: 'text-sky-400' },
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
        {q && filteredSections.length === 0 && filteredLLDSections.length === 0 && (
          <div className="text-center py-16 text-gray-600">
            <div className="text-4xl mb-3">🔍</div>
            <p className="text-sm">No questions match <span className="text-gray-400">"{searchQuery}"</span></p>
            <button onClick={() => setSearchQuery('')} className="mt-3 text-yellow-400 text-xs hover:underline">Clear search</button>
          </div>
        )}

        {/* ── HLD TOP-LEVEL SECTION ── */}
        <div className="border border-[#2a2a2a] rounded-2xl overflow-hidden">
          <button
            onClick={() => setHldOpen(prev => !prev)}
            className="w-full flex items-center justify-between px-6 py-5 bg-[#111] hover:bg-[#161616] transition-colors group"
          >
            <div className="flex items-center gap-4">
              <span className="text-2xl">🏗️</span>
              <div className="text-left">
                <p className="text-xl font-bold text-yellow-400">📘 High-Level Design (HLD)</p>
                <p className="text-xs text-gray-500 mt-0.5">{revisionSections.length} sections · {totalHLDQuestions} questions</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-600 bg-[#1a1a1a] px-3 py-1 rounded-full border border-[#2a2a2a]">{totalHLDQuestions}Q</span>
              <svg className={`w-5 h-5 text-yellow-400/70 transition-transform duration-300 ${hldOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </button>

          {(hldOpen || q) && (
            <div className="border-t border-[#1f1f1f] px-4 py-4 space-y-0 bg-[#0d0d0d]">
              {filteredSections.map((section, sIdx) => {
                const originalIdx = revisionSections.findIndex(s => s.title === section.title);
                const isCollapsed = q ? false : collapsedSections[originalIdx];
                return (
                  <div key={sIdx}>
                    {/* Sub-section header */}
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
                    {!isCollapsed && (
                      <div>
                        {section.questions.map((item, qIdx) => {
                          const key = `hld-${originalIdx}-${qIdx}`;
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
                                {/* ChatGPT icon */}
                                <a
                                  href={`https://chatgpt.com/?q=${encodeURIComponent(`${item.q} in system design, explain in short.`)}`}
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
                                {/* YouTube icon */}
                                <a
                                  href={item.yt || `https://www.youtube.com/results?search_query=${encodeURIComponent(`${item.q} system design explained`)}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  title={item.yt ? 'Watch on YouTube' : 'Search on YouTube'}
                                  className="flex-shrink-0 p-2 mr-1 text-red-500 hover:text-red-400 hover:scale-125 transition-all duration-300 rounded"
                                  onClick={e => e.stopPropagation()}
                                >
                                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                                  </svg>
                                </a>
                              </div>
                              {isOpen && (
                                <div className="px-1 pb-5 pt-2">
                                  {item.a ? (
                                    <p className="text-[16px] text-yellow-300/80 px-2 pb-1 leading-relaxed">
                                      <span className="text-yellow-500 mr-1">→</span>{item.a}
                                    </p>
                                  ) : (
                                    <p className="text-[15px] text-gray-600 italic px-2 pb-1">Answer coming soon...</p>
                                  )}
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
            </div>
          )}
        </div>

        {/* ── LLD TOP-LEVEL SECTION ── */}
        <div className="border border-[#2a2a2a] rounded-2xl overflow-hidden">
          <button
            onClick={() => setLldOpen(prev => !prev)}
            className="w-full flex items-center justify-between px-6 py-5 bg-[#111] hover:bg-[#161616] transition-colors group"
          >
            <div className="flex items-center gap-4">
              <span className="text-2xl">🔧</span>
              <div className="text-left">
                <p className="text-xl font-bold text-sky-400">📘 Low-Level Design (LLD)</p>
                <p className="text-xs text-gray-500 mt-0.5">{lldSections.length} sections · {totalLLDQuestions} questions</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-600 bg-[#1a1a1a] px-3 py-1 rounded-full border border-[#2a2a2a]">{totalLLDQuestions}Q</span>
              <svg className={`w-5 h-5 text-sky-400/70 transition-transform duration-300 ${lldOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </button>

          {(lldOpen || q) && (
            <div className="border-t border-[#1f1f1f] px-4 py-4 bg-[#0d0d0d]">
              {filteredLLDSections.length === 0 && q ? null : filteredLLDSections.map((section, sIdx) => {
                const originalIdx = lldSections.findIndex(s => s.title === section.title);
                const isCollapsed = q ? false : collapsedLLDSections[originalIdx];
                return (
                  <div key={sIdx}>
                    <button
                      onClick={() => setCollapsedLLDSections(prev => ({ ...prev, [originalIdx]: !prev[originalIdx] }))}
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
                          const key = `lld-${originalIdx}-${qIdx}`;
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
                                    {isLastRead && <span className="text-sky-400 text-xs flex-shrink-0">📌</span>}
                                    <span className={`text-[17px] leading-snug ${isLastRead ? 'text-sky-200' : 'text-gray-200'}`}>{item.q}</span>
                                  </div>
                                  <svg className={`w-3.5 h-3.5 text-gray-600 flex-shrink-0 ml-3 transition-transform duration-200 ${isOpen ? 'rotate-180 text-sky-400' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                  </svg>
                                </button>
                                <a
                                  href={`https://chatgpt.com/?q=${encodeURIComponent(`${item.q} in low level design, explain in short.`)}`}
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
                                <a
                                  href={item.yt || `https://www.youtube.com/results?search_query=${encodeURIComponent(`${item.q} low level design explained`)}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  title={item.yt ? 'Watch on YouTube' : 'Search on YouTube'}
                                  className="flex-shrink-0 p-2 mr-1 text-red-500 hover:text-red-400 hover:scale-125 transition-all duration-300 rounded"
                                  onClick={e => e.stopPropagation()}
                                >
                                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                                  </svg>
                                </a>
                              </div>
                              {isOpen && (
                                <div className="px-1 pb-5 pt-2">
                                  {item.a ? (
                                    <p className="text-[16px] text-sky-300/80 px-2 pb-1 leading-relaxed">
                                      <span className="text-sky-500 mr-1">→</span>{item.a}
                                    </p>
                                  ) : (
                                    <p className="text-[15px] text-gray-600 italic px-2 pb-1">Answer coming soon...</p>
                                  )}
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
            </div>
          )}
        </div>

        {/* Search result count */}
        {q && (filteredSections.length > 0 || filteredLLDSections.length > 0) && (
          <p className="text-xs text-gray-600 text-center pt-2">{totalVisible} result{totalVisible !== 1 ? 's' : ''} for "{searchQuery}"</p>
        )}
      </div>

      <div className="pb-10" />
      <Footer />
    </div>
  );
}

export default SystemDesignSheet;