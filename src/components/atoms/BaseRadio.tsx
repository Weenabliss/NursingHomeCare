import React from "react";
import styles from "./BaseRadio.module.scss";

interface BaseRadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const BaseRadio: React.FC<BaseRadioProps> = ({ label, id, ...props }) => {
  const inputId = id || `radio-${Math.random().toString(36).substring(2, 9)}`;

  return (
    <div className={styles.container}>
      <input type="radio" id={inputId} className={styles.input} {...props} />
      <label htmlFor={inputId} className={styles.label}>
        {label}
      </label>
    </div>
  );
};
