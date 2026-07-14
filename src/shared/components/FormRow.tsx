import React from "react";
import styles from "./FormRow.module.scss";

interface FormRowProps {
  children: React.ReactNode;
  /** Extra inline styles */
  style?: React.CSSProperties;
}

/**
 * A thin wrapper for flex rows inside forms / timeline items.
 * Replaces the repeated pattern:
 *   <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", width: "100%" }}>
 */
export const FormRow: React.FC<FormRowProps> = ({ children, style }) => {
  return (
    <div className={styles.row} style={style}>
      {children}
    </div>
  );
};
