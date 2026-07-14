import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { ChevronDown } from "lucide-react";
import styles from "./BankSelect.module.scss";

interface BankOption {
  code: string;
  name: string;
  shortName: string;
  logo: string;
}

interface BankSelectProps {
  label?: string;
  options: BankOption[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export const BankSelect: React.FC<BankSelectProps> = ({ label, options, value, onChange, error }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.code === value);

  // Calculate dropdown position using fixed positioning to escape modal overflow clipping
  const openDropdown = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const dropdownHeight = Math.min(options.length * 56, 260);

      if (spaceBelow >= dropdownHeight) {
        // Open downward
        setDropdownStyle({
          position: "fixed",
          top: rect.bottom + 4,
          left: rect.left,
          width: rect.width,
          zIndex: 9999,
        });
      } else {
        // Open upward
        setDropdownStyle({
          position: "fixed",
          bottom: window.innerHeight - rect.top + 4,
          left: rect.left,
          width: rect.width,
          zIndex: 9999,
        });
      }
    }
    setIsOpen(true);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const dropdown = isOpen
    ? createPortal(
        <div className={styles.dropdown} style={dropdownStyle}>
          {options.map((opt) => (
            <div
              key={opt.code}
              className={`${styles.option} ${value === opt.code ? styles.selected : ""}`}
              onMouseDown={(e) => {
                e.preventDefault();
                onChange(opt.code);
                setIsOpen(false);
              }}
            >
              <img src={opt.logo} alt={opt.shortName} className={styles.bankLogo} />
              <div className={styles.optionText}>
                <span className={styles.optionShortName}>{opt.shortName}</span>
                <span className={styles.optionFullName}>{opt.name}</span>
              </div>
            </div>
          ))}
        </div>,
        document.body
      )
    : null;

  return (
    <div className={styles.container} ref={containerRef}>
      {label && <label className={styles.label}>{label}</label>}
      <div
        ref={triggerRef}
        className={`${styles.selectBox} ${error ? styles.hasError : ""} ${isOpen ? styles.isOpen : ""}`}
        onClick={() => (isOpen ? setIsOpen(false) : openDropdown())}
      >
        {selectedOption ? (
          <div className={styles.selectedContent}>
            <img src={selectedOption.logo} alt={selectedOption.shortName} className={styles.bankLogo} />
            <span className={styles.bankName}>
              {selectedOption.shortName}
            </span>
          </div>
        ) : (
          <span className={styles.placeholder}>Chọn ngân hàng...</span>
        )}
        <ChevronDown
          size={16}
          className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ""}`}
        />
      </div>
      {dropdown}
      {error && <span className={styles.errorText}>{error}</span>}
    </div>
  );
};
