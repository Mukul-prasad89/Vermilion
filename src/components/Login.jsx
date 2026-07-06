import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from "../services/authService.js";

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Email and password are required.');
      return;
    }

    setLoading(true);

    try {
      await login({ email, password });
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'radial-gradient(circle at center, rgba(193, 18, 31, 0.15), rgba(10, 6, 8, 0.6))', backdropFilter: 'blur(12px)' }}
    >
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 border border-line">
        
        <button 
          onClick={() => navigate(-1)}
          className="absolute top-5 right-5 text-muted hover:text-vermillion transition-colors"
        >
          <i className="fa-solid fa-xmark text-xl"></i>
        </button>

        <div className="flex items-center gap-3 text-fg mb-8 justify-center">
          <div className="w-8 h-8">
            <svg viewBox="0 0 32 32" fill="none">
              <path d="M16 4 C 10 12, 6 18, 6 22 C 6 27, 10 30, 16 30 C 22 30, 26 27, 26 22 C 26 18, 22 12, 16 4 Z" fill="url(#lg4)"/>
              <defs>
                <linearGradient id="lg4" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#FF4D5A"/>
                  <stop offset="1" stopColor="#C1121F"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <span className="font-syne font-bold text-2xl tracking-wide">VERMILION</span>
        </div>

        <h2 className="font-display font-light text-3xl tracking-tight text-fg mb-2 text-center">
          Welcome back.
        </h2>
        <p className="text-fg-dim mb-8 text-sm text-center">
          Log in to check emergency alerts and manage your profile.
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-4">
            {error}
          </div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-muted mb-2">Email Address</label>
            <input 
              type="email" 
              placeholder="you@example.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-bg-main border border-line-strong rounded-lg px-4 py-3 text-fg placeholder-muted focus:outline-none focus:border-vermillion focus:ring-2 focus:ring-vermillion/10 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-muted mb-2">Password</label>
            <div className="relative">
              <input 
                type={showPassword ? 'text' : 'password'} 
                placeholder="Enter your password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-bg-main border border-line-strong rounded-lg px-4 py-3 pr-12 text-fg placeholder-muted focus:outline-none focus:border-vermillion focus:ring-2 focus:ring-vermillion/10 transition-all"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-vermillion transition-colors"
              >
                <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
              </button>
            </div>
          </div>
          
          <div className="flex items-center justify-end">
            <a href="#" className="text-xs text-vermillion hover:underline">Forgot password?</a>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-vermillion text-white font-medium py-3 rounded-lg border border-vermillion hover:bg-vermillion-bright hover:border-vermillion-bright transition-all shadow-lg shadow-vermillion/20 flex items-center justify-center gap-2 group disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Logging in...' : 'Log In'}
            {!loading && <i className="fa-solid fa-arrow-right transition-transform group-hover:translate-x-1"></i>}
          </button>
        </form>

        <p className="text-center text-sm text-fg-dim mt-6">
          New here? <Link to="/signup" className="text-vermillion font-medium hover:underline">Create an account</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;