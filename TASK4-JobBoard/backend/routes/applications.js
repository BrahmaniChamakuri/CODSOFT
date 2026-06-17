const router = require('express').Router();
const Application = require('../models/Application');
const Job = require('../models/Job');
const auth = require('../middleware/auth');

router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'candidate') {
      return res.status(403).json({ message: 'Only candidates can apply' });
    }
    const already = await Application.findOne({ job: req.body.job, candidate: req.user.id });
    if (already) return res.status(400).json({ message: 'Already applied' });
    const app = await Application.create({ ...req.body, candidate: req.user.id });
    await Job.findByIdAndUpdate(req.body.job, { $push: { applicants: req.user.id } });
    res.status(201).json(app);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/my', auth, async (req, res) => {
  try {
    const apps = await Application.find({ candidate: req.user.id })
      .populate('job', 'title company location type')
      .sort({ appliedAt: -1 });
    res.json(apps);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/job/:jobId', auth, async (req, res) => {
  try {
    const job = await Job.findOne({ _id: req.params.jobId, employer: req.user.id });
    if (!job) return res.status(403).json({ message: 'Not authorized' });
    const apps = await Application.find({ job: req.params.jobId })
      .populate('candidate', 'name email')
      .sort({ appliedAt: -1 });
    res.json(apps);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.patch('/:id', auth, async (req, res) => {
  try {
    const app = await Application.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json(app);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;