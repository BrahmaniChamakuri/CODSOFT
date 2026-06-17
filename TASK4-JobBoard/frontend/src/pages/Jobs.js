import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';

export default function Jobs() {
  const [jobs, setJobs]     = useState([]);
  const [search, setSearch] = useState('');
  const [type, setType]     = useState('');
  const [params]            = useSearchParams();

  const load = async (s, t) => {
    try {
      const r = await axios.get('http://localhost:5000/api/jobs', { params: { search:s, type:t } });
      setJobs(r.data);
    } catch {}
  };

  useEffect(() => {
    const q = params.get('search') || '';
    setSearch(q);
    load(q, '');
  }, []);

  return (
    <div className="wrap">
      <h1 style={{ fontSize:'1.5rem', fontWeight:800, marginBottom:4 }}>Browse Jobs</h1>
      <p style={{ color:'var(--gray)', marginBottom:18 }}>{jobs.length} jobs found</p>

      <div className="filterrow">
        <input
          className="fi"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search jobs..."
          onKeyDown={e => e.key === 'Enter' && load(search, type)}
        />
        <select className="fs" value={type}
          onChange={e => { setType(e.target.value); load(search, e.target.value); }}>
          <option value="">All Types</option>
          <option>Full-time</option>
          <option>Part-time</option>
          <option>Contract</option>
          <option>Internship</option>
          <option>Remote</option>
        </select>
        <button className="btn btn-blue" onClick={() => load(search, type)}>Search</button>
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
          <div className="ic">🔍</div>
          <h3>No jobs found</h3>
          <p>Try different keywords</p>
        </div>
      )}
    </div>
  );
}