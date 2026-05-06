import { useState, useEffect, useMemo } from 'react';
import { Box, Typography, Grid, Paper, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { motion } from 'framer-motion';
import {
  Activity, Heart, Droplets, Thermometer, Scale, AlertCircle
} from 'lucide-react';
import axios from 'axios';
import config from '../config';
import MetricCard from '../components/MetricCard';
import HealthScore from '../components/HealthScore';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area,
  PieChart, Pie, Cell, BarChart, Bar, Legend
} from 'recharts';
import { getHealthStatus } from '../utils/healthRanges';

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};


// Medical Normalization Helper
const normalize = (val, ideal, range) => {
  if (!val) return 0;
  const diff = Math.abs(val - ideal);
  const score = Math.max(0, 100 - (diff / range) * 100);
  return score;
};

const normalizeSpO2 = (val) => {
  if (!val) return 0;
  if (val >= 95) return 100;
  if (val < 70) return 0;
  return ((val - 70) / (95 - 70)) * 100;
};

function Dashboard() {
  const [userData, setUserData] = useState(null);
  const [healthData, setHealthData] = useState([]);
  const [chartView, setChartView] = useState('bp');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, dataRes] = await Promise.all([
          axios.get(`${config.API_URL}/users/profile`),
          axios.get(`${config.API_URL}/health-data`),
        ]);
        setUserData(userRes.data);
        setHealthData(dataRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  // Aggregated Analysis
  const analysis = useMemo(() => {
    if (healthData.length === 0) return null;

    const latest = healthData[healthData.length - 1];
    const prev = healthData[healthData.length - 2] || latest;
    
    const getTrend = (curr, old) => {
      if (!old) return 0;
      return ((curr - old) / old) * 100;
    };

    // Calculate Latest Metrics
    const latestMetrics = {
      bps: latest.bloodPressureSystolic || 0,
      bpd: latest.bloodPressureDiastolic || 0,
      hr: latest.heartRate || 0,
      bs: latest.bloodSugar || 0,
      spo2: latest.oxygenSaturation || 0,
      temp: latest.bodyTemperature || 0,
      weight: latest.weight || 0,
    };

    // Calculation for Bar Chart: Latest vs Previous (instead of average, as per user's "dont show average" intent)
    const comparisonData = [
      { name: 'Systolic', Current: latestMetrics.bps, Previous: prev.bloodPressureSystolic || 0 },
      { name: 'Diastolic', Current: latestMetrics.bpd, Previous: prev.bloodPressureDiastolic || 0 },
      { name: 'Heart Rate', Current: latestMetrics.hr, Previous: prev.heartRate || 0 },
      { name: 'Sugar', Current: latestMetrics.bs, Previous: prev.bloodSugar || 0 },
    ];

    // Stability Score Calculation for Pie Chart based on LATEST readings
    const currentScores = [
      normalize(latestMetrics.bps, 120, 40),
      normalize(latestMetrics.bpd, 80, 20),
      normalize(latestMetrics.hr, 70, 30),
      normalize(latestMetrics.bs, 90, 50),
      normalizeSpO2(latestMetrics.spo2),
      normalize(latestMetrics.temp, 37.0, 2),
    ];

    const stabilityData = [
      { name: 'Stable', value: currentScores.filter(s => s >= 90).length, color: '#10b981' },
      { name: 'Normal', value: currentScores.filter(s => s >= 70 && s < 90).length, color: '#3b82f6' },
      { name: 'Risk', value: currentScores.filter(s => s < 70).length, color: '#ef4444' },
    ].filter(s => s.value > 0);

    const dynamicScore = Math.round(currentScores.reduce((a, b) => a + b, 0) / currentScores.length);

    return { 
      latest: latestMetrics, dynamicScore, comparisonData, stabilityData,
      trends: {
        bps: getTrend(latestMetrics.bps, prev.bloodPressureSystolic),
        bpd: getTrend(latestMetrics.bpd, prev.bloodPressureDiastolic),
        hr: getTrend(latestMetrics.hr, prev.heartRate),
        bs: getTrend(latestMetrics.bs, prev.bloodSugar),
        spo2: getTrend(latestMetrics.spo2, prev.oxygenSaturation),
        temp: getTrend(latestMetrics.temp, prev.bodyTemperature),
        weight: getTrend(latestMetrics.weight, prev.weight),
      }
    };
  }, [healthData]);

  const chartData = useMemo(() => healthData.map(d => ({
    day: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    date: new Date(d.date),
    bps: d.bloodPressureSystolic || 0,
    bpd: d.bloodPressureDiastolic || 0,
    hr: d.heartRate || 0,
    bs: d.bloodSugar || 0,
    spo2: d.oxygenSaturation || 0,
    temp: d.bodyTemperature || 0,
    weight: d.weight || 0,
  })).sort((a, b) => a.date - b.date), [healthData]);

  const metrics = useMemo(() => {
    const rawMetrics = [
      { title: 'BP Systolic', value: analysis?.latest.bps || 0, unit: 'mmHg', icon: <Activity size={20} />, color: '#ef4444', trend: analysis?.trends.bps },
      { title: 'BP Diastolic', value: analysis?.latest.bpd || 0, unit: 'mmHg', icon: <Activity size={20} />, color: '#f87171', trend: analysis?.trends.bpd },
      { title: 'Heart Rate', value: analysis?.latest.hr || 0, unit: 'bpm', icon: <Heart size={20} />, color: '#ec4899', trend: analysis?.trends.hr },
      { title: 'Blood Sugar', value: analysis?.latest.bs || 0, unit: 'mg/dL', icon: <Droplets size={20} />, color: '#3b82f6', trend: analysis?.trends.bs },
      { title: 'SpO2', value: analysis?.latest.spo2 || 0, unit: '%', icon: <Activity size={20} />, color: '#10b981', trend: analysis?.trends.spo2 },
      { title: 'Body Temp', value: analysis?.latest.temp || 0, unit: '°C', icon: <Thermometer size={20} />, color: '#f59e0b', trend: analysis?.trends.temp },
      { title: 'Weight', value: analysis?.latest.weight || 0, unit: 'kg', icon: <Scale size={20} />, color: '#8b5cf6', trend: analysis?.trends.weight },
    ];

    return rawMetrics.map(m => {
      const { status, suggestion, color, type } = getHealthStatus(m.title, m.value);
      return { ...m, status, suggestion, statusType: type, statusColor: color, label: "Current Reading" };
    });
  }, [analysis]);

  if (!userData) return <Box sx={{ p: 4 }}><Typography>Loading Dashboard...</Typography></Box>;

  const hasData = (key) => chartData.some(d => d[key] > 0);

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>Medical Dashboard</Typography>
        <Typography variant="body1" color="text.secondary">Comprehensive clinical insights and historical analytics.</Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Main Score & KPI */}
        <Grid item xs={12} lg={4}>
          <HealthScore score={analysis?.dynamicScore || 0} momentum={analysis?.dynamicScore ? 10 : 0} />
        </Grid>

        <Grid item xs={12} lg={8}>
          <Grid container spacing={2}>
            {metrics.map((m, i) => (
              <Grid item xs={12} sm={6} md={4} key={i}>
                <MetricCard {...m} />
              </Grid>
            ))}
          </Grid>
        </Grid>

        {/* Breakdown Charts (Pie & Bar) */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 4, borderRadius: 4, background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(10px)', height: '100%' }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>Metric Stability</Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 3 }}>Distribution of healthy vs at-risk vitals</Typography>
            <Box sx={{ height: 300 }}>
              {analysis?.stabilityData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={analysis.stabilityData}
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {analysis.stabilityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: 8 }} />
                    <Legend verticalAlign="bottom" height={36}/>
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'text.secondary' }}>
                  No data to analyze stability
                </Box>
              )}
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 4, borderRadius: 4, background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(10px)', height: '100%' }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>Current vs Previous</Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 3 }}>Deviation of latest readings from your previous record</Typography>
            <Box sx={{ height: 300 }}>
              {analysis?.comparisonData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analysis.comparisonData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" fontSize={12} />
                    <YAxis stroke="rgba(255,255,255,0.3)" fontSize={12} />
                    <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: 8 }} />
                    <Legend />
                    <Bar dataKey="Current" fill="#6366f1" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Previous" fill="rgba(99, 102, 241, 0.3)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'text.secondary' }}>
                  No data for comparison
                </Box>
              )}
            </Box>
          </Paper>
        </Grid>

        {/* Historical Trends (Full Width) */}
        <Grid item xs={12}>
          <Paper sx={{ p: 4, borderRadius: 4, background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(10px)' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>Medical Trends</Typography>
                <Typography variant="caption" color="text.secondary">Historical progression over time</Typography>
              </Box>
              <ToggleButtonGroup 
                value={chartView} 
                exclusive 
                onChange={(e, val) => val && setChartView(val)}
                size="small"
                sx={{ background: 'rgba(255,255,255,0.05)', p: 0.5, borderRadius: 2 }}
              >
                <ToggleButton value="bp" sx={{ px: 2 }}>Blood Pressure</ToggleButton>
                <ToggleButton value="hr" sx={{ px: 2 }}>Heart Rate</ToggleButton>
                <ToggleButton value="sugar" sx={{ px: 2 }}>Sugar</ToggleButton>
                <ToggleButton value="vitals" sx={{ px: 2 }}>SpO2 & Temp</ToggleButton>
              </ToggleButtonGroup>
            </Box>

            <Box sx={{ height: 400, width: '100%' }}>
              {!hasData(chartView === 'bp' ? 'bps' : chartView === 'hr' ? 'hr' : chartView === 'sugar' ? 'bs' : 'spo2') ? (
                <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'text.secondary', opacity: 0.5 }}>
                  <AlertCircle size={48} strokeWidth={1} style={{ marginBottom: 16 }} />
                  <Typography variant="h6">No historical data available yet</Typography>
                </Box>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  {chartView === 'bp' ? (
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="colorBps" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="day" stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip 
                        contentStyle={{ background: '#1e293b', border: 'none', borderRadius: 8, boxShadow: '0 10px 15px -3px rgba(0,0,0,0.5)' }}
                      />
                      <Area type="monotone" dataKey="bps" stroke="#ef4444" fillOpacity={1} fill="url(#colorBps)" strokeWidth={3} name="Systolic" />
                      <Area type="monotone" dataKey="bpd" stroke="#f87171" fillOpacity={0} strokeWidth={2} name="Diastolic" />
                    </AreaChart>
                  ) : (
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="day" stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip 
                        contentStyle={{ background: '#1e293b', border: 'none', borderRadius: 8 }}
                      />
                      {chartView === 'hr' && <Line type="monotone" dataKey="hr" stroke="#ec4899" strokeWidth={3} dot={{ fill: '#ec4899' }} name="Heart Rate" />}
                      {chartView === 'sugar' && <Line type="monotone" dataKey="bs" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#3b82f6' }} name="Blood Sugar" />}
                      {chartView === 'vitals' && (
                        <>
                          <Line type="monotone" dataKey="spo2" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981' }} name="SpO2 %" />
                          <Line type="monotone" dataKey="temp" stroke="#f59e0b" strokeWidth={3} dot={{ fill: '#f59e0b' }} name="Temp °C" />
                        </>
                      )}
                    </LineChart>
                  )}
                </ResponsiveContainer>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </motion.div>
  );
}

export default Dashboard;
