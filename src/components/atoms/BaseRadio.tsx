import React from "react";

interface BaseRadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const BaseRadio: React.FC<BaseRadioProps> = ({ label, id, ...props }) => {
  const inputId = id || `radio-${Math.random().toString(36).substring(2, 9)}`;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
      <input
        type="radio"
        id={inputId}
        style={{
          width: "1.2rem",
          height: "1.2rem",
          accentColor: "var(--primary)",
          cursor: "pointer",
        }}
        {...props}
      />
      <label
        htmlFor={inputId}
        style={{
          cursor: "pointer",
          color: "var(--text-main)",
          fontSize: "0.9rem",
        }}
      >
        {label}
      </label>
    </div>
  );
};
