import axios from "axios";
import type { Staff } from "../types";

const API_BASE = "http://localhost:3001/api/hr";

export const staffApi = {
  getAll: async (): Promise<Staff[]> => {
    const res = await axios.get(`${API_BASE}/staff`);
    return res.data.data;
  },

  getById: async (id: string): Promise<Staff> => {
    const res = await axios.get(`${API_BASE}/staff/${id}`);
    return res.data.data;
  },

  create: async (data: Omit<Staff, "personal.id">): Promise<Staff> => {
    const res = await axios.post(`${API_BASE}/staff`, data);
    return res.data.data;
  },

  update: async (id: string, data: Partial<Staff>): Promise<Staff> => {
    const res = await axios.put(`${API_BASE}/staff/${id}`, data);
    return res.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await axios.delete(`${API_BASE}/staff/${id}`);
  }
};
