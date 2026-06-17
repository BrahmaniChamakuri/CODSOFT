import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function QuizList() {
  const [quizzes, setQuizzes] = useState([]);
  const [search,  setSearch]  = useState('');
  const [cat,     setCat]     = useState('');
  const navigate = useNavigate();

  const load = async () => {
    try {
      const r = await axios.get('http://localhost:5001/api/quizzes', {
        params: { search, category: cat }
      });
      setQuizzes(r.data);
    } catch {}
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="wrap">
      <h1 style={{ fontSize:'1.5rem', fontWeight:800, marginBottom:18 }}>Browse Quizzes</h1>

      <div style={{ display:'flex', gap:10, marginBottom:22, flexWrap:'wrap' }}>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && load()}
          placeholder="🔍 Search quizzes..."
          style={{ flex:1, minWidth:180, border:'1.5px solid var(--border)', borderRadius:8, padding:'9px 13px', fontSize:'.875rem', outline:'none' }}
        />
        <select value={cat} onChange={e => setCat(e.target.value)}
          style={{ border:'1.5px solid var(--border)', borderRadius:8, padding:'9px 13px', fontSize:'.875rem', background:'#fff', cursor:'pointer' }}>
          <option value="">All Categories</option>
          {['General','Science','Math','History','Technology','Sports'].map(c => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <button className="btn btn-purple" onClick={load}>Search</button>
      </div>

      {quizzes.length === 0 ? (
        <div className="nodata"><div className="ic">🔍</div><h3>No quizzes found</h3></div>
      ) : (
        <div className="qgrid">
          {quizzes.map(q => (
            <div className="qcard" key={q._id} onClick={() => navigate('/quiz/' + q._id + '/take')}>
              <div className="qcat">{q.category}</div>
              <h3>{q.title}</h3>
              <p>{q.description || 'Test your knowledge!'}</p>
              <div className="qmeta">
                <span>📝 {q.questions?.length || 0} questions</span>
                <span>👁 {q.attempts} attempts</span>
                {q.timeLimit > 0 && <span>⏱ {q.timeLimit} min</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}