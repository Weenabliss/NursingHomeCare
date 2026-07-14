import React, { useState, useRef, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, Search, X } from "lucide-react";
import styles from "./StaffSearchSelect.module.scss";

interface StaffOption {
  id: string;
  name: string;
  position: string;
  avatar?: string;
}

interface StaffSearchSelectProps {
  label?: string;
  options: StaffOption[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
}

export const StaffSearchSelect: React.FC<StaffSearchSelectProps> = ({ 
  label, 
  options, 
  value, 
  onChange, 
  error,
  placeholder = "Chọn nhân sự..."
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});
  
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const selectedOption = options.find((opt) => opt.id === value);

  const filteredOptions = useMemo(() => {
    if (!searchQuery.trim()) return options;
    const query = searchQuery.toLowerCase();
    return options.filter(opt => 
      opt.name.toLowerCase().includes(query) || 
      opt.id.toLowerCase().includes(query)
    );
  }, [options, searchQuery]);

  const openDropdown = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const dropdownHeight = Math.min(filteredOptions.length * 60 + 50, 300);

      if (spaceBelow >= dropdownHeight || spaceBelow > rect.top) {
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
    setSearchQuery("");
  };

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Need to check if clicking inside the portal dropdown OR the trigger
      const isDropdownClick = (event.target as Element).closest(`.${styles.dropdown}`);
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node) &&
        !isDropdownClick
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
          <div className={styles.searchBox}>
            <Search size={16} className={styles.searchIcon} />
            <input 
              ref={searchInputRef}
              type="text" 
              placeholder="Tìm theo tên hoặc mã nhân viên..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
            {searchQuery && (
              <button className={styles.clearBtn} onClick={() => setSearchQuery("")}>
                <X size={14} />
              </button>
            )}
          </div>
          
          <div className={styles.optionsList}>
            {filteredOptions.length === 0 ? (
              <div className={styles.noResult}>Không tìm thấy nhân viên phù hợp</div>
            ) : (
              filteredOptions.map((opt) => (
                <div
                  key={opt.id}
                  className={`${styles.option} ${value === opt.id ? styles.selected : ""}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onChange(opt.id);
                    setIsOpen(false);
                  }}
                >
                  <img src={opt.avatar || "https://i.pravatar.cc/150"} alt={opt.name} className={styles.avatar} />
                  <div className={styles.optionInfo}>
                    <div className={styles.optionName}>{opt.name}</div>
                    <div className={styles.optionSub}>
                      <span className={styles.optionId}>{opt.id}</span>
                      <span className={styles.dot}>•</span>
                      <span className={styles.optionPosition}>{opt.position}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
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
            <img src={selectedOption.avatar || "https://i.pravatar.cc/150"} alt={selectedOption.name} className={styles.avatarSmall} />
            <div className={styles.selectedText}>
              <span className={styles.selectedName}>{selectedOption.name}</span>
              <span className={styles.selectedId}>({selectedOption.id})</span>
            </div>
          </div>
        ) : (
          <span className={styles.placeholder}>{placeholder}</span>
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
