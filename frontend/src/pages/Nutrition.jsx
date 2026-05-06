import { useState, useMemo } from 'react';
import { Box, Typography, Paper, Grid, TextField, Button, Table, TableBody, TableCell, TableHead, TableRow, IconButton, Select, MenuItem, FormControl, InputLabel, CircularProgress, Chip } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Trash2, Sparkles } from 'lucide-react';

const GOALS = {
  weight_loss: { name: 'Weight Loss', macros: { protein: 45, carbs: 25, fat: 30 } },
  maintenance: { name: 'Maintenance', macros: { protein: 30, carbs: 40, fat: 30 } },
  muscle_gain: { name: 'Muscle Gain', macros: { protein: 30, carbs: 50, fat: 20 } },
};

const SUGGESTED_PLANS = {
  weight_loss: [
    { meal: 'Breakfast', food: '3 Egg Whites, 1/2 cup Oatmeal', cals: 250 },
    { meal: 'Lunch', food: '150g Grilled Chicken, Mixed Greens', cals: 350 },
    { meal: 'Dinner', food: '150g Baked Cod, 100g Broccoli', cals: 300 },
    { meal: 'Snack', food: '1 Greek Yogurt, Handful Almonds', cals: 200 },
  ],
  maintenance: [
    { meal: 'Breakfast', food: '2 Whole Eggs, 1 cup Oatmeal, Berries', cals: 400 },
    { meal: 'Lunch', food: '150g Chicken Breast, 100g Brown Rice', cals: 500 },
    { meal: 'Dinner', food: '150g Salmon, Asparagus, Quinoa', cals: 600 },
    { meal: 'Snack', food: 'Protein Shake, 1 Apple', cals: 300 },
  ],
  muscle_gain: [
    { meal: 'Breakfast', food: '3 Whole Eggs, 1.5 cup Oatmeal, Banana', cals: 600 },
    { meal: 'Lunch', food: '200g Chicken, 150g Rice, Avocado', cals: 750 },
    { meal: 'Dinner', food: '200g Steak, Sweet Potato, Veggies', cals: 850 },
    { meal: 'Snack', food: 'Mass Gainer Shake, Peanut Butter', cals: 500 },
  ],
};

