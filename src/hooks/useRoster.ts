import { useState, useCallback } from "react";
import type { RosterRow, ShiftEntry } from "../pages/scheduling/types";
import { buildInitialRosterData } from "../utils/scheduleUtils";
import { staffListMock } from "../mock/staff";

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
  const [rosterData, setRosterData] = useState<RosterRow[]>(() =>
    buildInitialRosterData(staffListMock)
  );
  const [draftRosterData, setDraftRosterData] = useState<RosterRow[]>([]);
  const [previewMode, setPreviewMode] = useState(false);
  const [warnings, setWarnings] = useState<string[]>([]);

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
