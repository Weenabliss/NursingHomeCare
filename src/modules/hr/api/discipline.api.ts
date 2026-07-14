import axios from "axios";
import type { DisciplineRecord } from "../types";

const API_BASE = "http://localhost:3001/api/hr/discipline";

export const disciplineApi = {
  getRecords: async (staffId: string): Promise<DisciplineRecord[]> => {
    const res = await axios.get(`${API_BASE}/${staffId}`);
    return res.data.data;
  },

  createRecord: async (data: Omit<DisciplineRecord, "id">): Promise<DisciplineRecord> => {
    const res = await axios.post(`${API_BASE}`, data);
    return res.data.data;
  }
};
