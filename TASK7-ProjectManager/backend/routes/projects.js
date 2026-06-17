const router = require('express').Router();
const Project = require('../models/Project');
const Task = require('../models/Task');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try {
    const projects = await Project.find({ owner: req.user.id }).sort({ createdAt: -1 });
    const result = await Promise.all(projects.map(async p => {
      const total = await Task.countDocuments({ project: p._id });
      const done = await Task.countDocuments({ project: p._id, status: 'done' });
      return { ...p.toObject(), taskCount: total, doneCount: done };
    }));
    res.json(result);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Not found' });
    res.json(project);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/', auth, async (req, res) => {
  try {
    const project = await Project.create({ ...req.body, owner: req.user.id });
    res.status(201).json(project);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    await Project.findOneAndDelete({ _id: req.params.id, owner: req.user.id });
    await Task.deleteMany({ project: req.params.id });
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;