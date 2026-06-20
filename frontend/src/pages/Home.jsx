import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import UrlForm from '../components/UrlForm';

const Home = () => {
  const { isAuthenticated } = useSelector(state => state.auth);
  const navigate = useNavigate();

  const handleSuccess = (data) => {
    if (isAuthenticated) {
      window.location.href = '/dashboard';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-20">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <div className="mb-6 inline-block">
            <span className="text-6xl">🔗</span>
          </div>
          <h1 className="text-6xl md:text-7xl font-black text-white mb-4 tracking-tight">
            Make Links
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">Shorter</span>
          </h1>
          <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            Create short, memorable URLs instantly. Track clicks, generate QR codes, and manage everything in one beautiful dashboard.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            {!isAuthenticated && (
              <>
                <button
                  onClick={() => navigate('/register')}
                  className="px-8 py-3 bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-blue-500/50 transition transform hover:scale-105"
                >
                  🚀 Get Started
                </button>
                <button
                  onClick={() => navigate('/login')}
                  className="px-8 py-3 border-2 border-slate-400 text-slate-300 font-bold rounded-xl hover:bg-slate-700 transition"
                >
                  Sign In
                </button>
              </>
            )}
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          <div className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-2xl p-8 border border-slate-600 hover:border-blue-400 transition">
            <div className="text-5xl mb-4">⚡</div>
            <h3 className="text-xl font-bold text-white mb-2">Lightning Fast</h3>
            <p className="text-slate-300">Instantly create short links in milliseconds</p>
          </div>

          <div className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-2xl p-8 border border-slate-600 hover:border-cyan-400 transition">
            <div className="text-5xl mb-4">📊</div>
            <h3 className="text-xl font-bold text-white mb-2">Real Analytics</h3>
            <p className="text-slate-300">Track clicks and see who's visiting</p>
          </div>

          <div className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-2xl p-8 border border-slate-600 hover:border-purple-400 transition">
            <div className="text-5xl mb-4">🎨</div>
            <h3 className="text-xl font-bold text-white mb-2">Custom URLs</h3>
            <p className="text-slate-300">Create memorable short links you control</p>
          </div>
        </div>

        {/* Form Section */}
        {isAuthenticated && (
          <div className="max-w-2xl mx-auto mb-20">
            <UrlForm onSuccess={handleSuccess} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
