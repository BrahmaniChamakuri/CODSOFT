import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [color, setColor] = useState('#6366f1');
  const [emoji, setEmoji] = useState('📁');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const r = await axios.get('http://localhost:5003/api/projects');
      setProjects(r.data);
    } catch {}
  };

  const createProject = async e => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5003/api/projects', { name, description: desc, color, emoji });
      setShowModal(false);
      setName(''); setDesc('');
      loadProjects();
    } catch {}
  };

  const deleteProject = async id => {
    if (!window.confirm('Delete this project and all its tasks?')) return;
    await axios.delete('http://localhost:5003/api/projects/' + id);
    setProjects(projects.filter(p => p._id !== id));
  };

  const emojis = ['📁','🚀','💡','🎯','📊','🛠️','🎨','📱'];
  const colors = ['#6366f1','#f97316','#059669','#dc2626','#0891b2','#d946ef'];

  return (
    <div className="wrap">
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:22 }}>
        <div>
          <h1 style={{ fontSize:'1.5rem', fontWeight:800 }}>My Projects</h1>
          <p style={{ color:'var(--gray)' }}>Welcome back, {user?.name}</p>
        </div>
        <button className="btn btn-purple" onClick={() => setShowModal(true)}>+ New Project</button>
      </div>

      <div className="numgrid">
        <div className="numcard"><div className="n">{projects.length}</div><div className="l">Total Projects</div></div>
        <div className="numcard"><div className="n">{projects.reduce((s,p)=>s+(p.taskCount||0),0)}</div><div className="l">Total Tasks</div></div>
        <div className="numcard"><div className="n">{projects.reduce((s,p)=>s+(p.doneCount||0),0)}</div><div className="l">Completed</div></div>
      </div>

      {projects.length === 0 ? (
        <div className="nodata">
          <div className="ic">📁</div>
          <h3>No projects yet</h3>
          <button className="btn btn-purple" style={{ marginTop:14 }} onClick={() => setShowModal(true)}>
            Create Your First Project
          </button>
        </div>
      ) : (
        <div className="projgrid">
          {projects.map(p => {
            const pct = p.taskCount > 0 ? Math.round((p.doneCount / p.taskCount) * 100) : 0;
            return (
              <div className="projcard" key={p._id} style={{ '--card-color': p.color }}
                onClick={() => navigate('/project/' + p._id)}>
                <div className="projemoji">{p.emoji}</div>
                <div className="projname">{p.name}</div>
                <div className="projdesc">{p.description || 'No description'}</div>
                <div className="progbg"><div className="progfill" style={{ width: pct + '%', background: p.color }} /></div>
                <div className="projmeta">
                  <span>{p.doneCount}/{p.taskCount} tasks done</span>
                  <span>{pct}%</span>
                </div>
                <button onClick={e => { e.stopPropagation(); deleteProject(p._id); }}
                  style={{ position:'absolute', top:12, right:12, background:'none', border:'none', cursor:'pointer', color:'var(--gray)', fontSize:'.9rem' }}>
                  ✕
                </button>
              </div>
            );
          })}
        </div>
      )}

      {showModal && (
        <div className="modal-bg" onClick={() => setShowModal(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <h2 style={{ fontSize:'1.2rem', fontWeight:800, marginBottom:16 }}>Create New Project</h2>
            <form onSubmit={createProject}>
              <div className="fld">
                <label>Project Name</label>
                <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Website Redesign" required />
              </div>
              <div className="fld">
                <label>Description</label>
                <textarea value={desc} onChange={e => setDesc(e.target.value)} rows={2} placeholder="What is this project about?" />
              </div>
              <div className="fld">
                <label>Choose Icon</label>
                <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                  {emojis.map(em => (
                    <button type="button" key={em} onClick={() => setEmoji(em)}
                      style={{ width:40, height:40, fontSize:'1.2rem', border: emoji===em ? '2px solid var(--purple)' : '1.5px solid var(--border)', borderRadius:8, background:'#fff', cursor:'pointer' }}>
                      {em}
                    </button>
                  ))}
                </div>
              </div>
              <div className="fld">
                <label>Choose Color</label>
                <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                  {colors.map(c => (
                    <button type="button" key={c} onClick={() => setColor(c)}
                      style={{ width:32, height:32, borderRadius:'50%', background:c, border: color===c ? '3px solid #000' : '2px solid #fff', cursor:'pointer' }}>
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ display:'flex', gap:10, marginTop:20 }}>
                <button type="submit" className="btn btn-purple" style={{ flex:1, justifyContent:'center' }}>Create Project</button>
                <button type="button" className="btn btn-border" onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}