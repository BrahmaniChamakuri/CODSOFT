import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="topbar">
      <Link to="/" className="topbar-logo">Job<span>Nest</span></Link>

      <div className="topbar-links">
        <Link to="/jobs">Browse Jobs</Link>
        {user?.role === 'employer'  && <Link to="/employer-dashboard">My Dashboard</Link>}
        {user?.role === 'candidate' && <Link to="/candidate-dashboard">My Applications</Link>}
      </div>

      <div className="topbar-right">
        {!user ? (
          <>
            <Link to="/login"    className="btn btn-border btn-small">Login</Link>
            <Link to="/register" className="btn btn-blue  btn-small">Sign Up</Link>
          </>
        ) : (
          <>
            <span style={{ fontSize:'.85rem', color:'var(--gray)' }}>Hi, {user.name}</span>
            {user.role === 'employer' && (
              <Link to="/postjob" className="btn btn-blue btn-small">+ Post Job</Link>
            )}
            <button
              className="btn btn-border btn-small"
              onClick={() => { logout(); navigate('/'); }}>
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}