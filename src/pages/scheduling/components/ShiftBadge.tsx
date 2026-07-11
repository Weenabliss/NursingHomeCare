import React from "react";
import { AlertTriangle } from "lucide-react";
import { getShiftColor } from "../../../utils/scheduleUtils";
import type { ShiftEntry } from "../types";
import styles from "../Schedule.module.scss";

interface ShiftBadgeProps extends ShiftEntry {
  /** Chế độ compact (Month View) - hiển thị 1 chữ cái đầu, size nhỏ hơn */
  compact?: boolean;
}

/**
 * Component hiển thị một ca trực dưới dạng badge màu sắc.
 * Hỗ trợ 2 chế độ: full (Week View) và compact (Month View).
 */
export const ShiftBadge: React.FC<ShiftBadgeProps> = ({ shift, type, compact = false }) => {
  const color = getShiftColor(type);
  const label = compact ? shift.charAt(0).toUpperCase() : shift;

  return (
    <div
      className={styles.shiftBadge}
      title={shift}
      style={{
        backgroundColor: color.bg,
        color: color.color,
        borderColor: color.border,
        padding: compact ? "4px 0" : "0.5rem",
        fontSize: compact ? "0.75rem" : "0.85rem",
        minHeight: compact ? "24px" : "40px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
    >
      {label}
      {type === "warning" && (
        <AlertTriangle
          size={compact ? 10 : 14}
          color="#b91c1c"
          style={{ position: "absolute", top: compact ? 2 : 4, right: compact ? 2 : 4 }}
        />
      )}
    </div>
  );
};

/** Badge hiển thị ô trống (không có ca) */
export const EmptyShiftBadge: React.FC<{ compact?: boolean }> = ({ compact = false }) => (
  <div
    className={styles.shiftBadge}
    style={{
      border: "1px dashed var(--border)",
      color: "var(--text-muted)",
      padding: compact ? "4px 0" : undefined,
      fontSize: compact ? "0.75rem" : undefined,
      minHeight: compact ? "24px" : "40px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    {compact ? "-" : "OFF"}
  </div>
);
