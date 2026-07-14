import axios from "axios";
import type { Candidate } from "../types";

const API_BASE = "http://localhost:3001/api/hr/recruitment";

export const recruitmentApi = {
  getAllCandidates: async (): Promise<Candidate[]> => {
    const res = await axios.get(`${API_BASE}/candidates`);
    return res.data.data;
  },

  createCandidate: async (data: Omit<Candidate, "id">): Promise<Candidate> => {
    const res = await axios.post(`${API_BASE}/candidates`, data);
    return res.data.data;
  },

  updateStatus: async (id: string, status: Candidate["status"]): Promise<Candidate> => {
    const res = await axios.patch(`${API_BASE}/candidates/${id}/status`, { status });
    return res.data.data;
  }
};
