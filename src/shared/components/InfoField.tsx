import React from "react";
import styles from "./InfoField.module.scss";

interface InfoFieldProps {
  label: string;
  value: React.ReactNode;
}

export const InfoField: React.FC<InfoFieldProps> = ({ label, value }) => {
  return (
    <div>
      <div className={styles.label}>
        {label}
      </div>
      <div className={styles.value}>
        {value || "---"}
      </div>
    </div>
  );
};
