import type { RosterRow, ShiftEntry } from "../pages/scheduling/types";
import { format, addDays } from "date-fns";

export const generateICalContent = (staffId: string, rosterData: RosterRow[], month: number, year: number): string => {
  const staffRow = rosterData.find((r) => r.staff.id === staffId);
  if (!staffRow) return "";

  // Bắt đầu file iCal
  let icalContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//NursingHomeCare//Scheduling//VI",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    `X-WR-CALNAME:Lịch trực - ${staffRow.staff.name}`,
    `X-WR-TIMEZONE:Asia/Ho_Chi_Minh`
  ];

  // Mock mapping ca trực sang giờ (Giả định)
  const shiftTimes: Record<string, { start: string; end: string }> = {
    "SÁNG": { start: "080000", end: "170000" },
    "CHIỀU": { start: "130000", end: "210000" },
    "ĐÊM": { start: "210000", end: "060000" } // Kết thúc vào ngày hôm sau
  };

  const startDate = new Date(year, month, 1);

  staffRow.schedule.forEach((dayShifts, dayIndex) => {
    if (!dayShifts || dayShifts.length === 0) return;

    dayShifts.forEach((shiftEntry: ShiftEntry) => {
      if (shiftEntry.type === "leave" || shiftEntry.type === "warning") return;

      const currentShift = shiftTimes[shiftEntry.shift];
      if (!currentShift) return; // Nếu là OFF hoặc không xác định

      const currentDay = addDays(startDate, dayIndex);
      const dateStr = format(currentDay, "yyyyMMdd");
      
      let endDateStr = dateStr;
      if (shiftEntry.shift === "ĐÊM") {
        endDateStr = format(addDays(currentDay, 1), "yyyyMMdd");
      }

      const uid = `${dateStr}-${shiftEntry.shift}-${staffId}@nursinghome.vn`;
      const now = format(new Date(), "yyyyMMdd'T'HHmmss'Z'");

      icalContent.push(
        "BEGIN:VEVENT",
        `UID:${uid}`,
        `DTSTAMP:${now}`,
        `DTSTART;TZID=Asia/Ho_Chi_Minh:${dateStr}T${currentShift.start}`,
        `DTEND;TZID=Asia/Ho_Chi_Minh:${endDateStr}T${currentShift.end}`,
        `SUMMARY:Ca trực ${shiftEntry.shift}`,
        `DESCRIPTION:Ca trực ${shiftEntry.shift} tại Viện Dưỡng Lão. Nhân viên: ${staffRow.staff.name}`,
        "STATUS:CONFIRMED",
        "BEGIN:VALARM",
        "TRIGGER:-PT1H",
        "ACTION:DISPLAY",
        "DESCRIPTION:Sắp tới ca trực!",
        "END:VALARM",
        "END:VEVENT"
      );
    });
  });

  icalContent.push("END:VCALENDAR");

  return icalContent.join("\r\n");
};

export const downloadICalFile = (staffId: string, rosterData: RosterRow[], month: number, year: number) => {
  const content = generateICalContent(staffId, rosterData, month, year);
  if (!content) return;

  const blob = new Blob([content], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement("a");
  a.href = url;
  a.download = `lich-truc-${staffId}-${month + 1}-${year}.ics`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
