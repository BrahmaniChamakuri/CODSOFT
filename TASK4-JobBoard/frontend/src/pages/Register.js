import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [name,     setName]     = useState('');
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [role,     setRole]     = useState('candidate');
  const [company,  setCompany]  = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);
  const { login } = useAuth();
  const navigate  = useNavigate();

  const submit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const r = await axios.post('http://localhost:5000/api/auth/register', {
        name, email, password, role, company
      });
      login(r.data.user, r.data.token);
      if (r.data.user.role === 'employer') navigate('/employer-dashboard');
      else navigate('/candidate-dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
    setLoading(false);
  };

  return (
    <div className="wrap">
      <div className="formbox">
        <h2>Create Account</h2>
        <p className="sub">Join JobNest — it's free</p>
        {error && <div className="errmsg">{error}</div>}
        <form onSubmit={submit}>
          <div className="fld">
            <label>I am a</label>
            <select value={role} onChange={e => setRole(e.target.value)}>
              <option value="candidate">Job Seeker</option>
              <option value="employer">Employer</option>
            </select>
          </div>
          <div className="fldrow">
            <div className="fld">
              <label>Full Name</label>
              <input value={name} onChange={e => setName(e.target.value)} placeholder="Your name" required />
            </div>
            <div className="fld">
              <label>Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" required />
            </div>
          </div>
          {role === 'employer' && (
            <div className="fld">
              <label>Company Name</label>
              <input value={company} onChange={e => setCompany(e.target.value)} placeholder="Your company" required />
            </div>
          )}
          <div className="fld">
            <label>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Min 6 characters" minLength={6} required />
          </div>
          <button type="submit" className="btn btn-blue btn-wide" disabled={loading}>
            {loading ? 'Creating...' : 'Create Account'}
          </button>
        </form>
        <p style={{ textAlign:'center', marginTop:16, fontSize:'.875rem', color:'var(--gray)' }}>
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}