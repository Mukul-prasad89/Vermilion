import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import Marquee from './components/Marquee.jsx';
import Problem from './components/Problem.jsx';
import HowItWorks from './components/HowItWorks.jsx';
import Compatibility from './components/Compatibility.jsx';
import DonorNetwork from './components/DonorNetwork.jsx';
import Timeline from './components/Timeline.jsx';
import Stories from './components/Stories.jsx';
import FinalCTA from './components/FinalCTA.jsx';
import Footer from './components/Footer.jsx';
import RevealWrapper from './components/RevealWrapper.jsx';
import SignUp from './components/SignUp.jsx';
import Login from './components/Login.jsx';

import { AuthProvider } from "./context/AuthContext.jsx";

const useMagneticButtons = () => {
  useEffect(() => {
    const buttons = document.querySelectorAll('.btn-magnetic');
    const handlers = [];
    buttons.forEach(btn => {
      const handleMove = (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.15}px, ${y * 0.2}px)`;
      };
      const handleLeave = () => { btn.style.transform = ''; };
      btn.addEventListener('mousemove', handleMove);
      btn.addEventListener('mouseleave', handleLeave);
      handlers.push({ btn, handleMove, handleLeave });
    });
    return () => {
      handlers.forEach(({ btn, handleMove, handleLeave }) => {
        btn.removeEventListener('mousemove', handleMove);
        btn.removeEventListener('mouseleave', handleLeave);
      });
    };
  });
};

const LandingPage = () => {
  useMagneticButtons();
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Marquee />
        <RevealWrapper><Problem /></RevealWrapper>
        <RevealWrapper><HowItWorks /></RevealWrapper>
        <RevealWrapper><Compatibility /></RevealWrapper>
        <RevealWrapper><DonorNetwork /></RevealWrapper>
        <RevealWrapper><Timeline /></RevealWrapper>
        <RevealWrapper><Stories /></RevealWrapper>
        <RevealWrapper><FinalCTA /></RevealWrapper>
      </main>
      <Footer />
    </>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </AuthProvider>
  );
};

export default App;