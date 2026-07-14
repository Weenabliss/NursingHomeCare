import React from "react";
import styles from "./BaseBadge.module.scss";

export type BadgeVariant = "success" | "danger" | "warning" | "info" | "default";

interface BaseBadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
  style?: React.CSSProperties;
}

export const BaseBadge: React.FC<BaseBadgeProps> = ({ children, variant = "default", className = "", style }) => {
  return (
    <span className={`${styles.badge} ${styles[variant]} ${className}`} style={style}>
      {children}
    </span>
  );
};

// ---------------------------------------------------------------------------
// Status helper functions — eliminates inline badge spans across the codebase
// ---------------------------------------------------------------------------

/** Staff employment status badge */
export const getStaffStatusBadge = (status: string): React.ReactElement => {
  const map: Record<string, { label: string; variant: BadgeVariant }> = {
    active:   { label: "Đang làm việc", variant: "success" },
    on_leave: { label: "Nghỉ thai sản", variant: "warning" },
    resigned: { label: "Đã nghỉ việc",  variant: "default" },
  };
  const cfg = map[status] ?? { label: status, variant: "default" };
  return <BaseBadge variant={cfg.variant}>{cfg.label}</BaseBadge>;
};

/** Contract status badge */
export const getContractStatusBadge = (status: string): React.ReactElement => {
  const map: Record<string, { label: string; variant: BadgeVariant }> = {
    active:     { label: "Hiệu lực",    variant: "success" },
    expired:    { label: "Hết hạn",     variant: "danger"  },
    terminated: { label: "Đã chấm dứt", variant: "default" },
  };
  const cfg = map[status] ?? { label: status, variant: "default" };
  return <BaseBadge variant={cfg.variant}>{cfg.label}</BaseBadge>;
};

/** Timekeeping check-in/out status badge */
export const getTimekeepingStatusBadge = (status: string): React.ReactElement => {
  const map: Record<string, { label: string; variant: BadgeVariant }> = {
    on_time:  { label: "Đúng giờ", variant: "success" },
    late:     { label: "Đi muộn", variant: "warning"  },
    early:    { label: "Về sớm",  variant: "warning"  },
    overtime: { label: "Tăng ca", variant: "info"     },
    missing:  { label: "Vắng mặt", variant: "danger"  },
  };
  const cfg = map[status] ?? { label: status, variant: "default" };
  return <BaseBadge variant={cfg.variant}>{cfg.label}</BaseBadge>;
};

/** Activity/audit log type badge */
export const getActivityTypeBadge = (type: string): React.ReactElement => {
  const map: Record<string, { label: string; variant: BadgeVariant }> = {
    system:      { label: "Hệ thống", variant: "default" },
    audit:       { label: "Hồ sơ",   variant: "info"    },
    performance: { label: "Thành tích", variant: "warning" },
  };
  const cfg = map[type] ?? { label: type, variant: "default" };
  return <BaseBadge variant={cfg.variant}>{cfg.label}</BaseBadge>;
};

