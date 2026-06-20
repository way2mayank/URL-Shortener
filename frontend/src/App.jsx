import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { fetchCurrentUser } from './redux/slices/authSlice';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';

const ProtectedRoute = ({ element }) => {
  const { isAuthenticated, loading } = useSelector(state => state.auth);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return isAuthenticated ? element : <Navigate to="/login" />;
};

const PublicRoute = ({ element }) => {
  const { isAuthenticated, loading } = useSelector(state => state.auth);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return !isAuthenticated ? element : <Navigate to="/dashboard" />;
};

function AppRoutes() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<PublicRoute element={<Login />} />} />
        <Route path="/register" element={<PublicRoute element={<Register />} />} />
        <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
      </Routes>
      <ToastContainer position="bottom-right" autoClose={3000} />
    </>
  );
}

function App() {
  const dispatch = useDispatch();

  // Check if user is already authenticated on app load
  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
