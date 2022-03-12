const mongoose = require('mongoose');

const ChallengeSchema = new mongoose.Schema({
  word: {
    type: String,
    required: true,
    trim: true,
  },
  bet: {
    type: Number,
    required: true,
  },
  from: {
    type: String,
    required: true,
    trim: true,
  },
  to: {
    type: String,
    required: true,
    trim: true,
  },
}, { collection: 'challenges' });

const Challenge = mongoose.model('Challenge', ChallengeSchema);

module.exports = Challenge;
