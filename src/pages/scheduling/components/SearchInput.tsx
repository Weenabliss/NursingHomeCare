import React from "react";
import { Search } from "lucide-react";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  width?: string | number;
}

/**
 * Thanh tìm kiếm nhân sự trong Schedule page.
 * Tách ra để Schedule.tsx gọn hơn và tái sử dụng nếu cần.
 */
export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  placeholder = "Tìm kiếm nhân sự (Tên, Mã NV)...",
  width = 300,
}) => {
  return (
    <div style={{ position: "relative", width, flexShrink: 0 }}>
      <Search
        size={16}
        style={{
          position: "absolute",
          left: "12px",
          top: "50%",
          transform: "translateY(-50%)",
          color: "var(--text-muted)",
          pointerEvents: "none",
        }}
      />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          boxSizing: "border-box",
          width: "100%",
          padding: "8px 12px 8px 36px",
          borderRadius: "var(--radius-sm)",
          border: "1px solid var(--border)",
          outline: "none",
          fontSize: "0.875rem",
          backgroundColor: "#ffffff",
          color: "var(--text-main)",
          fontFamily: "inherit",
          transition: "border-color 0.2s, box-shadow 0.2s",
        }}
        onFocus={(e) => {
          e.target.style.borderColor = "var(--primary)";
          e.target.style.boxShadow = "0 0 0 3px rgba(99, 102, 241, 0.15)";
        }}
        onBlur={(e) => {
          e.target.style.borderColor = "var(--border)";
          e.target.style.boxShadow = "none";
        }}
      />
    </div>
  );
};
