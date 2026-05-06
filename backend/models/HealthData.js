const mongoose = require('mongoose');

const healthDataSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  steps: { type: Number, default: 0 },
  caloriesBurned: { type: Number, default: 0 },
  sleepHours: { type: Number, default: 0 },
  sleepQuality: { type: Number, default: 0 }, // 0 - 100
  heartRateAvg: { type: Number, default: 70 },
  waterIntake: { type: Number, default: 0 }, // in Liters
  mentalLoadIndex: { type: Number, default: 50 }, // Cognitive fatigue (0-100)
  behaviorPattern: { type: String }, // e.g., 'Sedentary Evening', 'Active Morning'
  bloodPressureSystolic: { type: Number },
  bloodPressureDiastolic: { type: Number },
  heartRate: { type: Number },
  bloodSugar: { type: Number },
  oxygenSaturation: { type: Number },
  bodyTemperature: { type: Number },
  weight: { type: Number },
}, { timestamps: true });

module.exports = mongoose.model('HealthData', healthDataSchema);
