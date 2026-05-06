import { useState, useEffect } from 'react';
import { 
  Box, Typography, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Chip, IconButton, 
  Tooltip, CircularProgress, Alert
} from '@mui/material';
import { motion } from 'framer-motion';
import { RefreshCcw, Download, Trash2, Calendar, FileText } from 'lucide-react';
import axios from 'axios';
import config from '../config';

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

function Records() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const res = await axios.get(`${config.API_URL}/health-data`);
      // Sort by date descending
      const sorted = res.data.sort((a, b) => new Date(b.date) - new Date(a.date));
      setData(sorted);
      setError(null);
    } catch (err) {
      setError('Failed to load records. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
  }, []);

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this record?')) return;
    
    try {
      await axios.delete(`${config.API_URL}/health-data/${id}`);
      fetchData(); // Refresh list
    } catch (err) {
      console.error("Error deleting record:", err);
      alert("Failed to delete record.");
    }
  };

  const getStatusColor = (val, min, max) => {
    if (!val) return 'default';
    if (val < min || val > max) return 'error';
    return 'success';
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show">
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>Health Records</Typography>
          <Typography variant="body1" color="text.secondary">Comprehensive history of all submitted medical vitals.</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Tooltip title="Refresh Data">
            <IconButton onClick={fetchData} sx={{ background: 'rgba(255,255,255,0.05)' }}>
              <RefreshCcw size={20} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Export CSV">
            <IconButton sx={{ background: 'rgba(255,255,255,0.05)' }}>
              <Download size={20} />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 10 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Paper sx={{ 
          borderRadius: 4, 
          overflow: 'hidden', 
          background: 'rgba(30, 41, 59, 0.4)', 
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.05)'
        }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ background: 'rgba(255,255,255,0.02)' }}>
                  <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>Date & Time</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>Blood Pressure</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>Heart Rate</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>Sugar</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>SpO2</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>Temp</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>Weight</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700, color: 'text.secondary' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((row) => (
                  <TableRow 
                    key={row._id}
                    sx={{ '&:hover': { background: 'rgba(255,255,255,0.02)' }, transition: 'background 0.2s' }}
                  >
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Calendar size={16} color="#6366f1" />
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{formatDate(row.date)}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={row.bloodPressureSystolic ? `${row.bloodPressureSystolic}/${row.bloodPressureDiastolic}` : '-'}
                        size="small"
                        color={getStatusColor(row.bloodPressureSystolic, 90, 140)}
                        variant="outlined"
                        sx={{ fontWeight: 700 }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>{row.heartRate ? `${row.heartRate} bpm` : '-'}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>{row.bloodSugar ? `${row.bloodSugar} mg/dL` : '-'}</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={row.oxygenSaturation ? `${row.oxygenSaturation}%` : '-'}
                        size="small"
                        color={!row.oxygenSaturation ? 'default' : row.oxygenSaturation < 95 ? 'error' : 'success'}
                        sx={{ fontWeight: 700 }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>{row.bodyTemperature ? `${row.bodyTemperature}°C` : '-'}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>{row.weight ? `${row.weight} kg` : '-'}</Typography>
                    </TableCell>
                    <TableCell align="right">
                      <IconButton 
                        size="small" 
                        color="error" 
                        sx={{ opacity: 0.6, '&:hover': { opacity: 1 } }}
                        onClick={() => handleDelete(row._id)}
                      >
                        <Trash2 size={16} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                {data.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 10 }}>
                      <FileText size={48} color="rgba(255,255,255,0.1)" style={{ marginBottom: 16 }} />
                      <Typography color="text.secondary">No health records found.</Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
    </motion.div>
  );
}

export default Records;
