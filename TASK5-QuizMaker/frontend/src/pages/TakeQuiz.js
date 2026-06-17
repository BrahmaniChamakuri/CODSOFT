import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function TakeQuiz() {
  const { id }   = useParams();
  const navigate = useNavigate();
  const [quiz,    setQuiz]    = useState(null);
  const [step,    setStep]    = useState(0);
  const [answers, setAnswers] = useState([]);
  const [chosen,  setChosen]  = useState(null);
  const [time,    setTime]    = useState(null);
  const [started, setStarted] = useState(false);
  const [name,    setName]    = useState('');

  useEffect(() => {
    axios.get('http://localhost:5001/api/quizzes/' + id + '/take')
      .then(r => {
        setQuiz(r.data);
        if (r.data.timeLimit > 0) setTime(r.data.timeLimit * 60);
      })
      .catch(() => navigate('/quizzes'));
  }, [id]);

  const finish = useCallback(async (finalAnswers) => {
    try {
      const r = await axios.post('http://localhost:5001/api/quizzes/' + id + '/submit', {
        answers: finalAnswers
      });
      navigate('/result', { state: { result: r.data } });
    } catch {}
  }, [id, navigate]);

  useEffect(() => {
    if (!started || time === null) return;
    if (time === 0) { finish([...answers]); return; }
    const t = setTimeout(() => setTime(x => x - 1), 1000);
    return () => clearTimeout(t);
  }, [time, started]);

  const goNext = () => {
    const newAns = [...answers, chosen];
    setAnswers(newAns);
    setChosen(null);
    if (step + 1 < quiz.questions.length) setStep(s => s + 1);
    else finish(newAns);
  };

  if (!quiz) return <div className="wrap"><p>Loading...</p></div>;

  if (!started) return (
    <div className="takewrap">
      <div className="formbox" style={{ textAlign:'center' }}>
        <h2 style={{ marginBottom:8 }}>{quiz.title}</h2>
        <p style={{ color:'var(--gray)', marginBottom:20 }}>
          {quiz.description || 'Ready to test your knowledge?'}
        </p>
        <div style={{ display:'flex', gap:10, justifyContent:'center', marginBottom:22, flexWrap:'wrap' }}>
          <span style={{ background:'var(--purplelight)', color:'var(--purple)', padding:'5px 13px', borderRadius:20, fontSize:'.8rem', fontWeight:600 }}>
            📝 {quiz.questions.length} Questions
          </span>
          {quiz.timeLimit > 0 && (
            <span style={{ background:'#fef3c7', color:'#d97706', padding:'5px 13px', borderRadius:20, fontSize:'.8rem', fontWeight:600 }}>
              ⏱ {quiz.timeLimit} min
            </span>
          )}
        </div>
        <div className="fld">
          <label>Your Name (optional)</label>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Enter your name" />
        </div>
        <button className="btn btn-purple btn-wide" style={{ fontSize:'1rem', padding:'13px' }}
          onClick={() => setStarted(true)}>
          🚀 Start Quiz
        </button>
      </div>
    </div>
  );

  const q = quiz.questions[step];
  const progress = (step / quiz.questions.length) * 100;

  return (
    <div className="takewrap">
      <div className="pgrow">
        <span>Question {step + 1} of {quiz.questions.length}</span>
        {time !== null && (
          <span className={'timerbadge' + (time < 30 ? ' danger' : '')}>
            ⏱ {Math.floor(time / 60)}:{String(time % 60).padStart(2, '0')}
          </span>
        )}
      </div>
      <div className="pgbg">
        <div className="pgfill" style={{ width: progress + '%' }} />
      </div>

      <div className="qbox">
        <div className="qlabel">Question {step + 1}</div>
        <div className="qtext">{q.question}</div>
        <div className="optlist">
          {q.options.map((opt, i) => (
            <button key={i}
              className={'optbtn' + (chosen === i ? ' chosen' : '')}
              onClick={() => setChosen(i)}>
              <span className="optletter">{String.fromCharCode(65 + i)}</span>
              {opt}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display:'flex', justifyContent:'flex-end' }}>
        <button className="btn btn-purple" style={{ padding:'11px 28px', fontSize:'.95rem' }}
          onClick={goNext} disabled={chosen === null}>
          {step + 1 === quiz.questions.length ? 'Finish →' : 'Next →'}
        </button>
      </div>
    </div>
  );
}