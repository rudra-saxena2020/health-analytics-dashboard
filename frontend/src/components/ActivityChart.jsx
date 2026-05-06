import { Paper, Typography, Box } from '@mui/material';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <Box sx={{ background: 'rgba(15, 23, 42, 0.9)', p: 2, borderRadius: 2, border: '1px solid rgba(255,255,255,0.1)' }}>
        <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>{label}</Typography>
        <Typography variant="body2" sx={{ color: '#6366f1' }}>Steps: {payload[0].value}</Typography>
        <Typography variant="body2" sx={{ color: '#ec4899' }}>Calories: {payload[1].value} kcal</Typography>
      </Box>
    );
  }
  return null;
};

function ActivityChart({ data }) {
  // Format data for chart
  const chartData = data.map(d => ({
    name: new Date(d.date).toLocaleDateString('en-US', { weekday: 'short' }),
    steps: d.steps,
    calories: d.caloriesBurned
  }));

  return (
    <Paper sx={{ p: 3, height: '100%', minHeight: 400 }}>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>Activity Overview</Typography>
      <Box sx={{ width: '100%', height: 320, minWidth: 0, minHeight: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorSteps" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorCalories" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ec4899" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#ec4899" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="name" stroke="rgba(255,255,255,0.2)" tick={{fill: '#94a3b8'}} />
            <YAxis stroke="rgba(255,255,255,0.2)" tick={{fill: '#94a3b8'}} />
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="steps" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorSteps)" />
            <Area type="monotone" dataKey="calories" stroke="#ec4899" strokeWidth={3} fillOpacity={1} fill="url(#colorCalories)" />
          </AreaChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
}

export default ActivityChart;
