import axios from "axios";
import type { TrainingCourse, TrainingParticipant, CertificateWarning } from "../types";

const API_BASE = "http://localhost:3001/api/hr/training";

export const trainingApi = {
  getAllCourses: async (): Promise<TrainingCourse[]> => {
    const res = await axios.get(`${API_BASE}/courses`);
    return res.data.data;
  },

  createCourse: async (data: Omit<TrainingCourse, "id">): Promise<TrainingCourse> => {
    const res = await axios.post(`${API_BASE}/courses`, data);
    return res.data.data;
  },

  getWarnings: async (): Promise<CertificateWarning[]> => {
    const res = await axios.get(`${API_BASE}/warnings`);
    return res.data.data;
  },

  getStaffHistory: async (staffId: string): Promise<TrainingParticipant[]> => {
    const res = await axios.get(`${API_BASE}/staff/${staffId}`);
    return res.data.data;
  },

  enroll: async (data: TrainingParticipant): Promise<TrainingParticipant> => {
    const res = await axios.post(`${API_BASE}/enroll`, data);
    return res.data.data;
  }
};
