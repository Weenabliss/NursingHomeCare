import { z } from "zod";

export const ShiftTypeSchema = z.enum([
  "morning",     // Ca sáng (6h - 14h)
  "afternoon",   // Ca chiều (14h - 22h)
  "night",       // Ca đêm (22h - 6h)
  "office",      // Hành chính (8h - 17h)
]);

export const AttendanceStatusSchema = z.enum([
  "present",     // Có mặt đúng giờ
  "late",        // Đi muộn
  "early_leave", // Về sớm
  "absent",      // Vắng mặt không phép
  "on_leave",    // Nghỉ có phép
  "holiday"      // Nghỉ lễ
]);

export const AttendanceRecordSchema = z.object({
  id: z.string().uuid().optional(),
  staffId: z.string(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format YYYY-MM-DD required"),
  shift: ShiftTypeSchema,
  status: AttendanceStatusSchema,
  checkInTime: z.string().optional(),  // ISO string or HH:mm
  checkOutTime: z.string().optional(), // ISO string or HH:mm
  lateMinutes: z.number().min(0).default(0),
  earlyLeaveMinutes: z.number().min(0).default(0),
  overtimeHours: z.number().min(0).default(0),
  notes: z.string().optional(),
  isException: z.boolean().default(false), // Cho ca đặc biệt (VD: con nhỏ -> về sớm 1h không tính early_leave)
});

export const MonthlyAttendanceSummarySchema = z.object({
  staffId: z.string(),
  month: z.number().min(1).max(12),
  year: z.number().min(2000),
  totalPresentDays: z.number().min(0),
  totalAbsentDays: z.number().min(0),
  totalLateMinutes: z.number().min(0),
  totalOvertimeHours: z.number().min(0),
  totalNightShifts: z.number().min(0),
});

export type ShiftType = z.infer<typeof ShiftTypeSchema>;
export type AttendanceStatus = z.infer<typeof AttendanceStatusSchema>;
export type AttendanceRecord = z.infer<typeof AttendanceRecordSchema>;
export type MonthlyAttendanceSummary = z.infer<typeof MonthlyAttendanceSummarySchema>;
