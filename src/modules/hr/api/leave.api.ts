import axios from "axios";
import type { LeaveRequest, LeaveBalance } from "../types";

const API_BASE = "http://localhost:3001/api/hr/leave";

export const leaveApi = {
  getAll: async (): Promise<LeaveRequest[]> => {
    const res = await axios.get(`${API_BASE}`);
    return res.data.data;
  },

  getByStaffId: async (staffId: string): Promise<LeaveRequest[]> => {
    const res = await axios.get(`${API_BASE}/${staffId}`);
    return res.data.data;
  },

  getBalance: async (staffId: string, year: number): Promise<LeaveBalance> => {
    const res = await axios.get(`${API_BASE}/${staffId}/balance`, { params: { year } });
    return res.data.data;
  },

  create: async (data: Omit<LeaveRequest, "id" | "status" | "approvedAt" | "approverId" | "rejectReason">): Promise<LeaveRequest> => {
    const res = await axios.post(`${API_BASE}`, data);
    return res.data.data;
  },

  updateStatus: async (id: string, data: { status: LeaveRequest["status"]; approverId?: string; rejectReason?: string }): Promise<LeaveRequest> => {
    const res = await axios.patch(`${API_BASE}/${id}/status`, data);
    return res.data.data;
  }
};
