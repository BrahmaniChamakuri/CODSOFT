import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function JobDetail() {
  const { id }   = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [job,      setJob]      = useState(null);
  const [cover,    setCover]    = useState('');
  const [applied,  setApplied]  = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [msg,      setMsg]      = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/api/jobs/' + id)
      .then(r => setJob(r.data))
      .catch(() => navigate('/jobs'));
  }, [id]);

  const applyNow = async e => {
    e.preventDefault();
    if (!user) { navigate('/login'); return; }
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/applications', { job: id, coverLetter: cover });
      setApplied(true);
      setMsg('✅ Application submitted successfully!');
      setShowForm(false);
    } catch (err) {
      setMsg(err.response?.data?.message || 'Failed to apply');
    }
    setLoading(false);
  };

  if (!job) return <div className="wrap"><p>Loading...</p></div>;

  return (
    <div className="wrap">
      <div style={{ display:'grid', gridTemplateColumns:'1fr 280px', gap:22, alignItems:'start' }}>
        <div>
          <div style={{ background:'#fff', border:'1px solid var(--border)', borderRadius:'var(--rad)', padding:24, marginBottom:16 }}>
            <div style={{ display:'flex', gap:14, alignItems:'flex-start' }}>
              <div className="jobicon" style={{ width:56, height:56, fontSize:'1.8rem' }}>🏢</div>
              <div>
                <h1 style={{ fontSize:'1.3rem', fontWeight:800, marginBottom:4 }}>{job.title}</h1>
                <p style={{ color:'var(--gray)' }}>{job.company} · {job.location}</p>
              </div>
            </div>
            <div className="tagsrow" style={{ marginTop:14 }}>
              <span className="chip type">{job.type}</span>
              {job.salary && <span className="chip" style={{ background:'#dcfce7', color:'#059669' }}>💰 {job.salary}</span>}
              {job.skills?.map(s => <span key={s} className="chip">{s}</span>)}
            </div>
          </div>
          <div style={{ background:'#fff', border:'1px solid var(--border)', borderRadius:'var(--rad)', padding:24 }}>
            <h2 style={{ fontSize:'1rem', fontWeight:700, marginBottom:14 }}>Job Description</h2>
            <p style={{ color:'var(--gray)', lineHeight:1.8, whiteSpace:'pre-wrap' }}>{job.description}</p>
          </div>
        </div>

        <div style={{ background:'#fff', border:'1px solid var(--border)', borderRadius:'var(--rad)', padding:22, position:'sticky', top:80 }}>
          <h3 style={{ fontWeight:700, marginBottom:6 }}>{job.title}</h3>
          <p style={{ color:'var(--gray)', fontSize:'.875rem', marginBottom:18 }}>{job.company}</p>
          {msg && (
            <p style={{ padding:'10px', borderRadius:8, fontSize:'.875rem', marginBottom:14, background: applied ? '#dcfce7' : '#fee2e2', color: applied ? '#059669' : '#dc2626' }}>
              {msg}
            </p>
          )}
          {!applied && !showForm && (
            <button className="btn btn-blue btn-wide" onClick={() => {
              if (!user) navigate('/login');
              else if (user.role === 'candidate') setShowForm(true);
              else setMsg('Only candidates can apply');
            }}>
              {user ? 'Apply Now' : 'Login to Apply'}
            </button>
          )}
          {showForm && (
            <form onSubmit={applyNow}>
              <div className="fld">
                <label>Cover Letter (optional)</label>
                <textarea value={cover} onChange={e => setCover(e.target.value)} rows={4} placeholder="Why are you a great fit?"
                  style={{ width:'100%', border:'1.5px solid var(--border)', borderRadius:8, padding:'9px 12px', fontSize:'.875rem', fontFamily:'inherit', outline:'none', resize:'vertical' }} />
              </div>
              <button type="submit" className="btn btn-blue btn-wide" disabled={loading}>
                {loading ? 'Submitting...' : '🚀 Submit Application'}
              </button>
              <button type="button" className="btn btn-border btn-wide" style={{ marginTop:8 }} onClick={() => setShowForm(false)}>
                Cancel
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}