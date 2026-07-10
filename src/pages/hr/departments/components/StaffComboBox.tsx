import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Search, ChevronDown, Check } from "lucide-react";

export const mockStaffList = [
  { id: "S01", name: "Trần Anh Tuấn", gender: "Nam", dob: "1980", age: 44, avatar: "https://i.pravatar.cc/150?u=S01" },
  { id: "S02", name: "Lê Hoàng Yến", gender: "Nữ", dob: "1985", age: 39, avatar: "https://i.pravatar.cc/150?u=S02" },
  {
    id: "S03",
    name: "BS. Nguyễn Văn A",
    gender: "Nam",
    dob: "1975",
    age: 49,
    avatar: "https://i.pravatar.cc/150?u=S03",
  },
  { id: "S04", name: "ĐD. Trần Thị Bé", gender: "Nữ", dob: "1992", age: 32, avatar: "https://i.pravatar.cc/150?u=S04" },
  { id: "S05", name: "Nguyễn Văn B", gender: "Nam", dob: "1990", age: 34, avatar: "https://i.pravatar.cc/150?u=S05" },
];

export const StaffComboBox: React.FC<{ value: string; onChange: (v: string) => void }> = ({ value, onChange }) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = mockStaffList.filter(
    (s) => s.name.toLowerCase().includes(search.toLowerCase()) || s.id.toLowerCase().includes(search.toLowerCase())
  );

  const selectedStaff = mockStaffList.find((s) => s.name === value);

  return (
    <div style={{ position: "relative" }}>
      <label
        style={{
          fontSize: "var(--text-sm)",
          fontWeight: 500,
          color: "var(--text-main)",
          marginBottom: "0.5rem",
          display: "block",
        }}
      >
        {t("hr.manager")}
      </label>

      {/* Trigger Button */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0.5rem 1rem",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-sm)",
          backgroundColor: "var(--surface)",
          cursor: "pointer",
          height: "42px",
        }}
      >
        <span style={{ color: selectedStaff ? "var(--text-main)" : "var(--text-muted)" }}>
          {selectedStaff ? `${selectedStaff.id} - ${selectedStaff.name}` : t("hr.selectManager")}
        </span>
        <ChevronDown size={16} color="var(--text-muted)" />
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            marginTop: "4px",
            backgroundColor: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-sm)",
            boxShadow: "var(--shadow-lg)",
            zIndex: 100,
            maxHeight: "350px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Search Box */}
          <div
            style={{
              padding: "0.5rem",
              borderBottom: "1px solid var(--border)",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <Search size={16} color="var(--text-muted)" />
            <input
              type="text"
              autoFocus
              placeholder={t("hr.searchStaff")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ border: "none", outline: "none", boxShadow: "none", width: "100%", fontSize: "0.9rem" }}
            />
          </div>

          {/* List */}
          <div
            style={{ overflowY: "auto", padding: "0.5rem", display: "flex", flexDirection: "column", gap: "0.25rem" }}
          >
            {filtered.map((staff) => {
              const isSelected = value === staff.name;
              return (
                <div
                  key={staff.id}
                  onClick={() => {
                    onChange(staff.name);
                    setIsOpen(false);
                    setSearch("");
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    padding: "0.5rem",
                    borderRadius: "var(--radius-sm)",
                    cursor: "pointer",
                    backgroundColor: isSelected ? "#e0e7ff" : "transparent",
                    transition: "background-color 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) e.currentTarget.style.backgroundColor = "#eef2ff";
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  <img
                    src={staff.avatar}
                    alt={staff.name}
                    style={{ width: "40px", height: "40px", borderRadius: "50%", objectFit: "cover" }}
                  />
                  <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span
                        style={{
                          fontWeight: 600,
                          color: isSelected ? "var(--primary-dark)" : "var(--text-main)",
                          fontSize: "0.9rem",
                        }}
                      >
                        {staff.name}
                      </span>
                      <span
                        style={{
                          fontSize: "0.7rem",
                          color: "var(--text-muted)",
                          backgroundColor: "var(--surface-alt)",
                          padding: "2px 6px",
                          borderRadius: "4px",
                        }}
                      >
                        {staff.id}
                      </span>
                    </div>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                      {staff.gender} • {staff.age} tuổi (SN: {staff.dob})
                    </span>
                  </div>
                  {isSelected && <Check size={18} color="var(--primary)" />}
                </div>
              );
            })}
            {filtered.length === 0 && (
              <div style={{ padding: "1rem", textAlign: "center", color: "var(--text-muted)", fontSize: "0.9rem" }}>
                {t("hr.noStaffFound")}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
