import { PerformanceReview, MedicalIncident } from "../../../../../src/modules/hr/types";
import { v4 as uuidv4 } from "uuid";

let reviewsDB: PerformanceReview[] = [];
let incidentsDB: MedicalIncident[] = [];

// Seed
const seedData = () => {
  if (reviewsDB.length === 0) {
    reviewsDB.push({
      id: uuidv4(),
      staffId: "NV001",
      reviewerId: "HR001",
      period: "monthly",
      periodLabel: "Tháng 06/2026",
      criteria: [
        { name: "Chuyên môn", score: 4.5, weight: 0.5 },
        { name: "Kỷ luật", score: 4.0, weight: 0.3 },
        { name: "Thái độ", score: 5.0, weight: 0.2 }
      ],
      overallScore: 4.45,
      feedback: "Làm việc tốt, cần duy trì.",
      createdAt: "2026-06-30T10:00:00Z"
    });
  }

  if (incidentsDB.length === 0) {
    incidentsDB.push({
      id: uuidv4(),
      staffId: "NV001",
      type: "medication_error",
      severity: "low",
      date: "2026-06-15",
      description: "Nhầm liều thuốc nhẹ, phát hiện kịp thời",
      resolution: "Đã nhắc nhở"
    });
  }
};
seedData();

export class PerformanceModel {
  static async getReviewsByStaff(staffId: string): Promise<PerformanceReview[]> {
    return reviewsDB.filter(r => r.staffId === staffId);
  }

  static async createReview(data: Omit<PerformanceReview, "id" | "overallScore">): Promise<PerformanceReview> {
    const overallScore = data.criteria.reduce((sum, c) => sum + (c.score * c.weight), 0);
    const newReview = { ...data, id: uuidv4(), overallScore, createdAt: new Date().toISOString() } as PerformanceReview;
    reviewsDB.push(newReview);
    return newReview;
  }

  static async getIncidentsByStaff(staffId: string): Promise<MedicalIncident[]> {
    return incidentsDB.filter(i => i.staffId === staffId);
  }

  static async createIncident(data: Omit<MedicalIncident, "id">): Promise<MedicalIncident> {
    const newIncident = { ...data, id: uuidv4() } as MedicalIncident;
    incidentsDB.push(newIncident);
    return newIncident;
  }
}
