import React, { forwardRef } from "react";

interface BaseInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

export const BaseInput = forwardRef<HTMLInputElement, BaseInputProps>(
  ({ label, error, fullWidth = true, className = "", style, id, ...props }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substring(2, 9)}`;

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.25rem",
          width: fullWidth ? "100%" : "auto",
        }}
      >
        {label && (
          <label
            htmlFor={inputId}
            style={{
              fontSize: "0.875rem",
              fontWeight: 500,
              color: "var(--text-main)",
            }}
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          style={{
            padding: "0.5rem 0.75rem",
            borderRadius: "var(--radius-sm)",
            border: `1px solid ${error ? "#ef4444" : "var(--border)"}`,
            backgroundColor: "var(--background)",
            color: "var(--text-main)",
            outline: "none",
            fontSize: "1rem",
            transition: "border-color 0.2s",
            ...style,
          }}
          className={className}
          onFocus={(e) => {
            if (!error) e.currentTarget.style.borderColor = "var(--primary)";
          }}
          onBlur={(e) => {
            if (!error) e.currentTarget.style.borderColor = "var(--border)";
          }}
          {...props}
        />
        {error && <span style={{ fontSize: "0.75rem", color: "#ef4444" }}>{error}</span>}
      </div>
    );
  }
);

BaseInput.displayName = "BaseInput";
