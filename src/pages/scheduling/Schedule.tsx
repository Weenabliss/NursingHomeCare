import React, { useState, useMemo, useEffect } from "react";
import { Calendar, AlertTriangle, Bell } from "lucide-react";
import { BaseButton } from "../../shared/components/BaseButton";
import { PageHeader } from "../../shared/components/PageHeader";
import { useLayout } from "../../contexts/LayoutContext";
import { useRoster } from "../../hooks/useRoster";
import { generateDays } from "../../utils/scheduleUtils";
import { ScheduleToolbar } from "./components/ScheduleToolbar";
import { SearchInput } from "./components/SearchInput";
import { WeekView } from "./components/WeekView";
import { MonthView } from "./components/MonthView";
import { ScheduleStats } from "./components/ScheduleStats";
import { HeatmapView } from "./components/HeatmapView";
import AutoScheduleModal from "./modals/AutoScheduleModal";
import ManualShiftModal from "./modals/ManualShiftModal";
import { RequestsSidebar } from "./components/RequestsSidebar";
import type { ViewMode, ShiftEntry } from "./types";
import { useActivityLog } from "../../shared/hooks/useActivityLog";
import { useLeaveSwap } from "../../contexts/LeaveSwapContext";
import styles from "./Schedule.module.scss";

// ─── Constants ────────────────────────────────────────────────────────────────
const WEEK_DAYS = generateDays(7, 9);  // Aug 10 is Monday
const MONTH_DAYS = generateDays(31, 0); // Aug 1

