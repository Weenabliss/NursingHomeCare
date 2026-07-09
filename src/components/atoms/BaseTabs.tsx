import React from "react";

export interface TabOption {
  value: string;
  label: string;
  icon?: React.ElementType;
}

interface BaseTabsProps {
  options: TabOption[];
  activeTab: string;
  onChange: (value: string) => void;
  className?: string;
  style?: React.CSSProperties;
}

export const BaseTabs: React.FC<BaseTabsProps> = ({ options, activeTab, onChange, className = "", style }) => {
  return (
    <div
      className={`base-tabs ${className}`}
      style={{
        display: "flex",
        gap: "var(--spacing-sm)",
        marginBottom: "var(--spacing-lg)",
        overflowX: "auto",
        flexWrap: "nowrap",
        ...style,
      }}
    >
      {options.map((tab) => {
        const isActive = activeTab === tab.value;
        const Icon = tab.icon;

        return (
          <button
            key={tab.value}
            onClick={() => onChange(tab.value)}
            style={{
              padding: "0.75rem 1.5rem",
              backgroundColor: isActive ? "var(--primary)" : "var(--surface)",
              color: isActive ? "white" : "var(--text-main)",
              border: isActive ? "1px solid var(--primary)" : "1px solid var(--border)",
              borderRadius: "var(--radius-md)",
              cursor: "pointer",
              fontWeight: 500,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              whiteSpace: "nowrap",
              flexShrink: 0,
              transition: "all var(--transition-fast)",
              boxShadow: isActive ? "var(--shadow-md)" : "none",
            }}
          >
            {Icon && <Icon size={18} />}
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};
