import React, { useState } from "react";
import styles from "./BaseListCard.module.scss";

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

  const cardClass = [
    "card-25d",
    styles.card,
    interactive ? styles.interactive : "",
    interactive && isHovered ? styles.interactiveHover : "",
    isSelected ? styles.selected : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  // Handle custom border colors dynamically via inline styles ONLY if provided
  const customBorderColor = isSelected ? selectedBorderColor : interactive && isHovered ? hoverBorderColor : undefined;

  return (
    <div
      className={cardClass}
      onClick={onClick}
      onMouseEnter={() => interactive && setIsHovered(true)}
      onMouseLeave={() => interactive && setIsHovered(false)}
      style={{
        ...(customBorderColor ? { borderColor: customBorderColor } : {}),
        ...style,
      }}
    >
      {typeof children === "function" ? children({ isHovered, isSelected }) : children}
    </div>
  );
};
