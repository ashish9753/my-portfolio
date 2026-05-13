import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Footer from '../sheet-app/components/Footer';
import LoadingScreen from '../components/LoadingScreen.jsx';

function PostgreSQLSheet({ auth, setAuth }) {
  const topic = 'PostgreSQL';
  const navigate = useNavigate();
  const [concepts, setConcepts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSections, setExpandedSections] = useState({});
  const [stats, setStats] = useState({ total: 0, completed: 0, percentage: 0 });

  // const API_URL = 'https://api.ashishdev.com/api/core-concepts';
 const API_URL = 'https://dsa-sheet-backend-7r7i.onrender.com/api/core-concepts';
  const getAuthHeaders = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
  const handleAuthError = () => { localStorage.removeItem('token'); localStorage.removeItem('user'); setAuth({ isAuthenticated: false, user: null, token: null }); navigate('/login'); };

  useEffect(() => { fetchConcepts(); fetchStats(); }, []);

  const fetchConcepts = async () => {
    try {
      const response = await axios.get(`${API_URL}?topic=${topic}`, getAuthHeaders());
      const sorted = response.data.sort((a, b) => (a.sequenceNo || 0) - (b.sequenceNo || 0));
      setConcepts(sorted);
      const sections = {}; sorted.forEach(c => { sections[c.subTopic] = false; }); setExpandedSections(sections);
      setLoading(false);
    } catch (error) { if (error.response?.status === 401) handleAuthError(); setLoading(false); }
  };

  const fetchStats = async () => {
    try { const res = await axios.get(`${API_URL}/progress/summary?topic=${topic}`, getAuthHeaders()); setStats(res.data); }
    catch (error) { if (error.response?.status === 401) handleAuthError(); }
  };

  const handleCheckboxChange = async (id, currentStatus) => {
    try { await axios.patch(`${API_URL}/${id}`, { completed: !currentStatus }, getAuthHeaders()); setConcepts(concepts.map(c => c._id === id ? { ...c, completed: !currentStatus } : c)); fetchStats(); }
    catch (error) { console.error(error); }
  };

  const groupedBySubTopic = concepts.reduce((acc, concept) => { if (!acc[concept.subTopic]) acc[concept.subTopic] = []; acc[concept.subTopic].push(concept); return acc; }, {});
  const filterConcepts = (arr) => !searchQuery ? arr : arr.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const toggleSection = (subTopic) => setExpandedSections(prev => ({ ...prev, [subTopic]: !prev[subTopic] }));
  const handleLogout = () => { localStorage.removeItem('token'); localStorage.removeItem('user'); setAuth({ isAuthenticated: false, user: null, token: null }); navigate('/login'); };

  if (loading) {
    return <LoadingScreen message="Loading PostgreSQL concepts..." />;
  }

  const completedCount = concepts.filter(c => c.completed).length;
  const progressPercentage = concepts.length > 0 ? Math.round((completedCount / concepts.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <header className="border-b border-gray-800 bg-black/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Link to="/sheet" className="text-indigo-400 hover:text-indigo-300 transition-colors"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg></Link>
              <h1 className="text-2xl font-bold"><span className="text-indigo-400">PostgreSQL</span> Interview Prep</h1>
            </div>
            <div className="flex items-center space-x-4"><span className="text-gray-400">{auth.user?.username}</span><button onClick={handleLogout} className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors">Logout</button></div>
          </div>
        </div>
      </header>
      <div className="bg-[#0a0a0a] border-b border-[#2a2a2a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-[#1a1a1a] p-4 rounded-lg border border-[#2a2a2a]"><div className="text-gray-400 text-sm">Total</div><div className="text-2xl font-bold text-white">{stats.total}</div></div>
            <div className="bg-[#1a1a1a] p-4 rounded-lg border border-[#2a2a2a]"><div className="text-gray-400 text-sm">Completed</div><div className="text-2xl font-bold text-indigo-400">{stats.completed}</div></div>
            <div className="bg-[#1a1a1a] p-4 rounded-lg border border-[#2a2a2a]"><div className="text-gray-400 text-sm">Progress</div><div className="text-2xl font-bold text-indigo-400">{stats.percentage}%</div></div>
          </div>
          <div className="mt-4"><div className="flex justify-between text-sm text-gray-400 mb-2"><span>Overall Progress</span><span>{progressPercentage}%</span></div><div className="w-full bg-[#2a2a2a] rounded-full h-2"><div className="bg-indigo-400 h-2 rounded-full transition-all duration-300" style={{ width: `${progressPercentage}%` }}></div></div></div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="relative"><input type="text" placeholder="Search concepts..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-4 py-3 pl-12 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-400 transition-colors" /><svg className="w-5 h-5 text-gray-500 absolute left-4 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg></div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {Object.entries(groupedBySubTopic).map(([subTopic, subTopicConcepts]) => {
          const filtered = filterConcepts(subTopicConcepts); if (filtered.length === 0) return null;
          const done = filtered.filter(c => c.completed).length;
          return (
            <div key={subTopic} className="mb-8">
              <h2 onClick={() => toggleSection(subTopic)} className="text-xl font-bold mb-4 pb-2 border-b text-indigo-400 border-indigo-400 cursor-pointer flex items-center justify-between hover:opacity-80 transition-opacity">
                <span>{subTopic} ({done}/{filtered.length})</span>
                <svg className={`w-6 h-6 transition-transform duration-300 ${expandedSections[subTopic] ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </h2>
              {expandedSections[subTopic] && (
                <div className="space-y-3">
                  {filtered.map((concept, index) => (
                    <div key={concept._id} className={`bg-[#1a1a1a] border rounded-lg p-4 hover:bg-[#252525] transition-all ${concept.completed ? 'border-indigo-400/50' : 'border-[#2a2a2a]'}`}>
                      <div className="flex items-start space-x-4">
                        <input type="checkbox" checked={concept.completed || false} onChange={() => handleCheckboxChange(concept._id, concept.completed)} className="mt-1 w-5 h-5 rounded border-gray-600 cursor-pointer" />
                        <div className="flex-1">
                          <h3 className={`font-medium ${concept.completed ? 'line-through text-gray-500' : 'text-white'}`}>{index + 1}. {concept.name}</h3>
                          <div className="flex space-x-4 mt-2">
                            {concept.youtubeLink && concept.youtubeLink !== '' && <a href={concept.youtubeLink} target="_blank" rel="noopener noreferrer" className="text-sm text-red-400 hover:text-red-300 transition-colors flex items-center space-x-1"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg><span>YouTube →</span></a>}
                            {concept.notesLink && concept.notesLink !== '' && <a href={concept.notesLink} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-400 hover:text-blue-300 transition-colors flex items-center space-x-1"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm4 18H6V4h7v5h5v11z"/></svg><span>Notes →</span></a>}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <Footer />
    </div>
  );
}

export default PostgreSQLSheet;