// AI Food Database - per standard serving
const AI_FOOD_DB = {
  'chicken breast': { serving: '100g', cal: 165, p: 31, c: 0, f: 3.6 },
  'chicken': { serving: '100g', cal: 165, p: 31, c: 0, f: 3.6 },
  'grilled chicken': { serving: '100g', cal: 165, p: 31, c: 0, f: 3.6 },
  'rice': { serving: '1 cup cooked', cal: 206, p: 4.3, c: 45, f: 0.4 },
  'brown rice': { serving: '1 cup cooked', cal: 216, p: 5, c: 45, f: 1.8 },
  'white rice': { serving: '1 cup cooked', cal: 206, p: 4.3, c: 45, f: 0.4 },
  'egg': { serving: '1 large', cal: 78, p: 6, c: 0.6, f: 5 },
  'boiled egg': { serving: '1 large', cal: 78, p: 6, c: 0.6, f: 5 },
  'apple': { serving: '1 medium', cal: 95, p: 0.5, c: 25, f: 0.3 },
  'banana': { serving: '1 medium', cal: 105, p: 1.3, c: 27, f: 0.4 },
  'oatmeal': { serving: '1 cup cooked', cal: 154, p: 5, c: 27, f: 2.6 },
  'salmon': { serving: '100g fillet', cal: 208, p: 20, c: 0, f: 13 },
  'steak': { serving: '100g', cal: 271, p: 26, c: 0, f: 18 },
  'beef': { serving: '100g', cal: 250, p: 26, c: 0, f: 15 },
  'broccoli': { serving: '1 cup', cal: 55, p: 3.7, c: 11, f: 0.6 },
  'milk': { serving: '1 glass (250ml)', cal: 103, p: 8, c: 12, f: 2.4 },
  'yogurt': { serving: '1 cup', cal: 100, p: 17, c: 6, f: 0.7 },
  'greek yogurt': { serving: '1 cup', cal: 100, p: 17, c: 6, f: 0.7 },
  'bread': { serving: '1 slice', cal: 79, p: 2.7, c: 15, f: 1 },
  'pasta': { serving: '1 cup cooked', cal: 220, p: 8, c: 43, f: 1.3 },
  'potato': { serving: '1 medium', cal: 161, p: 4.3, c: 37, f: 0.2 },
  'sweet potato': { serving: '1 medium', cal: 103, p: 2.3, c: 24, f: 0.1 },
  'almonds': { serving: '1 handful (28g)', cal: 164, p: 6, c: 6, f: 14 },
  'peanut butter': { serving: '2 tbsp', cal: 188, p: 8, c: 6, f: 16 },
  'avocado': { serving: '1/2 fruit', cal: 161, p: 2, c: 9, f: 15 },
  'cheese': { serving: '1 slice (28g)', cal: 113, p: 7, c: 0.4, f: 9 },
  'paneer': { serving: '100g', cal: 265, p: 18, c: 1.2, f: 21 },
  'dal': { serving: '1 cup cooked', cal: 198, p: 14, c: 34, f: 0.8 },
  'roti': { serving: '1 piece', cal: 104, p: 3, c: 18, f: 3.5 },
  'chapati': { serving: '1 piece', cal: 104, p: 3, c: 18, f: 3.5 },
  'idli': { serving: '1 piece', cal: 39, p: 2, c: 8, f: 0.2 },
  'dosa': { serving: '1 piece', cal: 133, p: 4, c: 19, f: 4.6 },
  'tofu': { serving: '100g', cal: 76, p: 8, c: 1.9, f: 4.8 },
  'fish': { serving: '100g fillet', cal: 206, p: 22, c: 0, f: 12 },
  'tuna': { serving: '100g', cal: 132, p: 29, c: 0, f: 1 },
  'shrimp': { serving: '100g', cal: 99, p: 24, c: 0.2, f: 0.3 },
  'protein shake': { serving: '1 scoop', cal: 120, p: 24, c: 3, f: 1 },
  'whey protein': { serving: '1 scoop', cal: 120, p: 24, c: 3, f: 1 },
  'orange': { serving: '1 medium', cal: 62, p: 1.2, c: 15, f: 0.2 },
  'mango': { serving: '1 cup sliced', cal: 99, p: 1.4, c: 25, f: 0.6 },
  'spinach': { serving: '1 cup', cal: 7, p: 0.9, c: 1.1, f: 0.1 },
  'corn': { serving: '1 cup', cal: 177, p: 5.4, c: 41, f: 2.1 },
};

const COLORS = ['#6366f1', '#ec4899', '#10b981'];

const ChartTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <Box sx={{ background: 'rgba(15,23,42,0.9)', p: 1.5, borderRadius: 2, border: '1px solid rgba(255,255,255,0.1)' }}>
        <Typography variant="body2" sx={{ color: payload[0].payload.fill, fontWeight: 600 }}>
          {payload[0].name}: {payload[0].value}{payload[0].payload.unit || ''}
        </Typography>
      </Box>
    );
  }
  return null;
};

