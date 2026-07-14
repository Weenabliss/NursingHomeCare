import { z } from "zod";

export const PayrollStatusSchema = z.enum([
  "draft",       // Nháp
  "reviewing",   // Đang duyệt
  "approved",    // Đã duyệt
  "paid"         // Đã thanh toán
]);

export const PayrollItemSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string(),
  amount: z.number(),
  type: z.enum(["allowance", "bonus", "deduction"]),
  note: z.string().optional()
});

export const PayslipSchema = z.object({
  id: z.string().uuid().optional(),
  staffId: z.string(),
  month: z.number().min(1).max(12),
  year: z.number().min(2000),
  
  // Các thông số đầu vào
  baseSalary: z.number().min(0),
  standardWorkDays: z.number().min(0), // Số ngày công chuẩn của tháng (VD: 22, 26)
  actualWorkDays: z.number().min(0),   // Số ngày làm thực tế
  
  // Các khoản cộng
  overtimePay: z.number().min(0).default(0),
  items: z.array(PayrollItemSchema).default([]),
  
  // Thuế & Bảo hiểm (Khấu trừ bắt buộc)
  taxDeduction: z.number().min(0).default(0),
  insuranceDeduction: z.number().min(0).default(0),
  
  // Tổng kết
  grossSalary: z.number().min(0),
  netSalary: z.number().min(0),
  
  status: PayrollStatusSchema.default("draft"),
  paymentDate: z.string().optional(), // Ngày thanh toán thực tế
  createdAt: z.string().optional(),
  updatedAt: z.string().optional()
});

export type PayrollStatus = z.infer<typeof PayrollStatusSchema>;
export type PayrollItem = z.infer<typeof PayrollItemSchema>;
export type Payslip = z.infer<typeof PayslipSchema>;
