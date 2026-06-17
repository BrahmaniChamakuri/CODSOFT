import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function MyDashboard() {
  const [quizzes, setQuizzes] = useState([]);
  const { user }  = useAuth();
  const navigate  = useNavigate();

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    axios.get('http://localhost:5001/api/quizzes/my/created')
      .then(r => setQuizzes(r.data))
      .catch(() => {});
  }, []);

  const deleteQuiz = async id => {
    if (!window.confirm('Delete this quiz?')) return;
    await axios.delete('http://localhost:5001/api/quizzes/' + id);
    setQuizzes(quizzes.filter(q => q._id !== id));
  };

  return (
    <div className="wrap">
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:22 }}>
        <div>
          <h1 style={{ fontSize:'1.5rem', fontWeight:800 }}>My Dashboard</h1>
          <p style={{ color:'var(--gray)' }}>Welcome back, {user?.name}</p>
        </div>
        <Link to="/create" className="btn btn-purple">+ Create Quiz</Link>
      </div>

      <div className="dashstats">
        <div className="dashcard">
          <div className="dn">{quizzes.length}</div>
          <div className="dl">Quizzes Created</div>
        </div>
        <div className="dashcard">
          <div className="dn">{quizzes.reduce((s, q) => s + q.attempts, 0)}</div>
          <div className="dl">Total Attempts</div>
        </div>
        <div className="dashcard">
          <div className="dn">{quizzes.reduce((s, q) => s + (q.questions?.length || 0), 0)}</div>
          <div className="dl">Questions Written</div>
        </div>
      </div>

      {quizzes.length === 0 ? (
        <div className="nodata">
          <div className="ic">📝</div>
          <h3>No quizzes created yet</h3>
          <Link to="/create" className="btn btn-purple" style={{ marginTop:14 }}>
            Create Your First Quiz
          </Link>
        </div>
      ) : (
        <div className="tbox">
          <table className="tbl">
            <thead>
              <tr>
                <th>Title</th><th>Category</th><th>Questions</th><th>Attempts</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {quizzes.map(q => (
                <tr key={q._id}>
                  <td style={{ fontWeight:600 }}>{q.title}</td>
                  <td>{q.category}</td>
                  <td>{q.questions?.length || 0}</td>
                  <td>{q.attempts}</td>
                  <td>
                    <div style={{ display:'flex', gap:8 }}>
                      <button className="btn btn-border btn-small"
                        onClick={() => navigate('/quiz/' + q._id + '/take')}>
                        Take Quiz
                      </button>
                      <button className="btn btn-danger btn-small" onClick={() => deleteQuiz(q._id)}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}