import React from "react";

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
    <div
      style={{
        display: "flex",
        gap: "1rem",
        flexWrap: "wrap",
        width: "100%",
        ...style,
      }}
    >
      {children}
    </div>
  );
};
