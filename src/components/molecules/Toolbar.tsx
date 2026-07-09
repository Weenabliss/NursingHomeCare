import React, { type ReactNode } from "react";
import { Search } from "lucide-react";

interface ToolbarProps {
  onSearch?: (value: string) => void;
  searchPlaceholder?: string;
  filters?: ReactNode;
  actions?: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  onSearch,
  searchPlaceholder = "Tìm kiếm...",
  filters,
  actions,
  className = "",
  style,
}) => {
  return (
    <div
      className={`toolbar card-25d ${className}`}
      style={{
        padding: "var(--spacing-md)",
        marginBottom: "var(--spacing-lg)",
        display: "flex",
        gap: "var(--spacing-md)",
        flexWrap: "wrap",
        alignItems: "center",
        ...style,
      }}
    >
      {onSearch && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            backgroundColor: "var(--background)",
            padding: "0.5rem 1rem",
            borderRadius: "var(--radius-sm)",
            minWidth: "250px",
            border: "1px solid var(--border)",
            flex: 1,
            transition: "border-color 0.2s",
          }}
        >
          <Search size={18} color="var(--text-muted)" style={{ marginRight: "var(--spacing-sm)" }} />
          <input
            type="text"
            placeholder={searchPlaceholder}
            onChange={(e) => onSearch(e.target.value)}
            style={{
              border: "none",
              background: "transparent",
              outline: "none",
              boxShadow: "none",
              width: "100%",
              fontFamily: "inherit",
              color: "var(--text-main)",
            }}
          />
        </div>
      )}

      {filters && <div style={{ display: "flex", gap: "var(--spacing-md)", flexWrap: "wrap", flex: 2 }}>{filters}</div>}

      {actions && <div style={{ display: "flex", gap: "var(--spacing-sm)", marginLeft: "auto" }}>{actions}</div>}
    </div>
  );
};
