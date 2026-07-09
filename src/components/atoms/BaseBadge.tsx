import React from "react";

export type BadgeVariant = "success" | "danger" | "warning" | "info" | "default";

interface BaseBadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
  style?: React.CSSProperties;
}

export const BaseBadge: React.FC<BaseBadgeProps> = ({ children, variant = "default", className = "", style }) => {
  const getVariantStyles = (): React.CSSProperties => {
    switch (variant) {
      case "success":
        return {
          backgroundColor: "var(--success-light)",
          color: "var(--success)",
        };
      case "danger":
        return {
          backgroundColor: "var(--danger-light)",
          color: "var(--danger)",
        };
      case "warning":
        return {
          backgroundColor: "var(--warning-light)",
          color: "var(--warning)",
        };
      case "info":
        return { backgroundColor: "var(--info-light)", color: "var(--info)" };
      case "default":
      default:
        return {
          backgroundColor: "var(--surface-alt)",
          color: "var(--text-muted)",
        };
    }
  };

  return (
    <span
      className={`base-badge ${className}`}
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "0.25rem 0.75rem",
        borderRadius: "var(--radius-full)",
        fontSize: "var(--text-sm)",
        fontWeight: 500,
        ...getVariantStyles(),
        ...style,
      }}
    >
      {children}
    </span>
  );
};
