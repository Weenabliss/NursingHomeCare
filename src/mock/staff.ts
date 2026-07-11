export interface StaffContract {
  id: string;
  type: "Thử việc" | "Có thời hạn 1 năm" | "Có thời hạn 3 năm" | "Vô thời hạn";
  startDate: string;
  endDate?: string;
  status: "active" | "expired" | "terminated";
  documentUrl?: string;
}

export interface StaffCertificate {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  imageUrl?: string;
}

export interface StaffWorkHistory {
  id: string;
  role: string;
  department: string;
  startDate: string;
  endDate?: string;
}

export interface StaffTask {
  id: string;
  type: "activity" | "meal" | "bath" | "toilet" | "health" | "medication";
  time: string;
  patientName: string;
  room: string;
  notes?: string;
}

export interface StaffDailySchedule {
  date: string;
  shift: "Ca Sáng" | "Ca Chiều" | "Ca Đêm" | "Hành Chính" | "Nghỉ";
  tasks: StaffTask[];
}

export interface StaffSchedule {
  month: number;
  year: number;
  days: StaffDailySchedule[];
}

export interface StaffTimeLog {
  id: string;
  date: string;
  checkIn: string;
  checkOut: string;
  status: "on_time" | "late" | "early" | "overtime" | "missing";
}

export interface StaffActivity {
  id: string;
  date: string;
  description: string;
  type: "system" | "audit" | "performance";
}

export interface StaffAllowance {
  id: string;
  name: string;
  amount: number;
  isCustom: boolean;
}

export interface StaffBankAccount {
  bankCode: string;
  accountNo: string;
}

export interface StaffEmergencyContact {
  name: string;
  relationship: string;
  phone: string;
}

export interface Staff {
  id: string;
  name: string;
  email: string;
  phone: string;              // SĐT công tác (required)
  cccd: string;
  department: string;
  position: string;
  status: "active" | "on_leave" | "resigned";
  joinDate: string;
  autoRoles: string[];
  certWarning: boolean;
  gender: "male" | "female";
  age: number;
  dob: string;
  address: string;            // Địa chỉ thường trú (required)
  avatar: string;
  emergencyContact: StaffEmergencyContact; // Liên hệ khẩn cấp (required)
  contracts: StaffContract[];
  certificates: StaffCertificate[];
  workHistory: StaffWorkHistory[];
  schedule: StaffSchedule;
  activities: StaffActivity[];
  timeLogs: StaffTimeLog[];
  allowances: StaffAllowance[];
  bankAccount: StaffBankAccount;
  historicalMainShifts: number;
}

export const departmentsMock = [
  { label: "Tất cả Khoa/Phòng", value: "all" },
  { label: "Khoa Y Tế", value: "medical" },
  { label: "Tổ Điều Dưỡng", value: "nursing" },
  { label: "Phòng Hành Chính", value: "admin" },
];

export const positionsMock = [
  { label: "Bác Sĩ Trưởng Khoa", value: "head_doctor" },
  { label: "Điều Dưỡng Trưởng", value: "head_nurse" },
  { label: "Điều Dưỡng Viên", value: "nurse" },
  { label: "Lễ Tân", value: "receptionist" },
];

