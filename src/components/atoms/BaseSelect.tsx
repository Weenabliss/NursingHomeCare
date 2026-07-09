import React, { forwardRef } from "react";
import styles from "./BaseSelect.module.scss";

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
      <div className={`${styles.container} ${fullWidth ? styles.fullWidth : ""}`}>
        {label && (
          <label htmlFor={selectId} className={styles.label}>
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          className={`${styles.select} ${error ? styles.hasError : ""} ${className}`}
          style={style}
          {...props}
        >
          {options.map((opt, idx) => (
            <option key={idx} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <span className={styles.errorText}>{error}</span>}
      </div>
    );
  }
);

BaseSelect.displayName = "BaseSelect";
