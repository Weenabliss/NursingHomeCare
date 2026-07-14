import React, { useState, useRef, useEffect, type ReactNode } from "react";
import styles from "./BaseDropdown.module.scss";

export interface DropdownItem {
  key: string;
  label: ReactNode;
  icon?: ReactNode;
  onClick: () => void;
  danger?: boolean;
}

interface BaseDropdownProps {
  trigger: ReactNode;
  items: DropdownItem[];
  align?: "left" | "right";
  className?: string;
  style?: React.CSSProperties;
}

export const BaseDropdown: React.FC<BaseDropdownProps> = ({
  trigger,
  items,
  align = "right",
  className = "",
  style,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className={`${styles.container} ${className}`} style={style}>
      <div onClick={() => setIsOpen(!isOpen)} className={styles.trigger}>
        {trigger}
      </div>

      {isOpen && (
        <div className={`${styles.menu} ${styles[align]}`}>
          {items.map((item) => (
            <div
              key={item.key}
              onClick={() => {
                item.onClick();
                setIsOpen(false);
              }}
              className={`${styles.item} ${item.danger ? styles.danger : ""}`}
            >
              {item.icon}
              {item.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
