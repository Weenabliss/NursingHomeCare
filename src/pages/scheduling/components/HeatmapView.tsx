import React from "react";
import { BaseCard } from "../../../components/atoms/BaseCard";
import { useScrollSync } from "../../../hooks/useScrollSync";
import { StaffCell } from "./StaffCell";
import { useShifts } from "../../../contexts/ShiftContext";
import type { DayInfo, RosterRow, ShiftEntry } from "../types";
import styles from "../Schedule.module.scss";

interface HeatmapViewProps {
  days: DayInfo[];
  rosterData: RosterRow[];
  onCellClick: (staffIdx: number, dayIdx: number, staff: any, dateLabel: string, shifts: any[]) => void;
}

export const HeatmapView: React.FC<HeatmapViewProps> = ({ days, rosterData, onCellClick }) => {
  const { headerRef, handleScroll } = useScrollSync();
  const { shifts } = useShifts();

  // Helper to calculate hours
  const calculateHours = (shiftEntries: ShiftEntry[]) => {
    let totalHours = 0;
    shiftEntries.forEach((entry) => {
      if (entry.type === "leave" || entry.type === "warning") return;
      const shiftDef = shifts.find(s => s.name === entry.shift || s.id === entry.shift);
      if (shiftDef && shiftDef.startTime && shiftDef.endTime) {
        const [startH, startM] = shiftDef.startTime.split(":").map(Number);
        const [endH, endM] = shiftDef.endTime.split(":").map(Number);
        let hours = (endH + endM / 60) - (startH + startM / 60);
        if (hours < 0) hours += 24; // Qua đêm
        totalHours += hours;
      } else {
        // Fallback for mock shifts that might not exactly match definition names
        if (entry.type === "morning" || entry.type === "afternoon" || entry.type === "night") {
          totalHours += 8;
        }
      }
    });
    return totalHours;
  };

  const getHeatmapColor = (hours: number, isLeave: boolean) => {
    if (isLeave) return "repeating-linear-gradient(45deg, #f1f5f9, #f1f5f9 8px, #ffffff 8px, #ffffff 16px)";
    if (hours === 0) return "#f8fafc";
    if (hours <= 4) return "#dcfce7"; // Xanh nhạt (Ít việc)
    if (hours <= 8) return "#86efac"; // Xanh vừa (Bình thường)
    if (hours <= 12) return "#fde047"; // Vàng (Nhiều việc)
    if (hours <= 16) return "#fdba74"; // Cam (Cảnh báo)
    return "#fca5a5"; // Đỏ (Quá tải)
  };

  const gridCols = `260px repeat(${days.length}, minmax(40px, 1fr)) 80px`;

  return (
    <BaseCard className={styles.gridTableWrapper} style={{ padding: 0 }}>
      {/* Header Container */}
      <div className={styles.gridHeaderContainer} ref={headerRef} style={{ backgroundColor: "#f0fdf4" }}>
        <div className={styles.gridRow} style={{ gridTemplateColumns: gridCols }}>
          <div className={`${styles.gridHeaderCell} ${styles.gridStickyCol}`}>Nhân Sự</div>
          {days.map((day, idx) => (
            <div
              key={idx}
              className={`${styles.gridHeaderCell} ${day.isWeekend ? styles.weekendHeader : ""}`}
              style={{ padding: "8px 4px" }}
            >
              <div className={styles.dayOfWeekText} style={{ fontSize: "0.7rem" }}>{day.dayOfWeek}</div>
              <div className={styles.dateNumText} style={{ fontSize: "0.85rem" }}>{day.date.split("/")[0]}</div>
            </div>
          ))}
          <div className={styles.gridHeaderCell} style={{ fontWeight: 700 }}>Tổng (h)</div>
        </div>
      </div>

      {/* Body Container */}
      <div className={styles.gridBodyContainer} onScroll={handleScroll}>
        <div style={{ display: "flex", flexDirection: "column", width: "max-content", minWidth: "100%" }}>
          {rosterData.map((row, idx) => {
            let rowTotalHours = 0;
            return (
              <div key={idx} className={styles.gridRow} style={{ gridTemplateColumns: gridCols }}>
                {/* Staff Cell */}
                <div className={`${styles.gridCell} ${styles.gridStickyCol}`}>
                  <StaffCell staff={row.staff} />
                </div>

                {/* Day Cells */}
                {row.schedule.map((dayShifts, sIdx) => {
                  const isLeave = dayShifts.some(s => s.type === "leave");
                  const hours = calculateHours(dayShifts);
                  rowTotalHours += hours;
                  const bg = getHeatmapColor(hours, isLeave);

                  return (
                    <div
                      key={sIdx}
                      className={`${styles.gridCell} ${styles.clickableTd} ${days[sIdx]?.isWeekend ? styles.weekendCol : ""}`}
                      onClick={() => onCellClick(idx, sIdx, row.staff, days[sIdx].label, dayShifts)}
                      style={{
                        background: bg,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: 0,
                        fontWeight: 600,
                        fontSize: "0.8rem",
                        color: hours > 8 && !isLeave ? "#7f1d1d" : "var(--text-main)",
                        borderRight: "1px solid #fff",
                        borderBottom: "1px solid #fff"
                      }}
                      title={`${hours} giờ`}
                    >
                      {isLeave ? "✈️" : hours > 0 ? hours : ""}
                    </div>
                  );
                })}
                
                {/* Total Column */}
                <div 
                  className={styles.gridCell} 
                  style={{ 
                    fontWeight: 700, 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center",
                    backgroundColor: rowTotalHours > 48 ? "#fef2f2" : "#f0fdf4",
                    color: rowTotalHours > 48 ? "#dc2626" : "#16a34a"
                  }}
                >
                  {rowTotalHours}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </BaseCard>
  );
};
