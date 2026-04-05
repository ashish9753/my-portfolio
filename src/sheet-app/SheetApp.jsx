import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './components/HomePage';
import SortingSheet from './pages/SortingSheet';
import ArraySheet from './pages/ArraySheet';
import BinarySearchSheet from './pages/BinarySearchSheet';
import StringSheet from './pages/StringSheet';
import LinkedListSheet from './pages/LinkedListSheet';
import DPSheet from './pages/DPSheet';
import RecursionSheet from './pages/RecursionSheet';
import BitManipulationSheet from './pages/BitManipulationSheet';
import StackAndQueuesSheet from './pages/StackAndQueuesSheet';
import SlidingWindowSheet from './pages/SlidingWindowSheet';
import BinaryTreesSheet from './pages/BinaryTreesSheet';
import BinarySearchTreesSheet from './pages/BinarySearchTreesSheet';
import HeapsSheet from './pages/HeapsSheet';
import GreedySheet from './pages/GreedySheet';
import GraphsSheet from './pages/GraphsSheet';
import SystemDesignSheet from '../Core-Concept-CS/SystemDesignSheet';
import CNSheet from '../Core-Concept-CS/CNSheet';
import OSSheet from '../Core-Concept-CS/OSSheet';
import DBMSSheet from '../Core-Concept-CS/DBMSSheet';
import DevOpsSheet from '../Core-Concept-CS/DevOpsSheet';
import OOPSSheet from '../Core-Concept-CS/OOPSSheet';
import SoftwareEngineeringSheet from '../Core-Concept-CS/SoftwareEngineeringSheet';
import HTMLSheet from '../MERN-Interview-Prep/HTMLSheet';
import CSSSheet from '../MERN-Interview-Prep/CSSSheet';
import JSSheet from '../MERN-Interview-Prep/JSSheet';
import MongoDBSheet from '../MERN-Interview-Prep/MongoDBSheet';
import ReactSheet from '../MERN-Interview-Prep/ReactSheet';
import NodeJSSheet from '../MERN-Interview-Prep/NodeJSSheet';
import MySQLSheet from '../MERN-Interview-Prep/MySQLSheet';
import PostgreSQLSheet from '../MERN-Interview-Prep/PostgreSQLSheet';
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
    <>
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
          <HomePage auth={auth} setAuth={setAuth} />
        } 
      />
      <Route 
        path="/Sorting" 
        element={
          <ProtectedRoute>
            <SortingSheet auth={auth} setAuth={setAuth} />
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
      <Route 
        path="/String" 
        element={
          <ProtectedRoute>
            <StringSheet auth={auth} setAuth={setAuth} />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/LinkedList" 
        element={
          <ProtectedRoute>
            <LinkedListSheet auth={auth} setAuth={setAuth} />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/BitManipulation" 
        element={
          <ProtectedRoute>
            <BitManipulationSheet auth={auth} setAuth={setAuth} />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/StackAndQueues" 
        element={
          <ProtectedRoute>
            <StackAndQueuesSheet auth={auth} setAuth={setAuth} />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/SlidingWindow" 
        element={
          <ProtectedRoute>
            <SlidingWindowSheet auth={auth} setAuth={setAuth} />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/BinaryTrees" 
        element={
          <ProtectedRoute>
            <BinaryTreesSheet auth={auth} setAuth={setAuth} />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/BinarySearchTrees" 
        element={
          <ProtectedRoute>
            <BinarySearchTreesSheet auth={auth} setAuth={setAuth} />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/Heaps" 
        element={
          <ProtectedRoute>
            <HeapsSheet auth={auth} setAuth={setAuth} />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/Greedy" 
        element={
          <ProtectedRoute>
            <GreedySheet auth={auth} setAuth={setAuth} />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/Graphs" 
        element={
          <ProtectedRoute>
            <GraphsSheet auth={auth} setAuth={setAuth} />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/DP" 
        element={
          <ProtectedRoute>
            <DPSheet auth={auth} setAuth={setAuth} />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/Recursion" 
        element={
          <ProtectedRoute>
            <RecursionSheet auth={auth} setAuth={setAuth} />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/System Design" 
        element={
          <ProtectedRoute>
            <SystemDesignSheet auth={auth} setAuth={setAuth} />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/Computer Networks" 
        element={
          <ProtectedRoute>
            <CNSheet auth={auth} setAuth={setAuth} />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/Operating System" 
        element={
          <ProtectedRoute>
            <OSSheet auth={auth} setAuth={setAuth} />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/DBMS" 
        element={
          <ProtectedRoute>
            <DBMSSheet auth={auth} setAuth={setAuth} />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/DevOps" 
        element={
          <ProtectedRoute>
            <DevOpsSheet auth={auth} setAuth={setAuth} />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/OOPS" 
        element={
          <ProtectedRoute>
            <OOPSSheet auth={auth} setAuth={setAuth} />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/Software Engineering" 
        element={
          <ProtectedRoute>
            <SoftwareEngineeringSheet auth={auth} setAuth={setAuth} />
          </ProtectedRoute>
        } 
      />
      <Route path="/HTML" element={<ProtectedRoute><HTMLSheet auth={auth} setAuth={setAuth} /></ProtectedRoute>} />
      <Route path="/CSS" element={<ProtectedRoute><CSSSheet auth={auth} setAuth={setAuth} /></ProtectedRoute>} />
      <Route path="/JavaScript" element={<ProtectedRoute><JSSheet auth={auth} setAuth={setAuth} /></ProtectedRoute>} />
      <Route path="/MongoDB" element={<ProtectedRoute><MongoDBSheet auth={auth} setAuth={setAuth} /></ProtectedRoute>} />
      <Route path="/React" element={<ProtectedRoute><ReactSheet auth={auth} setAuth={setAuth} /></ProtectedRoute>} />
      <Route path="/NodeJS" element={<ProtectedRoute><NodeJSSheet auth={auth} setAuth={setAuth} /></ProtectedRoute>} />
      <Route path="/MySQL" element={<ProtectedRoute><MySQLSheet auth={auth} setAuth={setAuth} /></ProtectedRoute>} />
      <Route path="/PostgreSQL" element={<ProtectedRoute><PostgreSQLSheet auth={auth} setAuth={setAuth} /></ProtectedRoute>} />
    </Routes>

    {/* Floating Support Logo */}
    <a
      href="/#contact"
      className="fixed bottom-6 right-6 z-50 animate-bounce hover:animate-none hover:scale-110 transition-transform duration-300 group cursor-pointer"
      title="Contact Support"
    >
      <div className="absolute inset-0 bg-blue-500 rounded-full blur-xl opacity-0 group-hover:opacity-60 transition-opacity duration-300"></div>
      <img
        src="/Support_Logo.png"
        alt="Support Contact" 
        className="relative w-14 h-14 sm:w-16 sm:h-16 object-contain drop-shadow-[0_0_10px_rgba(0,191,255,0.7)]"
      />
    </a>
    </>
  );
}

export default SheetApp;
