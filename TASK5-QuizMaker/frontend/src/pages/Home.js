import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Home() {
  const [quizzes, setQuizzes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:5001/api/quizzes')
      .then(r => setQuizzes(r.data.slice(0, 4)))
      .catch(() => {});
  }, []);

  return (
    <div>
      <div className="herobanner">
        <h1>Test Your Knowledge 🧠</h1>
        <p>Create quizzes, challenge friends and learn every day</p>
        <div className="herobtnrow">
          <Link to="/quizzes" className="btnwhite">Browse Quizzes</Link>
          <Link to="/create"  className="btnghost">Create a Quiz</Link>
        </div>
      </div>

      <div className="wrap">
        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:20 }}>
          <h2 style={{ fontSize:'1.3rem', fontWeight:800 }}>Featured Quizzes</h2>
          <Link to="/quizzes" className="btn btn-border btn-small">View All →</Link>
        </div>

        <div className="qgrid">
          {quizzes.map(q => (
            <div className="qcard" key={q._id} onClick={() => navigate('/quiz/' + q._id + '/take')}>
              <div className="qcat">{q.category}</div>
              <h3>{q.title}</h3>
              <p>{q.description || 'Test your knowledge!'}</p>
              <div className="qmeta">
                <span>📝 {q.questions?.length || 0} questions</span>
                <span>👁 {q.attempts} attempts</span>
              </div>
            </div>
          ))}
        </div>

        {quizzes.length === 0 && (
          <div className="nodata">
            <div className="ic">🧩</div>
            <h3>No quizzes yet</h3>
            <Link to="/create" className="btn btn-purple" style={{ marginTop:14 }}>
              Create First Quiz
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}