
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import LoadingScreen from '../../components/LoadingScreen.jsx';

function AdminPage({ auth }) {
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
  const [editForm, setEditForm] = useState({ username: '', email: '', role: 'user' });
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [onlineFilter, setOnlineFilter] = useState('all');
  const [joinStart, setJoinStart] = useState('');
  const [joinEnd, setJoinEnd] = useState('');

  const ADMIN_API = 'https://dsa-sheet-backend-7r7i.onrender.com/api/admin';
  const MAIN_ADMIN_EMAIL = 'admin@ashishdev.com';

  const isAdminUser = auth?.user?.isAdmin || auth?.user?.role === 'admin';
  const isMainAdmin = isAdminUser && auth?.user?.email?.toLowerCase() === MAIN_ADMIN_EMAIL;

  const timeAgo = (date) => {
    if (!date) return null;
    const s = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
    if (s < 60) return `${s}s ago`;
    const m = Math.floor(s / 60);
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    const d = Math.floor(h / 24);
    if (d < 30) return `${d}d ago`;
    return new Date(date).toLocaleDateString();
  };

  const fmt = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' }) : null;

  const fetchUsers = async () => {
    try {
      setLoading(true); setError('');
      const token = localStorage.getItem('token');
      const res = await axios.get(`${ADMIN_API}/users`, { headers: { Authorization: `Bearer ${token}` } });
      const p = res.data;
      setUsers(Array.isArray(p) ? p : p?.users || p?.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load users.');
    } finally { setLoading(false); }
  };

  useEffect(() => {
    if (!isAdminUser) { setLoading(false); return; }
    fetchUsers();
    const token = localStorage.getItem('token');
    const id = setInterval(async () => {
      try {
        const res = await axios.get(`${ADMIN_API}/users`, { headers: { Authorization: `Bearer ${token}` } });
        const p = res.data;
        const list = Array.isArray(p) ? p : p?.users || p?.data || [];
        setUsers(prev => prev.map(u => { const up = list.find(x => x._id === u._id); return up ? { ...u, isOnline: up.isOnline, lastActive: up.lastActive } : u; }));
      } catch {}
    }, 10000);
    return () => clearInterval(id);
  }, [isAdminUser]);

  const filteredUsers = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return users.filter(u => {
      const name = (u.username || u.name || '').toLowerCase();
      const email = (u.email || '').toLowerCase();
      if (term && !name.includes(term) && !email.includes(term)) return false;
      if (showBlockedOnly && !u.isBlocked) return false;
      if (onlineFilter === 'online' && !u.isOnline) return false;
      if (onlineFilter === 'offline' && u.isOnline) return false;
      if (joinStart && (!u.joiningDate || new Date(u.joiningDate) < new Date(joinStart))) return false;
      if (joinEnd && (!u.joiningDate || new Date(u.joiningDate) > new Date(joinEnd))) return false;
      return true;
    });
  }, [users, searchTerm, showBlockedOnly, onlineFilter, joinStart, joinEnd]);

  const stats = useMemo(() => ({
    total: users.length,
    online: users.filter(u => u.isOnline).length,
    blocked: users.filter(u => u.isBlocked).length,
    admins: users.filter(u => u.isAdmin || u.role === 'admin').length,
  }), [users]);

  const handleToggleBlock = async (user) => {
    const isAdm = user.isAdmin || user.role === 'admin';
    const isSelf = user._id === auth?.user?._id || user.email?.toLowerCase() === auth?.user?.email?.toLowerCase();
    if ((isAdm && !isMainAdmin) || (isMainAdmin && isSelf)) return;
    if (!window.confirm(`${user.isBlocked ? 'Unblock' : 'Block'} ${user.username || user.email}?`)) return;
    try {
      setActionUserId(user._id);
      const token = localStorage.getItem('token');
      const res = await axios.patch(`${ADMIN_API}/users/${user._id}/block`, {}, { headers: { Authorization: `Bearer ${token}` } });
      const upd = res.data?.user || res.data || null;
      setUsers(prev => prev.map(item => item._id === user._id ? { ...item, ...upd } : item));
    } catch (err) { setError(err.response?.data?.message || 'Failed.'); }
    finally { setActionUserId(null); }
  };

  const handleDelete = async (user) => {
    const isAdm = user.isAdmin || user.role === 'admin';
    const isSelf = user._id === auth?.user?._id || user.email?.toLowerCase() === auth?.user?.email?.toLowerCase();
    if ((isAdm && !isMainAdmin) || (isMainAdmin && isSelf)) return;
    if (!window.confirm(`Delete ${user.username || user.email}? This cannot be undone.`)) return;
    try {
      setActionUserId(user._id);
      const token = localStorage.getItem('token');
      await axios.delete(`${ADMIN_API}/users/${user._id}`, { headers: { Authorization: `Bearer ${token}` } });
      setUsers(prev => prev.filter(item => item._id !== user._id));
    } catch (err) { setError(err.response?.data?.message || 'Failed.'); }
    finally { setActionUserId(null); }
  };

  const openEditModal = (user) => {
    const isAdm = user.isAdmin || user.role === 'admin';
    const isSelf = user._id === auth?.user?._id || user.email?.toLowerCase() === auth?.user?.email?.toLowerCase();
    if ((isAdm && !isMainAdmin) || (isMainAdmin && isSelf)) return;
    setEditUser(user);
    setEditForm({ username: user.username || '', email: user.email || '', role: user.role || 'user' });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editUser) return;
    try {
      setIsSavingEdit(true);
      const token = localStorage.getItem('token');
      const res = await axios.patch(`${ADMIN_API}/users/${editUser._id}`,
        { username: editForm.username.trim(), email: editForm.email.trim(), role: editForm.role },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const upd = res.data?.user || res.data || null;
      if (upd) setUsers(prev => prev.map(item => item._id === editUser._id ? { ...item, ...upd } : item));
      setEditUser(null);
    } catch (err) { setError(err.response?.data?.message || 'Failed.'); }
    finally { setIsSavingEdit(false); }
  };

  if (loading) return <LoadingScreen message="Loading admin console..." />;

  if (!isAdminUser) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
        <div className="bg-[#111] border border-[#2a2a2a] rounded-xl p-10 text-center max-w-md">
          <h1 className="text-2xl font-bold">Access Denied</h1>
          <p className="text-gray-400 mt-2 mb-6">Admin privileges required.</p>
          <Link to="/sheet" className="px-5 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 font-semibold">Back to dashboard</Link>
        </div>
      </div>
    );
  }

  const DateCell = ({ date }) => date ? (
    <div className="leading-tight">
      <div className="text-gray-300">{fmt(date)}</div>
      <div className="text-gray-600 text-[10px]">{timeAgo(date)}</div>
    </div>
  ) : <span className="text-gray-600">—</span>;

  return (
    <div className="min-h-screen bg-[#080808] text-white">
      <div className="px-4 py-8" style={{ maxWidth: '1600px', margin: '0 auto' }}>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-7">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Admin Console</h1>
            <p className="text-gray-500 text-sm mt-1">Manage users, permissions, and activity.</p>
          </div>
          <div className="flex gap-2">
            <button onClick={fetchUsers} className="px-4 py-2 rounded-lg bg-[#161616] hover:bg-[#1e1e1e] border border-[#252525] text-sm font-medium">↻ Refresh</button>
            <Link to="/sheet" className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-sm font-medium">← Dashboard</Link>
          </div>
        </div>

        {error && <div className="mb-4 rounded-lg border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">{error}</div>}

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
          {[
            { label: 'Total Users', value: stats.total, color: 'text-white' },
            { label: 'Online Now', value: stats.online, color: 'text-green-400' },
            { label: 'Blocked', value: stats.blocked, color: 'text-amber-400' },
            { label: 'Admins', value: stats.admins, color: 'text-blue-400' },
          ].map(s => (
            <div key={s.label} className="bg-[#0f0f0f] border border-[#1e1e1e] rounded-xl px-4 py-4">
              <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-gray-600 text-xs mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-[#0f0f0f] border border-[#1e1e1e] rounded-xl p-3 mb-4 flex flex-col xl:flex-row gap-3 items-start xl:items-center">
          <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
            placeholder="🔍 Search username or email..."
            className="w-full xl:flex-1 xl:min-w-[200px] rounded-lg border border-[#252525] bg-[#0a0a0a] px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500/50" />
          
          <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
            <label className="flex items-center gap-2 text-xs text-gray-400 cursor-pointer">
              <input type="checkbox" checked={showBlockedOnly} onChange={e => setShowBlockedOnly(e.target.checked)} className="rounded" />
              Blocked only
            </label>
            <select value={onlineFilter} onChange={e => setOnlineFilter(e.target.value)}
              className="flex-1 sm:flex-none rounded-lg border border-[#252525] bg-[#0a0a0a] px-3 py-2 text-xs text-white focus:outline-none">
              <option value="all">All status</option>
              <option value="online">Online</option>
              <option value="offline">Offline</option>
            </select>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 w-full xl:w-auto">
            <span className="hidden sm:inline">Joined:</span>
            <input type="date" value={joinStart} onChange={e => setJoinStart(e.target.value)}
              className="flex-1 sm:flex-none rounded-lg border border-[#252525] bg-[#0a0a0a] px-2 py-2 text-xs text-white focus:outline-none" />
            <span>–</span>
            <input type="date" value={joinEnd} onChange={e => setJoinEnd(e.target.value)}
              className="flex-1 sm:flex-none rounded-lg border border-[#252525] bg-[#0a0a0a] px-2 py-2 text-xs text-white focus:outline-none" />
          </div>
          
          <span className="text-xs text-gray-600 xl:ml-auto w-full xl:w-auto text-right xl:text-left">{filteredUsers.length} / {users.length} users</span>
        </div>

        {/* Mobile & Tablet Card View (Hidden on large screens) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 xl:hidden">
          {filteredUsers.length === 0 ? (
            <div className="col-span-full bg-[#0f0f0f] border border-[#1e1e1e] rounded-xl p-8 text-center text-gray-600">No users found.</div>
          ) : filteredUsers.map(user => {
            const isAdm = user.isAdmin || user.role === 'admin';
            const isSelf = user._id === auth?.user?._id || user.email?.toLowerCase() === auth?.user?.email?.toLowerCase();
            const isBlocked = user.isBlocked;
            const solved = user.completedQuestions ?? user.completedQuestionsCount ?? user.totalCompleted ?? user.completedCount ?? 0;
            const isBusy = actionUserId === user._id;
            const canAct = isMainAdmin ? !isSelf : !isAdm;
            const editDisabled = !canAct || isBusy;

            return (
              <div key={user._id} className={`bg-[#0f0f0f] border border-[#1e1e1e] rounded-xl p-4 flex flex-col gap-3 ${isBlocked ? 'opacity-55' : ''}`}>
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${user.isOnline ? 'bg-green-400 animate-pulse' : 'bg-gray-700'}`} />
                    <div>
                      <div className="font-bold text-white text-sm">{user.username || user.name || 'Unnamed'}</div>
                      <div className="text-gray-500 text-[10px] font-mono">{user._id?.slice(-8)}</div>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${isAdm ? 'bg-blue-500/15 text-blue-400' : 'bg-gray-700/20 text-gray-500'}`}>
                    {isAdm ? 'Admin' : 'User'}
                  </span>
                </div>
                
                <div className="text-gray-400 text-xs break-all">{user.email || '—'}</div>
                
                <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-xs mt-1 bg-[#151515] p-3 rounded-lg border border-[#1e1e1e]">
                  <div><span className="text-gray-500 block text-[10px] mb-0.5">Solved</span> <span className="text-blue-300 font-semibold">{solved}</span></div>
                  <div><span className="text-gray-500 block text-[10px] mb-0.5">Joined</span> <span className="text-gray-300">{fmt(user.joiningDate) || '—'}</span></div>
                  <div><span className="text-gray-500 block text-[10px] mb-0.5">Last Login</span> <DateCell date={user.lastLoginDate} /></div>
                  <div><span className="text-gray-500 block text-[10px] mb-0.5">Last Online</span> <DateCell date={user.lastActive} /></div>
                  <div className="col-span-2"><span className="text-gray-500 block text-[10px] mb-0.5">Last Submission</span> <DateCell date={user.lastSubmissionDate} /></div>
                </div>

                <div className="flex justify-end gap-2 mt-2 border-t border-[#1e1e1e] pt-3">
                  <button onClick={() => openEditModal(user)} disabled={editDisabled}
                    className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${editDisabled ? 'border-gray-800 text-gray-700 cursor-not-allowed' : 'border-slate-600/50 text-slate-300 hover:bg-slate-500/10'}`}>Edit</button>
                  <button onClick={() => handleToggleBlock(user)} disabled={!canAct || isBusy}
                    className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${!canAct ? 'border-gray-800 text-gray-700 cursor-not-allowed' : isBlocked ? 'border-amber-500/50 text-amber-400 hover:bg-amber-500/10' : 'border-indigo-500/50 text-indigo-400 hover:bg-indigo-500/10'} ${isBusy ? 'opacity-50 cursor-wait' : ''}`}>{isBlocked ? 'Unblock' : 'Block'}</button>
                  <button onClick={() => handleDelete(user)} disabled={!canAct || isBusy}
                    className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-medium border border-rose-600/40 text-rose-400 hover:bg-rose-500/10 transition-all ${!canAct ? 'opacity-30 cursor-not-allowed' : ''} ${isBusy ? 'opacity-50 cursor-wait' : ''}`}>Delete</button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Desktop Table (Hidden on smaller screens) */}
        <div className="hidden xl:block bg-[#0f0f0f] border border-[#1e1e1e] rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full" style={{ fontSize: '12px' }}>
              <thead>
                <tr className="bg-[#0a0a0a] border-b border-[#1e1e1e] text-gray-500 text-[11px] uppercase tracking-wider">
                  <th className="text-left px-3 py-2.5 font-semibold sticky left-0 bg-[#0a0a0a] z-10">User</th>
                  <th className="text-left px-3 py-2.5 font-semibold">Email</th>
                  <th className="text-center px-3 py-2.5 font-semibold">Solved</th>
                  <th className="text-center px-3 py-2.5 font-semibold">Joined</th>
                  <th className="text-center px-3 py-2.5 font-semibold">Last Login</th>
                  <th className="text-center px-3 py-2.5 font-semibold">Last Online</th>
                  <th className="text-center px-3 py-2.5 font-semibold">Last Submission</th>
                  <th className="text-center px-3 py-2.5 font-semibold">Role</th>
                  <th className="text-center px-3 py-2.5 font-semibold">Status</th>
                  <th className="text-right px-3 py-2.5 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#131313]">
                {filteredUsers.length === 0 ? (
                  <tr><td colSpan={10} className="py-12 text-center text-gray-600">No users found.</td></tr>
                ) : filteredUsers.map(user => {
                  const isAdm = user.isAdmin || user.role === 'admin';
                  const isSelf = user._id === auth?.user?._id || user.email?.toLowerCase() === auth?.user?.email?.toLowerCase();
                  const isBlocked = user.isBlocked;
                  const solved = user.completedQuestions ?? user.completedQuestionsCount ?? user.totalCompleted ?? user.completedCount ?? 0;
                  const isBusy = actionUserId === user._id;
                  const canAct = isMainAdmin ? !isSelf : !isAdm;
                  const editDisabled = !canAct || isBusy;

                  return (
                    <tr key={user._id} className={`hover:bg-[#111] transition-colors ${isBlocked ? 'opacity-55' : ''}`}>
                      {/* User */}
                      <td className="px-3 py-2.5 sticky left-0 bg-[#0f0f0f] group-hover:bg-[#111] z-10">
                        <div className="flex items-center gap-2 min-w-[130px]">
                          <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${user.isOnline ? 'bg-green-400' : 'bg-gray-700'}`} />
                          <div>
                            <div className="font-semibold text-white">{user.username || user.name || 'Unnamed'}</div>
                            <div className="text-gray-700 font-mono" style={{ fontSize: '9px' }}>{user._id?.slice(-8)}</div>
                          </div>
                        </div>
                      </td>
                      {/* Email */}
                      <td className="px-3 py-2.5 text-gray-400 max-w-[200px]">
                        <span className="truncate block">{user.email || '—'}</span>
                      </td>
                      {/* Solved */}
                      <td className="px-3 py-2.5 text-center text-blue-300 font-semibold">{solved}</td>
                      {/* Joined */}
                      <td className="px-3 py-2.5 text-center text-gray-400">{fmt(user.joiningDate) || '—'}</td>
                      {/* Last Login */}
                      <td className="px-3 py-2.5 text-center"><DateCell date={user.lastLoginDate} /></td>
                      {/* Last Online */}
                      <td className="px-3 py-2.5 text-center"><DateCell date={user.lastActive} /></td>
                      {/* Last Submission */}
                      <td className="px-3 py-2.5 text-center"><DateCell date={user.lastSubmissionDate} /></td>
                      {/* Role */}
                      <td className="px-3 py-2.5 text-center">
                        <span className={`px-2 py-0.5 rounded-full font-medium ${isAdm ? 'bg-blue-500/15 text-blue-400' : 'bg-gray-700/20 text-gray-500'}`}>
                          {isAdm ? 'Admin' : 'User'}
                        </span>
                      </td>
                      {/* Status */}
                      <td className="px-3 py-2.5 text-center">
                        {user.isOnline
                          ? <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500/15 text-green-400"><span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />Online</span>
                          : <span className="px-2 py-0.5 rounded-full bg-gray-700/20 text-gray-500">Offline</span>
                        }
                      </td>
                      {/* Actions */}
                      <td className="px-3 py-2.5">
                        <div className="flex justify-end gap-1">
                          <button onClick={() => openEditModal(user)} disabled={editDisabled}
                            title={editDisabled ? (isSelf ? 'Cannot edit yourself' : 'No permission') : 'Edit'}
                            className={`px-2.5 py-1 rounded text-[11px] font-medium border transition-all ${editDisabled ? 'border-gray-800 text-gray-700 cursor-not-allowed' : 'border-slate-600/50 text-slate-300 hover:bg-slate-500/10'}`}>
                            Edit
                          </button>
                          <button onClick={() => handleToggleBlock(user)} disabled={!canAct || isBusy}
                            className={`px-2.5 py-1 rounded text-[11px] font-medium border transition-all ${!canAct ? 'border-gray-800 text-gray-700 cursor-not-allowed' : isBlocked ? 'border-amber-500/50 text-amber-400 hover:bg-amber-500/10' : 'border-indigo-500/50 text-indigo-400 hover:bg-indigo-500/10'} ${isBusy ? 'opacity-50 cursor-wait' : ''}`}>
                            {isBlocked ? 'Unblock' : 'Block'}
                          </button>
                          <button onClick={() => handleDelete(user)} disabled={!canAct || isBusy}
                            className={`px-2.5 py-1 rounded text-[11px] font-medium border border-rose-600/40 text-rose-400 hover:bg-rose-500/10 transition-all ${!canAct ? 'opacity-30 cursor-not-allowed' : ''} ${isBusy ? 'opacity-50 cursor-wait' : ''}`}>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {editUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
          <div className="bg-[#0f0f0f] border border-[#252525] rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-lg font-semibold">Edit User</h2>
                <p className="text-gray-500 text-xs mt-0.5">{editUser.email}</p>
              </div>
              <button onClick={() => setEditUser(null)} className="text-gray-600 hover:text-white w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#1a1a1a]">✕</button>
            </div>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              {[{ label: 'Username', name: 'username', type: 'text' }, { label: 'Email', name: 'email', type: 'email' }].map(f => (
                <div key={f.name}>
                  <label className="block text-xs text-gray-500 mb-1.5">{f.label}</label>
                  <input type={f.type} name={f.name} value={editForm[f.name]}
                    onChange={e => setEditForm(p => ({ ...p, [f.name]: e.target.value }))}
                    className="w-full rounded-lg border border-[#252525] bg-[#0a0a0a] px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500/50" required />
                </div>
              ))}
              <div>
                <label className="block text-xs text-gray-500 mb-1.5">Role</label>
                <select value={editForm.role} onChange={e => setEditForm(p => ({ ...p, role: e.target.value }))}
                  className="w-full rounded-lg border border-[#252525] bg-[#0a0a0a] px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500/50">
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <button type="button" onClick={() => setEditUser(null)}
                  className="px-4 py-2 rounded-lg border border-[#252525] text-sm text-gray-400 hover:bg-[#161616]">Cancel</button>
                <button type="submit" disabled={isSavingEdit}
                  className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-sm font-semibold text-white disabled:opacity-60">
                  {isSavingEdit ? 'Saving...' : 'Save changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminPage;
