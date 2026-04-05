import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Footer from './Footer';
import LoadingScreen from '../../components/LoadingScreen.jsx';

function HomePage({ auth, setAuth }) {
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    easyCompleted: 0,
    mediumCompleted: 0,
    hardCompleted: 0
  });
  const [activity, setActivity] = useState({});
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState(60);
  const navigate = useNavigate();

  const API_URL = 'https://dsa-sheet-backend-7r7i.onrender.com/api/questions';
  useEffect(() => {
    const loadAll = async () => {
      try {
        await Promise.all([fetchStats(), fetchActivity()]);
      } finally {
        setLoading(false);
      }
    };

    loadAll();
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

  if (loading) {
    return <LoadingScreen message="Loading your DSA dashboard..." />;
  }

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
      name: 'Recursion',
      description: 'Master recursion, backtracking, and recursive problem-solving techniques',
      color: 'text-[#fb7185]',
      borderColor: 'border-[#fb7185]',
      hoverBg: 'hover:bg-[#fb7185]/10'
    },
    {
      name: 'BitManipulation',
      description: 'Master bit manipulation tricks, bitwise operations, and binary arithmetic',
      color: 'text-[#00bfff]',
      borderColor: 'border-[#00bfff]',
      hoverBg: 'hover:bg-[#00bfff]/10'
    },
    {
      name: 'StackAndQueues',
      description: 'Master stack and queue operations, monotonic stacks, and sliding window techniques',
      color: 'text-[#f97316]',
      borderColor: 'border-[#f97316]',
      hoverBg: 'hover:bg-[#f97316]/10'
    },
    {
      name: 'SlidingWindow',
      description: 'Master sliding window and two pointer patterns for subarray and substring problems',
      color: 'text-[#a78bfa]',
      borderColor: 'border-[#a78bfa]',
      hoverBg: 'hover:bg-[#a78bfa]/10'
    },
    {
      name: 'BinaryTrees',
      description: 'Master binary trees, tree traversals, and advanced tree algorithms',
      color: 'text-[#10b981]',
      borderColor: 'border-[#10b981]',
      hoverBg: 'hover:bg-[#10b981]/10'
    },
    {
      name: 'BinarySearchTrees',
      description: 'Master binary search trees, BST operations, and tree balancing',
      color: 'text-[#06b6d4]',
      borderColor: 'border-[#06b6d4]',
      hoverBg: 'hover:bg-[#06b6d4]/10'
    },
    {
      name: 'Heaps',
      description: 'Master heaps, priority queues, and heap-based algorithms',
      color: 'text-[#34d399]',
      borderColor: 'border-[#34d399]',
      hoverBg: 'hover:bg-[#34d399]/10'
    },
    {
      name: 'Greedy',
      description: 'Master greedy strategies, interval scheduling, and optimization problems',
      color: 'text-[#fb923c]',
      borderColor: 'border-[#fb923c]',
      hoverBg: 'hover:bg-[#fb923c]/10'
    },
    {
      name: 'Graphs',
      description: 'Master graph traversal, shortest paths, topological sort, and advanced graph algorithms',
      color: 'text-[#60a5fa]',
      borderColor: 'border-[#60a5fa]',
      hoverBg: 'hover:bg-[#60a5fa]/10'
    },
    {
      name: 'DP',
      description: 'Master Dynamic Programming patterns and optimization',
      color: 'text-[#ffd700]',
      borderColor: 'border-[#ffd700]',
      hoverBg: 'hover:bg-[#ffd700]/10'
    }
  ];

  const coreSubjects = [
    {
      title: 'System Design (LLD + HLD)',
      description: 'Master Low & High Level Design from Basics to Advanced',
      cta: 'Start Learning',
      to: '/sheet/System Design',
      available: true,
      accent: 'yellow'
    },
    {
      title: 'DevOps',
      description: 'Docker, Kubernetes, CI/CD, Cloud & More',
      cta: 'Start Learning',
      to: '/sheet/DevOps',
      available: true,
      accent: 'orange'
    },
    {
      title: 'DBMS (+ MySQL)',
      description: 'Most Asked DBMS & MySQL Interview Questions',
      cta: 'Coming Soon',
      available: false
    },
    {
      title: 'Operating System',
      description: 'Most Asked Operating System Interview Questions',
      cta: 'Start Learning',
      to: '/sheet/Operating System',
      available: true,
      accent: 'green'
    },
    {
      title: 'Computer Networks',
      description: 'Most Asked Computer Networks Interview Questions',
      cta: 'Coming Soon',
      available: false
    },
    {
      title: 'OOPS',
      description: 'Object Oriented Programming Concepts & Interview Questions',
      cta: 'Coming Soon',
      available: false
    },
    {
      title: 'Software Engineering',
      description: 'SDLC, Design Patterns, Agile & Software Architecture concepts',
      cta: 'Coming Soon',
      available: false
    }
  ];

  const mernSubjects = [
    {
      title: 'HTML',
      description: 'Most Asked HTML Interview Questions',
      cta: 'Start Learning',
      to: '/sheet/HTML',
      available: true,
      accent: 'orange'
    },
    {
      title: 'CSS + TailwindCSS',
      description: 'Most Asked CSS & TailwindCSS Interview Questions',
      cta: 'Start Learning',
      to: '/sheet/CSS',
      available: true,
      accent: 'orange'
    },
    {
      title: 'JavaScript',
      description: 'Most Asked JavaScript Interview Questions',
      cta: 'Start Learning',
      to: '/sheet/JavaScript',
      available: true,
      accent: 'yellow'
    },
    {
      title: 'MongoDB',
      description: 'Most Asked MongoDB Interview Questions',
      cta: 'Coming Soon',
      available: false
    },
    {
      title: 'React',
      description: 'Most Asked React Interview Questions',
      cta: 'Start Learning',
      to: '/sheet/React',
      available: true,
      accent: 'orange'
    },
    {
      title: 'Node.js',
      description: 'Most Asked Node.js Interview Questions',
      cta: 'Start Learning',
      to: '/sheet/NodeJS',
      available: true,
      accent: 'green'
    },
    {
      title: 'MySQL',
      description: 'Most Asked MySQL Interview Questions',
      cta: 'Coming Soon',
      available: false
    },
    {
      title: 'PostgreSQL',
      description: 'Most Asked PostgreSQL Interview Questions',
      cta: 'Coming Soon',
      available: false
    }
  ];

  const activeCardStyles = {
    yellow: {
      border: 'border-yellow-500',
      title: 'text-yellow-400',
      button: 'border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black'
    },
    green: {
      border: 'border-green-500',
      title: 'text-green-400',
      button: 'border-green-500 text-green-500 hover:bg-green-500 hover:text-white'
    },
    orange: {
      border: 'border-orange-500',
      title: 'text-orange-400',
      button: 'border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white'
    }
  };

  const renderModuleCard = (module) => {
    if (!module.available) {
      return (
        <div
          key={module.title}
          className="bg-[#111318] rounded-xl p-6 border border-[#334155] h-full cursor-not-allowed select-none"
          aria-disabled="true"
        >
          <div className="flex items-start justify-between gap-3 mb-4">
            <h3 className="text-xl font-bold text-gray-100">{module.title}</h3>
            <span className="rounded-full border border-[#475569] px-3 py-1 text-xs font-semibold tracking-[0.2em] text-gray-300">
              SOON
            </span>
          </div>
          <p className="text-gray-400 text-sm mb-6">{module.description}</p>
          <button
            type="button"
            disabled
            className="w-full py-2.5 px-4 bg-[#364152] text-gray-200 border border-[#475569] rounded-md cursor-not-allowed text-base font-semibold"
          >
            {module.cta}
          </button>
        </div>
      );
    }

    const styles = activeCardStyles[module.accent];

    return (
      <Link key={module.title} to={module.to} className="block h-full">
        <div className={`bg-[#1a1a1a] rounded-lg p-6 border-l-4 ${styles.border} hover:bg-[#1f1f1f] transition-all duration-300 h-full`}>
          <h3 className={`text-xl font-bold mb-2 ${styles.title}`}>{module.title}</h3>
          <p className="text-gray-400 text-sm mb-4">{module.description}</p>
          <button className={`w-full py-2 px-4 bg-transparent border rounded transition-colors duration-300 ${styles.button}`}>
            {module.cta}
          </button>
        </div>
      </Link>
    );
  };

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
  const badgeByAchievement = {
    Bronze: 'Bronze.png',
    Silver: 'Silver.png',
    Gold: 'Gold.png',
    Platinum: 'Platinum.png',
    Diamond: 'Diamond.png',
    Grandmaster: 'GrandMaster.png'
  };
  const currentBadge = {
    name: achievements[currentLevel]?.name || 'Bronze',
    image: badgeByAchievement[achievements[currentLevel]?.name] || 'Bronze.png'
  };
  const badgeAnimationByAchievement = {
    Bronze: 'badge-anim-silver',
    Silver: 'badge-anim-silver',
    Gold: 'badge-anim-silver',
    Platinum: 'badge-anim-silver',
    Diamond: 'badge-anim-silver',
    Grandmaster: 'badge-anim-silver'
  };

  // Contribution Heatmap Component
  const ContributionHeatmap = ({ activity, currentBadge, username }) => {
    const [hoveredDay, setHoveredDay] = useState(null);
    const scrollContainerRef = useRef(null);

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
    const todayDateKey = new Date().toDateString();
    const todayDateStr = days.find((day) => day.toDateString() === todayDateKey)?.toISOString().split('T')[0];
    const todayCount = todayDateStr ? activity[todayDateStr] || 0 : 0;
    const hasCompletedToday = todayCount > 0;

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

    // Auto-scroll to show latest activity (right side) by default
    useEffect(() => {
      if (scrollContainerRef.current) {
        const el = scrollContainerRef.current;
        el.scrollLeft = el.scrollWidth;
      }
    }, []);

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
      <div className="relative">
        <div className="flex items-end justify-between gap-5">
          <div ref={scrollContainerRef} className="flex-1 min-w-0 overflow-x-auto">
            {/* Month labels */}
            <div className="flex gap-[3px] mb-3 ml-[60px] text-[11px] text-gray-500 font-medium">
              {weeks.map((_, index) => (
                <div key={index} className="w-[16px] text-center">
                  {getMonthLabel(index)}
                </div>
              ))}
            </div>

            <div className="flex gap-[3px]">
              {/* Day labels */}
              <div className="flex flex-col gap-[4px] text-[11px] text-gray-500 pr-3 w-[56px] text-left font-medium">
                <div className="h-[16px] flex items-center">Mon</div>
                <div className="h-[16px]"></div>
                <div className="h-[16px] flex items-center">Wed</div>
                <div className="h-[16px]"></div>
                <div className="h-[16px] flex items-center">Fri</div>
                <div className="h-[16px]"></div>
                <div className="h-[16px] flex items-center">Sun</div>
              </div>

              {/* Heatmap grid */}
              <div className="flex gap-[4px]">
                {weeks.map((week, weekIndex) => (
                  <div key={weekIndex} className="flex flex-col gap-[4px]">
                    {week.map((day, dayIndex) => {
                      const dateStr = day.toISOString().split('T')[0];
                      const count = activity[dateStr] || 0;
                      const level = getLevel(count);
                      const isToday = day.toDateString() === todayDateKey;
                      const shouldBlinkToday = isToday && count === 0;

                      return (
                        <div
                          key={dayIndex}
                          className={`w-[16px] h-[16px] rounded-[3px] cursor-pointer transition-transform hover:ring-2 hover:ring-white/30 hover:scale-110 ${shouldBlinkToday ? 'today-empty-blink' : ''}`}
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
          </div>

          <div className="shrink-0 min-w-[150px] text-center">
            <img
              src={`/Badges/${currentBadge.image}`}
              alt={`${currentBadge.name} badge`}
              className={`w-36 h-42 mx-auto object-contain ${badgeAnimationByAchievement[currentBadge.name] || 'badge-anim-bronze'}`}
            />
            <p className="mt-2 text-xs text-gray-300">
              Earned by <span className="font-semibold text-white">{username || 'User'}</span>
            </p>
          </div>
        </div>

        {!hasCompletedToday && (
          <p className="mt-3 text-sm font-semibold text-red-400">
            No question completed today
          </p>
        )}

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
                <div className="text-gray-400">DSA Series Available</div>
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
        <div className="bg-[#1a1a1a] rounded-lg p-6 border border-[#2a2a2a] mb-10 pb-10">
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
          <ContributionHeatmap activity={activity} currentBadge={currentBadge} username={auth.user?.username} />
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
          <h3 className="text-xl font-semibold mb-4 text-white justify-center item-center flex">For Your Interview Preparations ↓</h3>
          
        </div>

        {/* Core CS Subjects */}
        <div className="mt-12 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-white">Core CS Subjects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coreSubjects.map(renderModuleCard)}
          </div>
        </div>

        {/* MERN Interview Preparations */}
        <div className="mt-12 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-white">MERN Interview Preparations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {mernSubjects.map(renderModuleCard)}
          </div>
        </div>

        <Footer />      </div>
    </div>
  );
}

export default HomePage;
