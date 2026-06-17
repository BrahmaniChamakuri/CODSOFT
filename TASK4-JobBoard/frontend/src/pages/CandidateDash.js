import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function CandidateDash() {
  const [apps, setApps] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    axios.get('http://localhost:5000/api/applications/my')
      .then(r => setApps(r.data)).catch(() => {});
  }, []);

  return (
    <div className="wrap">
      <h1 style={{ fontSize:'1.5rem', fontWeight:800, marginBottom:4 }}>My Applications</h1>
      <p style={{ color:'var(--gray)', marginBottom:22 }}>Hi {user?.name}, track your job applications here</p>

      <div className="numgrid">
        <div className="numcard"><div className="n">{apps.length}</div><div className="l">Applied</div></div>
        <div className="numcard"><div className="n">{apps.filter(a => a.status==='reviewing').length}</div><div className="l">In Review</div></div>
        <div className="numcard"><div className="n">{apps.filter(a => a.status==='accepted').length}</div><div className="l">Accepted</div></div>
      </div>

      {apps.length === 0 ? (
        <div className="nodata">
          <div className="ic">📋</div>
          <h3>No applications yet</h3>
          <Link to="/jobs" className="btn btn-blue" style={{ marginTop:14 }}>Browse Jobs</Link>
        </div>
      ) : (
        <div className="tbox">
          <table className="tbl">
            <thead>
              <tr><th>Job Title</th><th>Company</th><th>Location</th><th>Applied On</th><th>Status</th></tr>
            </thead>
            <tbody>
              {apps.map(app => (
                <tr key={app._id}>
                  <td style={{ fontWeight:600 }}>{app.job?.title}</td>
                  <td>{app.job?.company}</td>
                  <td style={{ color:'var(--gray)' }}>{app.job?.location}</td>
                  <td style={{ color:'var(--gray)' }}>{new Date(app.appliedAt).toLocaleDateString()}</td>
                  <td><span className={'pill pill-' + app.status}>{app.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}