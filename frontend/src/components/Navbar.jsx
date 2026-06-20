import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { logoutUser } from '../redux/slices/authSlice';

const Navbar = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector(state => state.auth);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await dispatch(logoutUser());
    toast.success('Logged out successfully');
    navigate('/');
  };

  return (
    <nav className="bg-gradient-to-r from-slate-900 to-slate-800 shadow-lg sticky top-0 z-50 border-b border-slate-700">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition">
            <span className="text-2xl">🔗</span>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent hidden sm:inline">LinkHub</span>
          </Link>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="text-slate-300 hover:text-white font-medium transition"
                >
                  Dashboard
                </Link>
                <div className="flex items-center space-x-3 border-l border-slate-600 pl-4">
                  <span className="text-sm text-slate-300">
                    👤 {user?.username || 'User'}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-red-600/80 text-white rounded-lg hover:bg-red-700 transition font-medium text-sm"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-slate-300 hover:text-white font-medium transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-lg hover:shadow-lg transition font-medium"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
