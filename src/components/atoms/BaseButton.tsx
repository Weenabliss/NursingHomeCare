import React from "react";

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
  const getBackgroundColor = () => {
    switch (variant) {
      case "primary":
        return "var(--primary)";
      case "secondary":
        return "var(--secondary)";
      case "danger":
        return "#ef4444";
      case "outline":
        return "transparent";
      default:
        return "var(--primary)";
    }
  };

  const getTextColor = () => {
    switch (variant) {
      case "outline":
        return "var(--text-main)";
      case "secondary":
        return "#000000";
      default:
        return "#ffffff";
    }
  };

  const getVariantClass = () => {
    switch (variant) {
      case "primary":
        return "base-btn-primary";
      default:
        return "";
    }
  };

  const baseStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
    border: variant === "outline" ? "1px solid var(--border)" : "1px solid rgba(255,255,255,0.1)",
    backgroundColor: getBackgroundColor(),
    color: getTextColor(),
    padding: size === "sm" ? "0.25rem 0.75rem" : size === "lg" ? "0.75rem 1.5rem" : "0.5rem 1rem",
    fontSize: size === "sm" ? "var(--text-sm)" : size === "lg" ? "var(--text-lg)" : "var(--text-base)",
    borderRadius: "var(--radius-full)",
    fontWeight: 500,
    width: fullWidth ? "100%" : "auto",
    ...style,
  };

  return (
    <button className={`base-btn ${getVariantClass()} ${className}`} style={baseStyle} {...props}>
      {children}
    </button>
  );
};
