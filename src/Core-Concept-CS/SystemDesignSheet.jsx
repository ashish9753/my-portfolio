import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Footer from '../sheet-app/components/Footer';

function SystemDesignSheet({ auth, setAuth }) {
  const navigate = useNavigate();
  const [concepts, setConcepts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSections, setExpandedSections] = useState({});
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    percentage: 0
  });
  const [selectedTopic, setSelectedTopic] = useState('System Design');
  const [topics, setTopics] = useState([]);

  const API_URL = 'https://dsa-sheet-backend-7r7i.onrender.com/api/core-concepts';

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
    fetchTopics();
  }, []);

  useEffect(() => {
    if (selectedTopic) {
      fetchConcepts();
      fetchStats();
    }
  }, [selectedTopic]);

  const fetchTopics = async () => {
    try {
      const response = await axios.get(`${API_URL}/topics`, getAuthHeaders());
      setTopics(response.data);
    } catch (error) {
      console.error('Error fetching topics:', error);
      if (error.response?.status === 401) {
        handleAuthError();
      }
    }
  };

  const fetchConcepts = async () => {
    try {
      const response = await axios.get(`${API_URL}?topic=${selectedTopic}`, getAuthHeaders());
      setConcepts(response.data);
      setLoading(false);
      
      // Auto-expand all sections
      const sections = {};
      response.data.forEach(concept => {
        sections[concept.subTopic] = true;
      });
      setExpandedSections(sections);
    } catch (error) {
      console.error('Error fetching concepts:', error);
      if (error.response?.status === 401) {
        handleAuthError();
      }
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API_URL}/progress/summary?topic=${selectedTopic}`, getAuthHeaders());
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
      
      setConcepts(concepts.map(c => 
        c._id === id ? { ...c, completed: !currentStatus } : c
      ));
      
      fetchStats();
    } catch (error) {
      console.error('Error updating concept:', error);
    }
  };

  const groupedBySubTopic = concepts.reduce((acc, concept) => {
    if (!acc[concept.subTopic]) {
      acc[concept.subTopic] = [];
    }
    acc[concept.subTopic].push(concept);
    return acc;
  }, {});

  const filterConcepts = (conceptsArray) => {
    if (!searchQuery) return conceptsArray;
    return conceptsArray.filter(c => 
      c.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const toggleSection = (subTopic) => {
    setExpandedSections(prev => ({
      ...prev,
      [subTopic]: !prev[subTopic]
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p>Loading concepts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/sheet" className="text-purple-400 hover:text-purple-300">
                ← Back to Sheet
              </Link>
              <h1 className="text-2xl font-bold">{selectedTopic} Concepts</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm">
                <span className="text-gray-400">Progress: </span>
                <span className="text-purple-400 font-semibold">
                  {stats.completed}/{stats.total} ({stats.percentage}%)
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Topic Tabs */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1 overflow-x-auto py-2">
            {topics.map(topic => (
              <button
                key={topic}
                onClick={() => setSelectedTopic(topic)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                  selectedTopic === topic
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {topic}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <input
          type="text"
          placeholder="Search concepts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500"
        />
      </div>

      {/* Concepts List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        {Object.entries(groupedBySubTopic).map(([subTopic, subTopicConcepts]) => {
          const filteredConcepts = filterConcepts(subTopicConcepts);
          if (filteredConcepts.length === 0) return null;

          const completedCount = filteredConcepts.filter(c => c.completed).length;
          const totalCount = filteredConcepts.length;

          return (
            <div key={subTopic} className="mb-6">
              {/* Section Header */}
              <div
                className="bg-gray-800 rounded-lg p-4 cursor-pointer hover:bg-gray-750 transition-colors"
                onClick={() => toggleSection(subTopic)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <svg
                      className={`w-5 h-5 transform transition-transform ${
                        expandedSections[subTopic] ? 'rotate-90' : ''
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <h2 className="text-xl font-semibold">{subTopic}</h2>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-400">
                      {completedCount} / {totalCount}
                    </span>
                    <div className="w-32 bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-purple-600 h-2 rounded-full transition-all"
                        style={{ width: `${(completedCount / totalCount) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Concepts Table */}
              {expandedSections[subTopic] && (
                <div className="mt-2 bg-gray-800 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-700">
                      <tr>
                        <th className="px-4 py-3 text-left w-16">Status</th>
                        <th className="px-4 py-3 text-left">Problem</th>
                        <th className="px-4 py-3 text-center w-48">Resource</th>
                        <th className="px-4 py-3 text-center w-24">Note</th>
                        <th className="px-4 py-3 text-center w-24">Revision</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                      {filteredConcepts.map((concept, index) => (
                        <tr
                          key={concept._id}
                          className={`hover:bg-gray-750 transition-colors ${
                            concept.completed ? 'bg-gray-800/50' : ''
                          }`}
                        >
                          <td className="px-4 py-3">
                            <input
                              type="checkbox"
                              checked={concept.completed || false}
                              onChange={() => handleCheckboxChange(concept._id, concept.completed)}
                              className="w-5 h-5 rounded border-gray-600 text-purple-600 focus:ring-purple-500 cursor-pointer"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <span className={concept.completed ? 'line-through text-gray-500' : ''}>
                              {concept.name}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <div className="flex items-center justify-center space-x-2">
                              {concept.youtubeLink && concept.youtubeLink !== '' ? (
                                <a
                                  href={concept.youtubeLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-red-500 hover:text-red-400"
                                  title="YouTube"
                                >
                                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                                  </svg>
                                </a>
                              ) : (
                                <span className="text-gray-600">---</span>
                              )}
                              {concept.notesLink && concept.notesLink !== '' ? (
                                <a
                                  href={concept.notesLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-gray-400 hover:text-gray-300"
                                  title="Notes"
                                >
                                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm4 18H6V4h7v5h5v11z"/>
                                  </svg>
                                </a>
                              ) : (
                                <span className="text-gray-600">---</span>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <button className="text-gray-400 hover:text-gray-300">
                              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                              </svg>
                            </button>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <button className="text-gray-400 hover:text-yellow-400">
                              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                              </svg>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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

export default SystemDesignSheet;
