import React from "react";
import type { StaffInfo } from "../types";
import styles from "../Schedule.module.scss";

interface StaffCellProps {
  staff: StaffInfo;
  /** Hiển thị chế độ compact (chỉ hiển thị chức vụ, không mã NV) dùng cho Month view */
  compact?: boolean;
}

/**
 * Component hiển thị thông tin nhân sự trong cột đầu của bảng lịch.
 * Tái sử dụng trong WeekView, MonthView, và ScheduleStats.
 */
export const StaffCell: React.FC<StaffCellProps> = ({ staff, compact = false }) => {
  return (
    <div className={styles.staffCell}>
      <img
        src={staff.avatar || "https://i.pravatar.cc/150"}
        alt={staff.name}
        className={styles.staffAvatar}
      />
      <div className={styles.staffInfo}>
        <span className={styles.staffNameText} style={compact ? { fontSize: "0.85rem" } : undefined}>
          {staff.name}
        </span>
        <div className={styles.staffMeta}>
          {!compact && (
            <>
              <span>{staff.id || "NV001"}</span>
              <span>•</span>
            </>
          )}
          <span className={styles.staffBadge}>{staff.position || "Nhân viên"}</span>
        </div>
      </div>
    </div>
  );
};
