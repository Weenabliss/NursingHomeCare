import express from 'express';
import cors from 'cors';
import { solveSchedule } from './solver/ScheduleSolver';

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/schedule/auto', async (req, res) => {
  try {
    const { month, year, ensureFairness, strictRest, shiftRequirements, offDaysPerWeek, staffNames, mode, currentRoster } = req.body;
    
    // In a real app, we would fetch staff and shifts from a database here.
    // For this prototype, the solver will use mock constraints and return a structured roster.
    const { rosterData, warnings } = await solveSchedule({ month, year, ensureFairness, strictRest, shiftRequirements, offDaysPerWeek, staffNames, mode, currentRoster });
    
    res.json({ success: true, rosterData, warnings });
  } catch (error: any) {
    console.error("Solver error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/schedule/save', async (req, res) => {
  try {
    // Simulate saving to DB
    await new Promise((resolve) => setTimeout(resolve, 500));
    res.json({ success: true, message: "Lưu kết quả phân ca thành công." });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
