import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signUp } from "../services/authService.js";

const SignUp = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [userType, setUserType] = useState('user');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [form, setForm] = useState({
    fullName: '',
    bloodType: '',
    city: '',
    institutionName: '',
    licenseNumber: '',
    email: '',
    password: '',
    termsAccepted: false,
  });

  const update = (field) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!form.termsAccepted) {
      setError('You must accept the Terms of Service to continue.');
      return;
    }

    if (!form.email || !form.password) {
      setError('Email and password are required.');
      return;
    }

    setLoading(true);

    try {
      const profile = userType === 'user'
        ? { full_name: form.fullName, blood_type: form.bloodType, city: form.city }
        : { institution_name: form.institutionName, license_number: form.licenseNumber };

      await signUp({ email: form.email, password: form.password, userType, ...profile });
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="h-screen flex bg-bg-main font-sans overflow-hidden">
      <div className="w-full lg:w-1/2 h-screen flex flex-col justify-center px-6 sm:px-12 lg:px-16 py-10">
        <div className="max-w-md w-full mx-auto">
          <Link to="/" className="flex items-center gap-3 text-fg mb-5">
            <div className="w-7 h-7">
              <svg viewBox="0 0 32 32" fill="none">
                <path d="M16 4 C 10 12, 6 18, 6 22 C 6 27, 10 30, 16 30 C 22 30, 26 27, 26 22 C 26 18, 22 12, 16 4 Z" fill="url(#lg3)"/>
                <defs>
                  <linearGradient id="lg3" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#FF4D5A"/>
                    <stop offset="1" stopColor="#C1121F"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <span className="font-syne font-bold text-2xl tracking-wide">VERMILION</span>
          </Link>

          <h2 className="font-display font-light text-4xl md:text-5xl leading-[1.1] tracking-tight text-fg mb-3">
            Join the <span className="bg-gradient-to-br from-vermillion-bright to-oxblood bg-clip-text text-transparent font-extrabold">network</span>.
          </h2>
          <p className="text-fg-dim mb-5 text-base">
            It takes 90 seconds to sign up. It could save a life today.
          </p>

          <div className="flex gap-2 mb-5 bg-bg-3 p-1.5 rounded-full border border-line">
            <button 
              onClick={() => setUserType('user')}
              className={`flex-1 py-2.5 text-sm font-medium rounded-full transition-all ${userType === 'user' ? 'bg-white text-vermillion shadow-sm' : 'text-fg-dim hover:text-fg'}`}
            >
              I am a User
            </button>
            <button 
              onClick={() => setUserType('hospital')}
              className={`flex-1 py-2.5 text-sm font-medium rounded-full transition-all ${userType === 'hospital' ? 'bg-white text-vermillion shadow-sm' : 'text-fg-dim hover:text-fg'}`}
            >
              Hospital / Blood Bank
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-4">
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            {userType === 'user' ? (
              <>
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-muted mb-2">Full Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Aarav Sharma" 
                    value={form.fullName}
                    onChange={update('fullName')}
                    className="w-full bg-white border border-line-strong rounded-lg px-4 py-3 text-fg placeholder-muted focus:outline-none focus:border-vermillion focus:ring-2 focus:ring-vermillion/10 transition-all"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium uppercase tracking-wider text-muted mb-2">Blood Type</label>
                    <select 
                      value={form.bloodType}
                      onChange={update('bloodType')}
                      className="w-full bg-white border border-line-strong rounded-lg px-4 py-3 text-fg focus:outline-none focus:border-vermillion focus:ring-2 focus:ring-vermillion/10 transition-all appearance-none cursor-pointer"
                    >
                      <option value="">Select</option>
                      <option value="O-">O−</option>
                      <option value="O+">O+</option>
                      <option value="A-">A−</option>
                      <option value="A+">A+</option>
                      <option value="B-">B−</option>
                      <option value="B+">B+</option>
                      <option value="AB-">AB−</option>
                      <option value="AB+">AB+</option>
                      <option value="unknown">I don't know</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium uppercase tracking-wider text-muted mb-2">City</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Bengaluru" 
                      value={form.city}
                      onChange={update('city')}
                      className="w-full bg-white border border-line-strong rounded-lg px-4 py-3 text-fg placeholder-muted focus:outline-none focus:border-vermillion focus:ring-2 focus:ring-vermillion/10 transition-all"
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-muted mb-2">Hospital / Institution Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Aster Medcity" 
                    value={form.institutionName}
                    onChange={update('institutionName')}
                    className="w-full bg-white border border-line-strong rounded-lg px-4 py-3 text-fg placeholder-muted focus:outline-none focus:border-vermillion focus:ring-2 focus:ring-vermillion/10 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-muted mb-2">License / Registration Number</label>
                  <input 
                    type="text" 
                    placeholder="Medical Authority ID" 
                    value={form.licenseNumber}
                    onChange={update('licenseNumber')}
                    className="w-full bg-white border border-line-strong rounded-lg px-4 py-3 text-fg placeholder-muted focus:outline-none focus:border-vermillion focus:ring-2 focus:ring-vermillion/10 transition-all"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-muted mb-2">Email Address</label>
              <input 
                type="email" 
                placeholder="you@example.com" 
                value={form.email}
                onChange={update('email')}
                className="w-full bg-white border border-line-strong rounded-lg px-4 py-3 text-fg placeholder-muted focus:outline-none focus:border-vermillion focus:ring-2 focus:ring-vermillion/10 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-muted mb-2">Password</label>
              <div className="relative">
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  placeholder="Create a secure password" 
                  value={form.password}
                  onChange={update('password')}
                  className="w-full bg-white border border-line-strong rounded-lg px-4 py-3 pr-12 text-fg placeholder-muted focus:outline-none focus:border-vermillion focus:ring-2 focus:ring-vermillion/10 transition-all"
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

            <div className="flex items-start gap-3 pt-1">
              <input type="checkbox" id="terms" checked={form.termsAccepted} onChange={update('termsAccepted')} className="mt-1.5 w-4 h-4 accent-vermillion cursor-pointer" />
              <label htmlFor="terms" className="text-sm text-fg-dim leading-relaxed">
                I agree to be available for emergency alerts and accept the <a href="#" className="text-vermillion hover:underline">Terms of Service</a>.
              </label>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-vermillion text-white font-medium py-2.5 rounded-lg border border-vermillion hover:bg-vermillion-bright hover:border-vermillion-bright transition-all shadow-lg shadow-vermillion/20 flex items-center justify-center gap-2 group mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating account...' : 'Create Account'}
              {!loading && <i className="fa-solid fa-arrow-right transition-transform group-hover:translate-x-1"></i>}
            </button>
          </form>

          <p className="text-center text-sm text-fg-dim mt-6 pb-4">
            Already part of the network? <Link to="/login" className="text-vermillion font-medium hover:underline">Log in</Link>
          </p>
        </div>
      </div>

      <div className="hidden lg:block w-1/2 relative bg-bg-3 overflow-hidden">
        <div className="absolute inset-0" style={{background: 'linear-gradient(135deg, rgba(230, 57, 70, 0.1), transparent 50%, rgba(244, 162, 97, 0.1))'}}></div>
        
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-vermillion-bright to-oxblood opacity-10 blur-3xl"></div>
        <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] rounded-full bg-amber opacity-10 blur-3xl"></div>
        
        <div className="relative h-full flex flex-col justify-center px-16 xl:px-24">
          
          <div className="inline-flex items-center gap-2.5 text-xs tracking-[0.2em] uppercase text-vermillion mb-8 py-1.5 px-3.5 border border-vermillion/30 rounded-full bg-white/50 backdrop-blur-sm w-fit">
            <span className="w-1.5 h-1.5 bg-vermillion rounded-full animate-pulse-dot" style={{boxShadow: '0 0 8px #E63946'}}></span>
            Impact in Real-Time
          </div>

          <h3 className="font-display font-light text-4xl xl:text-5xl leading-[1.1] tracking-tight text-fg mb-6">
            Your blood type is someone's <em className="italic font-medium text-vermillion">lifeline</em>.
          </h3>
          
          <p className="text-fg-dim leading-relaxed mb-12 max-w-md">
            Every 2 seconds, someone in this country needs blood. By joining Vermilion, you step directly into the chain of survival. No middlemen, no delays—just you, saving a life when minutes matter most.
          </p>

          <div className="grid grid-cols-2 gap-6 max-w-sm">
            <div className="bg-white/60 backdrop-blur-md border border-line rounded-xl p-5">
              <div className="font-display font-extrabold text-3xl text-vermillion tracking-tighter">84s</div>
              <div className="text-xs text-muted uppercase tracking-wider mt-1">Avg Alert Time</div>
            </div>
            <div className="bg-white/60 backdrop-blur-md border border-line rounded-xl p-5">
              <div className="font-display font-extrabold text-3xl text-vermillion tracking-tighter">2.3M</div>
              <div className="text-xs text-muted uppercase tracking-wider mt-1">Lives Touched</div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-line max-w-md">
            <p className="font-display italic font-light text-fg text-lg leading-snug">
              "I got the ping at 2:47am. By 3:15 I was at the hospital. Another 10 minutes and she wouldn't have made it. She's eight."
            </p>
            <span className="block text-xs text-muted uppercase tracking-wider mt-3">Karan Mehta · Donor · Mumbai</span>
          </div>

        </div>
      </div>
    </section>
  );
};

export default SignUp;