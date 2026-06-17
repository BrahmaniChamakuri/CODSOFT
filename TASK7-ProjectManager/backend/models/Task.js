const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, default: 'todo' },
  priority: { type: String, default: 'medium' },
  dueDate: Date,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Task', taskSchema);