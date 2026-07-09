import React from "react";
import styles from "./BaseButton.module.scss";

interface BaseButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "danger";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
}

export const BaseButton: React.FC<BaseButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  className = "",
  style,
  ...props
}) => {
  const btnClass = [styles.btn, styles[variant], styles[size], fullWidth ? styles.fullWidth : "", className]
    .filter(Boolean)
    .join(" ");

  return (
    <button className={btnClass} style={style} {...props}>
      {children}
    </button>
  );
};
