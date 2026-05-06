import { useState } from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  Button, TextField, Grid, Typography, Box, InputAdornment, IconButton,
  Alert, Snackbar
} from '@mui/material';
import { motion } from 'framer-motion';
import { X, Activity, Heart, Droplets, Thermometer, Scale } from 'lucide-react';
import axios from 'axios';
import config from '../config';

function HealthDataInput({ open, onClose, onSubmitSuccess }) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().slice(0, 16), // datetime-local format
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error on change
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    const { bloodPressureSystolic, bloodPressureDiastolic, heartRate, oxygenSaturation, bodyTemperature, weight } = formData;
    
    if (bloodPressureSystolic && (bloodPressureSystolic < 50 || bloodPressureSystolic > 250)) newErrors.bloodPressureSystolic = 'Invalid range (50-250)';
    if (bloodPressureDiastolic && (bloodPressureDiastolic < 30 || bloodPressureDiastolic > 150)) newErrors.bloodPressureDiastolic = 'Invalid range (30-150)';
    if (heartRate && (heartRate < 30 || heartRate > 220)) newErrors.heartRate = 'Invalid range (30-220)';
    if (oxygenSaturation && (oxygenSaturation < 70 || oxygenSaturation > 100)) newErrors.oxygenSaturation = 'Invalid range (70-100%)';
    if (bodyTemperature && (bodyTemperature < 30 || bodyTemperature > 45)) newErrors.bodyTemperature = 'Invalid range (30-45°C)';
    if (weight && (weight < 20 || weight > 500)) newErrors.weight = 'Invalid range (20-500kg)';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const payload = { ...formData };
      // Convert empty strings to undefined or 0 if needed, but Mongoose handles omitted fields.
      // Better to convert strings to numbers where provided.
      Object.keys(payload).forEach(key => {
        if (key !== 'date' && payload[key] === '') {
          delete payload[key];
        } else if (key !== 'date') {
          payload[key] = Number(payload[key]);
        }
      });

      await axios.post(`${config.API_URL}/health-data`, payload);
      setToast({ open: true, message: 'Health data saved successfully!', severity: 'success' });
      
      // Give time for toast to show
      setTimeout(() => {
        onSubmitSuccess();
        handleClose();
      }, 1000);
      
    } catch (error) {
      setToast({ open: true, message: 'Failed to save data.', severity: 'error' });
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      date: new Date().toISOString().slice(0, 16),
      bloodPressureSystolic: '',
      bloodPressureDiastolic: '',
      heartRate: '',
      bloodSugar: '',
      oxygenSaturation: '',
      bodyTemperature: '',
      weight: ''
    });
    setErrors({});
    onClose();
  };

  return (
    <>
      <Dialog 
        open={open} 
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          component: motion.div,
          initial: { opacity: 0, y: 50 },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: 50 },
          sx: { 
            borderRadius: 3, 
            background: 'rgba(15, 23, 42, 0.95)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.1)'
          }
        }}
      >
        <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 600, background: 'linear-gradient(90deg, #6366f1, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Log Health Data
          </Typography>
          <IconButton onClick={handleClose} sx={{ color: 'text.secondary' }}>
            <X size={20} />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ borderColor: 'rgba(255,255,255,0.05)' }}>
          <Box component="form" id="health-data-form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Date & Time"
                  type="datetime-local"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="BP Systolic"
                  name="bloodPressureSystolic"
                  type="number"
                  value={formData.bloodPressureSystolic}
                  onChange={handleChange}
                  error={!!errors.bloodPressureSystolic}
                  helperText={errors.bloodPressureSystolic}
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><Activity size={18} color="#ef4444" /></InputAdornment>,
                    endAdornment: <InputAdornment position="end">mmHg</InputAdornment>,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="BP Diastolic"
                  name="bloodPressureDiastolic"
                  type="number"
                  value={formData.bloodPressureDiastolic}
                  onChange={handleChange}
                  error={!!errors.bloodPressureDiastolic}
                  helperText={errors.bloodPressureDiastolic}
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><Activity size={18} color="#ef4444" /></InputAdornment>,
                    endAdornment: <InputAdornment position="end">mmHg</InputAdornment>,
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Heart Rate"
                  name="heartRate"
                  type="number"
                  value={formData.heartRate}
                  onChange={handleChange}
                  error={!!errors.heartRate}
                  helperText={errors.heartRate}
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><Heart size={18} color="#ef4444" /></InputAdornment>,
                    endAdornment: <InputAdornment position="end">bpm</InputAdornment>,
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Blood Sugar (Optional)"
                  name="bloodSugar"
                  type="number"
                  value={formData.bloodSugar}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><Droplets size={18} color="#3b82f6" /></InputAdornment>,
                    endAdornment: <InputAdornment position="end">mg/dL</InputAdornment>,
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Oxygen Saturation (SpO2)"
                  name="oxygenSaturation"
                  type="number"
                  value={formData.oxygenSaturation}
                  onChange={handleChange}
                  error={!!errors.oxygenSaturation}
                  helperText={errors.oxygenSaturation}
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><Activity size={18} color="#10b981" /></InputAdornment>,
                    endAdornment: <InputAdornment position="end">%</InputAdornment>,
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Body Temperature"
                  name="bodyTemperature"
                  type="number"
                  inputProps={{ step: "0.1" }}
                  value={formData.bodyTemperature}
                  onChange={handleChange}
                  error={!!errors.bodyTemperature}
                  helperText={errors.bodyTemperature}
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><Thermometer size={18} color="#f59e0b" /></InputAdornment>,
                    endAdornment: <InputAdornment position="end">°C</InputAdornment>,
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Weight"
                  name="weight"
                  type="number"
                  inputProps={{ step: "0.1" }}
                  value={formData.weight}
                  onChange={handleChange}
                  error={!!errors.weight}
                  helperText={errors.weight}
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><Scale size={18} color="#8b5cf6" /></InputAdornment>,
                    endAdornment: <InputAdornment position="end">kg</InputAdornment>,
                  }}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleClose} sx={{ color: 'text.secondary' }}>Cancel</Button>
          <Button 
            type="submit" 
            form="health-data-form"
            variant="contained" 
            disabled={isSubmitting}
            sx={{ 
              background: 'linear-gradient(90deg, #6366f1, #ec4899)',
              '&:hover': { opacity: 0.9 }
            }}
          >
            {isSubmitting ? 'Saving...' : 'Save Data'}
          </Button>
        </DialogActions>
      </Dialog>
      
      <Snackbar open={toast.open} autoHideDuration={4000} onClose={() => setToast(prev => ({ ...prev, open: false }))} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={() => setToast(prev => ({ ...prev, open: false }))} severity={toast.severity} sx={{ width: '100%' }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </>
  );
}

export default HealthDataInput;
