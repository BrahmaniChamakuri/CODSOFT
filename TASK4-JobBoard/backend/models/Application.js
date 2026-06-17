const mongoose = require('mongoose');

const appSchema = new mongoose.Schema({
  job:         { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  candidate:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  coverLetter: { type: String, default: '' },
  status:      { type: String, default: 'pending' },
  appliedAt:   { type: Date, default: Date.now }
});

module.exports = mongoose.model('Application', appSchema);