function Nutrition() {
  const [goal, setGoal] = useState('weight_loss');
  const [customPlan, setCustomPlan] = useState([]);
  const [foodInput, setFoodInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [aiError, setAiError] = useState('');

  const suggestedData = useMemo(() => {
    const macros = GOALS[goal].macros;
    return [
      { name: 'Protein', value: macros.protein },
      { name: 'Carbs', value: macros.carbs },
      { name: 'Fat', value: macros.fat },
    ];
  }, [goal]);

  const customMacros = useMemo(() => {
    let protein = 0, carbs = 0, fat = 0;
    customPlan.forEach(item => {
      protein += item.protein;
      carbs += item.carbs;
      fat += item.fat;
    });
    if (protein === 0 && carbs === 0 && fat === 0) return [];
    return [
      { name: 'Protein', value: Math.round(protein) },
      { name: 'Carbs', value: Math.round(carbs) },
      { name: 'Fat', value: Math.round(fat) },
    ];
  }, [customPlan]);

  const totalCalories = useMemo(() => {
    return customPlan.reduce((sum, item) => sum + item.calories, 0);
  }, [customPlan]);

  // AI Analysis: user types just a food name, AI generates everything
  const handleAnalyze = () => {
    if (!foodInput.trim()) return;
    setIsAnalyzing(true);
    setAiError('');
    setAiResult(null);

    setTimeout(() => {
      const input = foodInput.trim().toLowerCase();

      // Try exact match first, then partial match
      let matched = AI_FOOD_DB[input];
      if (!matched) {
        for (const key of Object.keys(AI_FOOD_DB)) {
          if (input.includes(key) || key.includes(input)) {
            matched = AI_FOOD_DB[key];
            break;
          }
        }
      }

      if (matched) {
        const result = {
          name: foodInput.trim().charAt(0).toUpperCase() + foodInput.trim().slice(1),
          serving: matched.serving,
          calories: matched.cal,
          protein: matched.p,
          carbs: matched.c,
          fat: matched.f,
        };
        setAiResult(result);
      } else {
        setAiError(`Could not find "${foodInput}". Try: chicken, rice, egg, banana, salmon, paneer, dal, roti, pasta, etc.`);
      }
      setIsAnalyzing(false);
    }, 1000);
  };

  const handleAddResult = () => {
    if (!aiResult) return;
    setCustomPlan(prev => [...prev, { ...aiResult, id: Date.now() }]);
    setAiResult(null);
    setFoodInput('');
  };

  const handleDeleteItem = (id) => {
    setCustomPlan(customPlan.filter(item => item.id !== id));
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" gutterBottom>Nutrition Tracking</Typography>
          <Typography variant="body1" color="text.secondary">AI-powered food analysis & macro tracking.</Typography>
        </Box>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Health Goal</InputLabel>
          <Select value={goal} label="Health Goal" onChange={(e) => setGoal(e.target.value)} sx={{ background: 'rgba(30,41,59,0.5)' }}>
            {Object.keys(GOALS).map(key => (
              <MenuItem key={key} value={key}>{GOALS[key].name}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Grid container spacing={4}>
        {/* Suggested Macros + Diet Plan */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Suggested Macros ({GOALS[goal].name})</Typography>
            <Box sx={{ width: '100%', height: 250, minWidth: 0, minHeight: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={suggestedData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value" animationDuration={1000}>
                    {suggestedData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                  </Pie>
                  <Tooltip content={<ChartTooltip />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Box>
            <Box sx={{ mt: 2, background: 'rgba(255,255,255,0.03)', p: 2, borderRadius: 2, border: '1px solid rgba(255,255,255,0.05)' }}>
              <Typography variant="subtitle2" color="primary" sx={{ mb: 1.5, fontWeight: 700 }}>Recommended Daily Plan</Typography>
              <Table size="small">
                <TableBody>
                  {SUGGESTED_PLANS[goal].map((meal, idx) => (
                    <TableRow key={idx} sx={{ '& td': { borderBottom: 'none', py: 0.5 } }}>
                      <TableCell sx={{ color: 'text.secondary', width: 80, fontWeight: 600 }}>{meal.meal}</TableCell>
                      <TableCell>{meal.food}</TableCell>
                      <TableCell align="right" sx={{ color: 'text.secondary' }}>{meal.cals} kcal</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Paper>
        </Grid>

        {/* Your Diet Plan Macros Chart */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Your Diet Plan Macros</Typography>
              <Chip label={`${totalCalories} kcal Total`} color="secondary" size="small" />
            </Box>
            {customMacros.length > 0 ? (
              <Box sx={{ width: '100%', height: 250, minWidth: 0, minHeight: 0 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={customMacros.map(d => ({ ...d, unit: 'g' }))} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value" animationDuration={1000}>
                      {customMacros.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                    </Pie>
                    <Tooltip content={<ChartTooltip />} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            ) : (
              <Box sx={{ height: 250, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 1 }}>
                <Sparkles size={32} color="#ec4899" />
                <Typography color="text.secondary">Use the AI analyzer below to add food items.</Typography>
              </Box>
            )}
            <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 2 }}>
              Actual breakdown based on your logged meals.
            </Typography>
          </Paper>
        </Grid>

        {/* AI Food Analyzer */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
              <Sparkles size={22} color="#ec4899" />
              <Typography variant="h6">AI Food Analyzer</Typography>
              <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>Just type a food name — AI does the rest</Typography>
            </Box>

            {/* Input */}
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <TextField
                fullWidth
                placeholder="Type any food item... e.g. chicken breast, banana, paneer, dal"
                value={foodInput}
                onChange={(e) => { setFoodInput(e.target.value); setAiError(''); setAiResult(null); }}
                onKeyPress={(e) => e.key === 'Enter' && handleAnalyze()}
                disabled={isAnalyzing}
                InputProps={{ startAdornment: <Sparkles size={18} color="#ec4899" style={{ marginRight: 10 }} /> }}
                sx={{ '& .MuiOutlinedInput-root': { background: 'rgba(0,0,0,0.2)', '&.Mui-focused': { boxShadow: '0 0 0 2px rgba(236,72,153,0.3)' } } }}
              />
              <Button variant="contained" onClick={handleAnalyze} disabled={isAnalyzing || !foodInput.trim()} sx={{ height: 56, minWidth: 160, background: 'linear-gradient(45deg, #6366f1, #ec4899)' }}>
                {isAnalyzing ? <CircularProgress size={24} color="inherit" /> : '🔍 Analyze Food'}
              </Button>
            </Box>

            {aiError && <Typography variant="body2" color="error" sx={{ mb: 2 }}>{aiError}</Typography>}

            {/* AI Result Card */}
            <AnimatePresence>
              {aiResult && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <Box sx={{ mb: 3, p: 3, borderRadius: 3, background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(236,72,153,0.1))', border: '1px solid rgba(236,72,153,0.2)' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>{aiResult.name}</Typography>
                        <Typography variant="caption" color="text.secondary">Per serving: {aiResult.serving}</Typography>
                      </Box>
                      <Chip icon={<Sparkles size={14} />} label="AI Generated" size="small" sx={{ background: 'rgba(236,72,153,0.15)', color: '#f472b6' }} />
                    </Box>
                    <Grid container spacing={2} sx={{ mb: 2 }}>
                      <Grid item xs={3}>
                        <Box sx={{ textAlign: 'center', p: 1.5, borderRadius: 2, background: 'rgba(255,255,255,0.05)' }}>
                          <Typography variant="h5" sx={{ fontWeight: 700, color: '#f59e0b' }}>{aiResult.calories}</Typography>
                          <Typography variant="caption" color="text.secondary">Calories</Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={3}>
                        <Box sx={{ textAlign: 'center', p: 1.5, borderRadius: 2, background: 'rgba(255,255,255,0.05)' }}>
                          <Typography variant="h5" sx={{ fontWeight: 700, color: '#6366f1' }}>{aiResult.protein}g</Typography>
                          <Typography variant="caption" color="text.secondary">Protein</Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={3}>
                        <Box sx={{ textAlign: 'center', p: 1.5, borderRadius: 2, background: 'rgba(255,255,255,0.05)' }}>
                          <Typography variant="h5" sx={{ fontWeight: 700, color: '#ec4899' }}>{aiResult.carbs}g</Typography>
                          <Typography variant="caption" color="text.secondary">Carbs</Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={3}>
                        <Box sx={{ textAlign: 'center', p: 1.5, borderRadius: 2, background: 'rgba(255,255,255,0.05)' }}>
                          <Typography variant="h5" sx={{ fontWeight: 700, color: '#10b981' }}>{aiResult.fat}g</Typography>
                          <Typography variant="caption" color="text.secondary">Fat</Typography>
                        </Box>
                      </Grid>
                    </Grid>
                    <Button fullWidth variant="contained" onClick={handleAddResult} sx={{ background: 'linear-gradient(45deg, #6366f1, #ec4899)' }}>
                      + Add to My Diet Plan
                    </Button>
                  </Box>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Logged Food Table */}
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Food Item</TableCell>
                  <TableCell align="right">Serving</TableCell>
                  <TableCell align="right">Calories</TableCell>
                  <TableCell align="right">Protein</TableCell>
                  <TableCell align="right">Carbs</TableCell>
                  <TableCell align="right">Fat</TableCell>
                  <TableCell align="right">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <AnimatePresence>
                  {customPlan.map((item) => (
                    <motion.tr key={item.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell align="right">{item.serving}</TableCell>
                      <TableCell align="right">{item.calories} kcal</TableCell>
                      <TableCell align="right">{item.protein}g</TableCell>
                      <TableCell align="right">{item.carbs}g</TableCell>
                      <TableCell align="right">{item.fat}g</TableCell>
                      <TableCell align="right">
                        <IconButton size="small" color="error" onClick={() => handleDeleteItem(item.id)}>
                          <Trash2 size={16} />
                        </IconButton>
                      </TableCell>
                    </motion.tr>
                  ))}
                </AnimatePresence>
                {customPlan.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 3, color: 'text.secondary' }}>
                      No items logged yet. Type a food name above and let AI analyze it!
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Paper>
        </Grid>
      </Grid>
    </motion.div>
  );
}

export default Nutrition;
