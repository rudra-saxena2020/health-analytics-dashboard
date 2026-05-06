const express = require('express');
const router = express.Router();
const User = require('../models/User');
const HealthData = require('../models/HealthData');

// API root health check
router.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'API is running' });
});

// Get user profile
router.get('/users/profile', async (req, res) => {
  try {
    // For demo purposes, fetch the first user
    const user = await User.findOne();
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get health dashboard data
router.get('/health-data', async (req, res) => {
  try {
    const user = await User.findOne();
    if (!user) return res.status(404).json({ message: 'User not found' });

    const data = await HealthData.find({ userId: user._id }).sort({ date: 1 });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add new health data
router.post('/health-data', async (req, res) => {
  try {
    const user = await User.findOne();
    if (!user) return res.status(404).json({ message: 'User not found' });

    const newData = new HealthData({
      userId: user._id,
      ...req.body
    });
    
    const savedData = await newData.save();
    res.status(201).json(savedData);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Bulk add health data
router.post('/health-data/bulk', async (req, res) => {
  try {
    const user = await User.findOne();
    if (!user) return res.status(404).json({ message: 'User not found' });

    const records = req.body.map(item => ({
      userId: user._id,
      ...item
    }));

    const savedData = await HealthData.insertMany(records);
    res.status(201).json(savedData);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete health data
router.delete('/health-data/:id', async (req, res) => {
  try {
    const deletedData = await HealthData.findByIdAndDelete(req.params.id);
    if (!deletedData) return res.status(404).json({ message: 'Record not found' });
    res.json({ message: 'Record deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get advanced insights
router.get('/insights', async (req, res) => {
  try {
    const user = await User.findOne();
    if (!user) return res.status(404).json({ message: 'User not found' });

    const latestData = await HealthData.findOne({ userId: user._id }).sort({ date: -1 });

    const anomalies = [
      { type: 'Sleep', message: 'Restless sleep detected between 2 AM and 4 AM.', status: 'Warning' }
    ];

    if (latestData) {
      if (latestData.bloodPressureSystolic > 130 || latestData.bloodPressureDiastolic > 80) {
        anomalies.push({ type: 'Blood Pressure', message: 'Blood pressure is elevated. Consider monitoring closely.', status: 'Elevated' });
      }
      if (latestData.oxygenSaturation && latestData.oxygenSaturation < 95) {
        anomalies.push({ type: 'Oxygen Levels', message: 'Potential risk detected in oxygen levels.', status: 'Critical' });
      }
      if (latestData.heartRate) {
        if (latestData.heartRate > 100 || latestData.heartRate < 60) {
          anomalies.push({ type: 'Heart Rate', message: 'Abnormal heart rate detected.', status: 'Elevated' });
        } else {
           anomalies.push({ type: 'Heart Rate', message: 'Heart rate is within healthy range.', status: 'Normal' });
        }
      }
    }

    // Mock predictive insights based on prompt requirements
    const insights = {
      biologicalAge: user.biologicalAge,
      healthScore: user.healthScore,
      momentumScore: user.momentumScore,
      habitFailurePrediction: 'Medium Risk - Irregular sleep patterns detected.',
      microRecommendation: 'Consider a 15-minute walk. You are 2,000 steps behind your average.',
      anomalies: anomalies,
      dataConfidence: 92 // Percentage of reliable tracking
    };

    res.json(insights);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
