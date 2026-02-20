import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Footer from '../components/Footer';

function LinkedListSheet({ auth, setAuth }) {
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

  const API_URL = 'https://dsa-sheet-backend-7r7i.onrender.com/api/linkedlist-questions';

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
      const response = await axios.get(API_URL, getAuthHeaders());
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
      const response = await axios.get(`${API_URL}/stats/summary`, getAuthHeaders());
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
    return questionsArray.filter(question =>
      question.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      question.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

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
    navigate('/sheet/login');
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-400';
      case 'Medium': return 'text-yellow-400';
      case 'Hard': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getBorderColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'border-green-400/20 hover:border-green-400/40';
      case 'Medium': return 'border-yellow-400/20 hover:border-yellow-400/40';
      case 'Hard': return 'border-red-400/20 hover:border-red-400/40';
      default: return 'border-gray-400/20';
    }
  };

  const progressPercentage = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading LinkedList questions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Navigation Header */}
      <nav className="bg-[#1a1a1a] border-b border-[#2a2a2a] sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <Link to="/sheet" className="text-xl font-bold text-blue-500 hover:text-blue-400">
                DSA Sheet
              </Link>
              <div className="text-gray-400">
                <span className="text-white">LinkedList</span> Problems
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-400">
                Welcome, <span className="text-blue-400">{auth.user?.name}</span>
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
            LinkedList Problems
          </h1>
          <p className="text-gray-400 text-lg">
            Master linked list data structures, pointer manipulation, and fundamental operations
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-[#1a1a1a] p-4 rounded-lg border border-[#2a2a2a]">
            <h3 className="text-2xl font-bold text-white">{stats.total}</h3>
            <p className="text-gray-400 text-sm">Total Problems</p>
          </div>
          <div className="bg-[#1a1a1a] p-4 rounded-lg border border-[#2a2a2a]">
            <h3 className="text-2xl font-bold text-blue-400">{stats.completed}</h3>
            <p className="text-gray-400 text-sm">Completed</p>
          </div>
          <div className="bg-[#1a1a1a] p-4 rounded-lg border border-[#2a2a2a]">
            <h3 className="text-2xl font-bold text-green-400">{stats.easyCompleted}</h3>
            <p className="text-gray-400 text-sm">Easy</p>
          </div>
          <div className="bg-[#1a1a1a] p-4 rounded-lg border border-[#2a2a2a]">
            <h3 className="text-2xl font-bold text-yellow-400">{stats.mediumCompleted}</h3>
            <p className="text-gray-400 text-sm">Medium</p>
          </div>
          <div className="bg-[#1a1a1a] p-4 rounded-lg border border-[#2a2a2a]">
            <h3 className="text-2xl font-bold text-red-400">{stats.hardCompleted}</h3>
            <p className="text-gray-400 text-sm">Hard</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8 bg-[#1a1a1a] p-6 rounded-lg border border-[#2a2a2a]">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-400">Progress</span>
            <span className="text-white font-semibold">{progressPercentage}%</span>
          </div>
          <div className="w-full bg-[#2a2a2a] rounded-full h-2">
            <div
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search LinkedList problems..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
            />
            <div className="absolute right-3 top-3">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Questions by Difficulty */}
        {['Easy', 'Medium', 'Hard'].map(difficulty => {
          const filteredQuestions = filterQuestions(groupedQuestions[difficulty]);
          return (
            <div key={difficulty} className="mb-6">
              <button
                onClick={() => toggleSection(difficulty)}
                className={`w-full flex items-center justify-between p-4 bg-[#1a1a1a] rounded-lg border ${getBorderColor(difficulty)} hover:bg-[#1e1e1e] transition-all`}
              >
                <div className="flex items-center space-x-3">
                  <span className={`text-xl font-semibold ${getDifficultyColor(difficulty)}`}>
                    {difficulty}
                  </span>
                  <span className="text-gray-400 text-sm">
                    ({filteredQuestions.length} problems)
                  </span>
                </div>
                <svg
                  className={`w-5 h-5 text-gray-400 transform transition-transform ${expandedSections[difficulty] ? 'rotate-90' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              {expandedSections[difficulty] && (
                <div className="mt-2 space-y-2">
                  {filteredQuestions.map((question, index) => (
                    <div
                      key={question._id}
                      className={`p-4 bg-[#1a1a1a] rounded-lg border ${getBorderColor(difficulty)} hover:bg-[#1e1e1e] transition-all`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 flex-1">
                          <input
                            type="checkbox"
                            checked={question.completed || false}
                            onChange={() => handleCheckboxChange(question._id, question.completed)}
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <span className="text-gray-400 text-sm w-8">
                            {index + 1}.
                          </span>
                          <div className="flex-1">
                            <h3 className={`font-medium ${question.completed ? 'line-through text-gray-500' : 'text-white'}`}>
                              {question.title}
                            </h3>
                            <p className="text-gray-400 text-sm mt-1">
                              {question.description}
                            </p>
                            {question.tags && question.tags.length > 0 && (
                              <div className="flex flex-wrap gap-2 mt-2">
                                {question.tags.map((tag, tagIndex) => (
                                  <span
                                    key={tagIndex}
                                    className="px-2 py-1 bg-[#2a2a2a] text-gray-300 text-xs rounded"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className={`text-sm font-medium ${getDifficultyColor(difficulty)}`}>
                            {difficulty}
                          </span>
                          {question.link && (
                            <a
                              href={question.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-400 hover:text-blue-300 text-sm underline"
                            >
                              Solve
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  {filteredQuestions.length === 0 && searchQuery && (
                    <div className="text-center py-8 text-gray-400">
                      No questions found matching "{searchQuery}"
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {questions.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-300 mb-2">No LinkedList Problems Available</h3>
            <p className="text-gray-500">LinkedList questions will appear here once they are added to the database.</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default LinkedListSheet;