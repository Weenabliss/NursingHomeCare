import React, { forwardRef } from "react";

interface BaseSelectOption {
  label: string;
  value: string | number;
}

interface BaseSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: BaseSelectOption[];
  error?: string;
  fullWidth?: boolean;
}

export const BaseSelect = forwardRef<HTMLSelectElement, BaseSelectProps>(
  ({ label, options, error, fullWidth = true, className = "", style, id, ...props }, ref) => {
    const selectId = id || `select-${Math.random().toString(36).substring(2, 9)}`;

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
            htmlFor={selectId}
            style={{
              fontSize: "0.875rem",
              fontWeight: 500,
              color: "var(--text-main)",
            }}
          >
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          style={{
            padding: "0.5rem 0.75rem",
            borderRadius: "var(--radius-sm)",
            border: `1px solid ${error ? "#ef4444" : "var(--border)"}`,
            backgroundColor: "var(--background)",
            color: "var(--text-main)",
            outline: "none",
            fontSize: "1rem",
            transition: "border-color 0.2s",
            appearance: "none",
            backgroundImage: `url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%2394a3b8%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right 0.7rem top 50%",
            backgroundSize: "0.65rem auto",
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
        >
          {options.map((opt, idx) => (
            <option key={idx} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <span style={{ fontSize: "0.75rem", color: "#ef4444" }}>{error}</span>}
      </div>
    );
  }
);

BaseSelect.displayName = "BaseSelect";