export const generateMockStaff = (): Staff[] => {
  const departments = ["Khoa Y Tế", "Tổ Điều Dưỡng", "Phòng Hành Chính", "Kế Toán", "Bảo Vệ", "Tổ Bếp"];
  const positions = ["Bác Sĩ", "Điều Dưỡng", "Lễ Tân", "Nhân Sự", "Kế Toán Viên", "Bảo Vệ Viên", "Đầu Bếp"];
  const roles = ["PRESCRIPTION_WRITE", "NURSE_BASIC", "HR_STAFF", "FINANCE_STAFF", "SECURITY_STAFF", "KITCHEN_STAFF"];

  return Array.from({ length: 42 }).map((_, i) => {
    const isMale = i % 2 === 0;
    const statusRnd = Math.random();
    const status = statusRnd > 0.85 ? "resigned" : statusRnd > 0.7 ? "on_leave" : "active";
    return {
      id: `NV24${String(i + 1).padStart(3, "0")}`,
      name: isMale
        ? `Nguyễn Văn ${String.fromCharCode(65 + (i % 26))}`
        : `Trần Thị ${String.fromCharCode(65 + (i % 26))}`,
      email: `nv${String.fromCharCode(97 + (i % 26))}${i + 1}@weenabliss.vn`,
      cccd: `001${i % 2 === 0 ? "0" : "1"}${90 + (i % 10)}${String(i * 12345).padStart(6, "0")}`,
      department: departments[i % departments.length],
      position: positions[i % positions.length],
      status: status as any,
      joinDate: `202${Math.floor(Math.random() * 4)}-0${(i % 9) + 1}-15`,
      autoRoles: status === "resigned" ? [] : [roles[i % roles.length]],
      certWarning: i % 7 === 0,
      gender: isMale ? "male" : "female",
      age: 25 + (i % 20),
      dob: `19${90 + (i % 10)}-0${(i % 9) + 1}-${String((i % 28) + 1).padStart(2, "0")}`,
      phone: `09${String(i % 10)}${String(Math.floor(Math.random() * 9000000) + 1000000)}`,
      address: ["12 Lê Duẩn, Hà Nội", "45 Nguyễn Huệ, TP.HCM", "78 Trần Phú, Đà Nẵng", "23 Hai Bà Trưng, Hà Nội"][i % 4],
      emergencyContact: {
        name: isMale ? `Nguyễn Thị ${String.fromCharCode(65 + (i % 26))}` : `Trần Văn ${String.fromCharCode(65 + (i % 26))}`,
        relationship: ["Vợ", "Chồng", "Bố", "Mẹ", "Anh/Chị"][i % 5],
        phone: `098${String(Math.floor(Math.random() * 9000000) + 1000000)}`,
      },
      avatar: `https://i.pravatar.cc/150?u=staff_nursing_${i}`,
      contracts: [
        {
          id: `HD-${i}-1`,
          type: "Có thời hạn 1 năm",
          startDate: "2023-01-01",
          endDate: "2024-01-01",
          status: "expired",
        },
        {
          id: `HD-${i}-2`,
          type: "Vô thời hạn",
          startDate: "2024-01-02",
          status: "active",
          documentUrl: "/sample-contract.pdf",
        },
      ],
      certificates: [
        {
          id: `CC-${i}-1`,
          name: "Bằng Tốt Nghiệp Đại Học Y",
          issuer: "Đại học Y Hà Nội",
          issueDate: "2015-06-30",
          imageUrl: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=200&h=150&fit=crop",
        },
        {
          id: `CC-${i}-2`,
          name: "Chứng Chỉ Hành Nghề",
          issuer: "Sở Y Tế Hà Nội",
          issueDate: "2018-05-12",
          expiryDate: i % 7 === 0 ? "2024-08-15" : "2028-05-12", // Simulating expiring soon for certWarning
        },
        {
          id: `CC-${i}-3`,
          name: "Chứng Chỉ Đào Tạo Liên Tục (CME)",
          issuer: "Hội Điều Dưỡng Việt Nam",
          issueDate: "2021-09-10",
        },
        {
          id: `CC-${i}-4`,
          name: "Chứng Chỉ Sơ Cấp Cứu Nâng Cao",
          issuer: "Bệnh Viện Chợ Rẫy",
          issueDate: "2022-11-20",
          expiryDate: "2026-11-20",
          imageUrl: "https://images.unsplash.com/photo-1576091160550-2173ff9e5eb3?w=200&h=150&fit=crop",
        },
        {
          id: `CC-${i}-5`,
          name: "Khóa Học Chăm Sóc Người Cao Tuổi",
          issuer: "Trường Cao Đẳng Y Tế",
          issueDate: "2023-02-15",
        }
      ],
      workHistory: [
        {
          id: `WH-${i}-1`,
          role: "Thực tập sinh",
          department: "Tổ Điều Dưỡng",
          startDate: "2015-08-01",
          endDate: "2016-01-31",
        },
        {
          id: `WH-${i}-2`,
          role: "Nhân viên thử việc",
          department: "Tổ Điều Dưỡng",
          startDate: "2016-02-01",
          endDate: "2016-04-30",
        },
        {
          id: `WH-${i}-3`,
          role: "Điều dưỡng viên bậc 1",
          department: "Tổ Điều Dưỡng",
          startDate: "2016-05-01",
          endDate: "2018-12-31",
        },
        {
          id: `WH-${i}-4`,
          role: "Điều dưỡng viên bậc 2",
          department: "Khoa Y Tế",
          startDate: "2019-01-01",
          endDate: "2021-06-30",
        },
        {
          id: `WH-${i}-5`,
          role: "Phó tổ trưởng tổ Điều dưỡng",
          department: "Tổ Điều Dưỡng",
          startDate: "2021-07-01",
          endDate: "2023-12-31",
        },
        ...Array.from({ length: 15 }).map((_, whIndex) => ({
          id: `WH-${i}-${whIndex + 6}`,
          role: `Chức vụ luân chuyển ${whIndex + 1}`,
          department: departments[(i + whIndex) % departments.length],
          startDate: `2023-${String((whIndex % 12) + 1).padStart(2, "0")}-01`,
          endDate: `2023-${String((whIndex % 12) + 1).padStart(2, "0")}-28`,
        })),
        {
          id: `WH-${i}-99`,
          role: positions[i % positions.length],
          department: departments[i % departments.length],
          startDate: "2024-01-01",
        },
      ],
      schedule: {
        month: 7,
        year: 2026,
        days: Array.from({ length: 31 }).map((_, d) => {
          const dateStr = `2026-07-${String(d + 1).padStart(2, "0")}`;
          const rnd = Math.random();
          const shift = rnd > 0.8 ? "Nghỉ" : rnd > 0.6 ? "Ca Đêm" : rnd > 0.3 ? "Ca Chiều" : "Ca Sáng";

          let tasks: any[] = [];
          if (shift !== "Nghỉ") {
            const baseTime = shift === "Ca Sáng" ? 7 : shift === "Ca Chiều" ? 15 : 23;
            tasks = [
              {
                id: `t1-${d}`,
                type: "activity",
                time: `${String(baseTime).padStart(2, "0")}:30`,
                patientName: "Ông Nguyễn Văn A",
                room: "P.101",
              },
              {
                id: `t2-${d}`,
                type: "meal",
                time: `${String(baseTime + 1).padStart(2, "0")}:00`,
                patientName: "Bà Trần Thị B",
                room: "P.102",
              },
              {
                id: `t3-${d}`,
                type: "bath",
                time: `${String(baseTime + 2).padStart(2, "0")}:30`,
                patientName: "Ông Lê Văn C",
                room: "P.103",
              },
              {
                id: `t4-${d}`,
                type: "toilet",
                time: `${String(baseTime + 3).padStart(2, "0")}:00`,
                patientName: "Bà Phạm Thị D",
                room: "P.104",
              },
              {
                id: `t5-${d}`,
                type: "health",
                time: `${String(baseTime + 4).padStart(2, "0")}:30`,
                patientName: "Ông Hoàng Văn E",
                room: "P.105",
              },
              {
                id: `t6-${d}`,
                type: "medication",
                time: `${String(baseTime + 5).padStart(2, "0")}:00`,
                patientName: "Bà Ngô Thị F",
                room: "P.106",
              },
            ];
          }

          return {
            date: dateStr,
            shift,
            tasks,
          };
        }),
      },
      activities: [
        {
          id: `ACT-${i}-1`,
          date: "2024-07-01 08:30",
          description: "Đăng nhập hệ thống",
          type: "system",
        },
        {
          id: `ACT-${i}-2`,
          date: "2024-06-25 14:00",
          description: "Cập nhật hồ sơ bệnh án BN Nguyễn Văn A",
          type: "audit",
        },
        {
          id: `ACT-${i}-3`,
          date: "2024-06-15 09:00",
          description: "Đạt thành tích: Nhân viên xuất sắc tháng 6",
          type: "performance",
        },
      ],
      timeLogs: Array.from({ length: 14 }).map((_, d) => {
        const dateStr = `2026-07-${String(d + 1).padStart(2, "0")}`;
        const rnd = Math.random();
        let status: "on_time" | "late" | "early" | "overtime" | "missing" = "on_time";
        let checkIn = "07:55";
        let checkOut = "17:05";
        
        if (rnd > 0.8) {
          status = "late";
          checkIn = "08:15";
        } else if (rnd > 0.6) {
          status = "early";
          checkOut = "16:45";
        } else if (rnd > 0.5) {
          status = "missing";
          checkIn = "--:--";
          checkOut = "--:--";
        } else if (rnd > 0.4) {
          status = "overtime";
          checkOut = "19:00";
        }

        return {
          id: `TL-${i}-${d}`,
          date: dateStr,
          checkIn,
          checkOut,
          status,
        };
      }),
      allowances: [
        { id: "AN_TRUA", name: "Phụ cấp ăn trưa", amount: 730000, isCustom: false },
        { id: `CUSTOM-${i}`, name: "Phụ cấp trách nhiệm", amount: 1500000, isCustom: true },
      ],
      bankAccount: {
        bankCode: i % 2 === 0 ? "VCB" : "TCB",
        accountNo: `1903${Math.floor(Math.random() * 1000000)}`,
      },
      historicalMainShifts: Math.floor(Math.random() * 20),
    };
  });
};

export const staffListMock = generateMockStaff();
