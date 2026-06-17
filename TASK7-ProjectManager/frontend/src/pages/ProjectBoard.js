import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function ProjectBoard() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [activeCol, setActiveCol] = useState('todo');
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [priority, setPriority] = useState('medium');

  useEffect(() => {
    loadProject();
    loadTasks();
  }, [id]);

  const loadProject = async () => {
    try {
      const r = await axios.get('http://localhost:5003/api/projects/' + id);
      setProject(r.data);
    } catch { navigate('/'); }
  };

  const loadTasks = async () => {
    try {
      const r = await axios.get('http://localhost:5003/api/tasks/project/' + id);
      setTasks(r.data);
    } catch {}
  };

  const openModal = (col) => { setActiveCol(col); setShowModal(true); };

  const createTask = async e => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5003/api/tasks', {
        title, description: desc, priority, project: id, status: activeCol
      });
      setShowModal(false);
      setTitle(''); setDesc(''); setPriority('medium');
      loadTasks();
    } catch {}
  };

  const changeStatus = async (taskId, status) => {
    await axios.put('http://localhost:5003/api/tasks/' + taskId, { status });
    loadTasks();
  };

  const deleteTask = async taskId => {
    await axios.delete('http://localhost:5003/api/tasks/' + taskId);
    loadTasks();
  };

  const columns = [
    { key: 'todo',     label: 'To Do',       cls: 'col-todo' },
    { key: 'inprogress', label: 'In Progress', cls: 'col-inprog' },
    { key: 'review',   label: 'Review',      cls: 'col-review' },
    { key: 'done',     label: 'Done',        cls: 'col-done' }
  ];

  if (!project) return <div className="wrap"><p>Loading...</p></div>;

  return (
    <div className="wrap">
      <Link to="/" style={{ fontSize:'.875rem', color:'var(--gray)', marginBottom:12, display:'inline-block' }}>← Back to Projects</Link>
      <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:24 }}>
        <span style={{ fontSize:'2rem' }}>{project.emoji}</span>
        <div>
          <h1 style={{ fontSize:'1.4rem', fontWeight:800 }}>{project.name}</h1>
          <p style={{ color:'var(--gray)', fontSize:'.875rem' }}>{project.description}</p>
        </div>
      </div>

      <div className="kanbanwrap">
        <div className="kanbanboard">
          {columns.map(col => (
            <div className="kanbancol" key={col.key}>
              <div className={'colhead ' + col.cls}>
                <span>{col.label}</span>
                <span>{tasks.filter(t => t.status === col.key).length}</span>
              </div>
              <div className={'colbody ' + col.cls}>
                {tasks.filter(t => t.status === col.key).map(task => (
                  <div className="taskcard" key={task._id}>
                    <div className="tasktitle">{task.title}</div>
                    {task.description && <div className="taskdesc">{task.description}</div>}
                    <div className="taskfoot">
                      <span className={'priobadge p-' + task.priority}>{task.priority}</span>
                      <button onClick={() => deleteTask(task._id)}
                        style={{ background:'none', border:'none', cursor:'pointer', color:'var(--gray)', fontSize:'.8rem' }}>
                        ✕
                      </button>
                    </div>
                    <select className="taskselect" value={task.status}
                      onChange={e => changeStatus(task._id, e.target.value)}
                      style={{ width:'100%', marginTop:8 }}>
                      <option value="todo">To Do</option>
                      <option value="inprogress">In Progress</option>
                      <option value="review">Review</option>
                      <option value="done">Done</option>
                    </select>
                  </div>
                ))}
                <button className="addtaskbtn" onClick={() => openModal(col.key)}>+ Add Task</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showModal && (
        <div className="modal-bg" onClick={() => setShowModal(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <h2 style={{ fontSize:'1.2rem', fontWeight:800, marginBottom:16 }}>Add New Task</h2>
            <form onSubmit={createTask}>
              <div className="fld">
                <label>Task Title</label>
                <input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Design homepage" required />
              </div>
              <div className="fld">
                <label>Description</label>
                <textarea value={desc} onChange={e => setDesc(e.target.value)} rows={2} placeholder="Task details (optional)" />
              </div>
              <div className="fld">
                <label>Priority</label>
                <select value={priority} onChange={e => setPriority(e.target.value)}>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
              <div style={{ display:'flex', gap:10, marginTop:20 }}>
                <button type="submit" className="btn btn-purple" style={{ flex:1, justifyContent:'center' }}>Add Task</button>
                <button type="button" className="btn btn-border" onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}