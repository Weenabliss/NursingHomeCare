import React from "react";
import { BaseCard } from "../../../shared/components/BaseCard";
import { useScrollSync } from "../../../hooks/useScrollSync";
import { StaffCell } from "./StaffCell";
import { ShiftBadge, EmptyShiftBadge } from "./ShiftBadge";
import type { DayInfo, RosterRow } from "../types";
import styles from "../Schedule.module.scss";

interface WeekViewProps {
  days: DayInfo[];
  rosterData: RosterRow[];
  onCellClick: (staffIdx: number, dayIdx: number, staff: any, dateLabel: string, shifts: any[]) => void;
}

export const WeekView: React.FC<WeekViewProps> = ({ days, rosterData, onCellClick }) => {
  const { headerRef, handleScroll } = useScrollSync();

  const gridCols = `260px repeat(${days.length}, minmax(120px, 1fr))`;

  return (
    <BaseCard className={styles.gridTableWrapper} style={{ padding: 0 }}>
      {/* Header Container */}
      <div className={styles.gridHeaderContainer} ref={headerRef} style={{ backgroundColor: "#fff1f2" }}>
        <div className={styles.gridRow} style={{ gridTemplateColumns: gridCols }}>
          <div className={`${styles.gridHeaderCell} ${styles.gridStickyCol}`}>Nhân Sự</div>
          {days.map((day, idx) => (
            <div
              key={idx}
              className={`${styles.gridHeaderCell} ${day.isWeekend ? styles.weekendHeader : ""}`}
            >
              <div className={styles.dayOfWeekText}>{day.dayOfWeek}</div>
              <div className={styles.dateNumText}>{day.date}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Body Container */}
      <div className={styles.gridBodyContainer} onScroll={handleScroll}>
        <div style={{ display: "flex", flexDirection: "column", width: "max-content", minWidth: "100%" }}>
          {rosterData.map((row, idx) => (
            <div key={idx} className={styles.gridRow} style={{ gridTemplateColumns: gridCols }}>
              {/* Staff Cell */}
              <div className={`${styles.gridCell} ${styles.gridStickyCol}`}>
                <StaffCell staff={row.staff} />
              </div>

              {/* Day Cells */}
              {row.schedule.map((dayShifts, sIdx) => (
                <div
                  key={sIdx}
                  className={`${styles.gridCell} ${styles.clickableTd} ${days[sIdx]?.isWeekend ? styles.weekendCol : ""}`}
                  onClick={() => onCellClick(idx, sIdx, row.staff, days[sIdx].label, dayShifts)}
                >
                  {dayShifts && dayShifts.length > 0 ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      {dayShifts.map((dayShift, bIdx) => (
                        <ShiftBadge key={bIdx} {...dayShift} />
                      ))}
                    </div>
                  ) : (
                    <EmptyShiftBadge />
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
