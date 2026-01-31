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
      const response = await axios.post('https://dsa-sheet-backend-roan.vercel.app/api/auth/login', formData);
      
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
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0a0a0a' }}>
      <div className="w-full max-w-md p-8 rounded-lg" style={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}>
        <h2 className="text-3xl font-bold text-center mb-8 text-white">Login to DSA Sheet</h2>
        
        {error && (
          <div className="mb-4 p-3 rounded" style={{ backgroundColor: '#ff375f22', border: '1px solid #ff375f', color: '#ff375f' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{ backgroundColor: '#2a2a2a', color: '#fff', border: '1px solid #444' }}
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
              className="w-full px-4 py-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{ backgroundColor: '#2a2a2a', color: '#fff', border: '1px solid #444' }}
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded font-semibold transition-colors"
            style={{ 
              backgroundColor: loading ? '#444' : '#3b82f6',
              color: '#fff',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-400">
          Don't have an account?{' '}
          <Link to="/sheet/signup" className="text-blue-500 hover:underline font-medium">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
