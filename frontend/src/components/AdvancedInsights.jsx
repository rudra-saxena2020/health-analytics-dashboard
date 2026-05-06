import { Paper, Typography, Box, Divider, Chip } from '@mui/material';
import { AlertTriangle, Zap, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

function AdvancedInsights({ insights }) {
  if (!insights) return null;

  return (
    <Paper sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>Predictive Intelligence</Typography>

      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
        
        {/* Biological Age */}
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="text.secondary">Estimated Biological Age</Typography>
            <Chip 
              icon={<Activity size={14} />} 
              label={`${insights.biologicalAge} yrs`} 
              size="small" 
              sx={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', fontWeight: 600 }} 
            />
          </Box>
          <Typography variant="caption" color="text.secondary">
            Based on your metabolic data and consistency, your body is operating younger than your chronological age.
          </Typography>
        </Box>

        <Divider sx={{ borderColor: 'rgba(255,255,255,0.05)' }} />

        {/* Anomaly Detection */}
        <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.5 }}>
          <Box sx={{ background: 'rgba(239, 68, 68, 0.05)', p: 2, borderRadius: 2, border: '1px solid rgba(239, 68, 68, 0.2)' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <AlertTriangle size={18} color="#ef4444" />
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#ef4444' }}>Anomaly Detected</Typography>
            </Box>
            <Typography variant="caption" color="text.secondary">
              {insights.anomalies[0].message}
            </Typography>
          </Box>
        </motion.div>

        {/* Micro Recommendation */}
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.7 }}>
          <Box sx={{ background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(236, 72, 153, 0.1))', p: 2, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Zap size={18} color="#f472b6" />
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#f8fafc' }}>Smart Suggestion</Typography>
            </Box>
            <Typography variant="caption" sx={{ color: '#e2e8f0' }}>
              {insights.microRecommendation}
            </Typography>
          </Box>
        </motion.div>

        {/* Data Confidence */}
        <Box sx={{ mt: 'auto', pt: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="caption" color="text.secondary">Data Confidence Score</Typography>
            <Typography variant="caption" sx={{ fontWeight: 600 }}>{insights.dataConfidence}%</Typography>
          </Box>
          <Box sx={{ width: '100%', height: 4, background: 'rgba(255,255,255,0.1)', borderRadius: 2, overflow: 'hidden' }}>
            <Box sx={{ width: `${insights.dataConfidence}%`, height: '100%', background: 'linear-gradient(90deg, #6366f1, #10b981)' }} />
          </Box>
        </Box>

      </Box>
    </Paper>
  );
}

export default AdvancedInsights;
