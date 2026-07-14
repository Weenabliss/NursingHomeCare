import axios from "axios";
import type { AttendanceRecord, MonthlyAttendanceSummary } from "../types";

const API_BASE = "http://localhost:3001/api/hr/attendance";

export const attendanceApi = {
  getByStaffId: async (staffId: string): Promise<AttendanceRecord[]> => {
    const res = await axios.get(`${API_BASE}/${staffId}`);
    return res.data.data;
  },

  getMonthlySummary: async (staffId: string, month: number, year: number): Promise<MonthlyAttendanceSummary> => {
    const res = await axios.get(`${API_BASE}/${staffId}/summary`, { params: { month, year } });
    return res.data.data;
  },

  create: async (data: Omit<AttendanceRecord, "id">): Promise<AttendanceRecord> => {
    const res = await axios.post(`${API_BASE}`, data);
    return res.data.data;
  }
};
