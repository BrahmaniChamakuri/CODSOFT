const router = require('express').Router();
const Quiz = require('../models/Quiz');
const auth = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const { search, category } = req.query;
    const query = { isPublic: true };
    if (search)   query.title    = { $regex: search, $options: 'i' };
    if (category) query.category = category;
    const quizzes = await Quiz.find(query)
      .populate('creator', 'name')
      .select('-questions.correctAnswer -questions.explanation')
      .sort({ createdAt: -1 });
    res.json(quizzes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/my/created', auth, async (req, res) => {
  try {
    const quizzes = await Quiz.find({ creator: req.user.id }).sort({ createdAt: -1 });
    res.json(quizzes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id/take', async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id)
      .select('-questions.correctAnswer -questions.explanation');
    if (!quiz) return res.status(404).json({ message: 'Not found' });
    await Quiz.findByIdAndUpdate(req.params.id, { $inc: { attempts: 1 } });
    res.json(quiz);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/:id/submit', async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: 'Not found' });
    const { answers } = req.body;
    let score = 0;
    const evaluated = quiz.questions.map((q, i) => {
      const correct = answers[i] === q.correctAnswer;
      if (correct) score++;
      return {
        correct,
        selected:      answers[i],
        correctAnswer: q.correctAnswer,
        explanation:   q.explanation,
        question:      q.question,
        options:       q.options
      };
    });
    res.json({
      score,
      total:      quiz.questions.length,
      percentage: Math.round((score / quiz.questions.length) * 100),
      evaluated,
      quizTitle:  quiz.title
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const quiz = await Quiz.create({ ...req.body, creator: req.user.id });
    res.status(201).json(quiz);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    await Quiz.findOneAndDelete({ _id: req.params.id, creator: req.user.id });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;