export interface ShiftDefinition {
  id: string;
  name: string;
  startTime: string; // "HH:mm" format
  endTime: string;   // "HH:mm" format
  color: string;     // Hex or var()
  description?: string;
  isActive: boolean;
  requiredStaffCount: number;
}

export const INITIAL_SHIFTS: ShiftDefinition[] = [
  {
    id: "SHIFT-1",
    name: "Ca Sáng",
    startTime: "06:00",
    endTime: "14:00",
    color: "#3b82f6", // blue-500
    description: "Ca làm việc buổi sáng",
    isActive: true,
    requiredStaffCount: 3,
  },
  {
    id: "SHIFT-2",
    name: "Ca Chiều",
    startTime: "14:00",
    endTime: "22:00",
    color: "#f59e0b", // amber-500
    description: "Ca làm việc buổi chiều",
    isActive: true,
    requiredStaffCount: 3,
  },
  {
    id: "SHIFT-3",
    name: "Ca Đêm",
    startTime: "22:00",
    endTime: "06:00",
    color: "#6366f1", // indigo-500
    description: "Ca làm việc ban đêm (qua ngày)",
    isActive: true,
    requiredStaffCount: 2,
  },
  {
    id: "SHIFT-4",
    name: "Hành Chính",
    startTime: "08:00",
    endTime: "17:00",
    color: "#10b981", // emerald-500
    description: "Ca hành chính văn phòng",
    isActive: true,
    requiredStaffCount: 5,
  },
];
