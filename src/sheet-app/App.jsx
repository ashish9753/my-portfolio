import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './components/HomePage';
import TopicPage from './components/TopicPage';
import Login from './components/Login';
import Signup from './components/Signup';

function App() {
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
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  // If authenticated, redirect login/signup to home
  const PublicRoute = ({ children }) => {
    if (auth.isAuthenticated) {
      return <Navigate to="/" replace />;
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
        path="/:topic" 
        element={
          <ProtectedRoute>
            <TopicPage auth={auth} setAuth={setAuth} />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
}

export default App;
