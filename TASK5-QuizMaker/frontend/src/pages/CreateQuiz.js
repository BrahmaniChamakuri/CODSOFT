import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const blank = () => ({ question:'', options:['','','',''], correctAnswer:0, explanation:'' });

export default function CreateQuiz() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [title,     setTitle]     = useState('');
  const [desc,      setDesc]      = useState('');
  const [category,  setCategory]  = useState('General');
  const [timeLimit, setTimeLimit] = useState(0);
  const [questions, setQuestions] = useState([blank()]);
  const [error,     setError]     = useState('');
  const [loading,   setLoading]   = useState(false);

  if (!user) return (
    <div className="wrap" style={{ textAlign:'center', paddingTop:60 }}>
      <h2>Please login to create quizzes</h2>
      <button className="btn btn-purple" style={{ marginTop:14 }} onClick={() => navigate('/login')}>
        Login
      </button>
    </div>
  );

  const addQ    = () => setQuestions([...questions, blank()]);
  const removeQ = i => setQuestions(questions.filter((_, idx) => idx !== i));

  const setQ = (i, field, val) => {
    const updated = [...questions];
    updated[i] = { ...updated[i], [field]: val };
    setQuestions(updated);
  };

  const setOpt = (qi, oi, val) => {
    const updated = [...questions];
    updated[qi].options[oi] = val;
    setQuestions(updated);
  };

  const submit = async e => {
    e.preventDefault();
    setError('');
    for (let i = 0; i < questions.length; i++) {
      if (!questions[i].question) { setError('Q' + (i+1) + ' question is empty'); return; }
      if (questions[i].options.some(o => !o)) { setError('Fill all options for Q' + (i+1)); return; }
    }
    setLoading(true);
    try {
      const r = await axios.post('http://localhost:5001/api/quizzes', {
        title, description: desc, category, timeLimit, questions
      });
      navigate('/quiz/' + r.data._id + '/take');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed');
    }
    setLoading(false);
  };

  return (
    <div className="wrap" style={{ maxWidth:740 }}>
      <h1 style={{ fontSize:'1.5rem', fontWeight:800, marginBottom:5 }}>Create a Quiz</h1>
      <p style={{ color:'var(--gray)', marginBottom:22 }}>Build your quiz and share with everyone</p>

      {error && <div className="errmsg">{error}</div>}

      <form onSubmit={submit}>
        <div style={{ background:'#fff', border:'1px solid var(--border)', borderRadius:'var(--rad)', padding:22, marginBottom:18 }}>
          <h3 style={{ fontWeight:700, marginBottom:16 }}>Quiz Details</h3>
          <div className="fld">
            <label>Title *</label>
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Quiz title" required />
          </div>
          <div className="fld">
            <label>Description</label>
            <textarea value={desc} onChange={e => setDesc(e.target.value)} rows={2} placeholder="What is this quiz about?" />
          </div>
          <div className="fldrow">
            <div className="fld">
              <label>Category</label>
              <select value={category} onChange={e => setCategory(e.target.value)}>
                {['General','Science','Math','History','Technology','Sports'].map(c => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="fld">
              <label>Time Limit (minutes, 0 = no limit)</label>
              <input type="number" min={0} max={60} value={timeLimit}
                onChange={e => setTimeLimit(Number(e.target.value))} />
            </div>
          </div>
        </div>

        {questions.map((q, qi) => (
          <div className="qbuilder" key={qi}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:12 }}>
              <span style={{ fontWeight:700 }}>Question {qi + 1}</span>
              {questions.length > 1 && (
                <button type="button" className="btn btn-danger btn-small" onClick={() => removeQ(qi)}>
                  Remove
                </button>
              )}
            </div>
            <div className="fld">
              <label>Question *</label>
              <input value={q.question} onChange={e => setQ(qi, 'question', e.target.value)}
                placeholder="Type your question here..." required />
            </div>
            <label style={{ display:'block', fontSize:'.78rem', fontWeight:600, color:'var(--gray)', textTransform:'uppercase', letterSpacing:'.8px', marginBottom:8 }}>
              Options — click the circle to mark correct answer
            </label>
            {q.options.map((opt, oi) => (
              <div className="optrow" key={oi}>
                <input type="radio" name={'correct-' + qi} checked={q.correctAnswer === oi}
                  onChange={() => setQ(qi, 'correctAnswer', oi)} title="Mark as correct" />
                <span style={{ width:26, height:26, borderRadius:'50%', background: q.correctAnswer === oi ? 'var(--purple)' : 'var(--border)', color: q.correctAnswer === oi ? '#fff' : 'var(--gray)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'.78rem', fontWeight:700, flexShrink:0 }}>
                  {String.fromCharCode(65 + oi)}
                </span>
                <input type="text" value={opt} onChange={e => setOpt(qi, oi, e.target.value)}
                  placeholder={'Option ' + String.fromCharCode(65 + oi)} required />
              </div>
            ))}
            <div className="fld" style={{ marginTop:10 }}>
              <label>Explanation (shown if wrong — optional)</label>
              <input value={q.explanation} onChange={e => setQ(qi, 'explanation', e.target.value)}
                placeholder="Explain the correct answer" />
            </div>
          </div>
        ))}

        <div style={{ display:'flex', gap:10, marginBottom:20 }}>
          <button type="button" className="btn btn-border" onClick={addQ}>+ Add Question</button>
          <span style={{ color:'var(--gray)', fontSize:'.875rem', alignSelf:'center' }}>
            {questions.length} question{questions.length !== 1 ? 's' : ''}
          </span>
        </div>

        <button type="submit" className="btn btn-purple btn-wide" style={{ fontSize:'1rem', padding:'13px' }} disabled={loading}>
          {loading ? 'Creating...' : '🚀 Create Quiz'}
        </button>
      </form>
    </div>
  );
}