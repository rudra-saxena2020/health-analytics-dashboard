import { Paper, Box, Typography, Chip } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, TrendingUp, TrendingDown, Minus, Info } from 'lucide-react';

const TrendIcon = ({ trend }) => {
  if (!trend || trend === 0) return <Minus size={14} />;
  return trend > 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />;
};

function MetricCard({ title, value, unit, color, icon, trend, label = "Average", status, suggestion, statusType }) {
  const isZero = value === 0 || value === '0' || !value;

  // Dynamic background based on status
  const getGradient = () => {
    if (isZero) return 'rgba(255,255,255,0.02)';
    if (statusType === 'normal') return 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.02) 100%)';
    if (statusType === 'warning') return 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(245, 158, 11, 0.02) 100%)';
    if (statusType === 'critical') return 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(239, 68, 68, 0.02) 100%)';
    return 'rgba(255,255,255,0.04)';
  };

  const getBorderColor = () => {
    if (isZero) return 'rgba(255,255,255,0.05)';
    return `${color}40`;
  };

  return (
    <motion.div 
      whileHover={{ y: -5, scale: 1.02 }} 
      transition={{ type: 'spring', stiffness: 300 }}
      layout
    >
      <Paper sx={{
        p: 3,
        height: '100%',
        borderRadius: 4,
        position: 'relative',
        overflow: 'hidden',
        background: getGradient(),
        border: `1px solid ${getBorderColor()}`,
        backdropFilter: 'blur(10px)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0, left: 0, width: '100%', height: '100%',
          background: `radial-gradient(circle at top right, ${color}15, transparent 70%)`,
          zIndex: 0,
        }
      }}>
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box sx={{ 
              p: 1.2, 
              borderRadius: 2.5, 
              background: `${color}20`, 
              color: color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 8px 20px ${color}15`
            }}>
              {icon}
            </Box>
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 1, display: 'block' }}>
                {title}
              </Typography>
              <AnimatePresence mode="wait">
                {!isZero && status && (
                  <motion.div
                    key={status}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                  >
                    <Chip 
                      label={status} 
                      size="small" 
                      sx={{ 
                        height: 20, 
                        fontSize: '0.65rem', 
                        fontWeight: 800, 
                        backgroundColor: `${color}20`, 
                        color: color,
                        border: `1px solid ${color}40`,
                        mt: 0.5
                      }} 
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </Box>
          </Box>

          <Box sx={{ mb: 2 }}>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>{label}</Typography>
            <AnimatePresence mode="wait">
              <motion.div
                key={value}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <Typography variant="h3" sx={{ fontWeight: 800, letterSpacing: -1 }}>
                  {isZero ? '0' : typeof value === 'number' ? value.toFixed(1) : value}
                  <Typography component="span" variant="h6" sx={{ ml: 1, color: 'text.secondary', fontWeight: 500 }}>
                    {unit}
                  </Typography>
                </Typography>
              </motion.div>
            </AnimatePresence>
          </Box>
        </Box>

        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <AnimatePresence mode="wait">
            {!isZero && suggestion ? (
              <motion.div
                key={suggestion}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <Box sx={{ 
                  mt: 1, p: 1.5, borderRadius: 2, 
                  backgroundColor: 'rgba(0,0,0,0.2)', 
                  borderLeft: `3px solid ${color}`,
                  display: 'flex', gap: 1
                }}>
                  <Info size={14} style={{ color: color, marginTop: 2, flexShrink: 0 }} />
                  <Typography variant="caption" sx={{ color: 'text.secondary', lineHeight: 1.4, fontStyle: 'italic' }}>
                    {suggestion}
                  </Typography>
                </Box>
              </motion.div>
            ) : null}
          </AnimatePresence>

          {!isZero && trend !== undefined && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 2, color: trend > 0 ? '#10b981' : '#ef4444' }}>
              <TrendIcon trend={trend} />
              <Typography variant="caption" sx={{ fontWeight: 600 }}>
                {Math.abs(trend).toFixed(1)}% vs. last
              </Typography>
            </Box>
          )}

          {isZero && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 2, color: 'rgba(255,255,255,0.3)' }}>
              <AlertCircle size={14} />
              <Typography variant="caption" sx={{ fontWeight: 500 }}>
                No data recorded
              </Typography>
            </Box>
          )}
        </Box>
      </Paper>
    </motion.div>
  );
}

export default MetricCard;
