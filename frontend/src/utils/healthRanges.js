export const HEALTH_RANGES = {
  'BP Systolic': {
    min: 90,
    max: 120,
    unit: 'mmHg',
    suggestions: {
      low: 'Your systolic blood pressure is low. Stay hydrated and consult a doctor if you feel dizzy.',
      normal: 'Your systolic blood pressure is in a healthy range. Keep up the good work!',
      high: 'Your systolic blood pressure is elevated. Reduce salt intake and monitor stress levels.'
    }
  },
  'BP Diastolic': {
    min: 60,
    max: 80,
    unit: 'mmHg',
    suggestions: {
      low: 'Your diastolic blood pressure is low. Ensure adequate salt and fluid intake.',
      normal: 'Your diastolic blood pressure is optimal.',
      high: 'Your diastolic blood pressure is high. Consider a low-sodium diet and regular exercise.'
    }
  },
  'Heart Rate': {
    min: 60,
    max: 100,
    unit: 'bpm',
    suggestions: {
      low: 'Your heart rate is below average. If you are not an athlete, consult a professional.',
      normal: 'Your heart rate is within the normal resting range.',
      high: 'Your heart rate is high. Try deep breathing exercises and avoid caffeine.'
    }
  },
  'Blood Sugar': {
    min: 70,
    max: 140,
    unit: 'mg/dL',
    suggestions: {
      low: 'Low blood sugar detected. Consume a quick source of glucose like fruit juice.',
      normal: 'Your blood sugar levels are stable.',
      high: 'High blood sugar detected. Limit sugary foods and stay active.'
    }
  },
  'SpO2': {
    min: 95,
    max: 100,
    unit: '%',
    suggestions: {
      low: 'Oxygen levels are below normal. Ensure proper ventilation and seek medical advice if it persists.',
      normal: 'Oxygen saturation is healthy.',
      high: 'Oxygen levels are excellent.'
    }
  },
  'Body Temp': {
    min: 36.1,
    max: 37.2,
    unit: '°C',
    suggestions: {
      low: 'Body temperature is lower than normal. Keep warm.',
      normal: 'Your body temperature is normal.',
      high: 'Elevated temperature detected. Rest and stay hydrated.'
    }
  },
  'Weight': {
    min: 50,
    max: 100, // Very generic, weight is personal
    unit: 'kg',
    suggestions: {
      low: 'Weight is below the target range for your profile.',
      normal: 'Your weight is stable.',
      high: 'Weight is above the target range. Focus on a balanced diet.'
    }
  }
};

export const getHealthStatus = (title, value) => {
  const range = HEALTH_RANGES[title];
  if (!range || value === 0 || value === '0') return { status: 'No data', color: '#94a3b8', suggestion: 'No data recorded yet.' };

  if (value < range.min) {
    return { 
      status: 'Low', 
      color: '#f59e0b', // Yellow/Orange
      suggestion: range.suggestions.low,
      type: 'warning'
    };
  } else if (value > range.max) {
    return { 
      status: 'High', 
      color: '#ef4444', // Red
      suggestion: range.suggestions.high,
      type: 'critical'
    };
  } else {
    return { 
      status: 'Normal', 
      color: '#10b981', // Green
      suggestion: range.suggestions.normal,
      type: 'normal'
    };
  }
};
