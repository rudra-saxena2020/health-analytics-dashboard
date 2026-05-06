const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  age: { type: Number, required: true },
  biologicalAge: { type: Number },
  gender: { type: String },
  healthScore: { type: Number, default: 0 }, // 0 - 100
  momentumScore: { type: Number, default: 0 }, // Consistency tracking
  settings: {
    theme: { type: String, enum: ['light', 'dark'], default: 'dark' },
    waterReminderInterval: { type: Number, default: 2 }, // Hours
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
