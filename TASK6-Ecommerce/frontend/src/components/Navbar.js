import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();

  return (
    <nav className="topbar">
      <Link to="/" className="topbar-logo">Shop<span>Sphere</span></Link>
      <div className="topbar-links">
        <Link to="/">Home</Link>
        <Link to="/products">Products</Link>
        {user && <Link to="/orders">My Orders</Link>}
      </div>
      <div className="topbar-right">
        {!user ? (
          <>
            <Link to="/login"    className="btn btn-border btn-small">Login</Link>
            <Link to="/register" className="btn btn-orange btn-small">Sign Up</Link>
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
        <Link to="/cart" className="cartbtn">
          🛒 Cart
          {cartCount > 0 && <span className="cartbadge">{cartCount}</span>}
        </Link>
      </div>
    </nav>
  );
}