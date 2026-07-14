import { z } from "zod";
import { 
  PersonalInfoSchema, 
  EmergencyContactSchema, 
  PracticingCertificateSchema, 
  InternalTrainingSchema, 
  EmploymentSchema, 
  ContractHistorySchema, 
  StaffSchema 
} from "../schemas/staff.schema";

export * from "../schemas/attendance.schema";
export * from "../schemas/leave.schema";
export * from "../schemas/payroll.schema";
export * from "../schemas/training.schema";
export * from "../schemas/performance.schema";
export * from "../schemas/discipline.schema";
export * from "../schemas/recruitment.schema";

// Generate TypeScript types directly from Zod Schemas
export type PersonalInfo = z.infer<typeof PersonalInfoSchema>;
export type EmergencyContact = z.infer<typeof EmergencyContactSchema>;
export type PracticingCertificate = z.infer<typeof PracticingCertificateSchema>;
export type InternalTraining = z.infer<typeof InternalTrainingSchema>;
export type Employment = z.infer<typeof EmploymentSchema>;
export type ContractHistory = z.infer<typeof ContractHistorySchema>;
export type Staff = z.infer<typeof StaffSchema>;

export type Allowance = Staff['allowances'][number];
export type Asset = Staff['assets'][number];