// ─── Component ────────────────────────────────────────────────────────────────
const Schedule: React.FC = () => {
  const { setFooterContent } = useLayout();

  // ── State ──────────────────────────────────────────────────────────────────
  const [viewMode, setViewMode] = useState<ViewMode>("week");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAutoModalOpen, setIsAutoModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [manualModalState, setManualModalState] = useState<{
    isOpen: boolean;
    staffIndex: number;
    dayIndex: number;
    staff: any;
    dateLabel: string;
    currentShifts: ShiftEntry[];
  }>({
    isOpen: false,
    staffIndex: -1,
    dayIndex: -1,
    staff: null,
    dateLabel: "",
    currentShifts: [],
  });

  // ── Custom Hooks ───────────────────────────────────────────────────────────
  const { log } = useActivityLog({ module: "scheduling" });
  const { leaveRequests, swapRequests } = useLeaveSwap();

  const pendingCount = 
    leaveRequests.filter(r => r.status === "pending").length + 
    swapRequests.filter(r => r.status === "pending").length;

  const {
    rosterData,
    draftRosterData,
    previewMode,
    warnings,
    handleAutoScheduleSuccess,
    handleConfirmPreview,
    handleCancelPreview,
    handleManualSave,
  } = useRoster();

  // ── Derived State ──────────────────────────────────────────────────────────
  // Log khi người dùng đổi chế độ xem
  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
    log("switch_view_mode", `Chuyển sang chế độ xem: ${mode}`, { from: viewMode, to: mode });
  };

  const displayedDays = viewMode === "week" ? WEEK_DAYS : MONTH_DAYS;

  const activeRosterData = useMemo(() => {
    const data = previewMode ? draftRosterData : rosterData;
    if (!searchQuery.trim()) return data;
    const lowerQuery = searchQuery.toLowerCase();
    return data.filter(
      (row) =>
        row.staff.name.toLowerCase().includes(lowerQuery) ||
        row.staff.id.toLowerCase().includes(lowerQuery)
    );
  }, [previewMode, draftRosterData, rosterData, searchQuery]);

  const displayedRosterData = useMemo(() => {
    const rawData = activeRosterData.map((row) => ({
      ...row,
      schedule: viewMode === "week" ? row.schedule.slice(0, 7) : row.schedule,
    }));

    return rawData.map(row => {
      const newSchedule = row.schedule.map((dayShifts, dayIdx) => {
        const dateObj = displayedDays[dayIdx];
        if (!dateObj || !dateObj.fullDate) return dayShifts;
        const currentFullDate = dateObj.fullDate;
        
        let injectedShifts = [...dayShifts];

        // 1. Inject Leaves
        const leaves = leaveRequests.filter(lr => 
          lr.staffId === row.staff.id && 
          currentFullDate >= lr.startDate && 
          currentFullDate <= lr.endDate
        );
        leaves.forEach(lr => {
          const type = lr.status === "pending" ? "leave-pending" : lr.status === "approved" ? "leave" : "leave-rejected";
          injectedShifts.push({
            shift: "PHÉP",
            type,
            note: lr.reason,
            reqId: lr.id,
            status: lr.status
          });
        });

        // 2. Inject Swaps (As Requester)
        const swapsAsReq = swapRequests.filter(sw => sw.requesterId === row.staff.id && sw.date === currentFullDate);
        swapsAsReq.forEach(sw => {
          if (sw.status === "approved") return; // Approved swap is handled by actual shift change
          const type = sw.status === "pending" ? "swap-pending" : "swap-rejected";
          injectedShifts.push({
            shift: "ĐỔI CA",
            type,
            note: `Xin đổi ca ${sw.requesterShift} lấy ca ${sw.targetShift} với ${sw.targetStaffName}. Lý do: ${sw.reason}`,
            reqId: sw.id,
            status: sw.status
          });
        });

        // 3. Inject Swaps (As Target)
        const swapsAsTarget = swapRequests.filter(sw => sw.targetStaffId === row.staff.id && sw.date === currentFullDate);
        swapsAsTarget.forEach(sw => {
          if (sw.status === "approved") return;
          const type = sw.status === "pending" ? "swap-pending" : "swap-rejected";
          injectedShifts.push({
            shift: "ĐỔI CA",
            type,
            note: `${sw.requesterName} xin đổi ca ${sw.requesterShift} lấy ca ${sw.targetShift}. Lý do: ${sw.reason}`,
            reqId: sw.id,
            status: sw.status
          });
        });

        return injectedShifts;
      });
      return { ...row, schedule: newSchedule };
    });
  }, [activeRosterData, viewMode, displayedDays, leaveRequests, swapRequests]);

  const hasViolation = displayedRosterData.some((row) =>
    row.schedule.some((dayShifts) => dayShifts.some((s) => s.type === "warning"))
  );

  // ── Footer Toolbar ─────────────────────────────────────────────────────────
  useEffect(() => {
    setFooterContent(
      <ScheduleToolbar
        viewMode={viewMode}
        onViewModeChange={handleViewModeChange}
        previewMode={previewMode}
        onConfirm={handleConfirmPreview}
        onCancel={handleCancelPreview}
      />
    );
    return () => setFooterContent(null);
  }, [viewMode, setFooterContent, previewMode, draftRosterData]);

  // ── Event Handlers ─────────────────────────────────────────────────────────
  const handleCellClick = (staffIndex: number, dayIndex: number, staff: any, dateLabel: string, currentShifts: ShiftEntry[]) => {
    log("open_modal", `Mở modal phân ca thủ công: ${staff.name} - ${dateLabel}`, { staffId: staff.id, date: dateLabel });
    setManualModalState({ isOpen: true, staffIndex, dayIndex, staff, dateLabel, currentShifts });
  };

  const handleManualSaveWrapper = (newShifts: ShiftEntry[]) => {
    log("manual_shift_save", `Lưu ca thủ công: ${manualModalState.staff?.name} - ${manualModalState.dateLabel}`, {
      staffId: manualModalState.staff?.id,
      date: manualModalState.dateLabel,
      shifts: newShifts.map(s => s.shift),
    });
    handleManualSave(manualModalState.staffIndex, manualModalState.dayIndex, newShifts);
  };

  const handleOpenAutoModal = () => {
    log("open_modal", "Mở modal tự động xếp ca");
    setIsAutoModalOpen(true);
  };

  const handleAutoSuccess = (newRoster: any, newWarnings: string[]) => {
    log("auto_schedule_run", "Thuật toán xếp ca chạy xong", { warningCount: newWarnings.length });
    handleAutoScheduleSuccess(newRoster, newWarnings);
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className={styles.schedulePage}>
      <PageHeader
        title="Xếp Ca Trực (Rostering)"
        subtitle="Hệ thống tự động phát hiện vi phạm luật lao động & thời gian nghỉ ngơi."
        actions={
          <div style={{ display: "flex", gap: "12px", alignItems: "center", flexShrink: 0, paddingRight: "8px", paddingTop: "8px" }}>
            <SearchInput value={searchQuery} onChange={setSearchQuery} />
            
            <BaseButton variant="outline" onClick={() => setIsSidebarOpen(true)} style={{ position: "relative" }}>
              <Bell size={18} />
              Duyệt Yêu cầu
              {pendingCount > 0 && (
                <span style={{ position: "absolute", top: -8, right: -8, background: "#dc2626", color: "#fff", fontSize: "0.7rem", fontWeight: 700, padding: "2px 6px", borderRadius: "10px", zIndex: 10 }}>
                  {pendingCount}
                </span>
              )}
            </BaseButton>

            <BaseButton variant="primary" onClick={handleOpenAutoModal}>
              <Calendar size={18} />
              Tự động xếp ca
            </BaseButton>
          </div>
        }
      />

      {/* Violation Banner */}
      {viewMode === "week" && hasViolation && !previewMode && (
        <ViolationBanner />
      )}

      {/* Preview Warnings Banner */}
      {previewMode && warnings.length > 0 && (
        <WarningsBanner warnings={warnings} />
      )}

      {/* Main Content */}
      <div className={styles.mainContent} style={{ position: "relative", overflow: "hidden" }}>
        {viewMode === "stats" ? (
          <ScheduleStats rosterData={activeRosterData} />
        ) : viewMode === "week" ? (
          <WeekView days={displayedDays} rosterData={displayedRosterData} onCellClick={handleCellClick} />
        ) : viewMode === "heatmap" ? (
          <HeatmapView days={displayedDays} rosterData={displayedRosterData} onCellClick={handleCellClick} />
        ) : (
          <MonthView days={displayedDays} rosterData={displayedRosterData} onCellClick={handleCellClick} />
        )}
        
        {/* Requests Sidebar */}
        <RequestsSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      </div>

      {/* Modals */}
      <AutoScheduleModal
        isOpen={isAutoModalOpen}
        onClose={() => setIsAutoModalOpen(false)}
        onSuccess={handleAutoSuccess}
        currentRosterData={rosterData}
      />

      <ManualShiftModal
        isOpen={manualModalState.isOpen}
        onClose={() => setManualModalState((prev) => ({ ...prev, isOpen: false }))}
        onSave={handleManualSaveWrapper}
        staff={manualModalState.staff}
        dateLabel={manualModalState.dateLabel}
        currentShifts={manualModalState.currentShifts}
        rosterData={rosterData}
        dayIndex={manualModalState.dayIndex}
      />
    </div>
  );
};

