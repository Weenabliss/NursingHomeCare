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
