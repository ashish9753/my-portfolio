import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Footer from './Footer';

function HomePage({ auth, setAuth }) {
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    easyCompleted: 0,
    mediumCompleted: 0,
    hardCompleted: 0
  });
  const [activity, setActivity] = useState({});
  const [countdown, setCountdown] = useState(60);
  const navigate = useNavigate();

  const API_URL = 'https://dsa-sheet-backend-7r7i.onrender.com/api/questions';
  useEffect(() => {
    fetchStats();
    fetchActivity();
  }, []);

  // Auto-refresh every 60 seconds
  useEffect(() => {
    const refreshInterval = setInterval(() => {
      fetchStats();
      fetchActivity();
      setCountdown(60); // Reset countdown after refresh
    }, 60000); // 60 seconds

    return () => clearInterval(refreshInterval);
  }, []);

  // Countdown timer
  useEffect(() => {
    const countdownInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          return 60; // Reset to 60 when it reaches 0
        }
        return prev - 1;
      });
    }, 1000); // Every 1 second

    return () => clearInterval(countdownInterval);
  }, []);

  // Auto-refresh every 60 seconds
  useEffect(() => {
    const refreshInterval = setInterval(() => {
      fetchStats();
      fetchActivity();
      setCountdown(60); // Reset countdown after refresh
    }, 60000); // 60 seconds

    return () => clearInterval(refreshInterval);
  }, []);

  // Countdown timer
  useEffect(() => {
    const countdownInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          return 60; // Reset to 60 when it reaches 0
        }
        return prev - 1;
      });
    }, 1000); // Every 1 second

    return () => clearInterval(countdownInterval);
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/stats/summary`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
      if (error.response?.status === 401) {
        handleLogout();
      }
    }
  };

  const fetchActivity = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/stats/activity`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setActivity(response.data);
    } catch (error) {
      console.error('Error fetching activity:', error);
    }
  };

  const migrateTimestamps = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/migrate/timestamps`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      // Refresh activity data
      fetchActivity();
      alert('Activity graph updated! Your completed questions now show on today\'s date.');
    } catch (error) {
      console.error('Error migrating timestamps:', error);
      alert('Failed to update activity graph');
    }
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

  const topics = [
    {
      name: 'Sorting',
      description: 'Master sorting algorithms and techniques',
      color: 'text-[#ff00ff]',
      borderColor: 'border-[#ff00ff]',
      hoverBg: 'hover:bg-[#ff00ff]/10'
    },
    {
      name: 'Array',
      description: 'Master array manipulation, searching, and sorting',
      color: 'text-[#00ff00]',
      borderColor: 'border-[#00ff00]',
      hoverBg: 'hover:bg-[#00ff00]/10'
    },
    {
      name: 'Binary Search',
      description: 'Master binary search on 1D, 2D arrays, and search space',
      color: 'text-[#00d9ff]',
      borderColor: 'border-[#00d9ff]',
      hoverBg: 'hover:bg-[#00d9ff]/10'
    },
    {
      name: 'String',
      description: 'Master string algorithms, pattern matching, and text processing',
      color: 'text-[#ff6b35]',
      borderColor: 'border-[#ff6b35]',
      hoverBg: 'hover:bg-[#ff6b35]/10'
    },
    {
      name: 'LinkedList',
      description: 'Master linked list operations, pointers, and node manipulation',
      color: 'text-[#9d4edd]',
      borderColor: 'border-[#9d4edd]',
      hoverBg: 'hover:bg-[#9d4edd]/10'
    },
    {
      name: 'DP',
      description: 'Master Dynamic Programming patterns and optimization',
      color: 'text-[#ffd700]',
      borderColor: 'border-[#ffd700]',
      hoverBg: 'hover:bg-[#ffd700]/10'
    }
    // Add more topics here in the future
  ];

  const progressPercentage = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  const achievements = [
    { name: 'Bronze', threshold: 0, color: 'bg-[#CD7F32]' },
    { name: 'Silver', threshold: 20, color: 'bg-[#C0C0C0]' },
    { name: 'Gold', threshold: 40, color: 'bg-[#FFD700]' },
    { name: 'Platinum', threshold: 60, color: 'bg-[#E5E4E2]' },
    { name: 'Diamond', threshold: 80, color: 'bg-[#B9F2FF]' },
    { name: 'Grandmaster', threshold: 95, color: 'bg-gradient-to-r from-purple-500 to-pink-500' }
  ];

  const getCurrentLevel = () => {
    for (let i = achievements.length - 1; i >= 0; i--) {
      if (progressPercentage >= achievements[i].threshold) {
        return i;
      }
    }
    return 0;
  };

  const currentLevel = getCurrentLevel();

  // Contribution Heatmap Component
  const ContributionHeatmap = ({ activity }) => {
    const [hoveredDay, setHoveredDay] = useState(null);

    // Generate last 365 days
    const generateDays = () => {
      const days = [];
      const today = new Date();
      for (let i = 364; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        days.push(date);
      }
      return days;
    };

    const days = generateDays();

    // Get activity level (0-4) based on count
    const getLevel = (count) => {
      if (!count || count === 0) return 0;
      if (count === 1) return 1;
      if (count === 2) return 2;
      if (count <= 4) return 3;
      return 4;
    };

    // Get color based on level
    const getColor = (level) => {
      const colors = ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'];
      return colors[level];
    };

    // Group days by week
    const weeks = [];
    for (let i = 0; i < days.length; i += 7) {
      weeks.push(days.slice(i, i + 7));
    }

    // Get month labels
    const getMonthLabel = (weekIndex) => {
      if (weekIndex >= weeks.length) return '';
      const firstDay = weeks[weekIndex][0];
      if (!firstDay) return '';
      const day = firstDay.getDate();
      if (day <= 7 || weekIndex === 0) {
        return firstDay.toLocaleString('default', { month: 'short' });
      }
      return '';
    };

    return (
      <div className="relative overflow-x-auto">
        {/* Month labels */}
        <div className="flex gap-[3px] mb-3 ml-[52px] text-[11px] text-gray-500 font-medium">
          {weeks.map((_, index) => (
            <div key={index} className="w-[13px] text-center">
              {getMonthLabel(index)}
            </div>
          ))}
        </div>

        <div className="flex gap-[3px]">
          {/* Day labels */}
          <div className="flex flex-col gap-[3px] text-[11px] text-gray-500 pr-3 w-[48px] text-left font-medium">
            <div className="h-[13px] flex items-center">Mon</div>
            <div className="h-[13px]"></div>
            <div className="h-[13px] flex items-center">Wed</div>
            <div className="h-[13px]"></div>
            <div className="h-[13px] flex items-center">Fri</div>
            <div className="h-[13px]"></div>
            <div className="h-[13px] flex items-center">Sun</div>
          </div>

          {/* Heatmap grid */}
          <div className="flex gap-[3px]">
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-[3px]">
                {week.map((day, dayIndex) => {
                  const dateStr = day.toISOString().split('T')[0];
                  const count = activity[dateStr] || 0;
                  const level = getLevel(count);

                  return (
                    <div
                      key={dayIndex}
                      className="w-[13px] h-[13px] rounded-[2px] cursor-pointer transition-all hover:ring-2 hover:ring-white/30 hover:scale-110"
                      style={{ backgroundColor: getColor(level) }}
                      onMouseEnter={() => setHoveredDay({ date: day, count })}
                      onMouseLeave={() => setHoveredDay(null)}
                      title={`${dateStr}: ${count} questions`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Tooltip */}
        {hoveredDay && (
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-gray-900 text-white text-xs px-3 py-2 rounded shadow-lg border border-gray-700 whitespace-nowrap z-50">
            <div className="font-semibold">
              {hoveredDay.count} {hoveredDay.count === 1 ? 'question' : 'questions'}
            </div>
            <div className="text-gray-400">
              {hoveredDay.date.toLocaleDateString('en-US', { 
                weekday: 'short', 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
              })}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header with User Info and Logout */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-5xl font-bold mb-2 text-white">
              DSA Practice Sheet
            </h1>
            <p className="text-gray-400 text-lg">
              Welcome, <span className="text-blue-500 font-semibold">{auth.user?.username}</span>
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="px-6 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition-colors"
          >
            Logout
          </button>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Series Available */}
          <div className="bg-[#1a1a1a] rounded-lg p-6 border border-[#2a2a2a]">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z"/>
                </svg>
              </div>
              <div>
                <div className="text-4xl font-bold">{topics.length}</div>
                <div className="text-gray-400">Series Available</div>
              </div>
            </div>
          </div>

          {/* Questions Completed */}
          <div className="bg-[#1a1a1a] rounded-lg p-6 border border-[#2a2a2a]">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
              </div>
              <div>
                <div className="text-4xl font-bold">{stats.completed}/{stats.total}</div>
                <div className="text-gray-400">Questions Completed</div>
              </div>
            </div>
          </div>

          {/* Auto-refresh Countdown */}
          <div className="bg-[#1a1a1a] rounded-lg p-6 border border-[#2a2a2a]">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd"/>
                </svg>
              </div>
              <div>
                <div className="text-4xl font-bold text-green-400">{countdown}s</div>
                <div className="text-gray-400">Next Refresh</div>
              </div>
            </div>
          </div>
        </div>

        {/* Overall Progress */}
        <div className="bg-[#1a1a1a] rounded-lg p-6 border border-[#2a2a2a] mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-5xl font-bold mb-2">{progressPercentage}%</div>
              <div className="text-gray-400 text-lg">Overall Progress</div>
            </div>
          </div>

          {/* Achievement Progress Bar */}
          <div className="relative px-5">
            {/* Progress line background */}
            <div className="absolute top-5 left-0 right-0 h-1 bg-gray-700 z-0"></div>
            
            {/* Progress line filled */}
            <div 
              className="absolute top-5 left-0 h-1 bg-gradient-to-r from-[#CD7F32] via-[#FFD700] to-purple-500 transition-all duration-500 z-0"
              style={{ width: `${progressPercentage}%` }}
            ></div>

            <div className="flex justify-between relative z-10">
              {achievements.map((achievement, index) => (
                <div key={achievement.name} className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                    index <= currentLevel 
                      ? achievement.color + ' border-transparent' 
                      : 'bg-gray-700 border-gray-600'
                  }`}>
                    {index <= currentLevel && (
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                      </svg>
                    )}
                  </div>
                  <div className={`text-xs mt-2 ${index <= currentLevel ? 'text-white font-semibold' : 'text-gray-600'}`}>
                    {achievement.name}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Contribution Heatmap */}
        <div className="bg-[#1a1a1a] rounded-lg p-6 border border-[#2a2a2a] mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-white">Activity Graph</h2>
              <p className="text-sm text-gray-400 mt-1">Your daily question completion streak</p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={migrateTimestamps}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-xs font-semibold transition-colors"
                title="Click if your completed questions don't show on the graph"
              >
                Sync Activity
              </button>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <span>Less</span>
                <div className="flex gap-1">
                  <div className="w-3 h-3 rounded-sm bg-[#161b22]"></div>
                  <div className="w-3 h-3 rounded-sm bg-[#0e4429]"></div>
                  <div className="w-3 h-3 rounded-sm bg-[#006d32]"></div>
                  <div className="w-3 h-3 rounded-sm bg-[#26a641]"></div>
                  <div className="w-3 h-3 rounded-sm bg-[#39d353]"></div>
                </div>
                <span>More</span>
              </div>
            </div>
          </div>
          <ContributionHeatmap activity={activity} />
        </div>

        {/* Topics Grid */}
        <h2 className="text-2xl font-bold mb-6">Available Topics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {topics.map((topic) => (
            <Link
              key={topic.name}
              to={topic.name}
              className={`bg-[#1a1a1a] rounded-lg p-6 border-2 ${topic.borderColor} ${topic.hoverBg} hover:scale-105 transition-all duration-300`}
            >
              <h2 className={`text-2xl font-bold mb-2 ${topic.color}`}>
                {topic.name}
              </h2>
              <p className="text-gray-400">
                {topic.description}
              </p>
            </Link>
          ))}
        </div>

        <div className="mt-12 p-6 bg-[#1a1a1a] rounded-lg border border-[#2a2a2a]">
          <h3 className="text-xl font-semibold mb-4 text-gray-300">Coming Soon</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {['Strings', 'Stacks & Queues', 'Trees', 'Graphs', 'Greedy'].map((topic) => (
              <div key={topic} className="bg-[#0a0a0a] p-3 rounded border border-[#2a2a2a] text-gray-500 text-center">
                {topic}
              </div>
            ))}
          </div>
        </div>

        {/* Core CS Subjects */}
        <div className="mt-12 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-white">Core CS Subjects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 1. System Design (LLD + HLD) */}
            <Link to="/sheet/System Design" className="block">
              <div className="bg-[#1a1a1a] rounded-lg p-6 border-l-4 border-yellow-500 hover:bg-[#1f1f1f] transition-all duration-300 h-full">
                <h3 className="text-xl font-bold mb-2 text-yellow-400">System Design (LLD + HLD)</h3>
                <p className="text-gray-400 text-sm mb-4">Master Low & High Level Design from Basics to Advanced</p>
                <button className="w-full py-2 px-4 bg-transparent border border-yellow-500 text-yellow-500 rounded hover:bg-yellow-500 hover:text-black transition-colors duration-300">
                  Start Learning
                </button>
              </div>
            </Link>

            {/* 2. DevOps */}
            <Link to="/sheet/DevOps" className="block">
              <div className="bg-[#1a1a1a] rounded-lg p-6 border-l-4 border-orange-500 hover:bg-[#1f1f1f] transition-all duration-300 h-full">
                <h3 className="text-xl font-bold mb-2 text-orange-400">DevOps</h3>
                <p className="text-gray-400 text-sm mb-4">Docker, Kubernetes, CI/CD, Cloud & More</p>
                <button className="w-full py-2 px-4 bg-transparent border border-orange-500 text-orange-500 rounded hover:bg-orange-500 hover:text-white transition-colors duration-300">
                  Start Learning
                </button>
              </div>
            </Link>

            {/* 3. DBMS (+ MySQL) */}
            <Link to="/sheet/DBMS" className="block">
              <div className="bg-[#1a1a1a] rounded-lg p-6 border-l-4 border-purple-500 hover:bg-[#1f1f1f] transition-all duration-300 h-full">
                <h3 className="text-xl font-bold mb-2 text-purple-400">DBMS (+ MySQL)</h3>
                <p className="text-gray-400 text-sm mb-4">Most Asked DBMS & MySQL Interview Questions</p>
                <button className="w-full py-2 px-4 bg-transparent border border-purple-500 text-purple-500 rounded hover:bg-purple-500 hover:text-white transition-colors duration-300">
                  Start Learning
                </button>
              </div>
            </Link>

            {/* 4. Operating System */}
            <Link to="/sheet/Operating System" className="block">
              <div className="bg-[#1a1a1a] rounded-lg p-6 border-l-4 border-green-500 hover:bg-[#1f1f1f] transition-all duration-300 h-full">
                <h3 className="text-xl font-bold mb-2 text-green-400">Operating System</h3>
                <p className="text-gray-400 text-sm mb-4">Most Asked Operating System Interview Questions</p>
                <button className="w-full py-2 px-4 bg-transparent border border-green-500 text-green-500 rounded hover:bg-green-500 hover:text-white transition-colors duration-300">
                  Start Learning
                </button>
              </div>
            </Link>

            {/* 5. Computer Networks */}
            <Link to="/sheet/Computer Networks" className="block">
              <div className="bg-[#1a1a1a] rounded-lg p-6 border-l-4 border-blue-500 hover:bg-[#1f1f1f] transition-all duration-300 h-full">
                <h3 className="text-xl font-bold mb-2 text-blue-400">Computer Networks</h3>
                <p className="text-gray-400 text-sm mb-4">Most Asked Computer Networks Interview Questions</p>
                <button className="w-full py-2 px-4 bg-transparent border border-blue-500 text-blue-500 rounded hover:bg-blue-500 hover:text-white transition-colors duration-300">
                  Start Learning
                </button>
              </div>
            </Link>

            {/* 6. OOPS */}
            <Link to="/sheet/OOPS" className="block">
              <div className="bg-[#1a1a1a] rounded-lg p-6 border-l-4 border-pink-500 hover:bg-[#1f1f1f] transition-all duration-300 h-full">
                <h3 className="text-xl font-bold mb-2 text-pink-400">OOPS</h3>
                <p className="text-gray-400 text-sm mb-4">Object Oriented Programming Concepts & Interview Questions</p>
                <button className="w-full py-2 px-4 bg-transparent border border-pink-500 text-pink-500 rounded hover:bg-pink-500 hover:text-white transition-colors duration-300">
                  Start Learning
                </button>
              </div>
            </Link>

            {/* 7. Software Engineering */}
            <Link to="/sheet/Software Engineering" className="block">
              <div className="bg-[#1a1a1a] rounded-lg p-6 border-l-4 border-cyan-500 hover:bg-[#1f1f1f] transition-all duration-300 h-full">
                <h3 className="text-xl font-bold mb-2 text-cyan-400">Software Engineering</h3>
                <p className="text-gray-400 text-sm mb-4">SDLC, Design Patterns, Agile & Software Architecture concepts</p>
                <button className="w-full py-2 px-4 bg-transparent border border-cyan-500 text-cyan-500 rounded hover:bg-cyan-500 hover:text-white transition-colors duration-300">
                  Start Learning
                </button>
              </div>
            </Link>
          </div>
        </div>

        {/* MERN Interview Preparations */}
        <div className="mt-12 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-white">MERN Interview Preparations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link to="/sheet/HTML" className="block">
              <div className="bg-[#1a1a1a] rounded-lg p-6 border-l-4 border-orange-500 hover:bg-[#1f1f1f] transition-all duration-300 h-full">
                <h3 className="text-xl font-bold mb-2 text-orange-400">HTML</h3>
                <p className="text-gray-400 text-sm mb-4">Most Asked HTML Interview Questions</p>
                <button className="w-full py-2 px-4 bg-transparent border border-orange-500 text-orange-500 rounded hover:bg-orange-500 hover:text-white transition-colors duration-300">Start Learning</button>
              </div>
            </Link>
            <Link to="/sheet/CSS" className="block">
              <div className="bg-[#1a1a1a] rounded-lg p-6 border-l-4 border-sky-500 hover:bg-[#1f1f1f] transition-all duration-300 h-full">
                <h3 className="text-xl font-bold mb-2 text-sky-400">CSS + TailwindCSS</h3>
                <p className="text-gray-400 text-sm mb-4">Most Asked CSS & TailwindCSS Interview Questions</p>
                <button className="w-full py-2 px-4 bg-transparent border border-sky-500 text-sky-500 rounded hover:bg-sky-500 hover:text-white transition-colors duration-300">Start Learning</button>
              </div>
            </Link>
            <Link to="/sheet/JavaScript" className="block">
              <div className="bg-[#1a1a1a] rounded-lg p-6 border-l-4 border-yellow-500 hover:bg-[#1f1f1f] transition-all duration-300 h-full">
                <h3 className="text-xl font-bold mb-2 text-yellow-400">JavaScript</h3>
                <p className="text-gray-400 text-sm mb-4">Most Asked JavaScript Interview Questions</p>
                <button className="w-full py-2 px-4 bg-transparent border border-yellow-500 text-yellow-500 rounded hover:bg-yellow-500 hover:text-black transition-colors duration-300">Start Learning</button>
              </div>
            </Link>
            <Link to="/sheet/MongoDB" className="block">
              <div className="bg-[#1a1a1a] rounded-lg p-6 border-l-4 border-green-500 hover:bg-[#1f1f1f] transition-all duration-300 h-full">
                <h3 className="text-xl font-bold mb-2 text-green-400">MongoDB</h3>
                <p className="text-gray-400 text-sm mb-4">Most Asked MongoDB Interview Questions</p>
                <button className="w-full py-2 px-4 bg-transparent border border-green-500 text-green-500 rounded hover:bg-green-500 hover:text-white transition-colors duration-300">Start Learning</button>
              </div>
            </Link>
            <Link to="/sheet/React" className="block">
              <div className="bg-[#1a1a1a] rounded-lg p-6 border-l-4 border-cyan-500 hover:bg-[#1f1f1f] transition-all duration-300 h-full">
                <h3 className="text-xl font-bold mb-2 text-cyan-400">React</h3>
                <p className="text-gray-400 text-sm mb-4">Most Asked React Interview Questions</p>
                <button className="w-full py-2 px-4 bg-transparent border border-cyan-500 text-cyan-500 rounded hover:bg-cyan-500 hover:text-white transition-colors duration-300">Start Learning</button>
              </div>
            </Link>
            <Link to="/sheet/NodeJS" className="block">
              <div className="bg-[#1a1a1a] rounded-lg p-6 border-l-4 border-lime-500 hover:bg-[#1f1f1f] transition-all duration-300 h-full">
                <h3 className="text-xl font-bold mb-2 text-lime-400">Node.js</h3>
                <p className="text-gray-400 text-sm mb-4">Most Asked Node.js Interview Questions</p>
                <button className="w-full py-2 px-4 bg-transparent border border-lime-500 text-lime-500 rounded hover:bg-lime-500 hover:text-black transition-colors duration-300">Start Learning</button>
              </div>
            </Link>
            <Link to="/sheet/MySQL" className="block">
              <div className="bg-[#1a1a1a] rounded-lg p-6 border-l-4 border-blue-500 hover:bg-[#1f1f1f] transition-all duration-300 h-full">
                <h3 className="text-xl font-bold mb-2 text-blue-400">MySQL</h3>
                <p className="text-gray-400 text-sm mb-4">Most Asked MySQL Interview Questions</p>
                <button className="w-full py-2 px-4 bg-transparent border border-blue-500 text-blue-500 rounded hover:bg-blue-500 hover:text-white transition-colors duration-300">Start Learning</button>
              </div>
            </Link>
            <Link to="/sheet/PostgreSQL" className="block">
              <div className="bg-[#1a1a1a] rounded-lg p-6 border-l-4 border-indigo-500 hover:bg-[#1f1f1f] transition-all duration-300 h-full">
                <h3 className="text-xl font-bold mb-2 text-indigo-400">PostgreSQL</h3>
                <p className="text-gray-400 text-sm mb-4">Most Asked PostgreSQL Interview Questions</p>
                <button className="w-full py-2 px-4 bg-transparent border border-indigo-500 text-indigo-500 rounded hover:bg-indigo-500 hover:text-white transition-colors duration-300">Start Learning</button>
              </div>
            </Link>
          </div>
        </div>

        <Footer />      </div>
    </div>
  );
}

export default HomePage;
