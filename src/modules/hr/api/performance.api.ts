import axios from "axios";
import type { PerformanceReview, MedicalIncident } from "../types";

const API_BASE = "http://localhost:3001/api/hr/performance";

export const performanceApi = {
  getReviews: async (staffId: string): Promise<PerformanceReview[]> => {
    const res = await axios.get(`${API_BASE}/reviews/${staffId}`);
    return res.data.data;
  },

  createReview: async (data: Omit<PerformanceReview, "id" | "overallScore">): Promise<PerformanceReview> => {
    const res = await axios.post(`${API_BASE}/reviews`, data);
    return res.data.data;
  },

  getIncidents: async (staffId: string): Promise<MedicalIncident[]> => {
    const res = await axios.get(`${API_BASE}/incidents/${staffId}`);
    return res.data.data;
  },

  createIncident: async (data: Omit<MedicalIncident, "id">): Promise<MedicalIncident> => {
    const res = await axios.post(`${API_BASE}/incidents`, data);
    return res.data.data;
  }
};
