export interface Relative {
  id: string;
  residentId: string;
  fullName: string;
  phone: string;
  relation: string;
  isPrimaryContact: boolean;
  address?: string;
}

export interface ActivityLog {
  id: string;
  residentId: string;
  date: string;
  time: string;
  type: "meal" | "exercise" | "medical" | "entertainment" | "other";
  description: string;
  staffName: string;
}

export interface ServiceUsage {
  id: string;
  residentId: string;
  serviceName: string;
  date: string;
  cost: number;
  status: "paid" | "unpaid";
}

export interface ResidenceHistory {
  id: string;
  residentId: string;
  fromDate: string;
  toDate?: string;
  location: string;
  reason: string;
}

export interface Prescription {
  id: string;
  name: string;
  type: string; // Loại thuốc (Huyết áp, Tiểu đường...)
  dosage: string; // Liều lượng (vd: 5, 500)
  unit: string; // Đơn vị (vd: mg, ml)
  time: string; // Thời gian uống (vd: Sáng, Tối)
  notes: string; // Lưu ý
}

export interface MedicalDevice {
  id: string;
  name: string;
  serialNumber: string;
}

export interface MedicalHistory {
  bloodType: string;
  height: number;
  weight: number;
  chronicDiseases: string[];
  allergies: string[];
  mobilityStatus: string;
  cognitiveStatus: string;

  // New fields
  latestVitals?: {
    bloodPressure: string; // vd: 120/80
    spO2: number; // vd: 98
    temperature: number; // vd: 37.0
  };
  adlStatus?: string; // Khả năng tự phục vụ
  sensoryStatus?: {
    vision: string;
    hearing: string;
  };
  prescriptions?: Prescription[];
  medicalDevices?: MedicalDevice[];
}

export interface Resident {
  id: string;
  code: string;
  fullName: string;
  dateOfBirth: string;
  gender: "male" | "female";
  admissionDate: string;
  status: "active" | "hospitalized" | "leave" | "discharged";
  healthStatus: string;
  healthColor?: string;
  assignedSlotId?: string;
  avatar: string;
  address: string;
  religion: string;
  medicalHistory: MedicalHistory;
  activities: ActivityLog[];
  services: ServiceUsage[];
  residenceHistory: ResidenceHistory[];
  servicePackage: string; // E.g., "Gói VIP", "Gói Chăm sóc toàn diện"
}


const makeResident = (
  id: string,
  code: string,
  fullName: string,
  dob: string,
  gender: "male" | "female",
  admissionDate: string,
  status: Resident["status"],
  healthStatus: string,
  assignedSlotId: string | undefined,
  address: string,
  bloodType: string,
  chronicDiseases: string[],
  mobilityStatus: MedicalHistory["mobilityStatus"],
  cognitiveStatus: MedicalHistory["cognitiveStatus"],
  servicePackage: string
): Resident => ({
  id,
  code,
  fullName,
  dateOfBirth: dob,
  gender,
  admissionDate,
  status,
  healthStatus,
  assignedSlotId,
  // Using LoremFlickr to specifically search for elderly portraits
  avatar: `https://loremflickr.com/150/150/elderly,portrait,${gender === "male" ? "man" : "woman"}/all?lock=${parseInt(id.replace(/\\D/g, "")) || 1}`,
  address,
  religion: "Phật giáo",
  medicalHistory: {
    bloodType,
    height: 160,
    weight: 58,
    chronicDiseases,
    allergies: [],
    mobilityStatus,
    cognitiveStatus,
    latestVitals: {
      bloodPressure: "120/80",
      spO2: 98,
      temperature: 36.5,
    },
    adlStatus: "Tự phục vụ hoàn toàn",
    sensoryStatus: {
      vision: "Bình thường",
      hearing: "Bình thường",
    },
    prescriptions: [
      { id: "P1", name: "Amlodipine", type: "Thuốc huyết áp", dosage: "5", unit: "mg", time: "Sáng", notes: "Uống sau ăn" },
      { id: "P2", name: "Glucophage", type: "Thuốc tiểu đường", dosage: "500", unit: "mg", time: "Tối", notes: "Trong bữa ăn" }
    ],
    medicalDevices: [
      { id: "D1", name: "Răng giả nguyên hàm", serialNumber: "RG-0921" }
    ]
  },
  activities: [],
  services: [],
  residenceHistory: [],
  servicePackage,
});

