import { z } from "zod";

export const LeaveTypeSchema = z.enum([
  "annual_leave",    // Phép năm
  "sick_leave",      // Nghỉ ốm (có giấy BHXH)
  "maternity",       // Nghỉ thai sản
  "unpaid_leave",    // Nghỉ không lương
  "bereavement",     // Nghỉ tang chế
  "marriage",        // Nghỉ kết hôn
  "compensatory"     // Nghỉ bù
]);

export const LeaveStatusSchema = z.enum([
  "pending",
  "approved",
  "rejected",
  "cancelled"
]);

export const LeaveRequestSchema = z.object({
  id: z.string().uuid().optional(),
  staffId: z.string(),
  type: LeaveTypeSchema,
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  totalDays: z.number().min(0.5), // Cho phép nghỉ nửa ngày
  reason: z.string().min(5, "Lý do cần tối thiểu 5 ký tự"),
  status: LeaveStatusSchema.default("pending"),
  approverId: z.string().optional(),
  approvedAt: z.string().optional(),
  rejectReason: z.string().optional(),
  documents: z.array(z.string()).optional() // URL hình ảnh giấy tờ xin phép (nếu có)
});

export const LeaveBalanceSchema = z.object({
  staffId: z.string(),
  year: z.number(),
  annualTotal: z.number().default(12),
  annualUsed: z.number().default(0),
  sickUsed: z.number().default(0),
  compensatoryTotal: z.number().default(0),
  compensatoryUsed: z.number().default(0),
});

export type LeaveType = z.infer<typeof LeaveTypeSchema>;
export type LeaveStatus = z.infer<typeof LeaveStatusSchema>;
export type LeaveRequest = z.infer<typeof LeaveRequestSchema>;
export type LeaveBalance = z.infer<typeof LeaveBalanceSchema>;
