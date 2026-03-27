import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import useAuthStore from '../store/useAuthStore';
import { AlertCircle } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5001/api/auth/login', { email, password });
      login(res.data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const autofillDemo = () => {
    setEmail('hire-me@anshumat.org');
    setPassword('HireMe@2025!');
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)] px-4">
      <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-sm border border-gray-200 w-full max-w-md">
        <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-8">Welcome Back</h2>
        
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-md flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="form-label" htmlFor="email">Email address</label>
            <input
              id="email"
              type="email"
              required
              className="form-input focus:ring-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
            />
          </div>
          <div>
            <label className="form-label" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              required
              className="form-input focus:ring-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary py-3.5 text-lg rounded-xl flex justify-center items-center font-bold"
          >
            {loading ? <span className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2" /> : null}
            {loading ? 'Authenticating...' : 'Sign in'}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-600">
          <p>Don't have an account? <Link to="/register" className="font-semibold text-primary hover:text-primary-hover">Create one</Link></p>
          
          <div className="mt-8 pt-6 border-t border-gray-100 text-left relative group">
            <button type="button" onClick={autofillDemo} className="absolute right-0 top-6 text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded hover:bg-blue-100">Autofill</button>
            <p className="font-semibold text-gray-800 mb-2">Demo Credentials:</p>
            <p className="text-xs font-mono bg-gray-50 p-2 border border-gray-100 rounded">Email: hire-me@anshumat.org</p>
            <p className="text-xs font-mono bg-gray-50 p-2 border border-gray-100 rounded mt-1">Pass: HireMe@2025!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
