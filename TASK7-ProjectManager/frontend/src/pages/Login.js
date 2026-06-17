import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = async e => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const r = await axios.post('http://localhost:5003/api/auth/login', { email, password });
      login(r.data.user, r.data.token);
      navigate('/');
    } catch (err) { setError(err.response?.data?.message || 'Login failed'); }
    setLoading(false);
  };

  return (
    <div className="wrap">
      <div className="formwrap" style={{ maxWidth:420, margin:'0 auto' }}>
        <h2 style={{ fontSize:'1.3rem', fontWeight:800, marginBottom:5 }}>Welcome back 👋</h2>
        <p style={{ color:'var(--gray)', marginBottom:22 }}>Sign in to TaskFlow</p>
        {error && <div className="errmsg">{error}</div>}
        <form onSubmit={submit}>
          <div className="fld"><label>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" required /></div>
          <div className="fld"><label>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Your password" required /></div>
          <button type="submit" className="btn btn-purple btn-wide" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <p style={{ textAlign:'center', marginTop:16, fontSize:'.875rem', color:'var(--gray)' }}>
          No account? <Link to="/register">Sign up</Link>
        </p>
      </div>
    </div>
  );
}