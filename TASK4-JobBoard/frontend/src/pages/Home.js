import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Home() {
  const [jobs, setJobs]     = useState([]);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:5000/api/jobs')
      .then(r => setJobs(r.data.slice(0,5)))
      .catch(() => {});
  }, []);

  return (
    <div>
      <div className="banner">
        <h1>Find Your Dream Job 💼</h1>
        <p>Browse thousands of jobs from top companies</p>
        <div className="searchrow">
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search jobs or companies..."
            onKeyDown={e => e.key === 'Enter' && navigate('/jobs?search=' + search)}
          />
          <button className="btn btn-blue" onClick={() => navigate('/jobs?search=' + search)}>
            Search
          </button>
        </div>
        <div className="numbersrow">
          <div className="numbox"><strong>12K+</strong><span>Jobs</span></div>
          <div className="numbox"><strong>5K+</strong><span>Companies</span></div>
          <div className="numbox"><strong>50K+</strong><span>Candidates</span></div>
        </div>
      </div>

      <div className="wrap">
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
          <h2 style={{ fontSize:'1.3rem', fontWeight:800 }}>Latest Jobs</h2>
          <Link to="/jobs" className="btn btn-border btn-small">View All →</Link>
        </div>

        <div className="joblist">
          {jobs.map(j => (
            <Link to={'/jobs/'+j._id} key={j._id} style={{ textDecoration:'none' }}>
              <div className="jobrow">
                <div className="jobicon">🏢</div>
                <div className="jobinfo">
                  <div className="jobtitle">{j.title}</div>
                  <div className="jobco">{j.company} · {j.location}</div>
                  <div className="tagsrow">
                    <span className="chip type">{j.type}</span>
                    {j.skills?.slice(0,3).map(s => <span key={s} className="chip">{s}</span>)}
                  </div>
                </div>
                <div className="jobright">
                  <div className="jobsalary">{j.salary || 'Competitive'}</div>
                  <div className="jobdate">{new Date(j.createdAt).toLocaleDateString()}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {jobs.length === 0 && (
          <div className="nodata">
            <div className="ic">💼</div>
            <h3>No jobs posted yet</h3>
            <p>Register as employer and post the first job!</p>
          </div>
        )}
      </div>
    </div>
  );
}