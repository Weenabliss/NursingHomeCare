import { z } from "zod";

// ==========================================
// 1. Core Demographics & Legal (Hành chính)
// ==========================================
export const PersonalInfoSchema = z.object({
  id: z.string().uuid().optional(),
  code: z.string().min(3, "Mã nhân viên bắt buộc"), // NV001
  fullName: z.string().min(2, "Họ tên quá ngắn"),
  avatar: z.string().url().optional(),
  dob: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Ngày sinh phải định dạng YYYY-MM-DD"),
  gender: z.enum(["male", "female", "other"]),
  
  // Pháp lý VN
  nationalId: z.string().regex(/^\d{12}$/, "CCCD phải gồm 12 số"),
  idIssueDate: z.string().optional(),
  idIssuePlace: z.string().optional(),
  taxCode: z.string().optional(),
  socialInsuranceNo: z.string().optional(),

  // Địa chỉ & Liên hệ
  phone: z.string().regex(/^(0|\+84)[3|5|7|8|9]\d{8}$/, "Số điện thoại không hợp lệ"),
  email: z.string().email().optional().or(z.literal("")),
  hometown: z.string().min(1, "Quê quán bắt buộc"), // Quan trọng để sắp xếp KTX/Ca Tết
  currentAddress: z.string().min(1, "Địa chỉ thường trú bắt buộc"),
  
  // Tôn giáo & Đời sống
  religion: z.string().default("Không"),
  maritalStatus: z.enum(["single", "married", "divorced", "widowed"]).default("single"),
  hasSmallChildren: z.boolean().default(false), // Dưới 12 tháng -> Không trực ca đêm
});

export const EmergencyContactSchema = z.object({
  name: z.string().min(1, "Tên người liên hệ bắt buộc"),
  relation: z.string().min(1, "Mối quan hệ bắt buộc"),
  phone: z.string().min(10, "SĐT bắt buộc"),
});

// ==========================================
// 2. Qualifications & Medical Credentials (Bằng cấp)
// ==========================================
export const PracticingCertificateSchema = z.object({
  id: z.string().uuid().optional(),
  certNumber: z.string().min(1, "Số CCHN bắt buộc"),
  scopeOfPractice: z.string().min(1, "Phạm vi hoạt động (VD: Khám bệnh đa khoa)"),
  issuedBy: z.string().min(1, "Nơi cấp (VD: Bộ Y tế)"),
  issueDate: z.string(),
  expiryDate: z.string().optional(), // Null nếu vô thời hạn
});

export const InternalTrainingSchema = z.object({
  courseId: z.enum([
    "cpr",           // Cấp cứu cơ bản
    "dementia",      // Sa sút trí tuệ
    "ipc",           // Kiểm soát nhiễm khuẩn
    "manual_handling",// Kỹ năng nâng đỡ
    "food_safety"    // VSATTP
  ]),
  completionDate: z.string(),
  expiryDate: z.string(), // Các khóa này thường có hạn 1-2 năm
});

// ==========================================
// 3. Employment & Roles (Hợp đồng & Phân bổ)
// ==========================================
export const EmploymentSchema = z.object({
  status: z.enum(["active", "probation", "suspended", "resigned", "maternity_leave"]),
  joinDate: z.string(),
  leaveDate: z.string().optional(),
  
  departmentId: z.string(), // ID Phòng ban
  jobTitle: z.string(),     // Chức danh (Bác sĩ, Điều dưỡng, Hộ lý)
  zoneAccess: z.array(z.string()), // VD: ["general_ward", "dementia_ward"]
  
  // Ràng buộc ca trực
  canDoNightShift: z.boolean().default(true),
  maxNightShiftsPerWeek: z.number().max(7).default(3),
});

export const ContractHistorySchema = z.object({
  id: z.string().uuid().optional(),
  contractType: z.enum(["probation", "fixed_12m", "fixed_36m", "permanent", "seasonal"]),
  startDate: z.string(),
  endDate: z.string().optional(),
  baseSalary: z.number().min(0),
  documentUrl: z.string().url().optional().or(z.literal("")),
});

// ==========================================
// 4. FULL STAFF SCHEMA
// ==========================================
export const StaffSchema = z.object({
  personal: PersonalInfoSchema,
  emergencyContacts: z.array(EmergencyContactSchema),
  
  employment: EmploymentSchema,
  contracts: z.array(ContractHistorySchema),
  
  medicalCredentials: z.object({
    practicingCert: PracticingCertificateSchema.nullable(),
    internalTrainings: z.array(InternalTrainingSchema),
  }),
  
  allowances: z.array(z.object({
    id: z.string(),
    name: z.string(), // name of allowance instead of hardcoded type enum
    amount: z.number().min(0),
  })),
  
  assets: z.array(z.object({
    id: z.string(),
    itemName: z.string(),
    issueDate: z.string(),
    returnDate: z.string().optional(),
  }))
});
