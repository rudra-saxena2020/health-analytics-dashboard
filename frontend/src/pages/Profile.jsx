import { useState } from 'react';
import { Box, Typography, Paper, TextField, Button, Grid, Avatar, Divider, Chip, IconButton, InputAdornment } from '@mui/material';
import { motion } from 'framer-motion';
import { User, Mail, Calendar, UserCheck, Save, Camera } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

function Profile() {
  const { user, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    age: user?.age || '',
    gender: user?.gender || '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    try {
      await updateProfile(formData);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="800" gutterBottom>Profile Details</Typography>
        <Typography variant="body1" color="text.secondary">View and manage your personal health profile.</Typography>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', height: '100%' }}>
            <Box sx={{ position: 'relative', mb: 3 }}>
              <Avatar
                sx={{ 
                  width: 120, 
                  height: 120, 
                  fontSize: '3rem',
                  background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
                  boxShadow: '0 8px 24px rgba(99, 102, 241, 0.4)'
                }}
              >
                {formData.name.charAt(0)}
              </Avatar>
              <IconButton 
                sx={{ 
                  position: 'absolute', bottom: 0, right: 0, 
                  backgroundColor: 'background.paper', border: '1px solid rgba(255,255,255,0.1)',
                  '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' }
                }}
                size="small"
              >
                <Camera size={16} />
              </IconButton>
            </Box>
            <Typography variant="h5" fontWeight="700">{formData.name}</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{formData.email}</Typography>
            
            <Divider sx={{ width: '100%', my: 2 }} />
            
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
              <Chip label="Premium Member" color="primary" size="small" variant="outlined" />
              <Chip label="Verified" color="secondary" size="small" variant="outlined" />
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 4 }}>
            <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
              <UserCheck size={20} /> Personal Information
            </Typography>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: <InputAdornment position="start"><User size={18} /></InputAdornment>
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email Address"
                    name="email"
                    value={formData.email}
                    disabled
                    InputProps={{
                      startAdornment: <InputAdornment position="start"><Mail size={18} /></InputAdornment>
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Age"
                    name="age"
                    type="number"
                    value={formData.age}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: <InputAdornment position="start"><Calendar size={18} /></InputAdornment>
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    size="large"
                    type="submit"
                    disabled={loading}
                    startIcon={success ? null : <Save size={20} />}
                    sx={{ minWidth: 160 }}
                  >
                    {loading ? 'Saving...' : success ? 'Saved Successfully!' : 'Save Changes'}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Grid>
      </Grid>
    </motion.div>
  );
}

export default Profile;
