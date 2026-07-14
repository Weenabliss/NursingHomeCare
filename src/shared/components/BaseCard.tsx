import React, { useState } from "react";
import styles from "./BaseCard.module.scss";

interface BaseCardProps {
  children: React.ReactNode | ((props: { isHovered: boolean; isSelected: boolean }) => React.ReactNode);
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
  isSelected?: boolean;
  isHoverable?: boolean;
}

export const BaseCard: React.FC<BaseCardProps> = ({
  children,
  className = "",
  style,
  onClick,
  isSelected = false,
  isHoverable = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const interactive = !!onClick;
  const hoverable = interactive || isHoverable;

  const cardClass = [
    styles.card,
    interactive ? styles.interactive : "",
    hoverable && isHovered ? styles.interactiveHover : "",
    isSelected ? styles.selected : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={cardClass}
      onClick={onClick}
      onMouseEnter={() => hoverable && setIsHovered(true)}
      onMouseLeave={() => hoverable && setIsHovered(false)}
      style={style}
    >
      {typeof children === "function" ? children({ isHovered, isSelected }) : children}
    </div>
  );
};
