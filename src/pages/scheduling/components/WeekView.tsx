import React from "react";
import { AlertTriangle, Users } from "lucide-react";
import { BaseCard } from "../../../components/atoms/BaseCard";
import styles from "../Schedule.module.scss";

interface WeekViewProps {
  days: string[];
  rosterData: any[];
  getShiftColor: (type: string) => { bg: string; color: string; border: string };
}

export const WeekView: React.FC<WeekViewProps> = ({ days, rosterData, getShiftColor }) => {
  return (
    <BaseCard className={styles.gridContainer}>
      <table className={styles.table}>
        <thead>
          <tr className={styles.theadRow}>
            <th className={styles.th} style={{ width: "200px" }}>
              Nhân Sự
            </th>
            {days.map((day, idx) => (
              <th key={idx} className={styles.th} style={{ textAlign: "center" }}>
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rosterData.map((row, idx) => (
            <tr key={idx} className={styles.tr}>
              <td className={styles.td}>
                <div className={styles.staffName}>
                  <Users size={16} />
                  {row.staff}
                </div>
              </td>
              {row.schedule.map((dayShift: any, sIdx: number) => {
                const style = getShiftColor(dayShift.type);
                return (
                  <td key={sIdx} className={styles.td} style={{ borderLeft: "1px solid var(--border)" }}>
                    <div
                      className={styles.shiftBadge}
                      style={{
                        backgroundColor: style.bg,
                        color: style.color,
                        borderColor: style.border,
                        minHeight: "40px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        position: "relative",
                      }}
                    >
                      {dayShift.shift}
                      {dayShift.type === "warning" && (
                        <AlertTriangle size={14} color="#b91c1c" style={{ position: "absolute", top: 4, right: 4 }} />
                      )}
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </BaseCard>
  );
};
