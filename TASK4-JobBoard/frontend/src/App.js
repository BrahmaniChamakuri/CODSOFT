import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Jobs from './pages/Jobs';
import JobDetail from './pages/JobDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import PostJob from './pages/PostJob';
import EmployerDash from './pages/EmployerDash';
import CandidateDash from './pages/CandidateDash';
import './App.css';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/"                   element={<Home />} />
          <Route path="/jobs"               element={<Jobs />} />
          <Route path="/jobs/:id"           element={<JobDetail />} />
          <Route path="/login"              element={<Login />} />
          <Route path="/register"           element={<Register />} />
          <Route path="/postjob"            element={<PostJob />} />
          <Route path="/employer-dashboard" element={<EmployerDash />} />
          <Route path="/candidate-dashboard"element={<CandidateDash />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}