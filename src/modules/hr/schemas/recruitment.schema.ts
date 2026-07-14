import { z } from "zod";

export const CandidateStatusSchema = z.enum([
  "new",             // Mới ứng tuyển
  "screening",       // Đang lọc CV
  "interviewing",    // Đang phỏng vấn
  "offered",         // Đã gửi offer
  "hired",           // Đã nhận việc
  "rejected"         // Từ chối
]);

export const CandidateSchema = z.object({
  id: z.string().uuid().optional(),
  fullName: z.string().min(2, "Tên không hợp lệ"),
  email: z.string().email("Email không hợp lệ"),
  phone: z.string(),
  appliedPosition: z.string(), // Vị trí ứng tuyển
  departmentId: z.string().optional(),
  status: CandidateStatusSchema.default("new"),
  
  // Pipeline timestamps
  appliedAt: z.string().optional(),
  interviewDate: z.string().optional(),
  expectedSalary: z.number().optional(),
  
  interviewerId: z.string().optional(), // Người phụ trách phỏng vấn
  notes: z.string().optional(),
  cvUrl: z.string().optional()
});

export type CandidateStatus = z.infer<typeof CandidateStatusSchema>;
export type Candidate = z.infer<typeof CandidateSchema>;
