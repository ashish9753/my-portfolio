import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function Login({ setAuth }) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('https://dsa-sheet-backend-7r7i.onrender.com/api/auth/login', formData);

      // Store token and user info
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      // Update auth state
      setAuth({
        isAuthenticated: true,
        user: response.data.user,
        token: response.data.token
      });

      // Redirect to home
      navigate('/sheet');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center auth-bg px-4 py-10 pt-20">
      <div className="absolute top-4 w-full px-6 flex justify-between items-center z-50">
        <Link 
          to="/sheet" 
          className="group flex flex-1 sm:flex-none justify-center items-center gap-2 px-5 py-2.5 bg-slate-900/60 hover:bg-rose-600 border border-slate-700 hover:border-rose-500 rounded-full text-slate-300 hover:text-white transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg hover:shadow-[0_0_20px_rgba(225,29,72,0.5)] backdrop-blur-md font-semibold text-sm mr-2"
        >
          <svg className="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          <span className="hidden sm:inline">Cancel to </span>Login
        </Link>
        <a 
          href="https://ashishdev.com" 
          className="group flex flex-1 sm:flex-none justify-center items-center gap-2 px-5 py-2.5 bg-slate-900/60 hover:bg-emerald-600 border border-slate-700 hover:border-emerald-500 rounded-full text-slate-300 hover:text-white transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg hover:shadow-[0_0_20px_rgba(16,185,129,0.5)] backdrop-blur-md font-semibold text-sm ml-2"
        >
          <span className="hidden sm:inline">Home page </span>
          <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
        </a>
      </div>

      <div className="max-w-5xl w-full auth-card auth-card-float auth-page-swap grid md:grid-cols-2 overflow-hidden">
        {/* Visual / left panel */}
        <div className="auth-visual-panel hidden md:block">
          <div className="auth-glow-pill auth-glow-pill-1" />
          <div className="auth-glow-pill auth-glow-pill-2" />
            <div className="auth-visual-panel-inner h-full flex flex-col justify-between p-8">
              <div className="flex items-center justify-start text-slate-200 text-xs uppercase tracking-[0.25em]">
                <span className="font-semibold text-slate-100">DSA SHEET</span>
              </div>
            <div className="mt-10 space-y-4 text-slate-100">
              <h2 className="text-3xl font-semibold leading-snug">
                Master DSA,
                <br />
                Level up every day.
              </h2>
              <p className="text-sm text-slate-300/80 max-w-xs">
                Track progress across curated sheets and interview-focused problem sets in a single dashboard.
              </p>
            </div>
            <div className="mt-8 flex items-center justify-between text-[11px] text-slate-300/80">
              <div className="flex items-center gap-3">
                <div className="h-1 w-7 rounded-full bg-[#9333ea]" />
                <div className="h-1 w-3 rounded-full bg-slate-500" />
                <div className="h-1 w-2 rounded-full bg-slate-600" />
              </div>
              <div className="flex items-center gap-2 text-slate-100/90">
                <img
                  src="/profilePhoto.jpg"
                  alt="Ashish Sharma"
                  className="w-7 h-7 rounded-full border border-white/20 object-cover shadow-sm bg-slate-900"
                />
                <span>
                  Created by <span className="font-semibold">Ashish Sharma</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Form / right panel */}
        <div className="relative flex items-center justify-center bg-slate-950/60 md:bg-slate-950/40 px-6 py-8 md:px-10 md:py-12 auth-slide-in-right">
          <div className="w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-semibold text-slate-50">Welcome back</h1>
                <p className="mt-1 text-sm text-slate-400">
                  New here?{' '}
              <Link
                to="/sheet/signup"
                className="text-[#a855f7] hover:text-[#c084fc] font-medium transition-colors auth-link-cta"
              >
                Create an account
              </Link>
                </p>
              </div>
                <Link
                  to="/sheet/signup"
                  className="hidden md:inline-flex auth-pill-cta text-[10px] md:text-[11px]"
                >
                  Create account
                </Link>
            </div>

            {error && (
              <div className="mb-4 rounded-md border border-rose-500/80 bg-rose-500/10 px-3 py-2 text-sm text-rose-300">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-300">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-slate-700/80 bg-slate-900/60 px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:border-[#9333ea] focus:outline-none focus:ring-2 focus:ring-[#9333ea]/40"
                  placeholder="Enter your email"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-300">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                  className="w-full rounded-lg border border-slate-700/80 bg-slate-900/60 px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:border-[#9333ea] focus:outline-none focus:ring-2 focus:ring-[#9333ea]/40"
                  placeholder="Enter your password"
                />
              </div>
							
              <button
                type="submit"
                disabled={loading}
                className="mt-2 w-full rounded-lg bg-[#3730a3] py-3 text-sm font-semibold text-white shadow-lg shadow-[rgba(55,48,163,0.65)] auth-primary-btn hover:bg-[#4f46e5] disabled:cursor-not-allowed disabled:bg-slate-700 disabled:shadow-none"
              >
                {loading ? 'Logging in…' : 'Login to dashboard'}
              </button>
            </form>
            <p className="mt-6 text-xs text-slate-500 text-center">
              By logging in you agree to the{' '}
              <span className="text-slate-300">Terms</span> and{' '}
              <span className="text-slate-300">Privacy Policy</span>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
