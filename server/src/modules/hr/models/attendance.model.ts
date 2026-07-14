import { AttendanceRecord, MonthlyAttendanceSummary } from "../../../../../src/modules/hr/types";
import { v4 as uuidv4 } from "uuid";

let attendanceDB: AttendanceRecord[] = [];

// Seed data
const seedData = () => {
  if (attendanceDB.length === 0) {
    attendanceDB.push({
      id: uuidv4(),
      staffId: "NV001", // Match the staff DB
      date: "2026-07-10",
      shift: "morning",
      status: "present",
      checkInTime: "05:55",
      checkOutTime: "14:05",
      lateMinutes: 0,
      earlyLeaveMinutes: 0,
      overtimeHours: 0,
      isException: false
    });
  }
};
seedData();

export class AttendanceModel {
  static async findAll(): Promise<AttendanceRecord[]> {
    return [...attendanceDB];
  }

  static async findByStaffId(staffId: string): Promise<AttendanceRecord[]> {
    return attendanceDB.filter(a => a.staffId === staffId);
  }

  static async create(data: Omit<AttendanceRecord, "id">): Promise<AttendanceRecord> {
    const newRecord = { ...data, id: uuidv4() } as AttendanceRecord;
    attendanceDB.push(newRecord);
    return newRecord;
  }

  static async getMonthlySummary(staffId: string, month: number, year: number): Promise<MonthlyAttendanceSummary> {
    const records = attendanceDB.filter(a => {
      if (a.staffId !== staffId) return false;
      const d = new Date(a.date);
      return d.getMonth() + 1 === month && d.getFullYear() === year;
    });

    let totalPresentDays = 0;
    let totalAbsentDays = 0;
    let totalLateMinutes = 0;
    let totalOvertimeHours = 0;
    let totalNightShifts = 0;

    records.forEach(r => {
      if (r.status === "present" || r.status === "late" || r.status === "early_leave") {
        totalPresentDays += 1;
      } else if (r.status === "absent") {
        totalAbsentDays += 1;
      }
      totalLateMinutes += r.lateMinutes;
      totalOvertimeHours += r.overtimeHours;
      if (r.shift === "night") totalNightShifts += 1;
    });

    return {
      staffId,
      month,
      year,
      totalPresentDays,
      totalAbsentDays,
      totalLateMinutes,
      totalOvertimeHours,
      totalNightShifts
    };
  }
}
