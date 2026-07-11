import type { DayInfo, ShiftColor, RosterRow } from "../pages/scheduling/types";

/**
 * Tạo mảng thông tin các ngày trong một khoảng.
 * @param count - Số ngày cần tạo
 * @param startDayOffset - Ngày bắt đầu trong tháng (bù từ ngày 1)
 * @param year - Năm
 * @param month - Tháng (0-indexed, JS Date style)
 */
export const generateDays = (
  count: number,
  startDayOffset: number = 0,
  year: number = 2026,
  month: number = 7 // August
): DayInfo[] => {
  const DAY_NAMES = ["CN", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];

  return Array.from({ length: count }).map((_, i) => {
    const date = new Date(year, month, i + 1 + startDayOffset);
    const dayOfWeek = DAY_NAMES[date.getDay()];
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    const dd = String(date.getDate()).padStart(2, "0");
    const mm = String(date.getMonth() + 1).padStart(2, "0");

    return {
      date: `${dd}/${mm}`,
      dayOfWeek,
      isWeekend,
      label: `${dayOfWeek} (${dd}/${mm})`,
    };
  });
};

/**
 * Trả về màu sắc tương ứng cho từng loại ca trực.
 * Logic tập trung tại đây thay vì hardcode trong từng component.
 */
export const getShiftColor = (type: string): ShiftColor => {
  switch (type) {
    case "morning":
      return { bg: "#e0f2fe", color: "#0369a1", border: "#bae6fd" };
    case "afternoon":
      return { bg: "#fef3c7", color: "#b45309", border: "#fde68a" };
    case "night":
      return { bg: "#ede9fe", color: "#5b21b6", border: "#ddd6fe" };
    case "leave":
      return { bg: "#fce7f3", color: "#be185d", border: "#fbcfe8" };
    case "warning":
      return { bg: "#fef2f2", color: "#991b1b", border: "#fecaca" };
    default:
      return { bg: "#f8fafc", color: "#64748b", border: "#e2e8f0" };
  }
};

/**
 * Tạo dữ liệu lịch trống ban đầu từ danh sách nhân sự.
 * @param staffList - Danh sách nhân sự (đã filter trạng thái)
 * @param daysCount - Số ngày trong tháng (mặc định 31)
 */
export const buildInitialRosterData = (staffList: any[], daysCount: number = 31): RosterRow[] => {
  return staffList
    .filter((s) => s.status !== "resigned")
    .map((staff) => ({
      staff,
      schedule: Array.from({ length: daysCount }).map(() => []),
    }));
};
