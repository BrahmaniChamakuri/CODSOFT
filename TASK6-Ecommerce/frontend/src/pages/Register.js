import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [name, setName] = useState('');
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
      const r = await axios.post('http://localhost:5002/api/auth/register', { name, email, password });
      login(r.data.user, r.data.token);
      navigate('/');
    } catch (err) { setError(err.response?.data?.message || 'Registration failed'); }
    setLoading(false);
  };

  return (
    <div className="wrap">
      <div className="formwrap" style={{ maxWidth:440, margin:'0 auto' }}>
        <h2 style={{ fontSize:'1.3rem', fontWeight:800, marginBottom:5 }}>Create Account</h2>
        <p style={{ color:'var(--gray)', marginBottom:22 }}>Join ShopSphere for free</p>
        {error && <div className="errmsg">{error}</div>}
        <form onSubmit={submit}>
          <div className="fld"><label>Full Name</label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Your name" required /></div>
          <div className="fld"><label>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" required /></div>
          <div className="fld"><label>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Min 6 characters" minLength={6} required /></div>
          <button type="submit" className="btn btn-orange btn-wide" disabled={loading}>
            {loading ? 'Creating...' : 'Create Account'}
          </button>
        </form>
        <p style={{ textAlign:'center', marginTop:16, fontSize:'.875rem', color:'var(--gray)' }}>
          Already registered? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}