// ─── MOCK DATA ─────────────────────────────────────────────────────────────────
export const residentsMockData: Resident[] = [
  makeResident("RES001","NCT-001","Nguyễn Văn An","1950-05-12","male","2023-01-15","active","normal","SLOT1","123 Lê Lợi, TP.HCM","O+",["Cao huyết áp","Thoái hóa khớp"],"normal","lucid","Gói VIP"),
  makeResident("RES002","NCT-002","Trần Thế Bình","1948-11-20","male","2023-11-05","active","attention","SLOT2","45 Nguyễn Trãi, Hà Nội","A+",["Tiểu đường tuýp 2"],"normal","confused","Gói Chăm sóc toàn diện"),
  makeResident("RES003","NCT-003","Trần Thị Cúc","1955-02-18","female","2024-02-28","active","critical","SLOT5","Thôn 2, XYZ","B+",["Suy tim","Loãng xương"],"wheelchair","lucid","Gói Cơ bản"),
  makeResident("RES004","NCT-004","Lê Văn Dũng","1942-08-09","male","2022-09-10","hospitalized","critical",undefined,"Quận 3, TP.HCM","AB+",["Tai biến mạch máu não"],"bedridden","dementia","Gói Hồi sức cấp cứu"),
  makeResident("RES005","NCT-005","Phạm Thị Lan","1952-03-25","female","2023-06-01","active","normal","SLOT3","Bình Dương","A-",["Huyết áp cao"],"normal","lucid","Gói Cơ bản"),
  makeResident("RES006","NCT-006","Hoàng Văn Minh","1945-07-14","male","2022-12-20","leave","attention",undefined,"Đà Nẵng","O-",["Parkinson"],"wheelchair","confused","Gói Chăm sóc toàn diện"),
  makeResident("RES007","NCT-007","Nguyễn Thị Nga","1958-01-30","female","2024-04-10","active","normal","SLOT4","Hải Phòng","B-",[],"normal","lucid","Gói VIP"),
  makeResident("RES008","NCT-008","Võ Văn Phú","1940-12-05","male","2021-08-15","active","attention",undefined,"Cần Thơ","O+",["Tiểu đường","Cao huyết áp","Gout"],"normal","lucid","Gói Cơ bản"),
  makeResident("RES009","NCT-009","Đỗ Thị Quỳnh","1953-09-22","female","2023-03-17","active","normal",undefined,"Huế","A+",["Loãng xương"],"normal","lucid","Gói Chăm sóc toàn diện"),
  makeResident("RES010","NCT-010","Bùi Văn Sơn","1947-06-08","male","2022-05-30","active","critical","SLOT6","Nghệ An","B+",["Ung thư tuyến tiền liệt giai đoạn 2"],"bedridden","lucid","Gói Hồi sức cấp cứu"),
  makeResident("RES011","NCT-011","Lý Thị Thu","1960-11-17","female","2024-01-09","active","normal",undefined,"Vũng Tàu","AB-",[],"normal","lucid","Gói VIP"),
  makeResident("RES012","NCT-012","Trương Văn Toàn","1943-04-03","male","2021-11-25","active","attention",undefined,"Quảng Nam","O+",["Sa sút trí tuệ","Cao huyết áp"],"normal","dementia","Gói Chăm sóc toàn diện"),
  makeResident("RES013","NCT-013","Phan Thị Uyên","1956-08-19","female","2023-09-14","hospitalized","critical",undefined,"Khánh Hòa","A+",["Suy thận mãn","Tiểu đường"],"bedridden","lucid","Gói Hồi sức cấp cứu"),
  makeResident("RES014","NCT-014","Đinh Văn Việt","1949-02-27","male","2022-07-04","active","normal","SLOT7","Bắc Ninh","B+",["Thoái hóa cột sống"],"normal","lucid","Gói Cơ bản"),
  makeResident("RES015","NCT-015","Ngô Thị Xuân","1951-10-11","female","2023-04-22","active","attention",undefined,"Nam Định","O-",["Huyết áp thấp","Thiếu máu"],"normal","lucid","Gói Chăm sóc toàn diện"),
  makeResident("RES016","NCT-016","Lê Thị Yến","1957-07-07","female","2024-05-01","leave","normal",undefined,"Hà Nam","A+",[],"normal","lucid","Gói Cơ bản"),
  makeResident("RES017","NCT-017","Phạm Văn Zung","1944-12-31","male","2022-02-14","active","critical",undefined,"Tiền Giang","O+",["Ung thư phổi giai đoạn 3"],"bedridden","lucid","Gói Hồi sức cấp cứu"),
  makeResident("RES018","NCT-018","Đặng Thị Ánh","1959-05-23","female","2023-08-08","active","normal",undefined,"Đồng Nai","AB+",["Viêm khớp"],"normal","lucid","Gói VIP"),
];

export const relativesMockData: Relative[] = [
  { id: "REL001", residentId: "RES001", fullName: "Nguyễn Văn Hưng", phone: "0901234567", relation: "Con trai", isPrimaryContact: true, address: "123 Lê Lợi, TP.HCM" },
  { id: "REL002", residentId: "RES002", fullName: "Trần Thị Minh", phone: "0987654321", relation: "Con gái", isPrimaryContact: true },
  { id: "REL003", residentId: "RES003", fullName: "Phạm Văn Tuấn", phone: "0912345678", relation: "Cháu", isPrimaryContact: true },
];