// ─── Internal Banner Sub-components ───────────────────────────────────────────
const ViolationBanner: React.FC = () => (
  <div className={styles.violationBanner}>
    <AlertTriangle size={24} className={styles.violationIcon} />
    <div>
      <span className={styles.violationTitle}>Phát hiện lỗi Xếp Ca (Rostering Violation)</span>
      <span className={styles.violationDesc}>
        Nhân sự <strong>Trần Thị Bé</strong> được xếp Ca Đêm vào Thứ 2 (kết thúc lúc 06:00 Thứ 3), nhưng lại bị xếp
        tiếp Ca Sáng vào Thứ 3 (bắt đầu lúc 06:00). Việc xếp ca liên tục không có thời gian nghỉ ngơi bị cấm.
        Vui lòng điều chỉnh lại trước khi Công bố!
      </span>
    </div>
  </div>
);

const WarningsBanner: React.FC<{ warnings: string[] }> = ({ warnings }) => (
  <div className={styles.violationBanner} style={{ backgroundColor: "#fffbeb", borderColor: "#fef3c7" }}>
    <AlertTriangle size={24} className={styles.violationIcon} style={{ color: "#d97706", backgroundColor: "#fef3c7" }} />
    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
      <span className={styles.violationTitle} style={{ color: "#b45309" }}>
        Cảnh báo kết quả Xếp Ca Tự Động
      </span>
      <ul style={{ margin: 0, paddingLeft: "1.5rem", color: "#b45309", fontSize: "0.85rem" }}>
        {warnings.map((w, i) => <li key={i}>{w}</li>)}
      </ul>
    </div>
  </div>
);

export default Schedule;
