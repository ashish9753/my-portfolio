import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function Signup({ setAuth }) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
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

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Validate username length
    if (formData.username.length < 3) {
      setError('Username must be at least 3 characters');
      return;
    }

    // Validate password length
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('https://dsa-sheet-backend-7r7i.onrender.com/api/auth/signup', {
        username: formData.username,
        email: formData.email,
        password: formData.password
      });

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
      setError(err.response?.data?.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center auth-bg px-4 py-10">
      <div className="max-w-5xl w-full auth-card auth-card-float auth-page-swap grid md:grid-cols-2 overflow-hidden">
        {/* Visual panel - on the right for signup to create swap effect */}
        <div className="auth-visual-panel hidden md:block order-2 md:order-2">
          <div className="auth-glow-pill auth-glow-pill-1" />
          <div className="auth-glow-pill auth-glow-pill-2" />
            <div className="auth-visual-panel-inner h-full flex flex-col justify-between p-8 items-end text-right">
              <div className="flex items-center justify-end w-full text-slate-200 text-xs uppercase tracking-[0.25em]">
                <span className="font-semibold text-slate-100">DSA SHEET</span>
              </div>
            <div className="mt-10 space-y-4 text-slate-100">
              <h2 className="text-3xl font-semibold leading-snug">
                Create your account,
                <br />
                track every milestone.
              </h2>
              <p className="text-sm text-slate-300/80 max-w-xs ml-auto">
                Personalised progress, topic-wise streaks and sheets crafted for coding interviews.
              </p>
            </div>
            <div className="mt-8 flex items-center justify-between text-[11px] text-slate-300/80 w-full">
              <div className="flex items-center gap-3">
                <div className="h-1 w-3 rounded-full bg-slate-500" />
                <div className="h-1 w-7 rounded-full bg-[#9333ea]" />
                <div className="h-1 w-2 rounded-full bg-slate-600" />
              </div>
              <div className="flex items-center gap-2 text-slate-100/90">
                <span className="hidden md:inline">Created by</span>
                <span className="font-semibold">Ashish Sharma</span>
                <img
                  src="/profilePhoto.jpg"
                  alt="Ashish Sharma"
                  className="w-7 h-7 rounded-full border border-white/20 object-cover shadow-sm bg-slate-900"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Form panel - on the left for signup */}
        <div className="relative flex items-center justify-center bg-slate-950/60 md:bg-slate-950/40 px-6 py-8 md:px-10 md:py-12 auth-slide-in-left order-1 md:order-1">
          <div className="w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-semibold text-slate-50">Create an account</h1>
                <p className="mt-1 text-sm text-slate-400">
                  Already have an account?{' '}
              <Link
                to="/sheet/login"
                className="text-[#a855f7] hover:text-[#c084fc] font-medium transition-colors auth-link-cta"
              >
                Log in
              </Link>
                </p>
              </div>
                <Link
                  to="/sheet/login"
                  className="hidden md:inline-flex auth-pill-cta text-[10px] md:text-[11px]"
                >
                  Login
                </Link>
            </div>

            {error && (
              <div className="mb-4 rounded-md border border-rose-500/80 bg-rose-500/10 px-3 py-2 text-sm text-rose-300">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-300">Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  minLength={3}
                  className="w-full rounded-lg border border-slate-700/80 bg-slate-900/60 px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:border-[#9333ea] focus:outline-none focus:ring-2 focus:ring-[#9333ea]/40"
                  placeholder="Choose a unique username"
                />
                <p className="mt-1 text-xs text-slate-500">Minimum 3 characters, must be unique.</p>
              </div>

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
                  placeholder="Create a password"
                />
                <p className="mt-1 text-xs text-slate-500">Minimum 6 characters.</p>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-300">Confirm password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  minLength={6}
                  className="w-full rounded-lg border border-slate-700/80 bg-slate-900/60 px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                  placeholder="Confirm your password"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-1 w-full rounded-lg bg-[#3730a3] py-3 text-sm font-semibold text-white shadow-lg shadow-[rgba(55,48,163,0.65)] auth-primary-btn hover:bg-[#4f46e5] disabled:cursor-not-allowed disabled:bg-slate-700 disabled:shadow-none"
              >
                {loading ? 'Creating account…' : 'Create account'}
              </button>
            </form>
            <p className="mt-6 text-xs text-slate-500 text-center">
              By creating an account you agree to the{' '}
              <span className="text-slate-300">Terms</span> and{' '}
              <span className="text-slate-300">Privacy Policy</span>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
