import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Footer from '../components/Footer';

function ArraySheet({ auth, setAuth }) {
  const topic = 'Array'; // Hardcoded for Array page
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
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
      const response = await axios.get(`${API_URL}?topic=${topic}`, getAuthHeaders());
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
    return questionsArray.filter(q => 
      q.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const filteredGroupedQuestions = {
    Easy: filterQuestions(groupedQuestions.Easy),
    Medium: filterQuestions(groupedQuestions.Medium),
    Hard: filterQuestions(groupedQuestions.Hard)
  };

  const DifficultySection = ({ difficulty, questions, color }) => {
    const completed = questions.filter(q => q.completed).length;
    const total = questions.length;

    if (total === 0) return null;

    return (
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3 px-2">
          <h2 className={`text-2xl font-semibold ${color}`}>
            {difficulty}
          </h2>
          <span className="text-gray-500 text-sm">
            {completed} / {total}
          </span>
        </div>
        
        <div className="bg-[#1a1a1a] rounded-md p-3 mb-2 border border-[#2a2a2a]">
          <div className="flex items-center gap-3">
            <div className="w-16 text-sm font-medium text-gray-400 text-left">Status</div>
            <div className="flex-1 text-sm font-medium text-gray-400 text-left">Problem/Link</div>
            <div className="w-24 text-sm font-medium text-gray-400 text-right">Difficulty</div>
          </div>
        </div>
        
        <div className="space-y-1.5">
          {questions.map((question) => (
            <div
              key={question._id}
              className="bg-[#1a1a1a] rounded-md p-3 hover:bg-[#252525] transition-colors border border-[#2a2a2a]"
            >
              <div className="flex items-center gap-3">
                <div className="w-16 flex items-center">
                  <input
                    type="checkbox"
                    checked={question.completed}
                    onChange={() => handleCheckboxChange(question._id, question.completed)}
                    className="w-4 h-4 rounded border-2 border-gray-600 bg-transparent checked:bg-[#00ff00] checked:border-[#00ff00] cursor-pointer accent-[#00ff00]"
                  />
                </div>
                
                <div className="flex-1 flex items-center gap-3">
                  <h3 className={`text-base font-normal ${question.completed ? 'line-through text-gray-600' : 'text-gray-300'}`}>
                    {question.name}
                  </h3>
                  <div className="flex gap-2 items-center">
                    {question.leetcodeLink && (
                      <a
                        href={question.leetcodeLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:opacity-80 transition-opacity"
                        title="LeetCode"
                      >
                        <img 
                          src="https://leetcode.com/static/images/LeetCode_logo_rvs.png" 
                          alt="LeetCode" 
                          className="h-4 w-auto"
                        />
                      </a>
                    )}
                    {question.gfgLink && (
                      <a
                        href={question.gfgLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:opacity-80 transition-opacity"
                        title="GeeksforGeeks"
                      >
                        <img 
                          src="https://media.geeksforgeeks.org/gfg-gg-logo.svg" 
                          alt="GFG" 
                          className="h-4 w-auto"
                        />
                      </a>
                    )}
                  </div>
                </div>
                
                <div className={`w-24 text-base font-medium text-right ${color}`}>
                  {difficulty}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <Link to="/sheet" className="text-gray-400 hover:text-white mb-4 inline-block">
              ← Back to Topics
            </Link>
            
            <h1 className="text-4xl font-bold mb-2 text-white">
              {topic} Problems
            </h1>
            <p className="text-gray-400">
              Welcome, <span className="text-blue-500 font-semibold">{auth.user?.username}</span>
            </p>
          </div>

          
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#1a1a1a] text-white px-4 py-3 rounded-lg border border-[#2a2a2a] focus:outline-none focus:border-[#00ff00] transition-colors placeholder-gray-500"
            />
          </div>
          
          <div className="bg-[#1a1a1a] rounded-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-gray-400 text-sm">Overall Progress</span>
                <div className="text-3xl font-bold mt-1">
                  {stats.completed}<span className="text-gray-500">/{stats.total}</span>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="text-center">
                  <div className="text-sm text-gray-400 mb-1">● Easy</div>
                  <div className="text-xl font-semibold text-[#00ff00]">
                    {stats.easyCompleted}/{filteredGroupedQuestions.Easy.length}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-400 mb-1">● Medium</div>
                  <div className="text-xl font-semibold text-[#ffa116]">
                    {stats.mediumCompleted}/{filteredGroupedQuestions.Medium.length}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-400 mb-1">● Hard</div>
                  <div className="text-xl font-semibold text-[#ff375f]">
                    {stats.hardCompleted}/{filteredGroupedQuestions.Hard.length}
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full bg-[#2a2a2a] rounded-full h-2">
              <div
                className="bg-[#00ff00] h-2 rounded-full transition-all duration-500"
                style={{ width: `${stats.total > 0 ? (stats.completed / stats.total) * 100 : 0}%` }}
              ></div>
            </div>
          </div>
        </div>

        <DifficultySection 
          difficulty="Easy" 
          questions={filteredGroupedQuestions.Easy} 
          color="text-[#00ff00]"
        />
        
        <DifficultySection 
          difficulty="Medium" 
          questions={filteredGroupedQuestions.Medium} 
          color="text-[#ffa116]"
        />
        
        <DifficultySection 
          difficulty="Hard" 
          questions={filteredGroupedQuestions.Hard} 
          color="text-[#ff375f]"
        />

        <Footer />
      </div>
    </div>
  );
}

export default ArraySheet;
