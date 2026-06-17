import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function PostJob() {
  const navigate = useNavigate();
  const [title,       setTitle]       = useState('');
  const [company,     setCompany]     = useState('');
  const [location,    setLocation]    = useState('');
  const [type,        setType]        = useState('Full-time');
  const [salary,      setSalary]      = useState('');
  const [description, setDescription] = useState('');
  const [skills,      setSkills]      = useState('');
  const [error,       setError]       = useState('');
  const [loading,     setLoading]     = useState(false);

  const submit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await axios.post('http://localhost:5000/api/jobs', {
        title, company, location, type, salary, description,
        skills: skills.split(',').map(s => s.trim()).filter(Boolean)
      });
      navigate('/employer-dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post');
    }
    setLoading(false);
  };

  return (
    <div className="wrap">
      <div className="formbox" style={{ maxWidth:660 }}>
        <h2>Post a Job</h2>
        <p className="sub">Fill in the details to find the right candidate</p>
        {error && <div className="errmsg">{error}</div>}
        <form onSubmit={submit}>
          <div className="fldrow">
            <div className="fld">
              <label>Job Title *</label>
              <input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. React Developer" required />
            </div>
            <div className="fld">
              <label>Company *</label>
              <input value={company} onChange={e => setCompany(e.target.value)} placeholder="Company name" required />
            </div>
          </div>
          <div className="fldrow">
            <div className="fld">
              <label>Location *</label>
              <input value={location} onChange={e => setLocation(e.target.value)} placeholder="e.g. Hyderabad" required />
            </div>
            <div className="fld">
              <label>Job Type</label>
              <select value={type} onChange={e => setType(e.target.value)}>
                <option>Full-time</option>
                <option>Part-time</option>
                <option>Contract</option>
                <option>Internship</option>
                <option>Remote</option>
              </select>
            </div>
          </div>
          <div className="fld">
            <label>Salary</label>
            <input value={salary} onChange={e => setSalary(e.target.value)} placeholder="e.g. 6-10 LPA" />
          </div>
          <div className="fld">
            <label>Job Description *</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} rows={5} placeholder="Describe the role and responsibilities..." required />
          </div>
          <div className="fld">
            <label>Skills (comma separated)</label>
            <input value={skills} onChange={e => setSkills(e.target.value)} placeholder="React, Node.js, MongoDB" />
          </div>
          <button type="submit" className="btn btn-blue btn-wide" disabled={loading}>
            {loading ? 'Posting...' : '🚀 Post Job'}
          </button>
        </form>
      </div>
    </div>
  );
}