import { z } from "zod";

export const DisciplineTypeSchema = z.enum(["reward", "violation"]);
export const ViolationSeveritySchema = z.enum(["low", "medium", "high", "termination"]);
export const RewardTypeSchema = z.enum(["bonus", "certificate", "promotion", "other"]);

export const DisciplineRecordSchema = z.object({
  id: z.string().uuid().optional(),
  staffId: z.string(),
  type: DisciplineTypeSchema,
  
  // Dành cho Khen thưởng
  rewardType: RewardTypeSchema.optional(),
  
  // Dành cho Kỷ luật
  severity: ViolationSeveritySchema.optional(),
  
  date: z.string(),
  reason: z.string(), // VD: "Nhận phong bì của người nhà bệnh nhân"
  actionTaken: z.string().optional(), // VD: "Đình chỉ công tác 3 ngày"
  amount: z.number().optional(), // Số tiền thưởng hoặc phạt
  
  decidedBy: z.string(), // Người ra quyết định
  createdAt: z.string().optional()
});

export type DisciplineType = z.infer<typeof DisciplineTypeSchema>;
export type ViolationSeverity = z.infer<typeof ViolationSeveritySchema>;
export type RewardType = z.infer<typeof RewardTypeSchema>;
export type DisciplineRecord = z.infer<typeof DisciplineRecordSchema>;
