import React, { useState } from "react";

interface BaseListCardProps {
  children: React.ReactNode | ((props: { isHovered: boolean; isSelected: boolean }) => React.ReactNode);
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
  isSelected?: boolean;
  hoverBorderColor?: string;
  selectedBorderColor?: string;
}

export const BaseListCard: React.FC<BaseListCardProps> = ({
  children,
  className = "",
  style,
  onClick,
  isSelected = false,
  hoverBorderColor,
  selectedBorderColor,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const interactive = !!onClick; // Only apply hover effects if it's clickable

  return (
    <div
      className={`card-25d ${className}`}
      onClick={onClick}
      onMouseEnter={() => interactive && setIsHovered(true)}
      onMouseLeave={() => interactive && setIsHovered(false)}
      style={{
        padding: "var(--spacing-lg)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "var(--spacing-lg)",
        flexWrap: "wrap",
        cursor: interactive ? "pointer" : "default",

        // Unified UI logic for hover and selected
        transition: "all 0.2s ease",
        backgroundColor: isSelected ? "#e0e7ff" : interactive && isHovered ? "#eef2ff" : "var(--surface)",
        border: "2px solid",
        borderColor: isSelected
          ? selectedBorderColor || "var(--primary)"
          : interactive && isHovered
            ? hoverBorderColor || "var(--primary-light)"
            : "transparent",
        boxShadow: (interactive && isHovered) || isSelected ? "var(--shadow-md)" : "var(--shadow-sm)",

        ...style,
      }}
    >
      {typeof children === "function" ? children({ isHovered, isSelected }) : children}
    </div>
  );
};
