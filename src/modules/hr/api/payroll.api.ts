import axios from "axios";
import type { Payslip } from "../types";

const API_BASE = "http://localhost:3001/api/hr/payroll";

export const payrollApi = {
  getAll: async (): Promise<Payslip[]> => {
    const res = await axios.get(`${API_BASE}`);
    return res.data.data;
  },

  getByStaffId: async (staffId: string): Promise<Payslip[]> => {
    const res = await axios.get(`${API_BASE}/${staffId}`);
    return res.data.data;
  },

  generateMonthly: async (month: number, year: number): Promise<Payslip[]> => {
    const res = await axios.post(`${API_BASE}/generate`, { month, year });
    return res.data.data;
  },

  updateStatus: async (id: string, status: Payslip["status"]): Promise<Payslip> => {
    const res = await axios.patch(`${API_BASE}/${id}/status`, { status });
    return res.data.data;
  }
};
