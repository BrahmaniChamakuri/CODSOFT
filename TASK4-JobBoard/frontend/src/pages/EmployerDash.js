import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function EmployerDash() {
  const [jobs,   setJobs]   = useState([]);
  const [apps,   setApps]   = useState({});
  const [openId, setOpenId] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    axios.get('http://localhost:5000/api/jobs/employer/myjobs')
      .then(r => setJobs(r.data)).catch(() => {});
  }, []);

  const viewApps = async id => {
    if (openId === id) { setOpenId(null); return; }
    setOpenId(id);
    if (!apps[id]) {
      try {
        const r = await axios.get('http://localhost:5000/api/applications/job/' + id);
        setApps(prev => ({ ...prev, [id]: r.data }));
      } catch {}
    }
  };

  const changeStatus = async (appId, status, jobId) => {
    await axios.patch('http://localhost:5000/api/applications/' + appId, { status });
    setApps(prev => ({
      ...prev,
      [jobId]: prev[jobId].map(a => a._id === appId ? { ...a, status } : a)
    }));
  };

  const removeJob = async id => {
    if (!window.confirm('Delete this job?')) return;
    await axios.delete('http://localhost:5000/api/jobs/' + id);
    setJobs(jobs.filter(j => j._id !== id));
  };

  return (
    <div className="wrap">
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:22 }}>
        <div>
          <h1 style={{ fontSize:'1.5rem', fontWeight:800 }}>Employer Dashboard</h1>
          <p style={{ color:'var(--gray)' }}>Welcome, {user?.name}</p>
        </div>
        <Link to="/postjob" className="btn btn-blue">+ Post Job</Link>
      </div>

      <div className="numgrid">
        <div className="numcard"><div className="n">{jobs.length}</div><div className="l">Jobs Posted</div></div>
        <div className="numcard"><div className="n">{jobs.filter(j => j.status === 'active').length}</div><div className="l">Active</div></div>
        <div className="numcard"><div className="n">{jobs.reduce((s,j) => s+(j.applicants?.length||0),0)}</div><div className="l">Applicants</div></div>
      </div>

      {jobs.length === 0 ? (
        <div className="nodata">
          <div className="ic">💼</div>
          <h3>No jobs posted yet</h3>
          <Link to="/postjob" className="btn btn-blue" style={{ marginTop:14 }}>Post First Job</Link>
        </div>
      ) : (
        <div className="tbox">
          <table className="tbl">
            <thead>
              <tr><th>Title</th><th>Location</th><th>Type</th><th>Applicants</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {jobs.map(job => (
                <React.Fragment key={job._id}>
                  <tr>
                    <td style={{ fontWeight:600 }}>{job.title}</td>
                    <td style={{ color:'var(--gray)' }}>{job.location}</td>
                    <td><span className="chip type">{job.type}</span></td>
                    <td>{job.applicants?.length || 0}</td>
                    <td><span className={'pill pill-' + job.status}>{job.status}</span></td>
                    <td>
                      <div style={{ display:'flex', gap:8 }}>
                        <button className="btn btn-border btn-small" onClick={() => viewApps(job._id)}>
                          {openId === job._id ? 'Hide' : 'View Apps'}
                        </button>
                        <button className="btn btn-danger btn-small" onClick={() => removeJob(job._id)}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                  {openId === job._id && apps[job._id] && (
                    <tr>
                      <td colSpan={6} style={{ background:'#f8fafc', padding:0 }}>
                        <div style={{ padding:16 }}>
                          {apps[job._id].length === 0 ? (
                            <p style={{ color:'var(--gray)', fontSize:'.875rem' }}>No applications yet</p>
                          ) : (
                            <table className="tbl">
                              <thead>
                                <tr><th>Name</th><th>Email</th><th>Date</th><th>Status</th><th>Change</th></tr>
                              </thead>
                              <tbody>
                                {apps[job._id].map(app => (
                                  <tr key={app._id}>
                                    <td style={{ fontWeight:600 }}>{app.candidate?.name}</td>
                                    <td style={{ color:'var(--gray)' }}>{app.candidate?.email}</td>
                                    <td style={{ color:'var(--gray)' }}>{new Date(app.appliedAt).toLocaleDateString()}</td>
                                    <td><span className={'pill pill-' + app.status}>{app.status}</span></td>
                                    <td>
                                      <select value={app.status}
                                        onChange={e => changeStatus(app._id, e.target.value, job._id)}
                                        style={{ border:'1px solid var(--border)', borderRadius:6, padding:'4px 8px', fontSize:'.8rem', cursor:'pointer' }}>
                                        <option value="pending">Pending</option>
                                        <option value="reviewing">Reviewing</option>
                                        <option value="accepted">Accepted</option>
                                        <option value="rejected">Rejected</option>
                                      </select>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}