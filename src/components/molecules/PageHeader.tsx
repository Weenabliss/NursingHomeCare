import React, { type ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, actions, className = "", style }) => {
  return (
    <div
      className={`page-header ${className}`}
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: "var(--spacing-lg)",
        ...style,
      }}
    >
      <div>
        <h1
          style={{
            fontSize: "1.75rem",
            fontWeight: 700,
            color: "var(--text-main)",
            margin: "0 0 0.5rem 0",
            letterSpacing: "-0.02em",
          }}
        >
          {title}
        </h1>
        {subtitle && <p style={{ color: "var(--text-muted)", margin: 0 }}>{subtitle}</p>}
      </div>
      {actions && <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>{actions}</div>}
    </div>
  );
};
