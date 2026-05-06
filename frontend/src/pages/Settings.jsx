import { useState } from 'react';
import { Box, Typography, Paper, Switch, Slider, Divider, Button, Alert, Collapse } from '@mui/material';
import { motion } from 'framer-motion';
import { Moon, Sun, Droplets, Bell, CheckCircle2 } from 'lucide-react';
import { useThemeMode } from '../context/ThemeContext';

function Settings() {
  const { mode, toggleTheme } = useThemeMode();
  const [waterInterval, setWaterInterval] = useState(() => {
    return parseInt(localStorage.getItem('waterReminderInterval')) || 2;
  });
  const [remindersEnabled, setRemindersEnabled] = useState(() => {
    return localStorage.getItem('waterRemindersEnabled') === 'true';
  });
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSave = () => {
    localStorage.setItem('waterReminderInterval', waterInterval);
    localStorage.setItem('waterRemindersEnabled', remindersEnabled);
    
    if (remindersEnabled && Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
    
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="800" gutterBottom>Settings</Typography>
        <Typography variant="body1" color="text.secondary">Customize your dashboard experience and alerts.</Typography>
      </Box>

      <Collapse in={showSuccess}>
        <Alert icon={<CheckCircle2 size={20} />} severity="success" sx={{ mb: 3, borderRadius: 2 }}>
          Settings saved successfully!
        </Alert>
      </Collapse>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {/* Appearance Section */}
        <Paper sx={{ p: 4 }}>
          <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Sun size={20} /> Appearance
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box>
              <Typography variant="subtitle1" fontWeight="600">Theme Mode</Typography>
              <Typography variant="body2" color="text.secondary">Switch between light and dark themes</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Sun size={18} color={mode === 'light' ? '#6366f1' : '#94a3b8'} />
              <Switch checked={mode === 'dark'} onChange={toggleTheme} color="primary" />
              <Moon size={18} color={mode === 'dark' ? '#6366f1' : '#94a3b8'} />
            </Box>
          </Box>
        </Paper>

        {/* Health Reminders Section */}
        <Paper sx={{ p: 4 }}>
          <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Bell size={20} /> Health Reminders
          </Typography>
          
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Droplets size={24} color="#6366f1" />
                <Box>
                  <Typography variant="subtitle1" fontWeight="600">Water Drinking Reminder</Typography>
                  <Typography variant="body2" color="text.secondary">Stay hydrated with periodic alerts</Typography>
                </Box>
              </Box>
              <Switch 
                checked={remindersEnabled} 
                onChange={(e) => setRemindersEnabled(e.target.checked)} 
                color="secondary" 
              />
            </Box>
            
            <Box sx={{ px: 2, mt: 4, opacity: remindersEnabled ? 1 : 0.5, pointerEvents: remindersEnabled ? 'auto' : 'none' }}>
              <Typography variant="body2" gutterBottom>Reminder Interval: <b>Every {waterInterval} hours</b></Typography>
              <Slider
                value={waterInterval}
                min={1}
                max={6}
                step={0.5}
                marks={[
                  { value: 1, label: '1h' },
                  { value: 2, label: '2h' },
                  { value: 4, label: '4h' },
                  { value: 6, label: '6h' },
                ]}
                onChange={(e, newValue) => setWaterInterval(newValue)}
                color="secondary"
              />
            </Box>
          </Box>
          
          <Divider sx={{ my: 3 }} />
          
          <Button 
            variant="contained" 
            size="large" 
            onClick={handleSave}
            sx={{ minWidth: 160 }}
          >
            Save Settings
          </Button>
        </Paper>
      </Box>
    </motion.div>
  );
}

export default Settings;
