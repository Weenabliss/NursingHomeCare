import React from "react";

interface InfoFieldProps {
  label: string;
  value: React.ReactNode;
}

export const InfoField: React.FC<InfoFieldProps> = ({ label, value }) => {
  return (
    <div>
      <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "4px" }}>
        {label}
      </div>
      <div style={{ fontWeight: 500, color: "var(--text-main)", fontSize: "0.95rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
        {value || "---"}
      </div>
    </div>
  );
};
