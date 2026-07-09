import React, { useState, useRef, useEffect, type ReactNode } from "react";

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
    <div
      ref={containerRef}
      className={`base-dropdown ${className}`}
      style={{ position: "relative", display: "inline-block", ...style }}
    >
      <div onClick={() => setIsOpen(!isOpen)} style={{ cursor: "pointer" }}>
        {trigger}
      </div>

      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            [align === "right" ? "right" : "left"]: 0,
            marginTop: "0.25rem",
            backgroundColor: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-md)",
            boxShadow: "var(--shadow-lg)",
            minWidth: "160px",
            zIndex: 50,
            padding: "0.5rem 0",
          }}
        >
          {items.map((item) => (
            <div
              key={item.key}
              onClick={() => {
                item.onClick();
                setIsOpen(false);
              }}
              style={{
                padding: "0.5rem 1rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                cursor: "pointer",
                color: item.danger ? "#ef4444" : "var(--text-main)",
                fontSize: "0.875rem",
                transition: "background-color 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = item.danger ? "#fef2f2" : "var(--background)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
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
