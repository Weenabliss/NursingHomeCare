export interface Department {
  id: string;
  name: string;
  parent: string | null;
  headCount: number;
  manager: string;
  icon: string;
  description: string;
  autoRoles: string[];
}

export interface Position {
  id: string;
  title: string;
  department: string;
  autoRoles: string[];
  baseSalaryMultiplier: number;
}

export const departmentsMockData: Department[] = [
  {
    id: "BGĐ",
    name: "Ban Giám đốc",
    parent: null,
    headCount: 3,
    manager: "Trần Anh Tuấn",
    icon: "Building",
    description: "Điều hành chung toàn bộ trung tâm",
    autoRoles: ["VIEW_ALL_REPORTS"],
  },
  {
    id: "HCTH",
    name: "Hành chính Tổng hợp",
    parent: "BGĐ",
    headCount: 5,
    manager: "Lê Hoàng Yến",
    icon: "Briefcase",
    description: "Nhân sự, kế toán, văn thư lưu trữ",
    autoRoles: ["VIEW_HR_DASHBOARD"],
  },
  {
    id: "YTSC",
    name: "Khoa Y tế & Chăm sóc",
    parent: "BGĐ",
    headCount: 25,
    manager: "BS. Nguyễn Văn A",
    icon: "HeartPulse",
    description: "Khám chữa bệnh và cấp phát thuốc",
    autoRoles: ["VIEW_MEDICAL_RECORDS"],
  },
  {
    id: "ĐDNT",
    name: "Tổ Điều dưỡng Nội trú",
    parent: "YTSC",
    headCount: 15,
    manager: "ĐD. Trần Thị Bé",
    icon: "Coffee",
    description: "Chăm sóc sinh hoạt 24/7 cho người cao tuổi",
    autoRoles: ["VIEW_SHIFT_SCHEDULE"],
  },
];

export const positionsMockData: Position[] = [
  {
    id: "DIR_01",
    title: "Giám đốc Điều hành",
    department: "Ban Giám đốc",
    autoRoles: ["SUPER_ADMIN", "FINANCE_APPROVER"],
    baseSalaryMultiplier: 8.0,
  },
  {
    id: "HR_01",
    title: "Trưởng phòng Hành chính",
    department: "Hành chính Tổng hợp",
    autoRoles: ["HR_MANAGER", "PAYROLL_VIEWER"],
    baseSalaryMultiplier: 6.0,
  },
  {
    id: "MED_01",
    title: "Bác Sĩ Trưởng Khoa",
    department: "Khoa Y tế & Chăm sóc",
    autoRoles: ["MEDICAL_LEAD", "PRESCRIPTION_WRITE", "ROSTER_MANAGER"],
    baseSalaryMultiplier: 6.0,
  },
  {
    id: "NUR_01",
    title: "Điều Dưỡng Viên",
    department: "Tổ Điều dưỡng Nội trú",
    autoRoles: ["NURSE_BASIC", "VITAL_SIGNS_INPUT"],
    baseSalaryMultiplier: 3.0,
  },
];
