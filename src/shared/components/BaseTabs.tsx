import React from "react";
import styles from "./BaseTabs.module.scss";

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
    <div className={`${styles.container} ${className}`} style={style}>
      {options.map((tab) => {
        const isActive = activeTab === tab.value;
        const Icon = tab.icon;

        return (
          <button
            key={tab.value}
            onClick={() => onChange(tab.value)}
            className={`${styles.tab} ${isActive ? styles.active : ""}`}
          >
            {Icon && <Icon size={18} />}
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};
