import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Footer from '../components/Footer';

function SortingSheet({ auth, setAuth }) {
  const topic = 'Sorting'; // Hardcoded for Sorting page
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSections, setExpandedSections] = useState({
    Easy: false,
    Medium: false,
    Hard: false
  });
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    easyCompleted: 0,
    mediumCompleted: 0,
    hardCompleted: 0
  });

  const API_URL = 'https://dsa-sheet-backend-34xk.onrender.com/api/questions';

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
  };

  const handleAuthError = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setAuth({
      isAuthenticated: false,
      user: null,
      token: null
    });
    navigate('/login');
  };

  useEffect(() => {
    fetchQuestions();
    fetchStats();
  }, []);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/${topic}`, getAuthHeaders());
      setQuestions(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching questions:', error);
      if (error.response?.status === 401) {
        handleAuthError();
      }
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API_URL}/stats/${topic}`, getAuthHeaders());
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
      if (error.response?.status === 401) {
        handleAuthError();
      }
    }
  };

  const toggleCompletion = async (id, currentStatus) => {
    try {
      await axios.patch(
        `${API_URL}/${id}/toggle`,
        {},
        getAuthHeaders()
      );
      
      // Update local state
      setQuestions(questions.map(q => 
        q._id === id ? { ...q, completed: !currentStatus } : q
      ));
      
      // Refresh stats
      fetchStats();
    } catch (error) {
      console.error('Error toggling completion:', error);
      if (error.response?.status === 401) {
        handleAuthError();
      }
    }
  };

  const toggleSection = (difficulty) => {
    setExpandedSections(prev => ({
      ...prev,
      [difficulty]: !prev[difficulty]
    }));
  };

  const groupedQuestions = {
    Easy: questions.filter(q => q.difficulty === 'Easy'),
    Medium: questions.filter(q => q.difficulty === 'Medium'),
    Hard: questions.filter(q => q.difficulty === 'Hard')
  };

  const filteredQuestions = (difficulty) => {
    return groupedQuestions[difficulty].filter(q =>
      q.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const getDifficultyCount = (difficulty) => {
    const total = groupedQuestions[difficulty].length;
    const completed = groupedQuestions[difficulty].filter(q => q.completed).length;
    return `${completed}/${total}`;
  };

  const progressPercentage = stats.total > 0 ? (stats.completed / stats.total * 100).toFixed(1) : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-[#00ff00] text-xl">Loading questions...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#e0e0e0]">
      {/* Header */}
      <header className="border-b border-[#333] bg-[#111] sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link to="/sheet" className="text-[#00ff00] hover:text-[#00d900] transition-colors">
              ← Back to Home
            </Link>
            <h1 className="text-2xl font-bold text-[#ff00ff]">Sorting Questions</h1>
            <div className="text-sm">
              <span className="text-[#888]">Welcome, </span>
              <span className="text-[#00ff00]">{auth.user?.name || 'User'}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-[#111] border border-[#333] rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-[#ff00ff]">Progress</h2>
            <span className="text-[#00ff00] font-bold">{stats.completed}/{stats.total} Completed</span>
          </div>
          <div className="w-full bg-[#222] rounded-full h-4 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-[#ff00ff] to-[#00ff00] h-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <div className="text-right mt-2 text-[#888]">{progressPercentage}%</div>
          
          {/* Difficulty Stats */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="bg-[#0a0a0a] border border-[#00ff00] rounded p-3 text-center">
              <div className="text-[#00ff00] font-semibold">Easy</div>
              <div className="text-2xl font-bold">{getDifficultyCount('Easy')}</div>
            </div>
            <div className="bg-[#0a0a0a] border border-[#ffaa00] rounded p-3 text-center">
              <div className="text-[#ffaa00] font-semibold">Medium</div>
              <div className="text-2xl font-bold">{getDifficultyCount('Medium')}</div>
            </div>
            <div className="bg-[#0a0a0a] border border-[#ff0000] rounded p-3 text-center">
              <div className="text-[#ff0000] font-semibold">Hard</div>
              <div className="text-2xl font-bold">{getDifficultyCount('Hard')}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="max-w-7xl mx-auto px-4 mb-6">
        <input
          type="text"
          placeholder="Search questions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-[#111] border border-[#333] rounded-lg px-4 py-3 text-[#e0e0e0] focus:outline-none focus:border-[#ff00ff] transition-colors"
        />
      </div>

      {/* Questions List */}
      <div className="max-w-7xl mx-auto px-4 pb-8 space-y-4">
        {['Easy', 'Medium', 'Hard'].map(difficulty => (
          <div key={difficulty} className="bg-[#111] border border-[#333] rounded-lg overflow-hidden">
            {/* Section Header */}
            <button
              onClick={() => toggleSection(difficulty)}
              className="w-full px-6 py-4 flex justify-between items-center hover:bg-[#1a1a1a] transition-colors"
            >
              <div className="flex items-center gap-4">
                <span className={`text-lg font-semibold ${
                  difficulty === 'Easy' ? 'text-[#00ff00]' : 
                  difficulty === 'Medium' ? 'text-[#ffaa00]' : 
                  'text-[#ff0000]'
                }`}>
                  {difficulty}
                </span>
                <span className="text-[#888]">
                  {getDifficultyCount(difficulty)}
                </span>
              </div>
              <span className="text-[#888]">
                {expandedSections[difficulty] ? '▼' : '▶'}
              </span>
            </button>

            {/* Questions */}
            {expandedSections[difficulty] && (
              <div className="border-t border-[#333]">
                {filteredQuestions(difficulty).length === 0 ? (
                  <div className="px-6 py-8 text-center text-[#888]">
                    No questions found
                  </div>
                ) : (
                  filteredQuestions(difficulty).map((question, index) => (
                    <div
                      key={question._id}
                      className="px-6 py-4 border-b border-[#222] last:border-b-0 hover:bg-[#1a1a1a] transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        {/* Checkbox */}
                        <input
                          type="checkbox"
                          checked={question.completed}
                          onChange={() => toggleCompletion(question._id, question.completed)}
                          className="w-5 h-5 cursor-pointer accent-[#ff00ff]"
                        />

                        {/* Question Number */}
                        <span className="text-[#888] font-mono min-w-[40px]">
                          {index + 1}.
                        </span>

                        {/* Question Name */}
                        <span className={`flex-1 ${question.completed ? 'line-through text-[#666]' : 'text-[#e0e0e0]'}`}>
                          {question.name}
                        </span>

                        {/* Links */}
                        <div className="flex gap-3">
                          {question.leetcodeLink && (
                            <a
                              href={question.leetcodeLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-4 py-2 bg-[#1a1a1a] border border-[#ffa116] text-[#ffa116] rounded hover:bg-[#ffa116] hover:text-[#000] transition-all"
                            >
                              LeetCode
                            </a>
                          )}
                          {question.gfgLink && (
                            <a
                              href={question.gfgLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-4 py-2 bg-[#1a1a1a] border border-[#00ff00] text-[#00ff00] rounded hover:bg-[#00ff00] hover:text-[#000] transition-all"
                            >
                              GFG
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <Footer />
    </div>
  );
}

export default SortingSheet;
