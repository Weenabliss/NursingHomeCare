import React from "react";
import { BaseCard } from "../../../components/atoms/BaseCard";
import { useScrollSync } from "../../../hooks/useScrollSync";
import { StaffCell } from "./StaffCell";
import { ShiftBadge, EmptyShiftBadge } from "./ShiftBadge";
import type { DayInfo, RosterRow } from "../types";
import styles from "../Schedule.module.scss";

interface MonthViewProps {
  days: DayInfo[];
  rosterData: RosterRow[];
  onCellClick: (staffIdx: number, dayIdx: number, staff: any, dateLabel: string, shifts: any[]) => void;
}

export const MonthView: React.FC<MonthViewProps> = ({ days, rosterData, onCellClick }) => {
  const { headerRef, handleScroll } = useScrollSync();

  // Sử dụng minmax(65px, 1fr) để đảm bảo Header và Body có cùng kích thước cột,
  // tránh bị lệch cột do chênh lệch độ rộng nội dung giữa "THỨ 4" và chữ cái đơn.
  const gridCols = `260px repeat(${days.length}, minmax(65px, 1fr))`;

  return (
    <BaseCard className={styles.gridTableWrapper} style={{ padding: 0 }}>
      {/* Header Container */}
      <div className={styles.gridHeaderContainer} ref={headerRef}>
        <div className={styles.gridRow} style={{ gridTemplateColumns: gridCols }}>
          <div className={`${styles.gridHeaderCell} ${styles.gridStickyCol}`}>Nhân Sự</div>
          {days.map((day, idx) => (
            <div
              key={idx}
              className={`${styles.gridHeaderCell} ${day.isWeekend ? styles.weekendHeader : ""}`}
              style={{ padding: "8px 4px" }}
            >
              <div className={styles.dayOfWeekText} style={{ fontSize: "0.8rem", whiteSpace: "nowrap" }}>
                {day.dayOfWeek}
              </div>
              <div className={styles.dateNumText} style={{ fontSize: "0.75rem", whiteSpace: "nowrap" }}>
                {day.date}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Body Container */}
      <div className={styles.gridBodyContainer} onScroll={handleScroll}>
        <div style={{ display: "flex", flexDirection: "column", width: "max-content", minWidth: "100%" }}>
          {rosterData.map((row, idx) => (
            <div key={idx} className={styles.gridRow} style={{ gridTemplateColumns: gridCols }}>
              {/* Staff Cell - compact mode cho Month View */}
              <div className={`${styles.gridCell} ${styles.gridStickyCol}`}>
                <StaffCell staff={row.staff} compact />
              </div>

              {/* Day Cells */}
              {row.schedule.map((dayShifts, sIdx) => (
                <div
                  key={sIdx}
                  className={`${styles.gridCell} ${styles.clickableTd} ${days[sIdx]?.isWeekend ? styles.weekendCol : ""}`}
                  onClick={() => onCellClick(idx, sIdx, row.staff, days[sIdx].label, dayShifts)}
                  style={{ padding: "4px" }}
                >
                  {dayShifts && dayShifts.length > 0 ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                      {dayShifts.map((dayShift, bIdx) => (
                        <ShiftBadge key={bIdx} {...dayShift} compact />
                      ))}
                    </div>
                  ) : (
                    <EmptyShiftBadge compact />
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </BaseCard>
  );
};
