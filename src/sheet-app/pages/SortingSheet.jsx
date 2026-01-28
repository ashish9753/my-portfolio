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
    Easy: true,
    Medium: true,
    Hard: true
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

  const handleCheckboxChange = async (id, currentStatus) => {
    try {
      await axios.patch(`${API_URL}/${id}`, {
        completed: !currentStatus
      }, getAuthHeaders());
      
      setQuestions(questions.map(q => 
        q._id === id ? { ...q, completed: !currentStatus } : q
      ));
      
      fetchStats();
    } catch (error) {
      console.error('Error updating question:', error);
    }
  };

  const groupedQuestions = {
    Easy: questions.filter(q => q.difficulty === 'Easy'),
    Medium: questions.filter(q => q.difficulty === 'Medium'),
    Hard: questions.filter(q => q.difficulty === 'Hard')
  };

  const filterQuestions = (questionsArray) => {
    if (!searchQuery.trim()) return questionsArray;
    return questionsArray.filter(q => 
      q.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const completedCount = questions.filter(q => q.completed).length;
  const progressPercentage = questions.length > 0 ? Math.round((completedCount / questions.length) * 100) : 0;

  const toggleSection = (difficulty) => {
    setExpandedSections(prev => ({
      ...prev,
      [difficulty]: !prev[difficulty]
    }));
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setAuth({
      isAuthenticated: false,
      user: null,
      token: null
    });
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-[#00ff00] text-xl">Loading Sorting questions...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-black/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Link to="/sheet" className="text-[#00ff00] hover:text-[#00ff00]/80 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </Link>
              <h1 className="text-2xl font-bold">
                <span className="text-[#00ff00]">Sorting</span> Sheet
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-400">{auth.user?.username}</span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Bar */}
      <div className="bg-[#0a0a0a] border-b border-[#2a2a2a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-[#1a1a1a] p-4 rounded-lg border border-[#2a2a2a]">
              <div className="text-gray-400 text-sm">Total</div>
              <div className="text-2xl font-bold text-white">{questions.length}</div>
            </div>
            <div className="bg-[#1a1a1a] p-4 rounded-lg border border-[#2a2a2a]">
              <div className="text-gray-400 text-sm">Completed</div>
              <div className="text-2xl font-bold text-[#00ff00]">{completedCount}</div>
            </div>
            <div className="bg-[#1a1a1a] p-4 rounded-lg border border-[#2a2a2a]">
              <div className="text-gray-400 text-sm">Easy</div>
              <div className="text-2xl font-bold text-green-500">
                {groupedQuestions.Easy.filter(q => q.completed).length}/{groupedQuestions.Easy.length}
              </div>
            </div>
            <div className="bg-[#1a1a1a] p-4 rounded-lg border border-[#2a2a2a]">
              <div className="text-gray-400 text-sm">Medium</div>
              <div className="text-2xl font-bold text-yellow-500">
                {groupedQuestions.Medium.filter(q => q.completed).length}/{groupedQuestions.Medium.length}
              </div>
            </div>
            <div className="bg-[#1a1a1a] p-4 rounded-lg border border-[#2a2a2a]">
              <div className="text-gray-400 text-sm">Hard</div>
              <div className="text-2xl font-bold text-red-500">
                {groupedQuestions.Hard.filter(q => q.completed).length}/{groupedQuestions.Hard.length}
              </div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-400 mb-2">
              <span>Progress</span>
              <span>{progressPercentage}%</span>
            </div>
            <div className="w-full bg-[#2a2a2a] rounded-full h-2">
              <div 
                className="bg-[#00ff00] h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search questions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-4 py-3 pl-12 text-white placeholder-gray-500 focus:outline-none focus:border-[#00ff00] transition-colors"
          />
          <svg
            className="w-5 h-5 text-gray-500 absolute left-4 top-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Questions List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {['Easy', 'Medium', 'Hard'].map((difficulty) => {
          const difficultyQuestions = filterQuestions(groupedQuestions[difficulty]);
          if (difficultyQuestions.length === 0) return null;

          const difficultyColors = {
            Easy: 'text-green-500 border-green-500',
            Medium: 'text-yellow-500 border-yellow-500',
            Hard: 'text-red-500 border-red-500'
          };

          return (
            <div key={difficulty} className="mb-8">
              <h2 
                onClick={() => toggleSection(difficulty)}
                className={`text-xl font-bold mb-4 pb-2 border-b ${difficultyColors[difficulty]} cursor-pointer flex items-center justify-between hover:opacity-80 transition-opacity`}
              >
                <span>{difficulty} ({difficultyQuestions.filter(q => q.completed).length}/{difficultyQuestions.length})</span>
                <svg 
                  className={`w-6 h-6 transition-transform duration-300 ${expandedSections[difficulty] ? 'rotate-180' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </h2>
              {expandedSections[difficulty] && (
              <div className="space-y-3">
                {difficultyQuestions.map((question, index) => (
                  <div
                    key={question._id}
                    className={`bg-[#1a1a1a] border rounded-lg p-4 hover:bg-[#252525] transition-all ${
                      question.completed ? 'border-[#00ff00]/50' : 'border-[#2a2a2a]'
                    }`}
                  >
                    <div className="flex items-start space-x-4">
                      <input
                        type="checkbox"
                        checked={question.completed}
                        onChange={() => handleCheckboxChange(question._id, question.completed)}
                        className="mt-1 w-5 h-5 rounded border-gray-600 text-[#00ff00] focus:ring-[#00ff00] focus:ring-offset-0 cursor-pointer"
                      />
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <h3 className={`font-medium ${question.completed ? 'line-through text-gray-500' : 'text-white'}`}>
                            {index + 1}. {question.name}
                          </h3>
                          <span className={`text-sm px-3 py-1 rounded-full ${
                            difficulty === 'Easy' ? 'bg-green-500/20 text-green-400' :
                            difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-red-500/20 text-red-400'
                          }`}>
                            {difficulty}
                          </span>
                        </div>
                        <div className="flex space-x-4 mt-2">
                          {question.leetcodeLink && (
                            <a
                              href={question.leetcodeLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-orange-400 hover:text-orange-300 transition-colors"
                            >
                              LeetCode →
                            </a>
                          )}
                          {question.gfgLink && (
                            <a
                              href={question.gfgLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-green-400 hover:text-green-300 transition-colors"
                            >
                              GFG →
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>              )}            </div>
          );
        })}
      </div>

      <Footer />
    </div>
  );
}

export default SortingSheet;
