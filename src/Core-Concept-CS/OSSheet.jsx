import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../sheet-app/components/Footer';

const osSections = [
  {
    title: '📘 Operating System Basics',
    questions: [
      { q: 'What is an Operating System?', a: 'An Operating System (OS) is system software that manages computer hardware and provides services to applications.' },
      { q: 'What are the main functions of OS?', a: '• Process Management\n• Memory Management\n• File System Management\n• Device Management\n• Security & Protection' },
      { q: 'What is Kernel?', a: 'The Kernel is the core component of an OS that directly interacts with hardware and manages system resources.' },
      { q: 'What is a System Call?', a: 'A System Call allows a program to request services from the OS.\n\nExamples:\n• read()\n• write()\n• fork()' },
      { q: 'User Mode vs Kernel Mode', a: 'User Mode:\n• Limited hardware access\n• Runs applications\n\nKernel Mode:\n• Full hardware access\n• Runs OS core' },
    ]
  },
  {
    title: '📘 Process Management',
    questions: [
      { q: 'What is a Process?', a: 'A Process is a program that is currently executing in memory.' },
      { q: 'Program vs Process', a: 'Program:\n• Static code\n• Stored on disk\n\nProcess:\n• Running instance\n• Stored in memory' },
      { q: 'What are Process States?', a: '• New\n• Ready\n• Running\n• Waiting / Blocked\n• Terminated' },
      { q: 'What is PCB?', a: 'Process Control Block (PCB) stores information about a process such as:\n• Process ID\n• Process state\n• CPU registers\n• Program counter' },
      { q: 'What is Context Switching?', a: 'The process of saving the state of one process and loading another process state.' },
    ]
  },
  {
    title: '📘 Threads',
    questions: [
      { q: 'What is a Thread?', a: 'A Thread is the smallest unit of CPU execution inside a process.' },
      { q: 'Process vs Thread', a: 'Process:\n• Heavyweight\n• Separate memory\n\nThread:\n• Lightweight\n• Shared memory' },
      { q: 'Advantages of Multithreading', a: '• Faster execution\n• Better CPU utilization\n• Resource sharing' },
    ]
  },
  {
    title: '📘 CPU Scheduling',
    questions: [
      { q: 'What is CPU Scheduling?', a: 'CPU scheduling decides which process gets CPU time next.' },
      { q: 'Preemptive vs Non-Preemptive Scheduling', a: 'Preemptive:\n• Process can be interrupted\n\nNon-Preemptive:\n• Process runs until completion' },
      { q: 'FCFS Scheduling', a: 'First Come First Serve executes processes in arrival order.' },
      { q: 'SJF Scheduling', a: 'Shortest Job First executes the process with the shortest burst time first.' },
      { q: 'Round Robin Scheduling', a: 'Each process gets a fixed time quantum in a circular order.' },
      { q: 'Priority Scheduling', a: 'CPU is assigned based on process priority.' },
    ]
  },
  {
    title: '📘 Deadlocks',
    questions: [
      { q: 'What is Deadlock?', a: 'Deadlock is a situation where processes wait indefinitely for resources held by each other.' },
      { q: 'Four Conditions of Deadlock', a: '• Mutual Exclusion\n• Hold and Wait\n• No Preemption\n• Circular Wait' },
      { q: 'Deadlock Prevention', a: 'Prevent deadlock by removing one of the four conditions.' },
      { q: 'Deadlock Avoidance', a: 'Avoid unsafe states using algorithms like Banker\'s Algorithm.' },
      { q: 'What is Banker\'s Algorithm?', a: 'An algorithm used to avoid deadlocks by checking if resource allocation keeps the system in a safe state.' },
    ]
  },
  {
    title: '📘 Memory Management',
    questions: [
      { q: 'What is Memory Management?', a: 'Memory management handles allocation and deallocation of memory to processes.' },
      { q: 'What is Virtual Memory?', a: 'Virtual memory allows programs to use disk space as extra memory when RAM is full.' },
      { q: 'What is Paging?', a: 'Paging divides memory into fixed-size pages and frames.' },
      { q: 'What is Segmentation?', a: 'Segmentation divides memory into logical segments like code, stack, and data.' },
      { q: 'Paging vs Segmentation', a: 'Paging:\n• Fixed size\n• No external fragmentation\n\nSegmentation:\n• Variable size\n• External fragmentation possible' },
      { q: 'What is Page Fault?', a: 'A Page Fault occurs when a required page is not found in RAM and must be loaded from disk.' },
    ]
  },
  {
    title: '📘 Page Replacement Algorithms',
    questions: [
      { q: 'FIFO Page Replacement', a: 'The oldest page in memory is replaced first.' },
      { q: 'LRU Page Replacement', a: 'The least recently used page is replaced.' },
      { q: 'Optimal Page Replacement', a: 'Replaces the page that will not be used for the longest time in the future.' },
      { q: 'What is Belady\'s Anomaly?', a: 'In FIFO page replacement, increasing frames may increase page faults.' },
    ]
  },
  {
    title: '📘 Synchronization',
    questions: [
      { q: 'What is Critical Section?', a: 'A critical section is a part of a program where shared resources are accessed.' },
      { q: 'What is Race Condition?', a: 'Occurs when multiple processes access shared data simultaneously, leading to inconsistent results.' },
      { q: 'What is Mutex?', a: 'A mutex (mutual exclusion lock) allows only one thread to access a resource at a time.' },
      { q: 'What is Semaphore?', a: 'A semaphore is a signaling mechanism used to control access to shared resources.' },
      { q: 'Binary Semaphore', a: 'A semaphore that can have only two values: 0 or 1.' },
    ]
  },
  {
    title: '📘 Classical Synchronization Problems',
    questions: [
      { q: 'Producer Consumer Problem', a: 'Producer generates data and consumer consumes data from a shared buffer.' },
      { q: 'Dining Philosophers Problem', a: 'A classic synchronization problem demonstrating deadlock and resource sharing.' },
      { q: 'Readers Writers Problem', a: 'Multiple readers can read simultaneously, but writers require exclusive access.' },
    ]
  },
  {
    title: '📘 File System',
    questions: [
      { q: 'What is File System?', a: 'A file system organizes and stores files on storage devices.' },
      { q: 'File Allocation Methods', a: '• Contiguous Allocation\n• Linked Allocation\n• Indexed Allocation' },
      { q: 'What is Inode?', a: 'An inode stores metadata of a file such as:\n• File size\n• Owner\n• Permissions' },
    ]
  },
  {
    title: '📘 Disk Scheduling',
    questions: [
      { q: 'What is Disk Scheduling?', a: 'Disk scheduling decides the order of disk I/O requests.' },
      { q: 'FCFS Disk Scheduling', a: 'Disk requests are handled in the order they arrive.' },
      { q: 'SSTF', a: 'Shortest Seek Time First selects the request closest to the disk head.' },
      { q: 'SCAN Algorithm', a: 'Disk head moves like an elevator, servicing requests along the way.' },
      { q: 'C-SCAN Algorithm', a: 'Disk head moves in one direction only and jumps back to start.' },
    ]
  },
];

