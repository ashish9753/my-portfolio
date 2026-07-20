import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Footer from './Footer';
import ThemeToggle from './ThemeToggle';
import LoadingScreen from '../../components/LoadingScreen.jsx';
import Leaderboard from './Leaderboard';
import WebsiteReviews from './WebsiteReviews';
import { ACTIVITY_UPDATED_EVENT } from '../utils/activitySync';

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
  const [selectedPeriod, setSelectedPeriod] = useState('Current');

  const periods = ['Current', '2026 (Jan - Jun)', '2025 (Jul - Dec)', '2025 (Jan - Jun)', '2024 (Jul - Dec)', '2024 (Jan - Jun)'];

  // Generate days for the selected period
  const generateDays = (period) => {
    const days = [];
    if (period === 'Current') {
      const today = new Date();
      for (let i = 182; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        days.push(d);
      }
    } else {
      const match = period.match(/(\d{4}) \((Jan - Jun|Jul - Dec)\)/);
      if (match) {
        const year = parseInt(match[1]);
        const isFirstHalf = match[2] === 'Jan - Jun';
        const startDate = new Date(year, isFirstHalf ? 0 : 6, 1);
        const endDate = new Date(year, isFirstHalf ? 5 : 11, isFirstHalf ? 30 : 31);
        
        let curr = new Date(startDate);
        // if the period is partially in the future, don't generate beyond today
        const today = new Date();
        while (curr <= endDate) {
          days.push(new Date(curr));
          curr.setDate(curr.getDate() + 1);
        }
      }
    }
    return days;
  };

  const days = generateDays(selectedPeriod);
  const todayDateKey = new Date().toDateString();
  
  // Ensure all days start on the correct weekday (align weeks to Monday or Sunday)
  // We'll just group every 7 days as they come for simplicity, or we can pad to align.
  // For accurate GitHub/Leetcode grid: weeks are columns. First column starts with Sunday or Monday.
  // Let's pad the start to ensure the week aligns correctly (e.g., Sunday = 0).
  const startPadding = days[0] ? days[0].getDay() : 0; 
  const paddedDays = [];
  // Pad with nulls
  for (let i = 0; i < startPadding; i++) {
      paddedDays.push(null);
  }
  paddedDays.push(...days);

  const todayDateStr = days.find((day) => day && day.toDateString() === todayDateKey)?.toISOString().split('T')[0];
  const todayCount = todayDateStr ? activity[todayDateStr] || 0 : 0;
  const hasCompletedToday = todayCount > 0;

  // Stats calculations
  const calcStats = () => {
    let subs = 0;
    Object.values(activity).forEach(c => subs += c);
    
    const dates = Object.keys(activity).sort();
    let maxStr = 0;
    let currStrTemp = 0;
    let lastDate = null;

    for (let i = 0; i < dates.length; i++) {
      if (activity[dates[i]] > 0) {
        const d = new Date(dates[i]);
        if (!lastDate) {
          currStrTemp = 1;
        } else {
          const diff = Math.round((d - lastDate) / (1000 * 60 * 60 * 24));
          if (diff === 1) {
            currStrTemp++;
          } else if (diff > 1) {
            currStrTemp = 1;
          }
        }
        if (currStrTemp > maxStr) maxStr = currStrTemp;
        lastDate = d;
      }
    }

    let currStr = 0;
    const t = new Date();
    t.setHours(0,0,0,0);
    for(let i=0; i<1000; i++) {
       const checkStr = new Date(t);
       checkStr.setDate(t.getDate() - i);
       const dStr = checkStr.toISOString().split('T')[0];
       if (activity[dStr] > 0) {
           currStr++;
       } else {
           if (i === 0) continue; // It's okay to miss today
           break;
       }
    }

    return { submissions: subs, maxStreak: maxStr, currentStreak: currStr };
  };

  const stats = calcStats();

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

  // Group days by week columns
  const weeks = [];
  for (let i = 0; i < paddedDays.length; i += 7) {
    weeks.push(paddedDays.slice(i, i + 7));
  }

  // Get month labels to display below the grid
  const getMonthLabelsBelow = () => {
    const monthLabels = [];
    let lastMonth = -1;
    
    weeks.forEach((week, weekIndex) => {
      // Find first valid day
      const validDay = week.find(d => d !== null);
      if (validDay) {
        const month = validDay.getMonth();
        if (month !== lastMonth) {
          monthLabels.push({ index: weekIndex, label: validDay.toLocaleString('default', { month: 'short' }) });
          lastMonth = month;
        }
      }
    });
    return monthLabels;
  };

  const monthLabels = getMonthLabelsBelow();

  return (
    <div className="relative bg-[#1a1a1a] rounded-xl p-4 md:p-6 border border-[#333]">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-[70%] overflow-hidden">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 md:mb-6 gap-4 md:gap-0">
            {/* Stats */}
            <div className="flex flex-wrap gap-3 md:gap-6 text-xs md:text-sm font-medium w-full md:w-auto">     
              <span className="text-gray-400">Max.Streak <span className="text-[#39d353] font-bold ml-1">{stats.maxStreak}</span></span>
              <span className="text-gray-400">Current.Streak <span className="text-[#39d353] font-bold ml-1">{stats.currentStreak}</span></span>
            </div>

            {/* Period Dropdown */}
            <div className="relative group w-full md:w-auto">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="bg-[#2a2a2a] text-white text-xs md:text-sm py-1.5 md:py-2 px-3 pr-8 rounded focus:outline-none appearance-none cursor-pointer border border-[#444] hover:border-gray-400 transition-colors w-full md:w-auto"
              >
                {periods.map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>

          {/* Heatmap Area */}
          <div className="flex flex-col overflow-x-auto overflow-y-hidden pb-4 custom-scrollbar">
            <div className="flex items-start gap-2 min-w-max">
               {/* We omit Day labels (Mon/Wed/Fri) on the left as per the image, or keep them optional */}
              {/* Heatmap Grid (Columns) */}
              <div className="flex gap-[4px]">
                {weeks.map((week, weekIndex) => (
                  <div key={weekIndex} className="flex flex-col gap-[4px]">
                    {week.map((day, dayIndex) => {
                      if (!day) return <div key={dayIndex} className="w-[14px] h-[14px] rounded-[3px] bg-transparent" />;

                      const dateStr = day.toISOString().split('T')[0];
                      const count = activity[dateStr] || 0;
                      const level = getLevel(count);
                      const isToday = day.toDateString() === todayDateKey;
                      const shouldBlinkToday = isToday && count === 0;

                      return (
                        <div
                          key={dayIndex}
                          className={`w-[14px] h-[14px] rounded-[3px] cursor-pointer transition-transform hover:ring-2 hover:ring-white/30 hover:scale-110 ${shouldBlinkToday ? 'today-empty-blink' : ''}`}
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

            {/* Month labels placed below the columns */}
            <div className="relative h-6 mt-2 text-xs text-gray-500 font-medium min-w-max w-full">
               {monthLabels.map(ml => (
                   <div key={ml.index} className="absolute" style={{ left: `${ml.index * 18}px` }}>
                       {ml.label}
                   </div>
               ))}
            </div>
          </div>

          {!hasCompletedToday && (
            <p className="mt-3 text-xs font-semibold text-red-500 text-center md:text-left">
              No question completed today
            </p>
          )}
        </div>

        {/* Badge Area (30%) */}
        <div className="w-full lg:w-[30%] flex justify-center items-center border-t lg:border-t-0 lg:border-l border-[#333] pt-6 lg:pt-0 lg:pl-6">
          <div className="text-center">
            <img
              src={`/Badges/${currentBadge.image}`}
              alt={`${currentBadge.name} badge`}
              className={`w-32 h-36 mx-auto object-contain ${badgeAnimationByAchievement[currentBadge.name] || 'badge-anim-bronze'}`}
            />
            <p className="mt-4 text-sm text-gray-300">
              Earned by <span className="font-semibold text-white">{username || 'User'}</span>
            </p>
          </div>
        </div>
      </div>
      {hoveredDay && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-4 bg-black text-white text-xs px-3 py-2 rounded shadow-[0_0_10px_rgba(0,0,0,0.5)] border border-gray-700 whitespace-nowrap z-50 pointer-events-none">
          <div className="font-semibold text-center mb-1">
            {hoveredDay.count} {hoveredDay.count === 1 ? 'submission' : 'submissions'}
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

function HomePage({ auth, setAuth }) {
  const [activeView, setActiveView] = useState(auth?.isAuthenticated ? 'activity' : 'leaderboard');
  const [topView, setTopView] = useState(auth?.isAuthenticated ? 'progress' : 'reviews');
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    easyCompleted: 0,
    mediumCompleted: 0,
    hardCompleted: 0
  });
  const [activity, setActivity] = useState({});
  const [loading, setLoading] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    username: auth?.user?.username || '',
    email: auth?.user?.email || ''
  });
  const [editError, setEditError] = useState('');
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });
  const [passwordError, setPasswordError] = useState('');
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const navigate = useNavigate();

  const syncBlockedStatus = (blockedValue) => {
    if (!auth?.isAuthenticated || blockedValue === undefined || blockedValue === null) {
      return;
    }
    if (auth.user?.isBlocked === blockedValue) {
      return;
    }
    const updatedUser = { ...auth.user, isBlocked: blockedValue };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setAuth((prev) => ({
      ...prev,
      user: updatedUser
    }));
  };

  const handleBlockedError = (error) => {
    const status = error?.response?.status;
    const message = (error?.response?.data?.message || '').toLowerCase();
    if (status === 403 || message.includes('blocked')) {
      syncBlockedStatus(true);
      return true;
    }
    return false;
  };

  useEffect(() => {
    setActiveView(auth?.isAuthenticated ? 'activity' : 'leaderboard');
    setTopView(auth?.isAuthenticated ? 'progress' : 'reviews');
  }, [auth?.isAuthenticated]);

  // const API_URL = 'https://api.ashishdev.com/api/questions';
 const API_URL = 'https://dsa-sheet-backend-7r7i.onrender.com/api/questions';
  // const AUTH_API = 'https://api.ashishdev.com/api/auth';
 const AUTH_API = 'https://dsa-sheet-backend-7r7i.onrender.com/api/auth';
  useEffect(() => {
    const loadAll = async () => {
      try {
        if (auth?.isAuthenticated) {
          await Promise.all([fetchStats(), fetchActivity()]);
        }
      } finally {
        setLoading(false);
      }
    };

    loadAll();
  }, [auth?.isAuthenticated]);

  const fetchStats = async () => {
    if (!auth?.isAuthenticated) return;
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/stats/summary`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      syncBlockedStatus(response.data?.isBlocked ?? response.data?.user?.isBlocked);
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
      if (handleBlockedError(error)) {
        return;
      }
      if (error.response?.status === 401) {
        handleLogout();
      }
    }
  };

  const fetchActivity = async () => {
    if (!auth?.isAuthenticated) return;
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/stats/activity`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      syncBlockedStatus(response.data?.isBlocked ?? response.data?.user?.isBlocked);
      setActivity(response.data);
    } catch (error) {
      console.error('Error fetching activity:', error);
      handleBlockedError(error);
    }
  };

  useEffect(() => {
    if (!auth?.isAuthenticated) return;

    const refreshDashboard = () => {
      fetchStats();
      fetchActivity();
    };

    window.addEventListener(ACTIVITY_UPDATED_EVENT, refreshDashboard);

    return () => {
      window.removeEventListener(ACTIVITY_UPDATED_EVENT, refreshDashboard);
    };
  }, [auth?.isAuthenticated, auth?.user]);

  // Auto-refresh dashboard every 30 seconds with countdown
  useEffect(() => {
    if (!auth?.isAuthenticated) return;

    const refreshInterval = setInterval(() => {
      fetchStats();
      fetchActivity();
      setCountdown(30); // Reset countdown after refresh
    }, 30000); // 30 seconds

    const countdownInterval = setInterval(() => {
      setCountdown((prev) => (prev > 1 ? prev - 1 : 30));
    }, 1000); // 1 second

    return () => {
      clearInterval(refreshInterval);
      clearInterval(countdownInterval);
    };
  }, [auth?.isAuthenticated]);

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
    navigate('/sheet/login');
  };

  const openEditProfile = () => {
    setEditError('');
    setEditForm({
      username: auth?.user?.username || '',
      email: auth?.user?.email || ''
    });
    setIsEditOpen(true);
  };

  const closeEditProfile = () => {
    setIsEditOpen(false);
  };

  const openPasswordModal = () => {
    setPasswordError('');
    setPasswordForm({ oldPassword: '', newPassword: '', confirmNewPassword: '' });
    setIsPasswordOpen(true);
  };

  const closePasswordModal = () => {
    setIsPasswordOpen(false);
  };

  const handleEditChange = (event) => {
    const { name, value } = event.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (event) => {
    const { name, value } = event.target;
    setPasswordForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditSubmit = async (event) => {
    event.preventDefault();
    if (!auth?.isAuthenticated) return;

    try {
      setIsSavingEdit(true);
      setEditError('');
      const token = localStorage.getItem('token');
      // Email is Google-verified and fixed, so only the username is updatable.
      const payload = {
        username: editForm.username.trim()
      };
      const response = await axios.patch(`${AUTH_API}/me`, payload, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const updatedUser = response.data?.user;
      if (updatedUser) {
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setAuth((prev) => ({
          ...prev,
          user: updatedUser
        }));
      }
      setIsEditOpen(false);
    } catch (error) {
      if (handleBlockedError(error)) {
        return;
      }
      setEditError(error.response?.data?.message || 'Failed to update profile.');
    } finally {
      setIsSavingEdit(false);
    }
  };

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();
    if (!auth?.isAuthenticated) return;

    if (!passwordForm.oldPassword) {
      setPasswordError('Please enter your current password.');
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters.');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    try {
      setIsSavingPassword(true);
      setPasswordError('');
      const token = localStorage.getItem('token');
      await axios.patch(`${AUTH_API}/me/password`, {
        oldPassword: passwordForm.oldPassword,
        newPassword: passwordForm.newPassword,
        confirmNewPassword: passwordForm.confirmNewPassword
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setIsPasswordOpen(false);
    } catch (error) {
      if (handleBlockedError(error)) {
        return;
      }
      setPasswordError(error.response?.data?.message || 'Failed to update password.');
    } finally {
      setIsSavingPassword(false);
    }
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
      cta: 'Start Learning',
      to: '/sheet/DBMS',
      available: true,
      accent: 'emerald'
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
      cta: 'Start Learning',
      to: '/sheet/Computer Networks',
      available: true,
      accent: 'sky'
    },
    {
      title: 'OOPS',
      description: 'Object Oriented Programming Concepts & Interview Questions',
      cta: 'Start Learning',
      to: '/sheet/OOPS',
      available: true,
      accent: 'purple'
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
    },
    emerald: {
      border: 'border-emerald-500',
      title: 'text-emerald-400',
      button: 'border-emerald-500 text-emerald-500 hover:bg-emerald-500 hover:text-black'
    },
    sky: {
      border: 'border-sky-500',
      title: 'text-sky-400',
      button: 'border-sky-500 text-sky-500 hover:bg-sky-500 hover:text-white'
    },
    purple: {
      border: 'border-purple-500',
      title: 'text-purple-400',
      button: 'border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-white'
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
  const today = new Date();
  const currentMonth = today.toLocaleString('default', { month: 'long' });
  const currentYear = today.getFullYear();
  const currentDay = today.getDate();
  const firstDayOfMonth = new Date(currentYear, today.getMonth(), 1).getDay();
  const daysInMonth = new Date(currentYear, today.getMonth() + 1, 0).getDate();
  const calendarDays = [
    ...Array(firstDayOfMonth).fill(null),
    ...Array.from({ length: daysInMonth }, (_, index) => index + 1)
  ];

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
  // Old place of ContributionHeatmap

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="container mx-auto px-4 py-8 max-w-6xl relative">
        {/* Header with User Info and Logout */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-8">
          <div>
            <h1 className="text-5xl font-bold mb-2 text-white">
              DSA Practice Sheet
            </h1>
            <p className="text-gray-400 text-lg">
              Welcome, <span className="text-blue-500 font-semibold username-anim">{auth?.isAuthenticated ? auth.user?.username : 'Guest'}</span>
            </p>
          </div>
          <div className="flex flex-col md:flex-row md:items-center md:justify-end gap-3">
            <div className="flex items-center justify-end">
              <ThemeToggle />
            </div>
            {auth?.isAuthenticated && (auth.user?.isAdmin || auth.user?.role === 'admin') && (
              <Link
                to="/sheet/admin"
                className="px-6 py-2 bg-[#1f2937] hover:bg-[#273449] border border-[#2a2a2a] rounded-full font-semibold transition-all duration-300 hover:scale-105 active:scale-95 hover:shadow-[0_0_20px_rgba(59,130,246,0.35)] w-full md:w-auto text-sm text-center"
              >
                Admin Console
              </Link>
            )}
            {auth?.isAuthenticated && (
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full md:w-auto">
                <button
                  onClick={openEditProfile}
                  className="px-5 py-2 bg-[#171717] hover:bg-[#222] border border-[#2a2a2a] rounded-full font-semibold transition-all duration-300 hover:scale-105 active:scale-95 hover:shadow-[0_0_18px_rgba(148,163,184,0.3)] w-full sm:w-auto text-sm"
                >
                  Edit Profile
                </button>
                <button
                  onClick={openPasswordModal}
                  className="px-5 py-2 bg-[#171717] hover:bg-[#222] border border-[#2a2a2a] rounded-full font-semibold transition-all duration-300 hover:scale-105 active:scale-95 hover:shadow-[0_0_18px_rgba(148,163,184,0.3)] w-full sm:w-auto text-sm"
                >
                  Change Password
                </button>
              </div>
            )}
            {auth?.isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="px-6 py-2 bg-red-600/20 hover:bg-red-600 border border-red-500/50 hover:border-red-500 rounded-full font-semibold transition-all duration-300 hover:scale-105 active:scale-95 hover:shadow-[0_0_18px_rgba(220,38,38,0.4)] w-full md:w-auto text-sm"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/sheet/login"
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-full font-semibold transition-all duration-300 hover:scale-105 active:scale-95 hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] w-full md:w-auto text-sm flex items-center justify-center gap-2"
              >
                <span>Login</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
              </Link>
            )}
          </div>
        </div>

        {isEditOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
            <div className="bg-[#0f0f0f] border border-[#2a2a2a] rounded-xl w-full max-w-lg p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Update Profile</h2>
                <button
                  type="button"
                  onClick={closeEditProfile}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              {editError && (
                <div className="mt-4 rounded-lg border border-rose-500/70 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                  {editError}
                </div>
              )}

              <form onSubmit={handleEditSubmit} className="mt-6 space-y-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Username</label>
                  <input
                    name="username"
                    value={editForm.username}
                    onChange={handleEditChange}
                    className="w-full rounded-lg border border-[#2a2a2a] bg-[#0d0d0d] px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={editForm.email}
                    readOnly
                    disabled
                    className="w-full rounded-lg border border-[#2a2a2a] bg-[#0a0a0a] px-4 py-2.5 text-sm text-gray-500 cursor-not-allowed"
                  />
                  <p className="mt-1.5 text-xs text-gray-500">Verified with Google — your email can't be changed.</p>
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={closeEditProfile}
                    className="px-4 py-2 rounded-lg border border-[#2a2a2a] text-gray-300 hover:bg-[#1a1a1a]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSavingEdit}
                    className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 font-semibold text-white disabled:opacity-60"
                  >
                    {isSavingEdit ? 'Saving...' : 'Save changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {isPasswordOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
            <div className="bg-[#0f0f0f] border border-[#2a2a2a] rounded-xl w-full max-w-lg p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Change Password</h2>
                <button
                  type="button"
                  onClick={closePasswordModal}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              {passwordError && (
                <div className="mt-4 rounded-lg border border-rose-500/70 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                  {passwordError}
                </div>
              )}

              <form onSubmit={handlePasswordSubmit} className="mt-6 space-y-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Current password</label>
                  <input
                    type="password"
                    name="oldPassword"
                    value={passwordForm.oldPassword}
                    onChange={handlePasswordChange}
                    autoComplete="current-password"
                    className="w-full rounded-lg border border-[#2a2a2a] bg-[#0d0d0d] px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-2">New password</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordForm.newPassword}
                    onChange={handlePasswordChange}
                    autoComplete="new-password"
                    className="w-full rounded-lg border border-[#2a2a2a] bg-[#0d0d0d] px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    required
                    minLength={6}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Confirm new password</label>
                  <input
                    type="password"
                    name="confirmNewPassword"
                    value={passwordForm.confirmNewPassword}
                    onChange={handlePasswordChange}
                    autoComplete="new-password"
                    className="w-full rounded-lg border border-[#2a2a2a] bg-[#0d0d0d] px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    required
                    minLength={6}
                  />
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={closePasswordModal}
                    className="px-4 py-2 rounded-lg border border-[#2a2a2a] text-gray-300 hover:bg-[#1a1a1a]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSavingPassword}
                    className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 font-semibold text-white disabled:opacity-60"
                  >
                    {isSavingPassword ? 'Saving...' : 'Update password'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-[1fr_1fr_0.72fr] gap-6 mb-8">
          {/* Series Available */}
          <div className="bg-[#1a1a1a] rounded-lg p-5 border border-[#2a2a2a]">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 shrink-0 bg-blue-600 rounded-full flex items-center justify-center">
                <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z"/>
                </svg>
              </div>
              <div className="min-w-0">
                <div className="text-3xl font-bold leading-none">{topics.length}</div>
                <div className="mt-1.5 text-base leading-tight text-gray-400">DSA Series Available</div>
              </div>
            </div>
          </div>

          {/* Questions Completed */}
          <div className="bg-[#1a1a1a] rounded-lg p-5 border border-[#2a2a2a]">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 shrink-0 bg-purple-600 rounded-full flex items-center justify-center">
                <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
              </div>
              <div className="min-w-0">
                <div className="text-3xl font-bold leading-none">{stats.completed}/{stats.total}</div>
                <div className="mt-1.5 text-base leading-tight text-gray-400">Questions Completed</div>
              </div>
            </div>
          </div>

          <div className="bg-[#1a1a1a] rounded-lg p-5 border border-[#2a2a2a]">
            <div className="flex items-center gap-4">
              {/* Auto-refresh Countdown */}
              {auth?.isAuthenticated && (
                <div className="mb-6 flex items-center justify-end gap-2 text-sm text-gray-400">
                  <span>Auto-refreshing in</span>
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600/20 border border-blue-500/40">
                  <span className="font-bold text-blue-400">{countdown}</span>
                  </div>
                  <span>seconds</span>
                  </div>
                )}
            </div>
          </div>
          

        </div>

{/* Top Section Toggle: Overall Progress or Website Reviews */}
        <div className="bg-[#1a1a1a] rounded-lg border border-[#2a2a2a] mb-8 overflow-hidden">
          <div className="flex items-center gap-2 border-b border-[#2a2a2a] px-6 pt-3 bg-[#161616]">
            <button
              onClick={() => setTopView('progress')}
              className={`text-lg font-semibold px-4 py-2 rounded-t-lg border-b-2 transition-all ${
                topView === 'progress'
                  ? 'text-white border-blue-500 bg-[#222]'
                  : 'text-gray-500 border-transparent hover:text-gray-300 hover:bg-[#1a1a1a]'
              }`}
            >
              Overall Progress
            </button>
            <button
              onClick={() => setTopView('reviews')}
              className={`text-lg font-semibold px-4 py-2 rounded-t-lg border-b-2 transition-all ${
                topView === 'reviews'
                  ? 'text-white border-blue-500 bg-[#222]'
                  : 'text-gray-500 border-transparent hover:text-gray-300 hover:bg-[#1a1a1a]'
              }`}
            >
              Website Reviews
            </button>
          </div>

          <div className="p-6">
            {topView === 'progress' ? (
              <>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-5xl font-bold mb-2">{progressPercentage}%</div>
                    <div className="text-gray-400 text-lg">Overall Progress</div>
                  </div>
                </div>

                {/* Achievement Progress Bar */}
                <div className="relative px-2 sm:px-5 mt-4">
                  {/* Progress line background */}
                  <div className="absolute top-4 sm:top-5 left-0 right-0 h-1 bg-gray-700 z-0"></div>

                  {/* Progress line filled */}
                  <div
                    className="absolute top-4 sm:top-5 left-0 h-1 bg-gradient-to-r from-[#CD7F32] via-[#FFD700] to-purple-500 transition-all duration-500 z-0"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>

                  <div className="flex justify-between relative z-10">
                    {achievements.map((achievement, index) => (
                      <div key={achievement.name} className="flex flex-col items-center">
                        <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border-2 ${        
                          index <= currentLevel
                            ? achievement.color + ' border-transparent'
                            : 'bg-gray-700 border-gray-600'  
                        }`}>
                          {index <= currentLevel && (        
                            <svg className="w-4 h-4 sm:w-6 sm:h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                            </svg>
                          )}
                        </div>
                        <div className={`text-[10px] sm:text-xs mt-2 text-center max-w-[40px] sm:max-w-none break-words ${index <= currentLevel ? 'text-white font-semibold' : 'text-gray-600'}`}>
                          {achievement.name}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <WebsiteReviews apiBaseUrl={API_URL.replace('/questions', '')} auth={auth} hideContainer={true} />
            )}
          </div>
        </div>

{/* Contribution Heatmap & Leaderboard */}
          <div className="bg-[#1a1a1a] rounded-lg border border-[#2a2a2a] mb-10 pb-6 overflow-hidden">
            <div className="flex flex-col xl:flex-row xl:items-center justify-between mb-4 border-b border-[#2a2a2a] px-4 md:px-6 pt-3 bg-[#161616] gap-4 xl:gap-0">
              <div className="flex gap-2 overflow-x-auto whitespace-nowrap custom-scrollbar pb-2 xl:pb-0">
                <button 
                  onClick={() => setActiveView('activity')}
                  className={`text-base md:text-xl font-semibold px-4 py-2 rounded-t-lg border-b-2 transition-all shrink-0 ${
                    activeView === 'activity' 
                      ? 'text-white border-blue-500 bg-[#222]' 
                      : 'text-gray-500 border-transparent hover:text-gray-300 hover:bg-[#1a1a1a]'
                  }`}
                >
                  Activity Graph
                </button>
                <button 
                  onClick={() => setActiveView('leaderboard')}
                  className={`text-base md:text-xl font-semibold px-4 py-2 rounded-t-lg border-b-2 transition-all shrink-0 ${
                    activeView === 'leaderboard' 
                      ? 'text-white border-blue-500 bg-[#222]' 
                      : 'text-gray-500 border-transparent hover:text-gray-300 hover:bg-[#1a1a1a]'
                  }`}
                >
                  Leaderboard
                </button>
              </div>

              {activeView === 'activity' && (
                <div className="flex flex-wrap items-center gap-3 md:gap-4 pb-2">
                  <button
                    onClick={migrateTimestamps}
                    className="px-3 md:px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-xs font-semibold transition-colors break-keep whitespace-nowrap"
                    title="Click if your completed questions don't show on the graph"
                  >
                    Sync Activity
                  </button>
                  <div className="flex items-center gap-1 md:gap-2 text-xs md:text-sm text-gray-400 whitespace-nowrap">
                    <span>Less</span>
                    <div className="flex gap-1">
                      <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-sm bg-[#161b22]"></div>
                      <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-sm bg-[#0e4429]"></div>
                      <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-sm bg-[#006d32]"></div>
                      <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-sm bg-[#26a641]"></div>
                      <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-sm bg-[#39d353]"></div>
                    </div>
                    <span>More</span>
                  </div>
                </div>
              )}
            </div>

            <div className="px-6">
              {activeView === 'activity' ? (
                <>
                  <p className="text-sm text-gray-400 mb-4">Your daily question completion streak</p>
                  <ContributionHeatmap activity={activity} currentBadge={currentBadge} username={auth.user?.username} />
                </>
              ) : (
                <div className="mt-4">
                  <Leaderboard baseUrl={API_URL} totalQuestions={stats.total} />
                </div>
              )}
            </div>
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


        <Footer /></div>
    </div>
  );
}

export default HomePage;
