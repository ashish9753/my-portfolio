import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import LoadingScreen from '../../components/LoadingScreen.jsx';

// const ADMIN_API = 'https://api.ashishdev.com/api/admin';
 const ADMIN_API = 'https://dsa-sheet-backend-7r7i.onrender.com/api/admin';
const MAIN_ADMIN_EMAIL = 'admin@ashishdev.com';
// Fallback list shown before live data loads (or when the DB is empty).
// Spellings here MUST match the values actually stored in the database so that
// filtering and adding line up with existing questions.
const FALLBACK_TOPICS = [
  'Sorting',
  'Array',
  'Binary Search',
  'String',
  'LinkedList',
  'Recursion',
  'Bit Manipulation',
  'Stack and Queues',
  'Sliding Window',
  'Binary Trees',
  'Binary Search Trees',
  'Heaps',
  'Greedy',
  'Graphs',
  'DP'
];
const EMPTY_QUESTION = {
  name: '',
  topic: 'Array',
  difficulty: 'Easy',
  sequenceNo: 0,
  leetcodeLink: '',
  gfgLink: ''
};

function AdminPage({ auth }) {
  const [activeView, setActiveView] = useState('users');
  const [users, setUsers] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [questionsLoading, setQuestionsLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [questionSearch, setQuestionSearch] = useState('');
  const [debouncedQuestionSearch, setDebouncedQuestionSearch] = useState('');
  const [questionTopic, setQuestionTopic] = useState('all');
  const [liveTopics, setLiveTopics] = useState([]);
  const [showBlockedOnly, setShowBlockedOnly] = useState(false);
  const [actionUserId, setActionUserId] = useState(null);
  const [actionQuestionId, setActionQuestionId] = useState(null);
  const [editUser, setEditUser] = useState(null);
  const [editForm, setEditForm] = useState({ username: '', email: '', role: 'user', password: '' });
  const [questionEditor, setQuestionEditor] = useState(undefined);
  const [questionForm, setQuestionForm] = useState(EMPTY_QUESTION);
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [isSavingQuestion, setIsSavingQuestion] = useState(false);
  const [onlineFilter, setOnlineFilter] = useState('all');
  const [joinStart, setJoinStart] = useState('');
  const [joinEnd, setJoinEnd] = useState('');
  const [analytics, setAnalytics] = useState(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  // Empty means "today", resolved by the server in its own timezone.
  const [analyticsDate, setAnalyticsDate] = useState('');

  const isAdminUser = auth?.user?.isAdmin || auth?.user?.role === 'admin';
  const isMainAdmin = isAdminUser && auth?.user?.email?.toLowerCase() === MAIN_ADMIN_EMAIL;
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  const timeAgo = (date) => {
    if (!date) return null;
    const s = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
    if (s < 60) return `${s}s ago`;
    const m = Math.floor(s / 60);
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    const d = Math.floor(h / 24);
    if (d < 30) return `${d}d ago`;
    return new Date(date).toLocaleDateString();
  };

  const fmt = (date) => date
    ? new Date(date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' })
    : null;

  // Visit times are read against the same timezone the server grouped them by,
  // so a visit never appears under the wrong day in the console.
  const fmtVisitTime = (date) => new Date(date).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: analytics?.timeZone || 'Asia/Kolkata'
  });

  // A country code only exists when a CDN geo header reaches the API. Without
  // one the browser's timezone is the closest thing to a location we collect.
  const locationLabel = (row) => row.country || row.timezone || 'Unknown';

  // Every selectable topic = real topics from the DB merged with the fallback
  // list, de-duplicated and sorted. This drives both the filter and the
  // Add/Edit question form so they always match the actual data.
  const topicOptions = useMemo(() => {
    const set = new Set([...FALLBACK_TOPICS, ...liveTopics].filter(Boolean));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [liveTopics]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await axios.get(`${ADMIN_API}/users`, { headers });
      const payload = res.data;
      setUsers(Array.isArray(payload) ? payload : payload?.users || payload?.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load users.');
    } finally {
      setLoading(false);
    }
  };

  const fetchQuestions = async ({ search = debouncedQuestionSearch, topic = questionTopic } = {}) => {
    try {
      setQuestionsLoading(true);
      setError('');
      const params = new URLSearchParams();
      if (topic !== 'all') params.set('topic', topic);
      if (search.trim()) params.set('search', search.trim());
      const url = `${ADMIN_API}/questions${params.toString() ? `?${params}` : ''}`;
      const res = await axios.get(url, { headers });
      setQuestions(res.data?.questions || []);
      // The backend returns the full distinct topic list (unaffected by the
      // current filter), so the dropdowns always reflect every real topic.
      if (Array.isArray(res.data?.topics)) {
        setLiveTopics(res.data.topics);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load questions.');
    } finally {
      setQuestionsLoading(false);
    }
  };

  const fetchAnalytics = async (date = analyticsDate) => {
    try {
      setAnalyticsLoading(true);
      setError('');
      const res = await axios.get(`${ADMIN_API}/analytics${date ? `?date=${date}` : ''}`, { headers });
      setAnalytics(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load traffic.');
    } finally {
      setAnalyticsLoading(false);
    }
  };

  useEffect(() => {
    if (!isAdminUser) {
      setLoading(false);
      return;
    }

    fetchUsers();
  }, [isAdminUser]);

  useEffect(() => {
    if (!isAdminUser || activeView !== 'traffic') return;

    fetchAnalytics(analyticsDate);
  }, [isAdminUser, activeView, analyticsDate]);

  useEffect(() => {
    const id = setTimeout(() => {
      setDebouncedQuestionSearch(questionSearch);
    }, 500);

    return () => clearTimeout(id);
  }, [questionSearch]);

  useEffect(() => {
    if (!isAdminUser || activeView !== 'questions') return;

    fetchQuestions({ search: debouncedQuestionSearch, topic: questionTopic });
  }, [isAdminUser, activeView, debouncedQuestionSearch, questionTopic]);

  const filteredUsers = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return users.filter(u => {
      const name = (u.username || u.name || '').toLowerCase();
      const email = (u.email || '').toLowerCase();
      if (term && !name.includes(term) && !email.includes(term)) return false;
      if (showBlockedOnly && !u.isBlocked) return false;
      if (onlineFilter === 'online' && !u.isOnline) return false;
      if (onlineFilter === 'offline' && u.isOnline) return false;
      if (joinStart && (!u.joiningDate || new Date(u.joiningDate) < new Date(joinStart))) return false;
      if (joinEnd && (!u.joiningDate || new Date(u.joiningDate) > new Date(joinEnd))) return false;
      return true;
    });
  }, [users, searchTerm, showBlockedOnly, onlineFilter, joinStart, joinEnd]);

  const stats = useMemo(() => ({
    total: users.length,
    online: users.filter(u => u.isOnline).length,
    blocked: users.filter(u => u.isBlocked).length,
    admins: users.filter(u => u.isAdmin || u.role === 'admin').length,
  }), [users]);

  const trafficStats = useMemo(() => ({
    weekPageViews: (analytics?.trend || []).reduce((sum, day) => sum + day.pageViews, 0),
    // Seeds with 1 so an empty day can't divide by zero when sizing the bars.
    peakHourViews: Math.max(1, ...(analytics?.byHour || []).map(bucket => bucket.pageViews))
  }), [analytics]);

  const questionStats = useMemo(() => ({
    total: questions.length,
    easy: questions.filter(q => q.difficulty === 'Easy').length,
    medium: questions.filter(q => q.difficulty === 'Medium').length,
    hard: questions.filter(q => q.difficulty === 'Hard').length,
  }), [questions]);

  const canActOnUser = (user) => {
    const isAdm = user.isAdmin || user.role === 'admin';
    const isSelf = user._id === auth?.user?._id || user.email?.toLowerCase() === auth?.user?.email?.toLowerCase();
    return isMainAdmin ? !isSelf : !isAdm;
  };

  const handleToggleBlock = async (user) => {
    if (!canActOnUser(user)) return;
    if (!window.confirm(`${user.isBlocked ? 'Unblock' : 'Block'} ${user.username || user.email}?`)) return;
    try {
      setActionUserId(user._id);
      const res = await axios.patch(`${ADMIN_API}/users/${user._id}/block`, {}, { headers });
      const upd = res.data?.user || res.data || {};
      setUsers(prev => prev.map(item => item._id === user._id ? { ...item, ...upd } : item));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed.');
    } finally {
      setActionUserId(null);
    }
  };

  const handleDeleteUser = async (user) => {
    if (!canActOnUser(user)) return;
    if (!window.confirm(`Delete ${user.username || user.email}? This cannot be undone.`)) return;
    try {
      setActionUserId(user._id);
      await axios.delete(`${ADMIN_API}/users/${user._id}`, { headers });
      setUsers(prev => prev.filter(item => item._id !== user._id));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed.');
    } finally {
      setActionUserId(null);
    }
  };

  const openEditModal = (user) => {
    if (!canActOnUser(user)) return;
    setEditUser(user);
    setEditForm({ username: user.username || '', email: user.email || '', role: user.role || 'user', password: '' });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editUser) return;
    try {
      const trimmedPassword = editForm.password.trim();
      if (trimmedPassword && trimmedPassword.length < 6) {
        setError('New password must be at least 6 characters.');
        return;
      }
      setIsSavingEdit(true);
      const res = await axios.patch(`${ADMIN_API}/users/${editUser._id}`, {
        username: editForm.username.trim(),
        email: editForm.email.trim(),
        role: editForm.role,
        // Only sent when the admin actually typed a new password
        ...(trimmedPassword ? { password: trimmedPassword } : {})
      }, { headers });
      const upd = res.data?.user || res.data || null;
      if (upd) setUsers(prev => prev.map(item => item._id === editUser._id ? { ...item, ...upd } : item));
      setEditUser(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed.');
    } finally {
      setIsSavingEdit(false);
    }
  };

  const openQuestionModal = (question = null) => {
    setQuestionEditor(question);
    setQuestionForm(question ? {
      name: question.name || '',
      topic: question.topic || 'Array',
      difficulty: question.difficulty || 'Easy',
      sequenceNo: question.sequenceNo || 0,
      leetcodeLink: question.leetcodeLink || '',
      gfgLink: question.gfgLink || ''
    } : EMPTY_QUESTION);
  };

  const handleQuestionSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSavingQuestion(true);
      const payload = {
        ...questionForm,
        name: questionForm.name.trim(),
        topic: questionForm.topic.trim(),
        sequenceNo: Number(questionForm.sequenceNo) || 0
      };
      const res = questionEditor
        ? await axios.patch(`${ADMIN_API}/questions/${questionEditor._id}`, payload, { headers })
        : await axios.post(`${ADMIN_API}/questions`, payload, { headers });
      const saved = res.data;

      setQuestions(prev => {
        const next = questionEditor
          ? prev.map(item => item._id === saved._id ? saved : item)
          : [...prev, saved];
        return next.sort((a, b) => (a.topic || '').localeCompare(b.topic || '') || (a.sequenceNo || 0) - (b.sequenceNo || 0) || (a.name || '').localeCompare(b.name || ''));
      });
      setQuestionEditor(undefined);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save question.');
    } finally {
      setIsSavingQuestion(false);
    }
  };

  const handleResetQuestionFilters = () => {
    if (questionSearch === '' && questionTopic === 'all') {
      fetchQuestions({ search: '', topic: 'all' });
      return;
    }

    setQuestionSearch('');
    setDebouncedQuestionSearch('');
    setQuestionTopic('all');
  };

  const handleDeleteQuestion = async (question) => {
    if (!window.confirm(`Delete "${question.name}"? This will remove users' saved progress for it.`)) return;
    try {
      setActionQuestionId(question._id);
      await axios.delete(`${ADMIN_API}/questions/${question._id}`, { headers });
      setQuestions(prev => prev.filter(item => item._id !== question._id));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete question.');
    } finally {
      setActionQuestionId(null);
    }
  };

  const DateCell = ({ date }) => date ? (
    <div className="leading-tight">
      <div className="text-gray-300">{fmt(date)}</div>
      <div className="text-gray-600 text-[10px]">{timeAgo(date)}</div>
    </div>
  ) : <span className="text-gray-600">-</span>;

  if (!auth || !auth.user) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Authentication Required</h1>
          <p className="text-gray-400">Please log in as an admin to view this page.</p>
        </div>
      </div>
    );
  }

  if (loading) return <LoadingScreen message="Loading admin console..." />;

  if (!isAdminUser) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
        <div className="bg-[#111] border border-[#2a2a2a] rounded-xl p-10 text-center max-w-md">
          <h1 className="text-2xl font-bold">Access Denied</h1>
          <p className="text-gray-400 mt-2 mb-6">Admin privileges required.</p>
          <Link to="/sheet" className="px-5 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 font-semibold">Back to dashboard</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080808] text-white">
      <div className="px-4 py-8" style={{ maxWidth: '1600px', margin: '0 auto' }}>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-7">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Admin Console</h1>
            <p className="text-gray-500 text-sm mt-1">Manage users, permissions, activity, and sheet questions.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <div className="flex rounded-lg border border-[#252525] bg-[#101010] p-1">
              <button onClick={() => setActiveView('users')} className={`px-4 py-2 rounded-md text-sm font-medium ${activeView === 'users' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}>Users</button>
              <button onClick={() => setActiveView('questions')} className={`px-4 py-2 rounded-md text-sm font-medium ${activeView === 'questions' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}>Questions</button>
              <button onClick={() => setActiveView('traffic')} className={`px-4 py-2 rounded-md text-sm font-medium ${activeView === 'traffic' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}>Traffic</button>
            </div>
            <button
              onClick={() => {
                if (activeView === 'users') return fetchUsers();
                if (activeView === 'traffic') return fetchAnalytics(analyticsDate);
                return fetchQuestions({ search: questionSearch, topic: questionTopic });
              }}
              className="px-4 py-2 rounded-lg bg-[#161616] hover:bg-[#1e1e1e] border border-[#252525] text-sm font-medium"
            >Refresh</button>
            <Link to="/sheet" className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-sm font-medium">Dashboard</Link>
          </div>
        </div>

        {error && <div className="mb-4 rounded-lg border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">{error}</div>}

        {activeView === 'users' && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
              {[
                { label: 'Total Users', value: stats.total, color: 'text-white' },
                { label: 'Online Now', value: stats.online, color: 'text-green-400' },
                { label: 'Blocked', value: stats.blocked, color: 'text-amber-400' },
                { label: 'Admins', value: stats.admins, color: 'text-blue-400' },
              ].map(s => (
                <div key={s.label} className="bg-[#0f0f0f] border border-[#1e1e1e] rounded-xl px-4 py-4">
                  <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
                  <div className="text-gray-600 text-xs mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>

            <div className="bg-[#0f0f0f] border border-[#1e1e1e] rounded-xl p-3 mb-4 flex flex-col xl:flex-row gap-3 items-start xl:items-center">
              <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Search username or email..." className="w-full xl:flex-1 xl:min-w-[200px] rounded-lg border border-[#252525] bg-[#0a0a0a] px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500/50" />
              <label className="flex items-center gap-2 text-xs text-gray-400 cursor-pointer">
                <input type="checkbox" checked={showBlockedOnly} onChange={e => setShowBlockedOnly(e.target.checked)} className="rounded" />
                Blocked only
              </label>
              <select value={onlineFilter} onChange={e => setOnlineFilter(e.target.value)} className="rounded-lg border border-[#252525] bg-[#0a0a0a] px-3 py-2 text-xs text-white focus:outline-none">
                <option value="all">All status</option>
                <option value="online">Online</option>
                <option value="offline">Offline</option>
              </select>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span>Joined:</span>
                <input type="date" value={joinStart} onChange={e => setJoinStart(e.target.value)} className="rounded-lg border border-[#252525] bg-[#0a0a0a] px-2 py-2 text-xs text-white focus:outline-none" />
                <span>-</span>
                <input type="date" value={joinEnd} onChange={e => setJoinEnd(e.target.value)} className="rounded-lg border border-[#252525] bg-[#0a0a0a] px-2 py-2 text-xs text-white focus:outline-none" />
              </div>
              <span className="text-xs text-gray-600 xl:ml-auto">{filteredUsers.length} / {users.length} users</span>
            </div>

            <div className="hidden xl:block bg-[#0f0f0f] border border-[#1e1e1e] rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full" style={{ fontSize: '12px' }}>
                  <thead>
                    <tr className="bg-[#0a0a0a] border-b border-[#1e1e1e] text-gray-500 text-[11px] uppercase tracking-wider">
                      {['User', 'Email', 'Solved', 'Joined', 'Last Login', 'Last Online', 'Last Submission', 'Role', 'Status', 'Actions'].map(h => (
                        <th key={h} className={`px-3 py-2.5 font-semibold ${h === 'Actions' ? 'text-right' : h === 'User' || h === 'Email' ? 'text-left' : 'text-center'}`}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#131313]">
                    {filteredUsers.length === 0 ? (
                      <tr><td colSpan={10} className="py-12 text-center text-gray-600">No users found.</td></tr>
                    ) : filteredUsers.map(user => {
                      const isAdm = user.isAdmin || user.role === 'admin';
                      const isBlocked = user.isBlocked;
                      const solved = user.completedQuestions ?? user.completedQuestionsCount ?? user.totalCompleted ?? user.completedCount ?? 0;
                      const isBusy = actionUserId === user._id;
                      const canAct = canActOnUser(user);
                      return (
                        <tr key={user._id} className={`hover:bg-[#111] transition-colors ${isBlocked ? 'opacity-55' : ''}`}>
                          <td className="px-3 py-2.5">
                            <div className="flex items-center gap-2 min-w-[130px]">
                              <span className={`w-1.5 h-1.5 rounded-full ${user.isOnline ? 'bg-green-400' : 'bg-gray-700'}`} />
                              <div>
                                <div className="font-semibold text-white">{user.username || user.name || 'Unnamed'}</div>
                                <div className="text-gray-700 font-mono" style={{ fontSize: '9px' }}>{user._id?.slice(-8)}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-3 py-2.5 text-gray-400 max-w-[220px]"><span className="truncate block">{user.email || '-'}</span></td>
                          <td className="px-3 py-2.5 text-center text-blue-300 font-semibold">{solved}</td>
                          <td className="px-3 py-2.5 text-center text-gray-400">{fmt(user.joiningDate) || '-'}</td>
                          <td className="px-3 py-2.5 text-center"><DateCell date={user.lastLoginDate} /></td>
                          <td className="px-3 py-2.5 text-center"><DateCell date={user.lastActive} /></td>
                          <td className="px-3 py-2.5 text-center"><DateCell date={user.lastSubmissionDate} /></td>
                          <td className="px-3 py-2.5 text-center"><span className={`px-2 py-0.5 rounded-full font-medium ${isAdm ? 'bg-blue-500/15 text-blue-400' : 'bg-gray-700/20 text-gray-500'}`}>{isAdm ? 'Admin' : 'User'}</span></td>
                          <td className="px-3 py-2.5 text-center">{user.isOnline ? <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500/15 text-green-400">Online</span> : <span className="px-2 py-0.5 rounded-full bg-gray-700/20 text-gray-500">Offline</span>}</td>
                          <td className="px-3 py-2.5">
                            <div className="flex justify-end gap-1">
                              <button onClick={() => openEditModal(user)} disabled={!canAct || isBusy} className={`px-2.5 py-1 rounded text-[11px] font-medium border ${!canAct || isBusy ? 'border-gray-800 text-gray-700 cursor-not-allowed' : 'border-slate-600/50 text-slate-300 hover:bg-slate-500/10'}`}>Edit</button>
                              <button onClick={() => handleToggleBlock(user)} disabled={!canAct || isBusy} className={`px-2.5 py-1 rounded text-[11px] font-medium border ${!canAct ? 'border-gray-800 text-gray-700 cursor-not-allowed' : isBlocked ? 'border-amber-500/50 text-amber-400 hover:bg-amber-500/10' : 'border-indigo-500/50 text-indigo-400 hover:bg-indigo-500/10'} ${isBusy ? 'opacity-50 cursor-wait' : ''}`}>{isBlocked ? 'Unblock' : 'Block'}</button>
                              <button onClick={() => handleDeleteUser(user)} disabled={!canAct || isBusy} className={`px-2.5 py-1 rounded text-[11px] font-medium border border-rose-600/40 text-rose-400 hover:bg-rose-500/10 ${!canAct || isBusy ? 'opacity-30 cursor-not-allowed' : ''}`}>Delete</button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 xl:hidden">
              {filteredUsers.map(user => {
                const canAct = canActOnUser(user);
                const isBusy = actionUserId === user._id;
                return (
                  <div key={user._id} className={`bg-[#0f0f0f] border border-[#1e1e1e] rounded-xl p-4 ${user.isBlocked ? 'opacity-55' : ''}`}>
                    <div className="flex justify-between gap-3">
                      <div>
                        <div className="font-bold text-white text-sm">{user.username || user.name || 'Unnamed'}</div>
                        <div className="text-gray-500 text-xs break-all">{user.email || '-'}</div>
                      </div>
                      <span className={`h-fit px-2 py-0.5 rounded-full text-[10px] font-medium ${(user.isAdmin || user.role === 'admin') ? 'bg-blue-500/15 text-blue-400' : 'bg-gray-700/20 text-gray-500'}`}>{(user.isAdmin || user.role === 'admin') ? 'Admin' : 'User'}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-xs mt-4 bg-[#151515] p-3 rounded-lg border border-[#1e1e1e]">
                      <div><span className="text-gray-500 block">Solved</span><span className="text-blue-300 font-semibold">{user.completedQuestions ?? 0}</span></div>
                      <div><span className="text-gray-500 block">Joined</span><span className="text-gray-300">{fmt(user.joiningDate) || '-'}</span></div>
                      <div><span className="text-gray-500 block">Last Login</span><DateCell date={user.lastLoginDate} /></div>
                      <div><span className="text-gray-500 block">Last Online</span><DateCell date={user.lastActive} /></div>
                    </div>
                    <div className="flex justify-end gap-2 mt-3 pt-3 border-t border-[#1e1e1e]">
                      <button onClick={() => openEditModal(user)} disabled={!canAct || isBusy} className="flex-1 px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-600/50 text-slate-300 disabled:opacity-30">Edit</button>
                      <button onClick={() => handleToggleBlock(user)} disabled={!canAct || isBusy} className="flex-1 px-3 py-1.5 rounded-lg text-xs font-medium border border-indigo-500/50 text-indigo-400 disabled:opacity-30">{user.isBlocked ? 'Unblock' : 'Block'}</button>
                      <button onClick={() => handleDeleteUser(user)} disabled={!canAct || isBusy} className="flex-1 px-3 py-1.5 rounded-lg text-xs font-medium border border-rose-600/40 text-rose-400 disabled:opacity-30">Delete</button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {activeView === 'questions' && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
              {[
                { label: 'Questions', value: questionStats.total, color: 'text-white' },
                { label: 'Easy', value: questionStats.easy, color: 'text-green-400' },
                { label: 'Medium', value: questionStats.medium, color: 'text-yellow-400' },
                { label: 'Hard', value: questionStats.hard, color: 'text-red-400' },
              ].map(s => (
                <div key={s.label} className="bg-[#0f0f0f] border border-[#1e1e1e] rounded-xl px-4 py-4">
                  <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
                  <div className="text-gray-600 text-xs mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>

            <div className="bg-[#0f0f0f] border border-[#1e1e1e] rounded-xl p-3 mb-4 flex flex-col lg:flex-row gap-3">
              <input value={questionSearch} onChange={e => setQuestionSearch(e.target.value)} placeholder="Search questions..." className="w-full lg:flex-1 rounded-lg border border-[#252525] bg-[#0a0a0a] px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500/50" />
              <select value={questionTopic} onChange={e => setQuestionTopic(e.target.value)} className="rounded-lg border border-[#252525] bg-[#0a0a0a] px-3 py-2 text-sm text-white focus:outline-none">
                <option value="all">All topics</option>
                {topicOptions.map(topic => <option key={topic} value={topic}>{topic}</option>)}
              </select>
              <button onClick={handleResetQuestionFilters} className="px-4 py-2 rounded-lg border border-[#252525] bg-[#161616] hover:bg-[#1e1e1e] text-sm font-medium">Reset Filter</button>
              <button onClick={() => openQuestionModal()} className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-sm font-semibold">Add Question</button>
            </div>

            <div className="bg-[#0f0f0f] border border-[#1e1e1e] rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full" style={{ fontSize: '12px' }}>
                  <thead>
                    <tr className="bg-[#0a0a0a] border-b border-[#1e1e1e] text-gray-500 text-[11px] uppercase tracking-wider">
                      {['No.', 'Name', 'Topic', 'Difficulty', 'LeetCode', 'GFG', 'Actions'].map(h => (
                        <th key={h} className={`px-3 py-2.5 font-semibold ${h === 'Name' ? 'text-left' : h === 'Actions' ? 'text-right' : 'text-center'}`}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#131313]">
                    {questionsLoading ? (
                      <tr><td colSpan={7} className="py-12 text-center text-gray-500">Loading questions...</td></tr>
                    ) : questions.length === 0 ? (
                      <tr><td colSpan={7} className="py-12 text-center text-gray-600">No questions found.</td></tr>
                    ) : questions.map(question => (
                      <tr key={question._id} className="hover:bg-[#111] transition-colors">
                        <td className="px-3 py-2.5 text-center text-gray-500">{question.sequenceNo || 0}</td>
                        <td className="px-3 py-2.5 min-w-[260px]">
                          <div className="font-semibold text-white">{question.name}</div>
                          <div className="text-gray-700 font-mono text-[9px]">{question._id}</div>
                        </td>
                        <td className="px-3 py-2.5 text-center text-gray-400">{question.topic}</td>
                        <td className="px-3 py-2.5 text-center">
                          <span className={`px-2 py-0.5 rounded-full font-medium ${question.difficulty === 'Easy' ? 'bg-green-500/15 text-green-400' : question.difficulty === 'Medium' ? 'bg-yellow-500/15 text-yellow-400' : 'bg-red-500/15 text-red-400'}`}>{question.difficulty}</span>
                        </td>
                        <td className="px-3 py-2.5 text-center">{question.leetcodeLink ? <a href={question.leetcodeLink} target="_blank" rel="noreferrer" className="text-orange-400 hover:text-orange-300">Open</a> : <span className="text-gray-700">-</span>}</td>
                        <td className="px-3 py-2.5 text-center">{question.gfgLink ? <a href={question.gfgLink} target="_blank" rel="noreferrer" className="text-green-400 hover:text-green-300">Open</a> : <span className="text-gray-700">-</span>}</td>
                        <td className="px-3 py-2.5">
                          <div className="flex justify-end gap-1">
                            <button onClick={() => openQuestionModal(question)} disabled={actionQuestionId === question._id} className="px-2.5 py-1 rounded text-[11px] font-medium border border-slate-600/50 text-slate-300 hover:bg-slate-500/10 disabled:opacity-40">Edit</button>
                            <button onClick={() => handleDeleteQuestion(question)} disabled={actionQuestionId === question._id} className="px-2.5 py-1 rounded text-[11px] font-medium border border-rose-600/40 text-rose-400 hover:bg-rose-500/10 disabled:opacity-40">Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {activeView === 'traffic' && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
              {[
                { label: 'Page Views', value: analytics?.pageViews ?? 0, color: 'text-white' },
                { label: 'Unique Visitors', value: analytics?.uniqueVisitors ?? 0, color: 'text-green-400' },
                { label: 'Last 7 Days', value: trafficStats.weekPageViews, color: 'text-blue-400' },
                { label: `Last ${analytics?.retentionDays ?? 90} Days`, value: analytics?.totalPageViews ?? 0, color: 'text-gray-300' },
              ].map(s => (
                <div key={s.label} className="bg-[#0f0f0f] border border-[#1e1e1e] rounded-xl px-4 py-4">
                  <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
                  <div className="text-gray-600 text-xs mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>

            <div className="bg-[#0f0f0f] border border-[#1e1e1e] rounded-xl p-3 mb-4 flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span>Day:</span>
                <input type="date" value={analyticsDate || analytics?.day || ''} onChange={e => setAnalyticsDate(e.target.value)} className="rounded-lg border border-[#252525] bg-[#0a0a0a] px-2 py-2 text-xs text-white focus:outline-none" />
              </div>
              <button onClick={() => setAnalyticsDate('')} className="px-4 py-2 rounded-lg border border-[#252525] bg-[#161616] hover:bg-[#1e1e1e] text-xs font-medium">Today</button>
              <span className="text-xs text-gray-600 sm:ml-auto">All times in {analytics?.timeZone || 'Asia/Kolkata'}</span>
            </div>

            <div className="bg-[#0f0f0f] border border-[#1e1e1e] rounded-xl p-4 mb-4">
              <h2 className="text-sm font-semibold mb-4">Page views by hour</h2>
              {analyticsLoading ? (
                <div className="h-40 flex items-center justify-center text-gray-600 text-sm">Loading traffic...</div>
              ) : (
                <>
                  <div className="flex items-end gap-[2px] h-40">
                    {(analytics?.byHour || []).map(bucket => (
                      <div key={bucket.hour} className="group relative flex-1 h-full flex items-end">
                        <div
                          className="w-full rounded-t bg-blue-500/70 group-hover:bg-blue-400 transition-colors"
                          style={{ height: bucket.pageViews ? `${Math.max((bucket.pageViews / trafficStats.peakHourViews) * 100, 2)}%` : '0%' }}
                        />
                        <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:block z-10 whitespace-nowrap rounded-md border border-[#252525] bg-[#0a0a0a] px-2 py-1 text-[10px] text-gray-300">
                          {String(bucket.hour).padStart(2, '0')}:00 — {bucket.pageViews} view{bucket.pageViews === 1 ? '' : 's'}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between text-[10px] text-gray-600 mt-2">
                    {['00:00', '06:00', '12:00', '18:00', '23:00'].map(label => <span key={label}>{label}</span>)}
                  </div>
                </>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
              <div className="bg-[#0f0f0f] border border-[#1e1e1e] rounded-xl overflow-hidden">
                <div className="px-4 py-3 border-b border-[#1e1e1e]">
                  <h2 className="text-sm font-semibold">Where visitors are</h2>
                </div>
                <table className="w-full" style={{ fontSize: '12px' }}>
                  <thead>
                    <tr className="bg-[#0a0a0a] border-b border-[#1e1e1e] text-gray-500 text-[11px] uppercase tracking-wider">
                      <th className="px-4 py-2.5 text-left font-semibold">Location</th>
                      <th className="px-4 py-2.5 text-center font-semibold">Visitors</th>
                      <th className="px-4 py-2.5 text-center font-semibold">Views</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#131313]">
                    {(analytics?.locations || []).length === 0 ? (
                      <tr><td colSpan={3} className="py-10 text-center text-gray-600">No visits yet.</td></tr>
                    ) : analytics.locations.map(row => (
                      <tr key={`${row.country}-${row.timezone}`} className="hover:bg-[#111] transition-colors">
                        <td className="px-4 py-2.5 text-gray-300">{locationLabel(row)}</td>
                        <td className="px-4 py-2.5 text-center text-gray-400">{row.uniqueVisitors}</td>
                        <td className="px-4 py-2.5 text-center text-gray-400">{row.pageViews}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="bg-[#0f0f0f] border border-[#1e1e1e] rounded-xl overflow-hidden">
                <div className="px-4 py-3 border-b border-[#1e1e1e]">
                  <h2 className="text-sm font-semibold">Most visited pages</h2>
                </div>
                <table className="w-full" style={{ fontSize: '12px' }}>
                  <thead>
                    <tr className="bg-[#0a0a0a] border-b border-[#1e1e1e] text-gray-500 text-[11px] uppercase tracking-wider">
                      <th className="px-4 py-2.5 text-left font-semibold">Page</th>
                      <th className="px-4 py-2.5 text-center font-semibold">Views</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#131313]">
                    {(analytics?.pages || []).length === 0 ? (
                      <tr><td colSpan={2} className="py-10 text-center text-gray-600">No visits yet.</td></tr>
                    ) : analytics.pages.map(row => (
                      <tr key={row.path} className="hover:bg-[#111] transition-colors">
                        <td className="px-4 py-2.5 text-gray-400 font-mono text-[11px]">{row.path}</td>
                        <td className="px-4 py-2.5 text-center text-gray-400">{row.pageViews}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-[#0f0f0f] border border-[#1e1e1e] rounded-xl overflow-hidden">
              <div className="px-4 py-3 border-b border-[#1e1e1e] flex items-center justify-between">
                <h2 className="text-sm font-semibold">Recent visits</h2>
                <span className="text-[10px] text-gray-600">{(analytics?.recent || []).length} shown</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full" style={{ fontSize: '12px' }}>
                  <thead>
                    <tr className="bg-[#0a0a0a] border-b border-[#1e1e1e] text-gray-500 text-[11px] uppercase tracking-wider">
                      {['Time', 'Page', 'Location', 'Came From'].map(h => (
                        <th key={h} className="px-4 py-2.5 text-left font-semibold">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#131313]">
                    {(analytics?.recent || []).length === 0 ? (
                      <tr><td colSpan={4} className="py-12 text-center text-gray-600">No visits on this day.</td></tr>
                    ) : analytics.recent.map((visit, index) => (
                      <tr key={`${visit.createdAt}-${index}`} className="hover:bg-[#111] transition-colors">
                        <td className="px-4 py-2.5 text-gray-300 whitespace-nowrap">{fmtVisitTime(visit.createdAt)}</td>
                        <td className="px-4 py-2.5 text-gray-400 font-mono text-[11px]">{visit.path}</td>
                        <td className="px-4 py-2.5 text-gray-400">{locationLabel(visit)}</td>
                        <td className="px-4 py-2.5 text-gray-500">{visit.referrer || 'Direct'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>

      {editUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
          <div className="bg-[#0f0f0f] border border-[#252525] rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-lg font-semibold">Edit User</h2>
                <p className="text-gray-500 text-xs mt-0.5">{editUser.email}</p>
              </div>
              <button onClick={() => setEditUser(null)} className="text-gray-500 hover:text-white w-8 h-8 rounded-lg hover:bg-[#1a1a1a]">x</button>
            </div>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              {[{ label: 'Username', name: 'username', type: 'text' }, { label: 'Email', name: 'email', type: 'email' }].map(f => (
                <div key={f.name}>
                  <label className="block text-xs text-gray-500 mb-1.5">{f.label}</label>
                  <input type={f.type} value={editForm[f.name]} onChange={e => setEditForm(p => ({ ...p, [f.name]: e.target.value }))} className="w-full rounded-lg border border-[#252525] bg-[#0a0a0a] px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500/50" required />
                </div>
              ))}
              <div>
                <label className="block text-xs text-gray-500 mb-1.5">Role</label>
                <select value={editForm.role} onChange={e => setEditForm(p => ({ ...p, role: e.target.value }))} className="w-full rounded-lg border border-[#252525] bg-[#0a0a0a] px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500/50">
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1.5">Reset password</label>
                <input
                  type="text"
                  value={editForm.password}
                  onChange={e => setEditForm(p => ({ ...p, password: e.target.value }))}
                  autoComplete="new-password"
                  placeholder="Leave blank to keep current password"
                  className="w-full rounded-lg border border-[#252525] bg-[#0a0a0a] px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500/50"
                />
                <p className="mt-1 text-[11px] text-gray-600">Min 6 characters. The user can change it later from their profile.</p>
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <button type="button" onClick={() => setEditUser(null)} className="px-4 py-2 rounded-lg border border-[#252525] text-sm text-gray-400 hover:bg-[#161616]">Cancel</button>
                <button type="submit" disabled={isSavingEdit} className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-sm font-semibold text-white disabled:opacity-60">{isSavingEdit ? 'Saving...' : 'Save changes'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {questionEditor !== undefined && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
          <div className="bg-[#0f0f0f] border border-[#252525] rounded-2xl w-full max-w-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-lg font-semibold">{questionEditor ? 'Edit Question' : 'Add Question'}</h2>
                <p className="text-gray-500 text-xs mt-0.5">Update name, topic, difficulty, order, and links.</p>
              </div>
              <button onClick={() => setQuestionEditor(undefined)} className="text-gray-500 hover:text-white w-8 h-8 rounded-lg hover:bg-[#1a1a1a]">x</button>
            </div>
            <form onSubmit={handleQuestionSubmit} className="space-y-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1.5">Question Name</label>
                <input value={questionForm.name} onChange={e => setQuestionForm(p => ({ ...p, name: e.target.value }))} className="w-full rounded-lg border border-[#252525] bg-[#0a0a0a] px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500/50" required />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5">Topic</label>
                  <input
                    list="admin-topic-options"
                    value={questionForm.topic}
                    onChange={e => setQuestionForm(p => ({ ...p, topic: e.target.value }))}
                    placeholder="Pick or type a topic"
                    className="w-full rounded-lg border border-[#252525] bg-[#0a0a0a] px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500/50"
                    required
                  />
                  <datalist id="admin-topic-options">
                    {topicOptions.map(topic => <option key={topic} value={topic} />)}
                  </datalist>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5">Difficulty</label>
                  <select value={questionForm.difficulty} onChange={e => setQuestionForm(p => ({ ...p, difficulty: e.target.value }))} className="w-full rounded-lg border border-[#252525] bg-[#0a0a0a] px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500/50">
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5">Sequence No.</label>
                  <input type="number" value={questionForm.sequenceNo} onChange={e => setQuestionForm(p => ({ ...p, sequenceNo: e.target.value }))} className="w-full rounded-lg border border-[#252525] bg-[#0a0a0a] px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500/50" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5">LeetCode Link</label>
                  <input type="url" value={questionForm.leetcodeLink} onChange={e => setQuestionForm(p => ({ ...p, leetcodeLink: e.target.value }))} className="w-full rounded-lg border border-[#252525] bg-[#0a0a0a] px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500/50" />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5">GFG Link</label>
                  <input type="url" value={questionForm.gfgLink} onChange={e => setQuestionForm(p => ({ ...p, gfgLink: e.target.value }))} className="w-full rounded-lg border border-[#252525] bg-[#0a0a0a] px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500/50" />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <button type="button" onClick={() => setQuestionEditor(undefined)} className="px-4 py-2 rounded-lg border border-[#252525] text-sm text-gray-400 hover:bg-[#161616]">Cancel</button>
                <button type="submit" disabled={isSavingQuestion} className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-sm font-semibold text-white disabled:opacity-60">{isSavingQuestion ? 'Saving...' : 'Save question'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminPage;
