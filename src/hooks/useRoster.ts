import { useState, useCallback, useEffect } from "react";
import type { RosterRow, ShiftEntry } from "../pages/scheduling/types";
import { buildInitialRosterData } from "../utils/scheduleUtils";
import { staffListMock } from "../mock/staff";
import { useLeaveSwap } from "../contexts/LeaveSwapContext";

export interface UseRosterReturn {
  rosterData: RosterRow[];
  setRosterData: React.Dispatch<React.SetStateAction<RosterRow[]>>;
  draftRosterData: RosterRow[];
  previewMode: boolean;
  warnings: string[];
  handleAutoScheduleSuccess: (newRoster: RosterRow[], newWarnings: string[]) => void;
  handleConfirmPreview: () => Promise<void>;
  handleCancelPreview: () => void;
  handleManualSave: (staffIndex: number, dayIndex: number, newShifts: ShiftEntry[]) => void;
}

/**
 * Custom hook quản lý toàn bộ state và logic nghiệp vụ của Roster.
 * Giải phóng Schedule.tsx khỏi việc phải ôm đồm quá nhiều state.
 */
export const useRoster = (): UseRosterReturn => {
  const { getLeavesForStaff } = useLeaveSwap();

  const [rosterData, setRosterData] = useState<RosterRow[]>(() =>
    buildInitialRosterData(staffListMock)
  );
  const [draftRosterData, setDraftRosterData] = useState<RosterRow[]>([]);
  const [previewMode, setPreviewMode] = useState(false);
  const [warnings, setWarnings] = useState<string[]>([]);

  const { leaveRequests } = useLeaveSwap();

  // Effect: Đồng bộ hóa Nghỉ phép đã duyệt vào lịch
  useEffect(() => {
    setRosterData((prev) => {
      const newData = [...prev];
      let changed = false;

      newData.forEach((row, rowIndex) => {
        const leaves = getLeavesForStaff(row.staff.id);
        if (leaves.length === 0) return;

        const newSchedule = [...row.schedule];
        let rowChanged = false;

        leaves.forEach((leave) => {
          // Parse "YYYY-MM-DD" -> ngày trong tháng (bỏ qua tháng/năm vì demo đang fix tháng 8)
          const startDay = parseInt(leave.startDate.split("-")[2], 10);
          const endDay = parseInt(leave.endDate.split("-")[2], 10);
          
          for (let d = startDay; d <= endDay; d++) {
            const index = d - 1; // 1-indexed to 0-indexed
            if (index >= 0 && index < newSchedule.length) {
              const currentShifts = [...newSchedule[index]];
              const hasLeave = currentShifts.some(s => s.type.startsWith("leave"));
              
              if (!hasLeave) {
                if (leave.status === "approved") {
                  newSchedule[index] = [{ shift: "PHÉP", type: "leave" }];
                } else if (leave.status === "pending") {
                  newSchedule[index] = [...currentShifts, { shift: "Chờ duyệt nghỉ", type: "leave-pending", note: leave.reason }];
                } else if (leave.status === "rejected") {
                  newSchedule[index] = [...currentShifts, { shift: "Từ chối nghỉ", type: "leave-rejected", note: leave.rejectReason || leave.reason }];
                }
                rowChanged = true;
                changed = true;
              }
            }
          }
        });

        if (rowChanged) {
          newData[rowIndex] = { ...row, schedule: newSchedule };
        }
      });

      return changed ? newData : prev;
    });
  }, [leaveRequests, getLeavesForStaff]);

  const handleAutoScheduleSuccess = useCallback(
    (newRoster: RosterRow[], newWarnings: string[]) => {
      setDraftRosterData(newRoster);
      setWarnings(newWarnings);
      setPreviewMode(true);
    },
    []
  );

  const handleConfirmPreview = useCallback(async () => {
    try {
      await fetch("http://localhost:3001/api/schedule/save", { method: "POST" });
      setRosterData(draftRosterData);
      setPreviewMode(false);
      setWarnings([]);
      alert("Đã lưu kết quả phân ca thành công!");
    } catch {
      alert("Lỗi khi lưu phân ca. Vui lòng thử lại.");
    }
  }, [draftRosterData]);

  const handleCancelPreview = useCallback(() => {
    setDraftRosterData([]);
    setPreviewMode(false);
    setWarnings([]);
  }, []);

  const handleManualSave = useCallback(
    (staffIndex: number, dayIndex: number, newShifts: ShiftEntry[]) => {
      if (staffIndex >= 0 && dayIndex >= 0) {
        setRosterData((prev) => {
          const newData = [...prev];
          const newSchedule = [...newData[staffIndex].schedule];
          newSchedule[dayIndex] = newShifts;
          newData[staffIndex] = { ...newData[staffIndex], schedule: newSchedule };
          return newData;
        });
      }
    },
    []
  );

  return {
    rosterData,
    setRosterData,
    draftRosterData,
    previewMode,
    warnings,
    handleAutoScheduleSuccess,
    handleConfirmPreview,
    handleCancelPreview,
    handleManualSave,
  };
};
