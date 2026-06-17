import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);
  const { login } = useAuth();
  const navigate  = useNavigate();

  const submit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const r = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      login(r.data.user, r.data.token);
      if (r.data.user.role === 'employer') navigate('/employer-dashboard');
      else navigate('/candidate-dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
    setLoading(false);
  };

  return (
    <div className="wrap">
      <div className="formbox">
        <h2>Welcome back 👋</h2>
        <p className="sub">Sign in to JobNest</p>
        {error && <div className="errmsg">{error}</div>}
        <form onSubmit={submit}>
          <div className="fld">
            <label>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" required />
          </div>
          <div className="fld">
            <label>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Your password" required />
          </div>
          <button type="submit" className="btn btn-blue btn-wide" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <p style={{ textAlign:'center', marginTop:16, fontSize:'.875rem', color:'var(--gray)' }}>
          No account? <Link to="/register">Sign up free</Link>
        </p>
      </div>
    </div>
  );
}