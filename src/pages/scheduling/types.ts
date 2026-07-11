// ============================================================
// Scheduling Module - Centralized TypeScript Type Definitions
// ============================================================

/** Thông tin một ngày hiển thị trên lịch */
export interface DayInfo {
  date: string;       // "01/08"
  fullDate: string;   // "2026-08-01"
  dayOfWeek: string;  // "Thứ 2", "CN"
  isWeekend: boolean;
  label: string;      // "Thứ 2 (01/08)"
}

/** Một ca trực cụ thể trong ngày */
export interface ShiftEntry {
  shift: string;  // "SÁNG", "CHIỀU", "ĐÊM", "HC", "PHÉP"
  type: string;   // "morning", "afternoon", "night", "leave", "leave-pending", "swap-pending", "warning"
  note?: string;  // Lý do nghỉ, ghi chú ca...
  reqId?: string; // ID của yêu cầu (nếu có)
  status?: string; // "pending" | "approved" | "rejected"
}

/** Màu sắc của một ca trực */
export interface ShiftColor {
  bg: string;
  color: string;
  border: string;
}

/** Một hàng trong bảng lịch (1 nhân sự) */
export interface RosterRow {
  staff: StaffInfo;
  /** Mỗi phần tử là danh sách ca trong một ngày */
  schedule: ShiftEntry[][];
}

/** Thông tin nhân sự cơ bản cần cho Schedule views */
export interface StaffInfo {
  id: string;
  name: string;
  position?: string;
  department?: string;
  avatar?: string;
}

/** Chế độ xem của lịch */
export type ViewMode = "week" | "month" | "stats" | "heatmap";

/** Chế độ phân ca tự động */
export type ScheduleMode = "append" | "overwrite";

/** Thống kê ca của 1 nhân sự */
export interface StaffStats {
  total: number;
  morning: number;
  afternoon: number;
  night: number;
  admin: number;
  offDays: number;
  leave: number;
}
