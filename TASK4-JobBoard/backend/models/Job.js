const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  company:     { type: String, required: true },
  location:    { type: String, required: true },
  type:        { type: String, default: 'Full-time' },
  salary:      { type: String, default: '' },
  description: { type: String, required: true },
  skills:      [String],
  employer:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  applicants:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  status:      { type: String, default: 'active' },
  createdAt:   { type: Date, default: Date.now }
});

module.exports = mongoose.model('Job', jobSchema);