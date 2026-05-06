require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const { MongoMemoryServer } = require('mongodb-memory-server');
const apiRoutes = require('./routes/api');
const authRoutes = require('./routes/auth');
const User = require('./models/User');
const HealthData = require('./models/HealthData');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api', apiRoutes);
app.use('/api/auth', authRoutes);

// Health check
app.get('/health', (req, res) => res.send('Backend is running!'));

async function seedData() {
  const userCount = await User.countDocuments();
  if (userCount > 0) return;

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('password123', salt);

  const user = await User.create({
    name: 'Alex Rivera',
    email: 'alex@example.com',
    password: hashedPassword,
    age: 32,
    biologicalAge: 32,
    gender: 'Male',
    healthScore: 85,
    momentumScore: 92,
    settings: {
      theme: 'dark',
      waterReminderInterval: 2
    }
  });
  
  console.log('User created with seed data.');

  // Seed Health Data
  const now = new Date();
  const sampleData = [
    {
      userId: user._id,
      date: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000),
      bloodPressureSystolic: 122,
      bloodPressureDiastolic: 82,
      heartRate: 72,
      bloodSugar: 95,
      oxygenSaturation: 98,
      bodyTemperature: 36.6,
      weight: 75.5
    },
    {
      userId: user._id,
      date: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
      bloodPressureSystolic: 125,
      bloodPressureDiastolic: 84,
      heartRate: 75,
      bloodSugar: 98,
      oxygenSaturation: 97,
      bodyTemperature: 36.8,
      weight: 75.2
    },
    {
      userId: user._id,
      date: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
      bloodPressureSystolic: 118,
      bloodPressureDiastolic: 78,
      heartRate: 68,
      bloodSugar: 92,
      oxygenSaturation: 99,
      bodyTemperature: 36.5,
      weight: 74.8
    },
    {
      userId: user._id,
      date: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
      bloodPressureSystolic: 120,
      bloodPressureDiastolic: 80,
      heartRate: 70,
      bloodSugar: 90,
      oxygenSaturation: 98,
      bodyTemperature: 36.6,
      weight: 74.5
    }
  ];

  await HealthData.insertMany(sampleData);
  console.log('Sample health data seeded.');
}

let isConnected = false;
async function startServer() {
  try {
    if (isConnected) return;

    let mongoUri = process.env.MONGODB_URI;
    
    if (!mongoUri && (process.env.NODE_ENV === 'test' || !process.env.VERCEL)) {
      const mongoServer = await MongoMemoryServer.create();
      mongoUri = mongoServer.getUri();
      console.log('Using In-Memory MongoDB');
    }
    
    if (mongoUri) {
      await mongoose.connect(mongoUri);
      isConnected = true;
      console.log('Connected to MongoDB');
      await seedData();
    }
  } catch (error) {
    console.error('Failed to start server:', error);
  }
}

// Middleware to ensure DB connection for serverless
app.use(async (req, res, next) => {
  if (!isConnected && process.env.VERCEL) {
    await startServer();
  }
  next();
});

if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  startServer().then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  });
}

module.exports = app;
