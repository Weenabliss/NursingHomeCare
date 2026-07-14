import React, { type ReactNode } from "react";
import { Search } from "lucide-react";
import styles from "./Toolbar.module.scss";

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
    <div className={`card-25d ${styles.toolbar} ${className}`} style={style}>
      {onSearch && (
        <div className={styles.searchContainer}>
          <Search size={18} color="var(--text-muted)" className={styles.searchIcon} />
          <input
            type="text"
            placeholder={searchPlaceholder}
            onChange={(e) => onSearch(e.target.value)}
            className={styles.searchInput}
          />
        </div>
      )}

      {filters && <div className={styles.filters}>{filters}</div>}

      {actions && <div className={styles.actions}>{actions}</div>}
    </div>
  );
};
