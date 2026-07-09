import React from "react";
import { useLayout } from "../../contexts/LayoutContext";

export const Footer: React.FC = () => {
  const { footerContent } = useLayout();
  return (
    <footer
      style={{
        marginTop: "auto",
        padding: "var(--spacing-md) 0",
        textAlign: "center",
        borderTop: "1px solid var(--border)",
        color: "var(--text-muted)",
        fontSize: "var(--text-sm)",
      }}
    >
      {footerContent || (
        <div style={{ width: "100%", padding: "0 1rem" }}>
          &copy; {new Date().getFullYear()} Weenabliss Nursing Home Care. All rights reserved.
        </div>
      )}
    </footer>
  );
};
