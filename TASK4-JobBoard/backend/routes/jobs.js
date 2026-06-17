const router = require('express').Router();
const Job = require('../models/Job');
const auth = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const { search, type } = req.query;
    const query = { status: 'active' };
    if (search) {
      query.$or = [
        { title:   { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } }
      ];
    }
    if (type) query.type = type;
    const jobs = await Job.find(query).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/employer/myjobs', auth, async (req, res) => {
  try {
    const jobs = await Job.find({ employer: req.user.id }).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('employer','name company');
    if (!job) return res.status(404).json({ message: 'Not found' });
    res.json(job);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'employer') {
      return res.status(403).json({ message: 'Only employers can post' });
    }
    const job = await Job.create({ ...req.body, employer: req.user.id });
    res.status(201).json(job);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    await Job.findOneAndDelete({ _id: req.params.id, employer: req.user.id });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;