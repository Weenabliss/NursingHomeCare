import { z } from "zod";

export const ReviewPeriodSchema = z.enum(["monthly", "quarterly", "annual", "probation"]);

export const PerformanceCriteriaSchema = z.object({
  name: z.string(),
  score: z.number().min(1).max(5), // Thang điểm 1-5
  weight: z.number().min(0).max(1) // Trọng số (VD: 0.3)
});

export const PerformanceReviewSchema = z.object({
  id: z.string().uuid().optional(),
  staffId: z.string(),
  reviewerId: z.string(),
  period: ReviewPeriodSchema,
  periodLabel: z.string(), // VD: "Quý 3/2026"
  
  criteria: z.array(PerformanceCriteriaSchema),
  
  overallScore: z.number().min(1).max(5).optional(), // Sẽ tính tự động: sum(score * weight)
  feedback: z.string().optional(),
  
  createdAt: z.string().optional()
});

export const IncidentTypeSchema = z.enum(["medication_error", "fall", "protocol_violation", "other"]);
export const IncidentSeveritySchema = z.enum(["low", "medium", "high", "critical"]);

export const MedicalIncidentSchema = z.object({
  id: z.string().uuid().optional(),
  staffId: z.string(),
  type: IncidentTypeSchema,
  severity: IncidentSeveritySchema,
  date: z.string(),
  description: z.string(),
  patientId: z.string().optional(), // Nếu liên quan bệnh nhân
  resolution: z.string().optional()
});

export type ReviewPeriod = z.infer<typeof ReviewPeriodSchema>;
export type PerformanceCriteria = z.infer<typeof PerformanceCriteriaSchema>;
export type PerformanceReview = z.infer<typeof PerformanceReviewSchema>;
export type IncidentType = z.infer<typeof IncidentTypeSchema>;
export type IncidentSeverity = z.infer<typeof IncidentSeveritySchema>;
export type MedicalIncident = z.infer<typeof MedicalIncidentSchema>;
