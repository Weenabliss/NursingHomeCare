import React, { useMemo } from "react";
import { BaseCard } from "../../../components/atoms/BaseCard";
import { useScrollSync } from "../../../hooks/useScrollSync";
import { getShiftColor } from "../../../utils/scheduleUtils";
import { downloadICalFile } from "../../../utils/icalGenerator";
import { StaffCell } from "./StaffCell";
import { Download } from "lucide-react";
import type { RosterRow, StaffStats } from "../types";
import styles from "../Schedule.module.scss";

interface ScheduleStatsProps {
  rosterData: RosterRow[];
}

interface StatsRow {
  staff: RosterRow["staff"];
  stats: StaffStats;
}

export const ScheduleStats: React.FC<ScheduleStatsProps> = ({ rosterData }) => {
  const { headerRef, handleScroll } = useScrollSync();

  const statsData: StatsRow[] = useMemo(() => {
    return rosterData.map((row) => {
      let total = 0, morning = 0, afternoon = 0, night = 0, admin = 0, offDays = 0, leave = 0;

      row.schedule.forEach((dayShifts) => {
        if (!dayShifts || dayShifts.length === 0) {
          offDays++;
        } else {
          dayShifts.forEach((shift) => {
            total++;
            if (shift.type === "morning" && shift.shift === "HC") admin++;
            else if (shift.type === "morning") morning++;
            else if (shift.type === "afternoon") afternoon++;
            else if (shift.type === "night") night++;
            else if (shift.type === "leave") leave++;
          });
        }
      });

      return { staff: row.staff, stats: { total, morning, afternoon, night, admin, offDays, leave } };
    });
  }, [rosterData]);

  const maxTotal = Math.max(...statsData.map((d) => d.stats.total), 1);
  const gridCols = `260px 100px 150px 100px 100px 100px 120px 100px 100px 120px`;

  const morningStyle = getShiftColor("morning");
  const afternoonStyle = getShiftColor("afternoon");
  const nightStyle = getShiftColor("night");

  return (
    <BaseCard className={styles.gridTableWrapper} style={{ padding: 0 }}>
      {/* Header */}
      <div className={styles.gridHeaderContainer} ref={headerRef}>
        <div className={styles.gridRow} style={{ gridTemplateColumns: gridCols }}>
          <div className={`${styles.gridHeaderCell} ${styles.gridStickyCol}`}>Nhân Sự</div>
          <div className={styles.gridHeaderCell}>Tổng số ca</div>
          <div className={styles.gridHeaderCell}>Tiến độ</div>
          <div className={styles.gridHeaderCell}>Ca Sáng</div>
          <div className={styles.gridHeaderCell}>Ca Chiều</div>
          <div className={styles.gridHeaderCell}>Ca Đêm</div>
          <div className={styles.gridHeaderCell}>Hành Chính</div>
          <div className={styles.gridHeaderCell}>Xin Phép</div>
          <div className={styles.gridHeaderCell}>Ngày Nghỉ</div>
          <div className={styles.gridHeaderCell}>Xuất lịch</div>
        </div>
      </div>

      {/* Body */}
      <div className={styles.gridBodyContainer} onScroll={handleScroll}>
        <div style={{ display: "flex", flexDirection: "column", width: "max-content", minWidth: "100%" }}>
          {statsData.map((row, idx) => {
            const progress = (row.stats.total / maxTotal) * 100;

            return (
              <div key={idx} className={styles.gridRow} style={{ gridTemplateColumns: gridCols }}>
                <div className={`${styles.gridCell} ${styles.gridStickyCol}`}>
                  <StaffCell staff={row.staff} />
                </div>

                {/* Total */}
                <div className={`${styles.gridCell} ${styles.statsCell}`} style={{ fontWeight: 700, fontSize: "1.1rem", color: "var(--primary-dark)" }}>
                  {row.stats.total}
                </div>

                {/* Progress bar */}
                <div className={`${styles.gridCell} ${styles.statsCell}`}>
                  <div style={{ width: "100%", height: "8px", backgroundColor: "var(--background-alt)", borderRadius: "4px", overflow: "hidden" }}>
                    <div style={{ width: `${progress}%`, height: "100%", backgroundColor: "var(--primary)", borderRadius: "4px", transition: "width 0.3s" }} />
                  </div>
                </div>

                {/* Morning */}
                <StatBadge value={row.stats.morning} bg={morningStyle.bg} color={morningStyle.color} />

                {/* Afternoon */}
                <StatBadge value={row.stats.afternoon} bg={afternoonStyle.bg} color={afternoonStyle.color} />

                {/* Night */}
                <StatBadge value={row.stats.night} bg={nightStyle.bg} color={nightStyle.color} />

                {/* Admin */}
                <StatBadge value={row.stats.admin} bg="#f1f5f9" color="#475569" border="1px solid #e2e8f0" />

                {/* Leave */}
                <StatBadge value={row.stats.leave} bg="#fce7f3" color="#be185d" border="1px solid #fbcfe8" />

                {/* Off Days */}
                <StatBadge value={row.stats.offDays} bg="#f8fafc" color="var(--text-muted)" />

                {/* Export iCal */}
                <div className={`${styles.gridCell} ${styles.statsCell}`}>
                  <button 
                    onClick={() => downloadICalFile(row.staff.id, rosterData, 7, 2026)}
                    style={{ background: "var(--background-alt)", border: "1px solid var(--border)", borderRadius: "6px", padding: "6px 12px", display: "flex", alignItems: "center", gap: "6px", cursor: "pointer", color: "var(--primary-dark)", fontSize: "0.8rem", fontWeight: 600, transition: "all 0.2s" }}
                    title="Xuất iCal file"
                  >
                    <Download size={14} /> iCal
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </BaseCard>
  );
};

/** Internal helper component for stat badge cells */
const StatBadge: React.FC<{ value: number; bg: string; color: string; border?: string }> = ({
  value, bg, color, border,
}) => (
  <div className={`${styles.gridCell} ${styles.statsCell}`}>
    <div
      className={styles.shiftBadge}
      style={{ backgroundColor: bg, color, border, padding: "4px 8px", display: "inline-block", minWidth: "40px" }}
    >
      {value}
    </div>
  </div>
);
