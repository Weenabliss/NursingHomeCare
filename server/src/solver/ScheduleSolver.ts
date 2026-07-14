/**
 * This is a conceptual implementation of the Google OR-Tools CP-SAT Solver wrapper in Node.js.
 * Since native OR-Tools can be complex to compile on some environments, this function
 * demonstrates the constraints generation and returns a simulated optimal schedule.
 */

interface SolverParams {
  month: number;
  year: number;
  ensureFairness: boolean;
  strictRest: boolean;
  offDaysPerWeek: number;
  shiftRequirements: Record<string, { min: string; max: string }>;
  staffNames: any[];
  mode?: "append" | "overwrite";
  currentRoster?: any[];
}

export const solveSchedule = async (params: SolverParams) => {
  console.log(`[OR-Tools] Starting CP-SAT Solver for ${params.month}/${params.year}...`);
  console.log(`[OR-Tools] Constraints: Fairness=${params.ensureFairness}, StrictRest=${params.strictRest}, OffDays/Week=${params.offDaysPerWeek}`);
  console.log(`[OR-Tools] Shift Reqs:`, params.shiftRequirements);
  
  // Simulated delay for constraint programming execution
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // In a real OR-Tools CP-SAT implementation we would:
  // 1. Create a model: `const model = new cp_model.CpModel();`
  // 2. Define boolean variables: `const shifts = {}` for (staff, day, shift)
  // 3. Add demand constraints: `model.Add(cp_model.LinearExpr.Sum(...) == requiredStaffCount)`
  // 4. Add single shift constraint: `model.Add(cp_model.LinearExpr.Sum(staff_shifts_per_day) <= 1)`
  // 5. Add fairness objective: `model.Minimize(max_shifts - min_shifts)`
  // 6. Run solver: `const solver = new cp_model.CpSolver(); const status = solver.Solve(model);`

  console.log("[OR-Tools] Optimal solution found (Simulated).");

  // Calculate days in the selected month
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month, 0).getDate();
  };
  const daysInMonth = getDaysInMonth(params.year, params.month);

  const staffNames = params.staffNames || [];
  
  // Create a map to look up current schedule quickly
  const currentRosterMap = new Map();
  if (params.currentRoster) {
    params.currentRoster.forEach((r: any) => {
      currentRosterMap.set(r.staff.id, r.schedule);
    });
  }

  const shiftTypes = [
    { shift: "SÁNG", type: "morning" },
    { shift: "CHIỀU", type: "afternoon" },
    { shift: "ĐÊM", type: "night" },
    { shift: "OFF", type: "off" }
  ];

  // Generate roster data for the entire month
  const rosterData = staffNames.map((staff, i) => {
    const currentSchedule = currentRosterMap.get(staff.id) || [];
    const schedule = [];
    let lastShiftWasNight = false;
    let shiftCount = 0;

    for (let day = 0; day < daysInMonth; day++) {
      let existingShifts = currentSchedule[day] || [];
      
      // If overwrite, clear everything EXCEPT 'leave' shifts
      if (params.mode === "overwrite") {
        existingShifts = existingShifts.filter((s: any) => s.type === "leave");
      }
      
      // If append, and already has shifts (not just leave), keep them and skip auto-gen
      const hasMainShift = existingShifts.some((s: any) => ["morning", "afternoon", "night"].includes(s.type));
      if (params.mode === "append" && hasMainShift) {
        schedule.push(existingShifts);
        if (existingShifts.some((s: any) => s.type === "night")) lastShiftWasNight = true;
        else lastShiftWasNight = false;
        
        shiftCount += existingShifts.length;
        continue;
      }
      
      // If day has a 'leave' shift, do not schedule any main shifts here
      if (existingShifts.some((s: any) => s.type === "leave")) {
        schedule.push(existingShifts);
        lastShiftWasNight = false;
        continue;
      }

      if (params.strictRest && lastShiftWasNight) {
        // Enforce strict rest: Must be OFF after a Night shift
        schedule.push([]);
        lastShiftWasNight = false;
        continue;
      }

      // Pseudo-randomly assign a shift ensuring fairness conceptually
      const shiftType = shiftTypes[(i + day) % 4]; 
      
      if (shiftType.type === "night") {
        lastShiftWasNight = true;
      } else {
        lastShiftWasNight = false;
      }

      if (shiftType.shift === "OFF") {
        schedule.push(existingShifts); // which is empty or has leaves if any
      } else {
        // CONSTRAINT: Kiểm tra phụ nữ có thai/con nhỏ hoặc không thể trực đêm
        if (shiftType.type === "night" && staff.employment?.canDoNightShift === false) {
          schedule.push(existingShifts);
          lastShiftWasNight = false;
          continue;
        }

        const dailyShifts = [...existingShifts, shiftType];
        // 10% chance to demonstrate a double shift (Morning + Night)
        if (shiftType.type === "morning" && (day * 7 + i) % 10 === 0) {
          if (staff.employment?.canDoNightShift !== false) {
            dailyShifts.push({ shift: "ĐÊM", type: "night" });
            lastShiftWasNight = true;
            shiftCount++;
          }
        }
        schedule.push(dailyShifts);
        shiftCount++;
      }
    }

    return { staff, schedule, shiftCount };
  });

  const warnings: string[] = [];
  rosterData.forEach(r => {
    if (r.shiftCount < 10) {
      warnings.push(`Nhân sự ${r.staff.name} chưa được phân đủ ca (${r.shiftCount}/10 ca tối thiểu).`);
    } else if (r.shiftCount === 0) {
      warnings.push(`Nhân sự ${r.staff.name} chưa được phân ca nào.`);
    }
  });

  // Remove temporary shiftCount before returning
  const finalRosterData = rosterData.map(({ shiftCount, ...rest }) => rest);

  return { rosterData: finalRosterData, warnings };
};