const totalQuestions = osSections.reduce((s, sec) => s + sec.questions.length, 0);

function OSSheet({ auth, setAuth }) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [openAnswers, setOpenAnswers] = useState({});
  const [collapsedSections, setCollapsedSections] = useState(
    () => osSections.reduce((acc, _, i) => ({ ...acc, [i]: true }), {})
  );
  const questionRefs = useRef({});

  const [lastRead, setLastRead] = useState(() => {
    try { return JSON.parse(localStorage.getItem('os_revision_last_read')) || null; }
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
        localStorage.setItem('os_revision_last_read', JSON.stringify(data));
      }
      return { ...prev, [key]: !prev[key] };
    });
  };

  const jumpToLastRead = () => {
    if (!lastRead) return;
    const parts = lastRead.key.split('-');
    const sectionIdx = parseInt(parts[1], 10);
    setCollapsedSections(prev => ({ ...prev, [sectionIdx]: false }));
    setOpenAnswers(prev => ({ ...prev, [lastRead.key]: true }));
    setTimeout(() => {
      const el = questionRefs.current[lastRead.key];
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 80);
  };

  const clearLastRead = () => {
    setLastRead(null);
    localStorage.removeItem('os_revision_last_read');
  };

  const toggleSection = (sIdx) => {
    setCollapsedSections(prev => ({ ...prev, [sIdx]: !prev[sIdx] }));
  };

  const q = searchQuery.toLowerCase().trim();
  const filteredSections = osSections.map(sec => ({
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
                <span className="text-yellow-400">Operating System</span> – Questions & Answers
              </h1>
              <p className="text-xs text-gray-500">{totalQuestions} questions · {osSections.length} sections</p>
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
            { label: 'Topics', value: osSections.length, color: 'text-sky-400' },
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

        {/* OS Content */}
        <div className="border border-[#2a2a2a] rounded-2xl overflow-hidden">
          <div className="border-t border-[#1f1f1f] px-4 py-4 space-y-0 bg-[#0d0d0d]">
            {filteredSections.map((section, sIdx) => {
              const originalIdx = osSections.findIndex(s => s.title === section.title);
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
                        const key = `os-${originalIdx}-${qIdx}`;
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
                                href={`https://chatgpt.com/?q=${encodeURIComponent(`${item.q} in operating system, explain in short.`)}`}
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
                                href={item.yt || `https://www.youtube.com/results?search_query=${encodeURIComponent(`${item.q} operating system explained`)}`}
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
                                  <p className="text-[16px] text-yellow-300/80 px-2 pb-1 leading-relaxed whitespace-pre-line">
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
        </div>

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

export default OSSheet;
