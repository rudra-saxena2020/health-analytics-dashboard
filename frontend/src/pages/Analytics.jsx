import { useState } from 'react';
import { 
  Box, Typography, Paper, Grid, TextField, Button, 
  InputAdornment, Alert, Snackbar, Chip, 
  CircularProgress
} from '@mui/material';
import { motion } from 'framer-motion';
import { 
  AlertCircle, Activity, Heart, Droplets, Thermometer, Scale 
} from 'lucide-react';
import axios from 'axios';
import config from '../config';

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

function Analytics() {
  // --- Form State ---
  const [formData, setFormData] = useState({
    date: new Date().toISOString().slice(0, 16),
    bloodPressureSystolic: '',
    bloodPressureDiastolic: '',
    heartRate: '',
    bloodSugar: '',
    oxygenSaturation: '',
    bodyTemperature: '',
    weight: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const validate = () => {
    const newErrors = {};
    const n = (val) => val === '' ? null : Number(val);
    
    const { 
      bloodPressureSystolic: bps, 
      bloodPressureDiastolic: bpd, 
      heartRate: hr, 
      bloodSugar: bs, 
      oxygenSaturation: spo2, 
      bodyTemperature: temp, 
      weight: w 
    } = formData;

    if (bps && (n(bps) < 50 || n(bps) > 250)) newErrors.bloodPressureSystolic = 'Range: 50-250';
    if (bpd && (n(bpd) < 30 || n(bpd) > 150)) newErrors.bloodPressureDiastolic = 'Range: 30-150';
    if (hr && (n(hr) < 30 || n(hr) > 220)) newErrors.heartRate = 'Range: 30-220';
    if (bs && (n(bs) < 20 || n(bs) > 600)) newErrors.bloodSugar = 'Range: 20-600';
    if (spo2 && (n(spo2) < 70 || n(spo2) > 100)) newErrors.oxygenSaturation = 'Range: 70-100';
    if (temp && (n(temp) < 30 || n(temp) > 45)) newErrors.bodyTemperature = 'Range: 30-45';
    if (w && (n(w) < 20 || n(w) > 500)) newErrors.weight = 'Range: 20-500';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const payload = { ...formData };
      Object.keys(payload).forEach(key => {
        if (key === 'date') return;
        if (payload[key] === '') delete payload[key];
        else payload[key] = Number(payload[key]);
      });

      await axios.post(`${config.API_URL}/health-data`, payload);
      setToast({ open: true, message: 'Medical data saved successfully!', severity: 'success' });
      
      setFormData({
        date: new Date().toISOString().slice(0, 16),
        bloodPressureSystolic: '', bloodPressureDiastolic: '', heartRate: '',
        bloodSugar: '', oxygenSaturation: '', bodyTemperature: '', weight: ''
      });
    } catch {
      setToast({ open: true, message: 'Failed to save data.', severity: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>Medical Data Entry</Typography>
        <Typography variant="body1" color="text.secondary">
          Log your vital health metrics for medical monitoring and analysis.
        </Typography>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} lg={8}>
          <motion.div variants={itemVariants}>
            <Paper sx={{ p: 4, borderRadius: 3 }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>Vital Signs Log</Typography>
              <Box component="form" onSubmit={handleFormSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField fullWidth label="Date & Time" type="datetime-local" name="date" value={formData.date} onChange={handleFormChange} InputLabelProps={{ shrink: true }} required />
                  </Grid>
                  
                  <Grid item xs={12} sm={4}>
                    <TextField fullWidth label="BP Systolic" name="bloodPressureSystolic" type="number" value={formData.bloodPressureSystolic} onChange={handleFormChange} error={!!errors.bloodPressureSystolic} helperText={errors.bloodPressureSystolic} InputProps={{ startAdornment: <InputAdornment position="start"><Activity size={18} color="#ef4444" /></InputAdornment>, endAdornment: <InputAdornment position="end">mmHg</InputAdornment> }} />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField fullWidth label="BP Diastolic" name="bloodPressureDiastolic" type="number" value={formData.bloodPressureDiastolic} onChange={handleFormChange} error={!!errors.bloodPressureDiastolic} helperText={errors.bloodPressureDiastolic} InputProps={{ endAdornment: <InputAdornment position="end">mmHg</InputAdornment> }} />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField fullWidth label="Heart Rate" name="heartRate" type="number" value={formData.heartRate} onChange={handleFormChange} error={!!errors.heartRate} helperText={errors.heartRate} InputProps={{ startAdornment: <InputAdornment position="start"><Heart size={18} color="#ef4444" /></InputAdornment>, endAdornment: <InputAdornment position="end">bpm</InputAdornment> }} />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth label="Blood Sugar" name="bloodSugar" type="number" value={formData.bloodSugar} onChange={handleFormChange} error={!!errors.bloodSugar} helperText={errors.bloodSugar} InputProps={{ startAdornment: <InputAdornment position="start"><Droplets size={18} color="#3b82f6" /></InputAdornment>, endAdornment: <InputAdornment position="end">mg/dL</InputAdornment> }} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth label="SpO2 (%)" name="oxygenSaturation" type="number" value={formData.oxygenSaturation} onChange={handleFormChange} error={!!errors.oxygenSaturation} helperText={errors.oxygenSaturation} InputProps={{ startAdornment: <InputAdornment position="start"><Activity size={18} color="#10b981" /></InputAdornment>, endAdornment: <InputAdornment position="end">%</InputAdornment> }} />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth label="Body Temp" name="bodyTemperature" type="number" inputProps={{ step: '0.1' }} value={formData.bodyTemperature} onChange={handleFormChange} error={!!errors.bodyTemperature} helperText={errors.bodyTemperature} InputProps={{ startAdornment: <InputAdornment position="start"><Thermometer size={18} color="#f59e0b" /></InputAdornment>, endAdornment: <InputAdornment position="end">°C</InputAdornment> }} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth label="Weight" name="weight" type="number" inputProps={{ step: '0.1' }} value={formData.weight} onChange={handleFormChange} error={!!errors.weight} helperText={errors.weight} InputProps={{ startAdornment: <InputAdornment position="start"><Scale size={18} color="#8b5cf6" /></InputAdornment>, endAdornment: <InputAdornment position="end">kg</InputAdornment> }} />
                  </Grid>

                  <Grid item xs={12} sx={{ mt: 2 }}>
                    <Button fullWidth type="submit" variant="contained" size="large" disabled={isSubmitting} sx={{ background: 'linear-gradient(90deg, #6366f1, #ec4899)', py: 1.5, fontWeight: 600, borderRadius: 2 }}>
                      {isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Save Medical Entry'}
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Paper>
          </motion.div>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <motion.div variants={itemVariants}>
              <Paper sx={{ p: 4, borderRadius: 3 }}>
                <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AlertCircle size={18} color="#f59e0b" /> Entry Guidelines
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Ensure readings are taken while at rest. For Blood Pressure, wait at least 5 minutes before measuring.
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {['BP Systolic', 'BP Diastolic', 'Heart Rate', 'Blood Sugar', 'SpO2', 'Body Temp', 'Weight'].map(tag => (
                    <Chip key={tag} label={tag} size="small" sx={{ fontSize: '0.7rem' }} />
                  ))}
                </Box>
              </Paper>
            </motion.div>
          </Box>
        </Grid>
      </Grid>

      <Snackbar open={toast.open} autoHideDuration={4000} onClose={() => setToast(prev => ({ ...prev, open: false }))} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={() => setToast(prev => ({ ...prev, open: false }))} severity={toast.severity} sx={{ width: '100%', borderRadius: 2 }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </motion.div>
  );
}

export default Analytics;
