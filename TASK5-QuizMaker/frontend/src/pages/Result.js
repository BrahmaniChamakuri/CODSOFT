import React from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';

export default function Result() {
  const { state }  = useLocation();
  const navigate   = useNavigate();
  if (!state) { navigate('/quizzes'); return null; }

  const { score, total, percentage, evaluated, quizTitle } = state.result;

  const grade =
    percentage >= 80 ? { label:'🏆 Excellent!',     color:'#059669' } :
    percentage >= 60 ? { label:'👍 Good Job!',       color:'#2563eb' } :
    percentage >= 40 ? { label:'📚 Keep Practicing', color:'#d97706' } :
                       { label:'💪 Try Again!',      color:'#dc2626' };

  return (
    <div className="resultwrap">
      <div className="resultbox">
        <h1 style={{ fontSize:'1.4rem', fontWeight:800, marginBottom:5 }}>Quiz Complete! 🎉</h1>
        <p style={{ color:'var(--gray)', marginBottom:24 }}>{quizTitle}</p>

        <div className="scorering" style={{ borderColor: grade.color }}>
          <span className="snum" style={{ color: grade.color }}>{score}/{total}</span>
          <span className="spct">{percentage}%</span>
        </div>

        <h2 style={{ color: grade.color, marginBottom:8 }}>{grade.label}</h2>
        <p style={{ color:'var(--gray)', marginBottom:26 }}>
          You got {score} out of {total} correct
        </p>

        <div style={{ display:'flex', gap:10, justifyContent:'center', marginBottom:32, flexWrap:'wrap' }}>
          <span style={{ background:'#dcfce7', color:'#059669', padding:'7px 16px', borderRadius:20, fontWeight:600, fontSize:'.875rem' }}>
            ✓ {score} Correct
          </span>
          <span style={{ background:'#fee2e2', color:'#dc2626', padding:'7px 16px', borderRadius:20, fontWeight:600, fontSize:'.875rem' }}>
            ✗ {total - score} Wrong
          </span>
        </div>

        <h3 style={{ fontSize:'1rem', fontWeight:700, marginBottom:14, textAlign:'left' }}>Answer Review</h3>
        <div className="anslist">
          {evaluated.map((a, i) => (
            <div key={i} className={'ansitem ' + (a.correct ? 'ok' : 'wrong')}>
              <div style={{ display:'flex', justifyContent:'space-between' }}>
                <span style={{ fontWeight:600 }}>Q{i + 1}. {a.question}</span>
                <span>{a.correct ? '✅' : '❌'}</span>
              </div>
              <div style={{ fontSize:'.8rem', color:'var(--gray)', marginTop:4 }}>
                Your answer: <strong>{a.options[a.selected] || 'Not answered'}</strong>
                {!a.correct && (
                  <> · Correct: <strong style={{ color:'#059669' }}>{a.options[a.correctAnswer]}</strong></>
                )}
              </div>
              {a.explanation && !a.correct && (
                <div className="explbox">💡 {a.explanation}</div>
              )}
            </div>
          ))}
        </div>

        <div style={{ display:'flex', gap:10, marginTop:24, justifyContent:'center', flexWrap:'wrap' }}>
          <Link to="/quizzes" className="btn btn-purple">Browse More</Link>
          <Link to="/create"  className="btn btn-border">Create a Quiz</Link>
        </div>
      </div>
    </div>
  );
}