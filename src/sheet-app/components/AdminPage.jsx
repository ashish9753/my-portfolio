
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import LoadingScreen from '../../components/LoadingScreen.jsx';

function AdminPage({ auth }) {
  // Defensive: fallback if auth is missing
  if (!auth || !auth.user) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Authentication Required</h1>
          <p className="text-gray-400">Please log in as an admin to view this page.</p>
        </div>
      </div>
    );
  }
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showBlockedOnly, setShowBlockedOnly] = useState(false);
  const [actionUserId, setActionUserId] = useState(null);
  const [editUser, setEditUser] = useState(null);
  const [editForm, setEditForm] = useState({
    username: '',
    email: '',
    role: 'user'
  });
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  // New filter states
  const [onlineFilter, setOnlineFilter] = useState('all'); // all | online | offline
  const [joinStart, setJoinStart] = useState('');
  const [joinEnd, setJoinEnd] = useState('');

  const ADMIN_API = 'https://dsa-sheet-backend-7r7i.onrender.com/api/admin';
  const MAIN_ADMIN_EMAIL = 'admin@ashishdev.com';

  const isAdminUser = auth?.user?.isAdmin || auth?.user?.role === 'admin';
  const isMainAdmin = isAdminUser && auth?.user?.email?.toLowerCase() === MAIN_ADMIN_EMAIL;

  // Returns a human-readable "X ago" string from a date
  const timeAgo = (date) => {
    if (!date) return null;
    const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days}d ago`;
    return new Date(date).toLocaleDateString();
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');
      const token = localStorage.getItem('token');
      const response = await axios.get(`${ADMIN_API}/users`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const payload = response.data;
      const list = Array.isArray(payload)
        ? payload
        : payload?.users || payload?.data || [];

      setUsers(list);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load users.');
    } finally {
      setLoading(false);
    }
  };

  // Only one polling effect: fetch all users on mount, then poll only status
  useEffect(() => {
    if (!isAdminUser) {
      setLoading(false);
      return;
    }
    fetchUsers(); // initial full fetch
    const token = localStorage.getItem('token');
    let intervalId = setInterval(async () => {
      try {
        const response = await axios.get(`${ADMIN_API}/users`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const payload = response.data;
        const list = Array.isArray(payload)
          ? payload
          : payload?.users || payload?.data || [];
        setUsers(prevUsers => prevUsers.map(user => {
          const updated = list.find(u => u._id === user._id);
          return updated ? { ...user, isOnline: updated.isOnline } : user;
        }));
      } catch {}
    }, 10000);
    return () => clearInterval(intervalId);
  }, [isAdminUser, ADMIN_API]);

  const filteredUsers = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return users.filter((user) => {
      const username = user.username || user.name || '';
      const email = user.email || '';
      const matchesTerm = !term || username.toLowerCase().includes(term) || email.toLowerCase().includes(term);
      const matchesBlocked = !showBlockedOnly || user.isBlocked;
      // Online/offline filter
      const matchesOnline =
        onlineFilter === 'all' ? true :
        onlineFilter === 'online' ? user.isOnline :
        onlineFilter === 'offline' ? !user.isOnline : true;
      // Joining date filter
      let matchesJoin = true;
      if (joinStart) {
        matchesJoin = matchesJoin && user.joiningDate && new Date(user.joiningDate) >= new Date(joinStart);
      }
      if (joinEnd) {
        matchesJoin = matchesJoin && user.joiningDate && new Date(user.joiningDate) <= new Date(joinEnd);
      }
      return matchesTerm && matchesBlocked && matchesOnline && matchesJoin;
    });
  }, [users, searchTerm, showBlockedOnly, onlineFilter, joinStart, joinEnd]);

  const stats = useMemo(() => {
    const total = users.length;
    const blocked = users.filter((user) => user.isBlocked).length;
    const admins = users.filter((user) => user.isAdmin || user.role === 'admin').length;
    return { total, blocked, admins };
  }, [users]);

  const handleToggleBlock = async (user) => {
    const isAdmin = user.isAdmin || user.role === 'admin';
    const isSelf = user._id === auth?.user?._id || user.email?.toLowerCase() === auth?.user?.email?.toLowerCase();
    if ((isAdmin && !isMainAdmin) || (isMainAdmin && isSelf)) {
      return;
    }

    const nextState = user.isBlocked ? 'unblock' : 'block';
    const ok = window.confirm(`Are you sure you want to ${nextState} ${user.username || user.email || 'this user'}?`);
    if (!ok) return;

    try {
      setActionUserId(user._id);
      const token = localStorage.getItem('token');
      const response = await axios.patch(`${ADMIN_API}/users/${user._id}/block`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const updatedUser = response.data?.user || response.data || null;
      setUsers((prev) =>
        prev.map((item) => (item._id === user._id ? { ...item, ...updatedUser } : item))
      );
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update user status.');
    } finally {
      setActionUserId(null);
    }
  };

  const handleDelete = async (user) => {
    const isAdmin = user.isAdmin || user.role === 'admin';
    const isSelf = user._id === auth?.user?._id || user.email?.toLowerCase() === auth?.user?.email?.toLowerCase();
    if ((isAdmin && !isMainAdmin) || (isMainAdmin && isSelf)) {
      return;
    }
    const ok = window.confirm(`Delete ${user.username || user.email || 'this user'} and all progress? This cannot be undone.`);
    if (!ok) return;

    try {
      setActionUserId(user._id);
      const token = localStorage.getItem('token');
      await axios.delete(`${ADMIN_API}/users/${user._id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setUsers((prev) => prev.filter((item) => item._id !== user._id));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete user.');
    } finally {
      setActionUserId(null);
    }
  };

  const openEditModal = (user) => {
    const isAdmin = user.isAdmin || user.role === 'admin';
    const isSelf = user._id === auth?.user?._id || user.email?.toLowerCase() === auth?.user?.email?.toLowerCase();
    if ((isAdmin && !isMainAdmin) || (isMainAdmin && isSelf)) {
      return;
    }
    setEditUser(user);
    setEditForm({
      username: user.username || '',
      email: user.email || '',
      role: user.role || 'user'
    });
  };

  const closeEditModal = () => {
    setEditUser(null);
  };

  const handleEditChange = (event) => {
    const { name, value } = event.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditSubmit = async (event) => {
    event.preventDefault();
    if (!editUser) return;

    try {
      setIsSavingEdit(true);
      setError('');
      const token = localStorage.getItem('token');
      const payload = {
        username: editForm.username.trim(),
        email: editForm.email.trim(),
        role: editForm.role
      };

      const response = await axios.patch(`${ADMIN_API}/users/${editUser._id}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const updatedUser = response.data?.user || response.data || null;
      if (updatedUser) {
        setUsers((prev) => prev.map((item) => (item._id === editUser._id ? { ...item, ...updatedUser } : item)));
      }
      closeEditModal();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update user.');
    } finally {
      setIsSavingEdit(false);
    }
  };

  if (loading) {
    return <LoadingScreen message="Loading admin console..." />;
  }

  if (!isAdminUser) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white">
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <div className="bg-[#111] border border-[#2a2a2a] rounded-xl p-8 text-center">
            <h1 className="text-3xl font-semibold">Admin access required</h1>
            <p className="text-gray-400 mt-3">You do not have permission to view this page.</p>
            <Link
              to="/sheet"
              className="inline-flex items-center justify-center mt-6 px-5 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 font-semibold transition-all"
            >
              Back to dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="container mx-auto px-4 py-10 max-w-6xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold">Admin Console</h1>
            <p className="text-gray-400 mt-2">Manage users, block access, and review progress stats.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={fetchUsers}
              className="px-5 py-2.5 rounded-full bg-[#1f2937] hover:bg-[#2d3748] border border-[#2a2a2a] font-semibold"
            >
              Refresh
            </button>
            <Link
              to="/sheet"
              className="px-5 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 font-semibold text-center"
            >
              Back to dashboard
            </Link>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-rose-500/70 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
          <div className="bg-[#111] border border-[#2a2a2a] rounded-xl p-5">
            <div className="text-3xl font-bold">{stats.total}</div>
            <div className="text-gray-400 text-sm">Total users</div>
          </div>
          <div className="bg-[#111] border border-[#2a2a2a] rounded-xl p-5">
            <div className="text-3xl font-bold text-amber-300">{stats.blocked}</div>
            <div className="text-gray-400 text-sm">Blocked users</div>
          </div>
          <div className="bg-[#111] border border-[#2a2a2a] rounded-xl p-5">
            <div className="text-3xl font-bold text-emerald-300">{stats.admins}</div>
            <div className="text-gray-400 text-sm">Admins</div>
          </div>
        </div>

        <div className="bg-[#111] border border-[#2a2a2a] rounded-xl p-5 mb-6 flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center w-full">
            <div className="flex-1">
              <input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search by username or email"
                className="w-full rounded-lg border border-[#2a2a2a] bg-[#0d0d0d] px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>
            <label className="flex items-center gap-2 text-sm text-gray-300">
              <input
                type="checkbox"
                checked={showBlockedOnly}
                onChange={(event) => setShowBlockedOnly(event.target.checked)}
                className="h-4 w-4 rounded border-gray-600 bg-[#0d0d0d] text-blue-500 focus:ring-blue-500/50"
              />
              Show blocked only
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-300">
              <span>Status:</span>
              <select
                value={onlineFilter}
                onChange={e => setOnlineFilter(e.target.value)}
                className="rounded border border-[#2a2a2a] bg-[#0d0d0d] px-2 py-1 text-sm text-white"
              >
                <option value="all">All</option>
                <option value="online">Online</option>
                <option value="offline">Offline</option>
              </select>
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-300">
              <span>Joined from:</span>
              <input
                type="date"
                value={joinStart}
                onChange={e => setJoinStart(e.target.value)}
                className="rounded border border-[#2a2a2a] bg-[#0d0d0d] px-2 py-1 text-sm text-white"
              />
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-300">
              <span>to</span>
              <input
                type="date"
                value={joinEnd}
                onChange={e => setJoinEnd(e.target.value)}
                className="rounded border border-[#2a2a2a] bg-[#0d0d0d] px-2 py-1 text-sm text-white"
              />
            </label>
          </div>
          {/* Removed extra info text for less congestion */}
        </div>

        <div className="bg-[#111] border border-[#2a2a2a] rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-[#0d0d0d] text-gray-400">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold">User</th>
                  <th className="text-left px-4 py-3 font-semibold">Email</th>
                  <th className="text-center px-4 py-3 font-semibold">Solved</th>
                  <th className="text-center px-4 py-3 font-semibold">Joined</th>
                  <th className="text-center px-4 py-3 font-semibold">Last Login</th>
                  <th className="text-center px-4 py-3 font-semibold">Last Online</th>
                  <th className="text-center px-4 py-3 font-semibold">Last Submission</th>
                  <th className="text-center px-4 py-3 font-semibold">Role</th>
                  <th className="text-center px-4 py-3 font-semibold">Status</th>
                  <th className="text-right px-4 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                      No users found.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => {
                    const isAdmin = user.isAdmin || user.role === 'admin';
                    const isSelf = user._id === auth?.user?._id || user.email?.toLowerCase() === auth?.user?.email?.toLowerCase();
                    const isBlocked = user.isBlocked;
                    const solvedCount = user.completedQuestions ?? user.completedQuestionsCount ?? user.totalCompleted ?? user.completedCount ?? 0;
                    const isBusy = actionUserId === user._id;
                    const allowAdminActions = isMainAdmin ? !isSelf : !isAdmin;
                    const isEditingDisabled = !allowAdminActions || isBusy;

                    return (
                      <tr key={user._id} className="border-t border-[#1f1f1f]">
                        <td className="px-4 py-4">
                          <div className="font-semibold text-white">{user.username || user.name || 'Unnamed'}</div>
                          <div className="text-xs text-gray-400">{user._id}</div>
                        </td>
                        <td className="px-4 py-4 text-gray-300">{user.email || 'N/A'}</td>
                        <td className="px-4 py-4 text-center text-gray-200">{solvedCount}</td>
                        <td className="px-4 py-4 text-center text-gray-200">
                          {user.joiningDate ? new Date(user.joiningDate).toLocaleDateString() : 'N/A'}
                        </td>
                        {/* Last Login */}
                        <td className="px-4 py-4 text-center">
                          {user.lastLoginDate ? (
                            <div>
                              <div className="text-gray-200 text-xs">{new Date(user.lastLoginDate).toLocaleDateString()}</div>
                              <div className="text-gray-500 text-xs">{timeAgo(user.lastLoginDate)}</div>
                            </div>
                          ) : (
                            <span className="text-gray-500 text-xs">Never</span>
                          )}
                        </td>
                        {/* Last Online */}
                        <td className="px-4 py-4 text-center">
                          {user.lastActive ? (
                            <div>
                              <div className="text-gray-200 text-xs">{new Date(user.lastActive).toLocaleDateString()}</div>
                              <div className="text-gray-500 text-xs">{timeAgo(user.lastActive)}</div>
                            </div>
                          ) : (
                            <span className="text-gray-500 text-xs">Never</span>
                          )}
                        </td>
                        <td className="px-4 py-4 text-center text-gray-200">
                          {user.lastSubmissionDate ? new Date(user.lastSubmissionDate).toLocaleString() : 'N/A'}
                        </td>
                        <td className="px-4 py-4 text-center">
                          <span className={`px-2 py-1 rounded-full text-xs ${isAdmin ? 'bg-emerald-500/20 text-emerald-300' : 'bg-gray-700/40 text-gray-300'}`}>
                            {isAdmin ? 'Admin' : 'User'}
                          </span>
                        </td>
                        {/* Online/Offline badge only */}
                        <td className="px-4 py-4 text-center">
                          {user.isOnline ? (
                            <span className="px-2 py-1 rounded-full text-xs bg-green-500/20 text-green-300">● Online</span>
                          ) : (
                            <span className="px-2 py-1 rounded-full text-xs bg-gray-700/40 text-gray-400">Offline</span>
                          )}
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex flex-wrap justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => openEditModal(user)}
                              disabled={isEditingDisabled}
                              className={`px-3 py-1.5 rounded-md text-xs font-semibold border transition-all ${isEditingDisabled ? 'border-gray-700 text-gray-500 cursor-not-allowed' : 'border-slate-500/60 text-slate-200 hover:bg-slate-500/10'}`}
                              title={isEditingDisabled ? (isMainAdmin && isSelf ? 'Cannot edit yourself here' : 'Cannot edit admin users') : 'Edit user'}
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleToggleBlock(user)}
                              disabled={!allowAdminActions || isBusy}
                              className={`px-3 py-1.5 rounded-md text-xs font-semibold border transition-all ${!allowAdminActions ? 'border-gray-700 text-gray-500 cursor-not-allowed' : isBlocked ? 'border-amber-400/60 text-amber-200 hover:bg-amber-500/10' : 'border-blue-400/60 text-blue-200 hover:bg-blue-500/10'} ${isBusy ? 'opacity-50 cursor-wait' : ''}`}
                            >
                              {isBlocked ? 'Unblock' : 'Block'}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(user)}
                              disabled={!allowAdminActions || isBusy}
                              className={`px-3 py-1.5 rounded-md text-xs font-semibold border border-rose-500/60 text-rose-200 hover:bg-rose-500/10 ${!allowAdminActions ? 'opacity-40 cursor-not-allowed' : ''} ${isBusy ? 'opacity-50 cursor-wait' : ''}`}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {editUser && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
            <div className="bg-[#0f0f0f] border border-[#2a2a2a] rounded-xl w-full max-w-lg p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Edit User</h2>
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

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
                    onChange={handleEditChange}
                    className="w-full rounded-lg border border-[#2a2a2a] bg-[#0d0d0d] px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Role</label>
                  <select
                    name="role"
                    value={editForm.role}
                    onChange={handleEditChange}
                    className="w-full rounded-lg border border-[#2a2a2a] bg-[#0d0d0d] px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={closeEditModal}
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
      </div>
    </div>
  );
}

export default AdminPage;
