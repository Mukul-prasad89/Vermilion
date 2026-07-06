import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { logout } from '../services/authService.js';

const Navbar = () => {
  const { user } = useAuth();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fullName = user?.user_metadata?.full_name;
  const initial = fullName ? fullName.charAt(0).toUpperCase() : (user?.email?.charAt(0)?.toUpperCase() || '?');

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-400 ${scrolled ? 'bg-bg-main/85 backdrop-blur-xl border-b border-line py-3' : 'py-5'}`}>
      <div className="max-w-[1400px] mx-auto px-6 lg:px-16 flex items-center justify-between">
        <a href="#" className="flex items-center gap-3 text-fg">
          <div className="w-7 h-7">
            <svg viewBox="0 0 32 32" fill="none">
              <path d="M16 4 C 10 12, 6 18, 6 22 C 6 27, 10 30, 16 30 C 22 30, 26 27, 26 22 C 26 18, 22 12, 16 4 Z" fill="url(#lg)"/>
              <circle cx="16" cy="22" r="3" fill="#FBFAF9" opacity="0.6"/>
              <defs>
                <linearGradient id="lg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#FF4D5A"/>
                  <stop offset="1" stopColor="#C1121F"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <span className="font-syne font-bold text-2xl tracking-wide">VERMILION</span>
        </a>
        <ul className="hidden md:flex gap-10 list-none">
          <li><a href="#network" className="text-fg-dim text-sm font-medium transition-colors hover:text-fg relative group">Network<span className="absolute left-0 -bottom-1 w-0 h-px bg-vermillion transition-all group-hover:w-full"></span></a></li>
          <li><a href="#how" className="text-fg-dim text-sm font-medium transition-colors hover:text-fg relative group">How it works<span className="absolute left-0 -bottom-1 w-0 h-px bg-vermillion transition-all group-hover:w-full"></span></a></li>
          <li><a href="#compat" className="text-fg-dim text-sm font-medium transition-colors hover:text-fg relative group">Compatibility<span className="absolute left-0 -bottom-1 w-0 h-px bg-vermillion transition-all group-hover:w-full"></span></a></li>
          <li><a href="#stories" className="text-fg-dim text-sm font-medium transition-colors hover:text-fg relative group">Stories<span className="absolute left-0 -bottom-1 w-0 h-px bg-vermillion transition-all group-hover:w-full"></span></a></li>
        </ul>
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="hidden sm:inline-flex items-center gap-2 text-sm text-fg-dim">
                <span className="w-7 h-7 rounded-full bg-vermillion text-white flex items-center justify-center text-xs font-bold">
                  {initial}
                </span>
                {fullName && <span className="font-medium">{fullName}</span>}
              </span>
              <button
                onClick={logout}
                className="inline-flex items-center gap-2 bg-transparent text-fg border border-line-strong px-4 py-2.5 text-sm font-medium transition-colors hover:border-vermillion hover:text-vermillion"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hidden sm:inline-flex bg-transparent text-fg border border-line-strong px-5 py-3 text-sm font-medium transition-colors hover:border-fg">Login</Link>
              <Link to="/signup" className="inline-flex items-center gap-2 bg-vermillion text-white px-4 py-2.5 text-sm font-semibold border border-vermillion transition-colors hover:bg-vermillion-bright hover:border-vermillion-bright shadow-sm shadow-vermillion/30">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
