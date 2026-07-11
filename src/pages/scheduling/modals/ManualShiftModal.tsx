import React, { useState, useEffect } from "react";
import { BaseModal } from "../../../components/atoms/BaseModal";
import { BaseCheckbox } from "../../../components/atoms/BaseCheckbox";

interface ManualShiftModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newShifts: { shift: string; type: string }[]) => void;
  staff: any;
  dateLabel: string;
  currentShifts: { shift: string; type: string }[];
}

const SHIFT_OPTIONS = [
  { label: "Ca Sáng (06:00 - 14:00)", value: "SÁNG", type: "morning" },
  { label: "Ca Chiều (14:00 - 22:00)", value: "CHIỀU", type: "afternoon" },
  { label: "Ca Đêm (22:00 - 06:00)", value: "ĐÊM", type: "night" },
  { label: "Hành Chính (08:00 - 17:00)", value: "HC", type: "morning" },
  { label: "Nghỉ Phép (Xin phép)", value: "PHÉP", type: "leave" },
];

export const ManualShiftModal: React.FC<ManualShiftModalProps> = ({
  isOpen,
  onClose,
  onSave,
  staff,
  dateLabel,
  currentShifts,
}) => {
  const [selectedValues, setSelectedValues] = useState<string[]>([]);

  useEffect(() => {
    setSelectedValues(currentShifts.map((s) => s.shift));
  }, [currentShifts, isOpen]);

  const handleToggle = (val: string, checked: boolean) => {
    if (checked) {
      setSelectedValues((prev) => [...prev, val]);
    } else {
      setSelectedValues((prev) => prev.filter((v) => v !== val));
    }
  };

  const handleSave = () => {
    const newShifts = selectedValues
      .map((val) => {
        const opt = SHIFT_OPTIONS.find((o) => o.value === val);
        if (opt) return { shift: opt.value, type: opt.type };
        return null;
      })
      .filter(Boolean) as { shift: string; type: string }[];
    onSave(newShifts);
    onClose();
  };

  const isDirty =
    selectedValues.length !== currentShifts.length ||
    selectedValues.some((v) => !currentShifts.find((s) => s.shift === v));

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Phân Ca Thủ Công"
      onConfirm={handleSave}
      confirmText="Lưu thay đổi"
      cancelText="Hủy"
      isDirty={isDirty}
      maxWidth="800px"
    >
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--spacing-lg)" }}>
        {/* Left Column: Staff Info */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div style={{ padding: "var(--spacing-lg)", backgroundColor: "#ffffff", borderRadius: "var(--radius-md)", border: "1px solid var(--border)", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
          {staff && (
            <>
              <img src={staff.avatar || "https://i.pravatar.cc/150"} alt={staff.name} style={{ width: "80px", height: "80px", borderRadius: "50%", objectFit: "cover", border: "3px solid #f1f5f9", marginBottom: "12px" }} />
              <h3 style={{ margin: "0 0 4px 0", fontSize: "1.15rem", color: "var(--text-main)", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                {staff.name} 
              </h3>
              <span style={{ fontSize: "0.8rem", padding: "4px 8px", background: "var(--primary)", borderRadius: "6px", color: "#ffffff", fontWeight: 600, marginBottom: "16px", letterSpacing: "0.05em", boxShadow: "0 2px 4px rgba(99, 102, 241, 0.2)" }}>
                {staff.id}
              </span>
              
              <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "12px", fontSize: "0.85rem", color: "var(--text-secondary)", width: "100%", textAlign: "left", padding: "12px", background: "#f8fafc", borderRadius: "8px" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ opacity: 0.8 }}>Phòng ban:</span>
                  <strong style={{ color: "var(--text-main)" }}>{staff.department}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ opacity: 0.8 }}>Chức vụ:</span>
                  <strong style={{ color: "var(--text-main)" }}>{staff.position}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ opacity: 0.8 }}>Ngày sinh:</span>
                  <strong style={{ color: "var(--text-main)" }}>{staff.dob ? new Date(staff.dob).toLocaleDateString('vi-VN') : 'N/A'}</strong>
                </div>
              </div>
            </>
          )}
        </div>
        
        {/* Áp dụng ngày info below profile */}
        <div style={{ padding: "12px 16px", backgroundColor: "#eef2ff", borderRadius: "var(--radius-md)", border: "1px dashed var(--primary)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: "0.85rem", color: "var(--primary-dark)" }}>Ngày áp dụng xếp ca:</span>
          <strong style={{ color: "var(--primary)", fontSize: "1rem" }}>{dateLabel}</strong>
        </div>
      </div>

        {/* Right Column: Shift Checkboxes */}
        <div style={{ padding: "var(--spacing-lg)", backgroundColor: "#ffffff", borderRadius: "var(--radius-md)", border: "1px solid var(--border)", display: "flex", flexDirection: "column" }}>
          <p style={{ margin: "0 0 12px 0", fontWeight: 600, fontSize: "0.875rem" }}>Chọn ca trực (Có thể chọn nhiều ca)</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-sm)" }}>
            {SHIFT_OPTIONS.map((opt) => (
              <BaseCheckbox
                key={opt.value}
                label={opt.label}
                checked={selectedValues.includes(opt.value)}
                onChange={(e) => handleToggle(opt.value, e.target.checked)}
              />
            ))}
          </div>
          {selectedValues.length === 0 && (
            <p style={{ margin: "12px 0 0 0", color: "var(--text-muted)", fontSize: "0.85rem", fontStyle: "italic" }}>
              * Không chọn ca nào đồng nghĩa với Nghỉ (OFF)
            </p>
          )}
        </div>
      </div>
    </BaseModal>
  );
};

export default ManualShiftModal;
