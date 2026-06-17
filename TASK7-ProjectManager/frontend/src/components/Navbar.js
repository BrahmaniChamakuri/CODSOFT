import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="topbar">
      <Link to="/" className="topbar-logo">📋 TaskFlow</Link>
      <div className="topbar-right">
        {!user ? (
          <>
            <Link to="/login" className="btn btn-border btn-small">Login</Link>
            <Link to="/register" className="btn btn-purple btn-small">Sign Up</Link>
          </>
        ) : (
          <>
            <span style={{ fontSize:'.85rem', color:'var(--gray)' }}>Hi, {user.name}</span>
            <button className="btn btn-border btn-small"
              onClick={() => { logout(); navigate('/'); }}>
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}