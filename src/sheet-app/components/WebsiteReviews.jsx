import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FaStar, FaUserCircle, FaEdit, FaTrash } from 'react-icons/fa';

const WebsiteReviews = ({ apiBaseUrl, auth, hideContainer = false }) => {
  const [allReviews, setAllReviews] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({ averageRating: 0, totalReviews: 0 });
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showAllModal, setShowAllModal] = useState(false);
  const [filterRating, setFilterRating] = useState('All');
  const [formData, setFormData] = useState({ rating: 5, review: '' });
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Wait for both reviews and stats endpoints to resolve
      const [reviewsRes, statsRes] = await Promise.allSettled([
        axios.get(`${apiBaseUrl}/website`),
        axios.get(`${apiBaseUrl}/website/stats`)
      ]);
      
      const revData = reviewsRes.status === 'fulfilled' ? reviewsRes.value.data : [];
      const stData = statsRes.status === 'fulfilled' ? statsRes.value.data : { averageRating: 0, totalReviews: 0 };
      
      const parsedReviews = Array.isArray(revData) ? revData : (revData.reviews || []);
      setAllReviews(parsedReviews);
      setReviews(parsedReviews.slice(0, 20)); // Show only recent 20 reviews
      
      // Some APIs return { totalReviews: X, averageRating: Y }
      setStats({
        averageRating: stData.averageRating || 0,
        totalReviews: stData.totalReviews || parsedReviews.length
      });
    } catch (error) {
      console.error('Error fetching website reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  // Auto-scroll logic for reviews
  useEffect(() => {
      // Only scroll if there are enough reviews to overflow horizontally. Check logic or arbitrary threshold.
      if (reviews.length <= 3) return;

      let animationFrameId;
      const scrollStep = () => {
          const scrollEl = scrollRef.current;
          if (scrollEl && !isHovered) {
              // Same exact scroll jump technique used in Leaderboard to create an infinite left-to-right carousel loop
              if (scrollEl.scrollLeft >= scrollEl.scrollWidth / 2) {
                  scrollEl.scrollLeft = 0;
              } else {
                  scrollEl.scrollLeft += 0.5; // Custom speed
              }
          }
          animationFrameId = requestAnimationFrame(scrollStep);
      };

      animationFrameId = requestAnimationFrame(scrollStep);

      return () => cancelAnimationFrame(animationFrameId);
  }, [isHovered, reviews.length]);

  const getUserId = (u) => {
    if (!u) return null;
    return typeof u === 'string' ? u : (u._id || u.id);
  };

  const authUserId = getUserId(auth?.user);

  const myReviewIndex = auth?.isAuthenticated && authUserId
    ? reviews.findIndex(r => getUserId(r.user) === authUserId)
    : -1;

  const handleOpenModal = () => {
    setFormData({ rating: 5, review: '' });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!auth?.token) return;
    try {
      setIsSubmitting(true);
      await axios.post(
        `${apiBaseUrl}/website`,
        { rating: formData.rating, review: formData.review },
        { headers: { Authorization: `Bearer ${auth.token}` } }
      );
      setShowModal(false);
      fetchData(); // Refresh the list
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete your review?')) return;
    try {
      await axios.delete(`${apiBaseUrl}/reviews/${reviewId}`, {
        headers: { Authorization: `Bearer ${auth.token}` }
      });
      fetchData();
    } catch (error) {
      console.error('Error deleting review:', error);
      alert('Failed to delete review');
    }
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <FaStar
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400' : 'text-gray-600'}`}
      />
    ));
  };

  const formattedStatsRating = typeof stats.averageRating === 'number' ? stats.averageRating.toFixed(1) : '0.0';

  if (loading) {
    return (
      <div className={`flex justify-center items-center py-10 ${hideContainer ? '' : 'bg-[#1a1a1a] rounded-lg border border-[#2a2a2a] mb-10'}`}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${hideContainer ? '' : 'bg-[#1a1a1a] rounded-lg p-6 border border-[#2a2a2a] mb-10'}`}>
      <div className="relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-[#333] pb-6">
          <div className="flex-1 w-full md:w-auto">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                Website Reviews
              </h2>
            </div>
            <div className="flex items-center gap-3 mt-2 flex-wrap">
              <div className="flex items-center gap-1.5 bg-[#222] px-3 py-1.5 rounded-full border border-[#333]">
                <span className="text-yellow-400 font-bold text-lg leading-none">{formattedStatsRating}</span>
                <FaStar className="w-4 h-4 text-yellow-400 mb-0.5" />
              </div>
              <span className="text-gray-400 font-medium">Based on {stats.totalReviews} reviews</span>
              
              {allReviews.length > 0 && (
                <button
                  onClick={() => setShowAllModal(true)}
                  className="ml-auto md:ml-4 text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors"
                >
                  See All Reviews →
                </button>
              )}
            </div>
          </div>

          {auth?.isAuthenticated ? (
            <button
              onClick={handleOpenModal}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all duration-300 shadow-[0_0_20px_rgba(37,99,235,0.2)] hover:shadow-[0_0_25px_rgba(37,99,235,0.4)] hover:-translate-y-0.5 active:translate-y-0"
            >
              Leave a Review
            </button>
          ) : (
            <div className="text-sm text-gray-500 italic bg-[#2a2a2a] px-4 py-2 rounded-lg border border-[#333]">
              Log in to leave a review.
            </div>
          )}
        </div>

        <div className="relative group">
          <div 
            className="flex overflow-x-auto gap-6 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden w-full pb-4 items-stretch cursor-grab active:cursor-grabbing"
            ref={scrollRef}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {reviews.length > 0 ? (
              (reviews.length > 3 ? [...reviews, ...reviews] : reviews).map((r, i) => {
                const isMine = auth?.isAuthenticated && getUserId(r.user) === authUserId;
                
                return (
                  <div
                    key={`${r._id || i}-${i}`}
                    className={`shrink-0 w-80 md:w-[350px] bg-[#161616] rounded-xl p-6 border ${isMine ? 'border-blue-500/50 shadow-[0_0_15px_rgba(37,99,235,0.1)]' : 'border-[#2a2a2a]'} relative transition-all hover:bg-[#1a1a1a] hover:-translate-y-1 hover:shadow-xl flex flex-col justify-between`}
                  >
                    <div>
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 shrink-0 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-inner">
                            {r.user?.username?.charAt(0)?.toUpperCase() || 'A'}
                          </div>
                          <div className="flex-1 min-w-0 pr-2">
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold text-gray-200 truncate">
                                {r.user?.username || r.user?.name || 'Anonymous'}
                              </h4>
                              {isMine && (
                                <span className="text-[10px] font-bold bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full ring-1 ring-blue-500/50 shrink-0">
                                  YOU
                                </span>
                              )}
                            </div>
                            <div className="flex mt-1 gap-0.5">
                              {renderStars(r.rating || 5)}
                            </div>
                          </div>
                        </div>

                        {isMine && (
                          <div className="flex gap-2 shrink-0">
                            <button 
                              onClick={handleOpenModal}
                              className="p-1.5 text-gray-500 hover:text-blue-400 hover:bg-blue-400/10 rounded transition-colors"
                              title="Edit Review"
                            >
                              <FaEdit className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDelete(r._id)}
                              className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded transition-colors"
                              title="Delete Review"
                            >
                              <FaTrash className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>
                      
                      <p className="text-gray-300 text-sm leading-relaxed mb-4 whitespace-pre-wrap line-clamp-4">
                        {r.review}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-[#2a2a2a] text-xs font-semibold text-gray-500 uppercase tracking-wider mt-auto">
                      {new Date(r.createdAt || Date.now()).toLocaleDateString('en-US', {
                        year: 'numeric', month: 'short', day: 'numeric'
                      })}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="w-full py-16 flex flex-col items-center justify-center text-gray-500 bg-[#161616] rounded-xl border border-[#2a2a2a] border-dashed">
                <FaStar className="w-12 h-12 text-[#333] mb-4 drop-shadow-md" />  
                <p className="text-lg">No reviews yet.</p>
                <p className="text-sm mt-1">Be the first to share your experience!</p>
              </div>
            )}
          </div>
          {/* Gradient fade borders for seamless looping effect */}
          {reviews.length > 3 && (
             <>
                <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[#1a1a1a] to-transparent pointer-events-none z-10 hidden md:block"></div>
                <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#1a1a1a] to-transparent pointer-events-none z-10 hidden md:block"></div>
             </>
          )}
        </div>
      </div>

      {/* Write/Edit Review Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#161616] rounded-2xl border border-[#333] w-full max-w-md shadow-2xl transform transition-all overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-[#2a2a2a] flex justify-between items-center bg-[#1a1a1a]">
              <h3 className="text-xl font-bold text-white">
                Write a Review
              </h3>
              <button 
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-white transition-colors bg-[#222] hover:bg-[#333] p-2 rounded-full"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 flex flex-col flex-1">
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wider">Overal Rating</label>
                <div className="flex gap-2 justify-center py-2 bg-[#1a1a1a] rounded-xl border border-[#2a2a2a]">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setFormData({ ...formData, rating: star })}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="focus:outline-none transition-transform hover:scale-110 p-1"
                    >
                      <FaStar
                        className={`w-8 h-8 ${
                          star <= (hoverRating || formData.rating)
                            ? 'text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]'
                            : 'text-gray-600'
                        } transition-colors duration-200`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <label htmlFor="review" className="block text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wider">
                  Your Experience
                </label>
                <textarea
                  id="review"
                  required
                  rows="4"
                  placeholder="Share your thoughts about this DSA platform..."
                  className="w-full bg-[#1a1a1a] border border-[#333] text-gray-100 rounded-xl p-4 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-none shadow-inner"
                  value={formData.review}
                  onChange={(e) => setFormData({ ...formData, review: e.target.value })}
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 mt-auto">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 rounded-xl text-gray-300 font-semibold hover:text-white hover:bg-[#333] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-[0_0_15px_rgba(37,99,235,0.4)] hover:shadow-[0_0_20px_rgba(37,99,235,0.6)] transition-all flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin"></div>
                      Processing...
                    </>
                  ) : (
                    'Submit Review'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* See All Reviews Modal */}
      {showAllModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#161616] rounded-2xl border border-[#333] w-full max-w-4xl max-h-[90vh] shadow-2xl transform transition-all flex flex-col">
            <div className="px-6 py-4 border-b border-[#2a2a2a] flex justify-between items-center bg-[#1a1a1a]">
              <h3 className="text-xl font-bold text-white">
                All Reviews
              </h3>
              <button 
                onClick={() => setShowAllModal(false)}
                className="text-gray-400 hover:text-white transition-colors bg-[#222] hover:bg-[#333] p-2 rounded-full"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
            
            <div className="p-4 border-b border-[#2a2a2a] bg-[#1a1a1a]">
              <div className="flex flex-wrap gap-2">
                {[
                  { label: 'All', value: 'All' },
                  { label: 'Best (5 Stars)', value: 5 },
                  { label: 'Good (4 Stars)', value: 4 },
                  { label: 'Average (3 Stars)', value: 3 },
                  { label: 'Poor (1-2 Stars)', value: 'Poor' }
                ].map(filter => (
                  <button
                    key={filter.label}
                    onClick={() => setFilterRating(filter.value)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      filterRating === filter.value
                      ? 'bg-blue-600 text-white' 
                      : 'bg-[#2a2a2a] text-gray-400 hover:bg-[#333] hover:text-gray-200'
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6 overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
              {allReviews
                .filter(r => {
                  if (filterRating === 'All') return true;
                  if (filterRating === 'Poor') return r.rating <= 2;
                  return r.rating === filterRating;
                })
                .map((r, i) => {
                  const isMine = auth?.isAuthenticated && getUserId(r.user) === authUserId;
                  return (
                    <div
                      key={`${r._id || i}-all`}
                      className={`bg-[#1a1a1a] rounded-xl p-5 border ${isMine ? 'border-blue-500/50 shadow-[0_0_10px_rgba(37,99,235,0.05)]' : 'border-[#2a2a2a]'} flex flex-col hover:bg-[#1f1f1f] transition-colors`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 shrink-0 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-inner">
                            {r.user?.username?.charAt(0)?.toUpperCase() || 'A'}
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-200 text-sm">
                              {r.user?.username || r.user?.name || 'Anonymous'}
                              {isMine && <span className="ml-2 text-[10px] font-bold bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full ring-1 ring-blue-500/50">YOU</span>}
                            </h4>
                            <div className="flex mt-1 gap-0.5">
                              {renderStars(r.rating || 5)}
                            </div>
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-300 text-sm leading-relaxed mb-3 whitespace-pre-wrap">
                        {r.review}
                      </p>
                      <div className="pt-3 border-t border-[#2a2a2a] text-xs font-semibold text-gray-500 uppercase mt-auto">
                        {new Date(r.createdAt || Date.now()).toLocaleDateString('en-US', {
                          year: 'numeric', month: 'short', day: 'numeric'
                        })}
                      </div>
                    </div>
                  );
                })
              }
              {allReviews.filter(r => {
                  if (filterRating === 'All') return true;
                  if (filterRating === 'Poor') return r.rating <= 2;
                  return r.rating === filterRating;
                }).length === 0 && (
                <div className="col-span-full py-16 flex flex-col items-center justify-center text-gray-500 bg-[#161616] rounded-xl border border-[#2a2a2a] border-dashed">
                  <FaStar className="w-10 h-10 text-[#333] mb-3" />
                  <p>No reviews match this filter.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WebsiteReviews;