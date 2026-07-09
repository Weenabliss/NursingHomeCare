import React from "react";
import DatePicker from "react-datepicker";
import type { DatePickerProps } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styles from "./BaseDatePicker.module.scss";

interface BaseDatePickerProps extends Omit<DatePickerProps, "onChange" | "value" | "selected"> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
  value?: Date | null;
  onChange: (date: Date | null) => void;
}

export const BaseDatePicker: React.FC<BaseDatePickerProps> = ({
  label,
  error,
  fullWidth = true,
  value,
  onChange,
  id,
  ...props
}) => {
  const pickerId = id || `datepicker-${Math.random().toString(36).substring(2, 9)}`;

  return (
    <div className={`${styles.container} ${fullWidth ? styles.fullWidth : ""}`}>
      {label && (
        <label htmlFor={pickerId} className={styles.label}>
          {label}
        </label>
      )}
      <DatePicker
        id={pickerId}
        selected={value}
        onChange={(date: any) => onChange(date as Date | null)}
        className={`base-datepicker-input ${error ? "has-error" : ""}`}
        wrapperClassName={fullWidth ? "w-full" : ""}
        dateFormat="dd/MM/yyyy"
        {...(props as any)}
      />
      {error && <span className={styles.errorText}>{error}</span>}
    </div>
  );
};
