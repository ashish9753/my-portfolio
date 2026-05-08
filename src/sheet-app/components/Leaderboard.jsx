import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const Leaderboard = ({ baseUrl, totalQuestions = 0 }) => {
    const [leaderboardData, setLeaderboardData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isHovered, setIsHovered] = useState(false);
    const scrollRef = useRef(null);

    const [totalQs, setTotalQs] = useState(totalQuestions);

    useEffect(() => {
        setTotalQs(totalQuestions);
    }, [totalQuestions]);

    const achievements = [
        { name: 'Bronze', threshold: 0 },
        { name: 'Silver', threshold: 20 },
        { name: 'Gold', threshold: 40 },
        { name: 'Platinum', threshold: 60 },
        { name: 'Diamond', threshold: 80 },
        { name: 'Grandmaster', threshold: 95 }
    ];

    const getBadgeImage = (completedCount) => {
        if (!totalQs) return 'Bronze.png';
        const percentage = Math.round((completedCount / totalQs) * 100);
        let currentName = 'Bronze';
        for (let i = achievements.length - 1; i >= 0; i--) {
            if (percentage >= achievements[i].threshold) {
                currentName = achievements[i].name;
                break;
            }
        }
        
        const badgeByAchievement = {
            Bronze: 'Bronze.png',
            Silver: 'Silver.png',
            Gold: 'Gold.png',
            Platinum: 'Platinum.png',
            Diamond: 'Diamond.png',
            Grandmaster: 'GrandMaster.png'
        };
        return badgeByAchievement[currentName] || 'Bronze.png';
    };

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const baseUrlToUse = baseUrl || 'http://13.201.54.180:5000/api/questions';
                const apiRoot = baseUrlToUse.replace(/\/questions\/?$/, '');
                const response = await axios.get(`${apiRoot}/leaderboard`);
                const data = response.data;
                const rawUsers = data.leaderboard || (Array.isArray(data) ? data : []);
                setLeaderboardData(rawUsers.slice(0, 100));
                
                // If totalQuestions wasn't provided (e.g., user not logged in), check if the API returned it 
                // or default to a fallback total (e.g. 450) if we can't find it
                if (!totalQuestions) {
                    setTotalQs(data.totalQuestions || 450); 
                }
            } catch (error) {
                console.error('Error fetching leaderboard:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchLeaderboard();
    }, []);

    // Auto-scroll logic for Top 6+ users
    useEffect(() => {
        if (leaderboardData.length <= 6) return;

        let animationFrameId;
        const scrollStep = () => {
            const scrollEl = scrollRef.current;
            if (scrollEl && !isHovered) {
                // If we've scrolled exactly past the first set of items (half the scrollHeight),
                // invisibly reset the scroll position to the top to create a seamless infinite scroll loop.
                if (scrollEl.scrollTop >= scrollEl.scrollHeight / 2) {
                    scrollEl.scrollTop = 0;
                } else {
                    scrollEl.scrollTop += 0.5; // Controls scrolling speed
                }
            }
            animationFrameId = requestAnimationFrame(scrollStep);
        };

        animationFrameId = requestAnimationFrame(scrollStep);

        return () => cancelAnimationFrame(animationFrameId);
    }, [isHovered, leaderboardData.length]);

    if (loading) {
        return <div className="text-gray-400 text-center py-10 animate-pulse">Loading Leaderboard...</div>;
    }

    return (
        <div className="flex flex-col w-full rounded-lg border border-[#2a2a2a] bg-[#161616] overflow-hidden">
            <div className="py-3 px-6 bg-[#1a1a1a] border-b border-[#2a2a2a] flex items-center justify-between">
                <h3 className="font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 uppercase text-sm">
                    Top 100 Users
                </h3>
            </div>
            <div 
                className="overflow-y-auto overflow-x-auto max-h-[440px] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                ref={scrollRef}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <table className="w-full min-w-[450px] text-left border-collapse relative">
                    <thead className="sticky top-0 z-10">
                        <tr className="bg-[#1f1f1f] text-gray-400 text-xs uppercase tracking-wider shadow-md">
                            <th className="py-4 px-2 sm:px-6 font-semibold w-[20%] sm:w-1/4 text-center">Rank</th>
                        <th className="py-4 px-2 sm:px-6 font-semibold w-[45%] sm:w-1/2 text-left">User</th>
                        <th className="py-4 px-2 sm:px-6 font-semibold text-center w-[35%] sm:w-1/4">Questions Solved</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-[#2a2a2a]/50">
                    {leaderboardData.length > 0 ? (
                        [...leaderboardData, ...leaderboardData].map((user, index) => {
                            const actualIndex = index % leaderboardData.length;
                            const solvedCount = user.completedQuestionsCount ?? user.totalCompleted ?? user.completedCount ?? 0;
                            const percentage = totalQs ? Math.round((solvedCount / totalQs) * 100) : 0;
                            return (
                            <tr 
                                key={`${user._id || index}-${index}`} 
                                className="group hover:bg-[#2a2a2a]/40 transition-all duration-200"
                            >
                                <td className="py-2 sm:py-3 px-2 sm:px-6 text-center">
                                    <div className={`inline-flex items-center justify-center font-bold text-xs sm:text-sm ${
                                        actualIndex === 0 ? 'w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-yellow-500/20 text-yellow-400 ring-1 ring-yellow-500/50' : 
                                        actualIndex === 1 ? 'w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gray-400/20 text-gray-300 ring-1 ring-gray-400/50' : 
                                        actualIndex === 2 ? 'w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-amber-600/20 text-amber-500 ring-1 ring-amber-600/50' : 
                                        'text-gray-400 font-semibold'
                                    }`}>
                                        #{actualIndex + 1}
                                    </div>
                                </td>
                                <td className="py-2 sm:py-3 px-2 sm:px-6">
                                    <div className="flex justify-start items-center gap-2 sm:gap-4">
                                        <img 
                                            src={`/Badges/${getBadgeImage(solvedCount)}`} 
                                            alt="Badge" 
                                            className="w-8 h-8 sm:w-12 sm:h-12 object-contain drop-shadow-[0_0_8px_rgba(255,255,255,0.1)] group-hover:scale-110 transition-transform duration-300"
                                        />
                                        <div className="flex flex-col text-left min-w-0">
                                            <span className="font-semibold text-gray-200 text-sm sm:text-base group-hover:text-blue-400 transition-colors break-all line-clamp-1">
                                                {user.username || user.name || 'AnonymousPlayer'}
                                            </span>
                                            <span className="text-[10px] sm:text-xs text-gray-500 whitespace-nowrap">
                                                {percentage}% Completed
                                            </span>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-3 sm:py-4 px-2 sm:px-6 text-center">
                                    <div className="flex justify-center items-end gap-1 flex-row flex-wrap sm:flex-nowrap">
                                        <span className="font-bold text-lg sm:text-xl text-emerald-400 leading-none">
                                            {solvedCount}
                                        </span>
                                        {totalQs > 0 && (
                                            <span className="text-xs sm:text-sm text-gray-500 font-semibold leading-none mb-[2px]">
                                                /{totalQs}
                                            </span>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        )})
                    ) : (
                        <tr>
                            <td colSpan="3" className="text-center py-10 text-gray-500">
                                <div className="flex flex-col items-center gap-2">
                                    <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path></svg>
                                    <span>No data available yet.</span>
                                </div>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
        </div>
    );
};

export default Leaderboard;