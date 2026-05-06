import { useEffect, useState } from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { motion } from 'framer-motion';

function HealthScore({ score, momentum }) {
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    // Simple animated counter for health score
    let start = 0;
    const end = parseInt(score, 10);
    if (start === end) return;
    
    let totalMiliseconds = 1500;
    let incrementTime = (totalMiliseconds / end);
    
    let timer = setInterval(() => {
      start += 1;
      setDisplayScore(start);
      if (start === end) clearInterval(timer);
    }, incrementTime);

    return () => clearInterval(timer);
  }, [score]);

  return (
    <Paper sx={{ 
      p: 4, 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(99, 102, 241, 0.1) 100%)',
      position: 'relative'
    }}>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 4, alignSelf: 'flex-start' }}>Health Score</Typography>
      
      <Box sx={{ position: 'relative', width: 200, height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {/* SVG Circle Background */}
        <svg width="200" height="200" style={{ position: 'absolute' }}>
          <defs>
            <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
          </defs>
          <circle cx="100" cy="100" r="90" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="12" />
          <motion.circle 
            cx="100" cy="100" r="90" 
            fill="none" 
            stroke="url(#scoreGradient)" 
            strokeWidth="12"
            strokeDasharray="565.48" // 2 * pi * r
            initial={{ strokeDashoffset: 565.48 }}
            animate={{ strokeDashoffset: 565.48 - (565.48 * (score / 100)) }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            strokeLinecap="round"
            transform="rotate(-90 100 100)"
          />
        </svg>

        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h2" sx={{ fontWeight: 800, background: 'linear-gradient(45deg, #6366f1, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            {displayScore}
          </Typography>
          <Typography variant="caption" color="text.secondary">out of 100</Typography>
        </Box>
      </Box>

      <Box sx={{ mt: 4, width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="body2" color="text.secondary">Momentum</Typography>
        <Typography variant="body1" sx={{ fontWeight: 600, color: '#10b981' }}>+{momentum}% Trend</Typography>
      </Box>
    </Paper>
  );
}

export default HealthScore;
