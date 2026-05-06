import { useState } from 'react';
import { Box, IconButton, Typography, Avatar, Menu as MuiMenu, MenuItem, Divider } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, Home, Activity, PieChart, Settings, Bell, FileText, User, LogOut } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const DRAWER_WIDTH_OPEN = 260;
const DRAWER_WIDTH_CLOSED = 80;

const menuItems = [
  { text: 'Dashboard', icon: <Home size={24} />, path: '/' },
  { text: 'Analytics', icon: <Activity size={24} />, path: '/analytics' },
  { text: 'Records', icon: <FileText size={24} />, path: '/records' },
  { text: 'Nutrition', icon: <PieChart size={24} />, path: '/nutrition' },
  { text: 'Profile', icon: <User size={24} />, path: '/profile' },
  { text: 'Settings', icon: <Settings size={24} />, path: '/settings' },
];

function Layout({ children }) {
  const [open, setOpen] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const toggleDrawer = () => setOpen(!open);

  const handleProfileMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleProfileMenuClose = () => setAnchorEl(null);

  const handleLogout = () => {
    handleProfileMenuClose();
    logout();
    navigate('/login');
  };

  // Don't show layout on login/signup pages
  if (['/login', '/signup'].includes(location.pathname)) {
    return <>{children}</>;
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', overflow: 'hidden' }}>
      {/* Animated Sidebar */}
      <motion.div
        animate={{ width: open ? DRAWER_WIDTH_OPEN : DRAWER_WIDTH_CLOSED }}
        transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
        style={{
          background: 'rgba(30, 41, 59, 0.6)',
          backdropFilter: 'blur(20px)',
          borderRight: '1px solid rgba(255, 255, 255, 0.05)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 100,
        }}
      >
        <Box sx={{ p: 3, display: 'flex', alignItems: 'center', justifyContent: open ? 'space-between' : 'center' }}>
          {open && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, background: 'linear-gradient(45deg, #6366f1, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                HealthOS
              </Typography>
            </motion.div>
          )}
          <IconButton onClick={toggleDrawer} sx={{ color: 'text.primary' }}>
            <Menu size={20} />
          </IconButton>
        </Box>

        <Box sx={{ flexGrow: 1, px: 2, py: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Box
                key={item.text}
                onClick={() => navigate(item.path)}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  p: 1.5,
                  borderRadius: 2,
                  cursor: 'pointer',
                  color: isActive ? 'white' : 'text.secondary',
                  background: isActive ? 'linear-gradient(45deg, rgba(99, 102, 241, 0.2), rgba(236, 72, 153, 0.2))' : 'transparent',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.05)',
                    color: 'white',
                  },
                }}
              >
                <Box sx={{ minWidth: 40, display: 'flex', justifyContent: 'center' }}>{item.icon}</Box>
                <AnimatePresence>
                  {open && (
                    <motion.div
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}
                    >
                      <Typography sx={{ ml: 1, fontWeight: isActive ? 600 : 400 }}>{item.text}</Typography>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Box>
            );
          })}
        </Box>
      </motion.div>

      {/* Main Content Area */}
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Top Navbar */}
        <Box sx={{ 
          height: 80, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'flex-end', 
          px: 4,
          background: 'rgba(15, 23, 42, 0.4)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
        }}>
          <IconButton sx={{ mr: 2, color: 'text.primary' }}>
            <Bell size={20} />
          </IconButton>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, cursor: 'pointer' }} onClick={handleProfileMenuOpen}>
            <Box sx={{ textAlign: 'right', display: { xs: 'none', sm: 'block' } }}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>{user?.name || 'Guest User'}</Typography>
              <Typography variant="caption" color="text.secondary">{user?.email || 'Login to sync data'}</Typography>
            </Box>
            <Avatar sx={{ background: 'linear-gradient(45deg, #6366f1, #ec4899)' }}>
              {user?.name?.charAt(0) || 'U'}
            </Avatar>
          </Box>

          <MuiMenu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleProfileMenuClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            PaperProps={{
              sx: {
                mt: 1.5,
                minWidth: 180,
                background: 'rgba(30, 41, 59, 0.9)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }
            }}
          >
            <MenuItem onClick={() => { handleProfileMenuClose(); navigate('/profile'); }}>
              <User size={18} style={{ marginRight: 12 }} /> Profile
            </MenuItem>
            <MenuItem onClick={() => { handleProfileMenuClose(); navigate('/settings'); }}>
              <Settings size={18} style={{ marginRight: 12 }} /> Settings
            </MenuItem>
            <Divider sx={{ my: 1, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
            <MenuItem onClick={handleLogout} sx={{ color: '#ef4444' }}>
              <LogOut size={18} style={{ marginRight: 12 }} /> Logout
            </MenuItem>
          </MuiMenu>
        </Box>

        {/* Page Content */}
        <Box sx={{ flexGrow: 1, p: 4, overflowY: 'auto' }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}

export default Layout;
