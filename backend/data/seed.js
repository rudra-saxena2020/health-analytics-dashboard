const mongoose = require('mongoose');
const User = require('../models/User');
const HealthData = require('../models/HealthData');

mongoose.connect('mongodb://127.0.0.1:27017/health-dashboard');

async function seed() {
  try {
    await User.deleteMany({});
    await HealthData.deleteMany({});

    const user = await User.create({
      name: 'Alex Rivera',
      email: 'alex@example.com',
      age: 32,
      biologicalAge: 29,
      gender: 'Male',
      healthScore: 88,
      momentumScore: 82,
    });

    const dates = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      dates.push(d);
    }

    const healthDataEntries = dates.map((date, i) => ({
      userId: user._id,
      date: date,
      steps: 6000 + Math.floor(Math.random() * 6000),
      caloriesBurned: 2200 + Math.floor(Math.random() * 600),
      sleepHours: 6 + Math.random() * 2.5,
      sleepQuality: 60 + Math.floor(Math.random() * 35),
      heartRateAvg: 65 + Math.floor(Math.random() * 10),
      waterIntake: 1.5 + Math.random() * 1.5,
      mentalLoadIndex: 40 + Math.floor(Math.random() * 40),
      behaviorPattern: i % 2 === 0 ? 'Active Morning' : 'Sedentary Evening',
    }));

    await HealthData.insertMany(healthDataEntries);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seed();
