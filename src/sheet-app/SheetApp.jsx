import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './components/HomePage';
import ArraySheet from './pages/ArraySheet';
import BinarySearchSheet from './pages/BinarySearchSheet';
import Login from './components/Login';
import Signup from './components/Signup';
import './App.css';
import './index.css';

function SheetApp() {
  const [auth, setAuth] = useState({
    isAuthenticated: false,
    user: null,
    token: null
  });

  // Check for existing auth on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
      setAuth({
        isAuthenticated: true,
        user: JSON.parse(user),
        token: token
      });
    }
  }, []);

  // Protected Route Component
  const ProtectedRoute = ({ children }) => {
    if (!auth.isAuthenticated) {
      return <Navigate to="/sheet/login" replace />;
    }
    return children;
  };

  // If authenticated, redirect login/signup to home
  const PublicRoute = ({ children }) => {
    if (auth.isAuthenticated) {
      return <Navigate to="/sheet" replace />;
    }
    return children;
  };

  return (
    <Routes>
      <Route 
        path="/login" 
        element={
          <PublicRoute>
            <Login setAuth={setAuth} />
          </PublicRoute>
        } 
      />
      <Route 
        path="/signup" 
        element={
          <PublicRoute>
            <Signup setAuth={setAuth} />
          </PublicRoute>
        } 
      />
      <Route 
        path="/" 
        element={
          <ProtectedRoute>
            <HomePage auth={auth} setAuth={setAuth} />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/Array" 
        element={
          <ProtectedRoute>
            <ArraySheet auth={auth} setAuth={setAuth} />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/Binary Search" 
        element={
          <ProtectedRoute>
            <BinarySearchSheet auth={auth} setAuth={setAuth} />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
}

export default SheetApp;
