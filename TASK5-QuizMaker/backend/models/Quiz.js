const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question:      { type: String, required: true },
  options:       [String],
  correctAnswer: { type: Number, required: true },
  explanation:   { type: String, default: '' }
});

const quizSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  description: { type: String, default: '' },
  category:    { type: String, default: 'General' },
  timeLimit:   { type: Number, default: 0 },
  questions:   [questionSchema],
  creator:     { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isPublic:    { type: Boolean, default: true },
  attempts:    { type: Number, default: 0 },
  createdAt:   { type: Date, default: Date.now }
});

module.exports = mongoose.model('Quiz', quizSchema);