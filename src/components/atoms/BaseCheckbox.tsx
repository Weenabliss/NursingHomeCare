import React from "react";
import styles from "./BaseCheckbox.module.scss";

interface BaseCheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const BaseCheckbox: React.FC<BaseCheckboxProps> = ({ label, id, ...props }) => {
  const inputId = id || `checkbox-${Math.random().toString(36).substring(2, 9)}`;

  return (
    <div className={styles.container}>
      <input type="checkbox" id={inputId} className={styles.input} {...props} />
      <label htmlFor={inputId} className={styles.label}>
        {label}
      </label>
    </div>
  );
};
