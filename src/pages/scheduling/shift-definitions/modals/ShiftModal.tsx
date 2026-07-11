import React, { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Check, Trash2 } from "lucide-react";
import { BaseModal } from "../../../../components/atoms/BaseModal";
import { BaseInput } from "../../../../components/atoms/BaseInput";
import { FormRow } from "../../../../components/atoms/FormRow";
import { BaseButton } from "../../../../components/atoms/BaseButton";
import { useShifts } from "../../../../contexts/ShiftContext";

interface ShiftModalProps {
  isOpen: boolean;
  onClose: () => void;
  shiftId: string | null;
}

const PREDEFINED_COLORS = [
  "#dc2626", // red-600
  "#ea580c", // orange-600
  "#d97706", // amber-600
  "#ca8a04", // yellow-600
  "#65a30d", // lime-600
  "#16a34a", // green-600
  "#059669", // emerald-600
  "#0d9488", // teal-600
  "#0891b2", // cyan-600
  "#0284c7", // light blue-600
  "#2563eb", // blue-600
  "#4f46e5", // indigo-600
  "#7c3aed", // violet-600
  "#9333ea", // purple-600
  "#c026d3", // fuchsia-600
  "#e11d48", // rose-600
];

const ShiftModal: React.FC<ShiftModalProps> = ({ isOpen, onClose, shiftId }) => {
  const { t } = useTranslation();
  const { shifts, addShift, updateShift, deleteShift } = useShifts();

  const [name, setName] = useState("");
  const [startTime, setStartTime] = useState("08:00");
  const [endTime, setEndTime] = useState("17:00");
  const [color, setColor] = useState(PREDEFINED_COLORS[0]);
  const [description, setDescription] = useState("");

  const isEdit = !!shiftId;

  // Find colors already used by OTHER shifts
  const usedColors = useMemo(() => {
    return shifts
      .filter((s) => s.id !== shiftId)
      .map((s) => s.color.toLowerCase());
  }, [shifts, shiftId]);

  useEffect(() => {
    if (isOpen) {
      if (isEdit && shiftId) {
        const shift = shifts.find((s) => s.id === shiftId);
        if (shift) {
          setName(shift.name);
          setStartTime(shift.startTime);
          setEndTime(shift.endTime);
          setColor(shift.color);
          setDescription(shift.description || "");
        }
      } else {
        setName("");
        setStartTime("08:00");
        setEndTime("17:00");
        // Auto-select the first unused color
        const firstUnused = PREDEFINED_COLORS.find(c => !usedColors.includes(c.toLowerCase()));
        setColor(firstUnused || PREDEFINED_COLORS[0]);
        setDescription("");
      }
    }
  }, [isOpen, shiftId, shifts, isEdit, usedColors]);

  const isDirty = useMemo(() => {
    if (isEdit && shiftId) {
      const original = shifts.find((s) => s.id === shiftId);
      if (!original) return false;
      return (
        name !== original.name ||
        startTime !== original.startTime ||
        endTime !== original.endTime ||
        color !== original.color ||
        description !== (original.description || "")
      );
    }
    return (
      name !== "" ||
      startTime !== "08:00" ||
      endTime !== "17:00" ||
      description !== ""
    );
  }, [name, startTime, endTime, color, description, isEdit, shiftId, shifts]);

  const handleSave = () => {
    if (!name.trim() || !startTime || !endTime) {
      alert("Vui lòng điền đầy đủ các trường bắt buộc.");
      return;
    }

    if (isEdit && shiftId) {
      updateShift(shiftId, { name, startTime, endTime, color, description });
    } else {
      addShift({ name, startTime, endTime, color, description, isActive: true });
    }
    onClose();
  };

  const handleDelete = () => {
    if (window.confirm("Bạn có chắc chắn muốn xóa ca này?")) {
      deleteShift(shiftId!);
      onClose();
    }
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? "Sửa định nghĩa ca" : "Thêm định nghĩa ca"}
      onConfirm={handleSave}
      confirmText={t("common.save")}
      cancelText={t("common.cancel")}
      maxWidth="500px"
      isDirty={isDirty}
      footerLeftContent={
        isEdit && (
          <BaseButton variant="danger" onClick={handleDelete}>
            <Trash2 size={16} style={{ marginRight: 8 }} />
            {t("common.delete")}
          </BaseButton>
        )
      }
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-md)" }}>
        <FormRow>
          <BaseInput
            label="Tên ca trực (*)"
            placeholder="VD: Ca Sáng"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </FormRow>

        <FormRow>
          <div style={{ display: "flex", gap: "var(--spacing-sm)", width: "100%" }}>
            <div style={{ flex: 1 }}>
              <BaseInput
                label="Giờ bắt đầu (*)"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>
            <div style={{ flex: 1 }}>
              <BaseInput
                label="Giờ kết thúc (*)"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>
          </div>
        </FormRow>

        <FormRow>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-sm)", width: "100%" }}>
            <label style={{ fontSize: "0.875rem", fontWeight: 500, color: "var(--text-main)" }}>
              Màu nhận diện
            </label>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(8, 1fr)",
                gap: "var(--spacing-xs)",
              }}
            >
              {PREDEFINED_COLORS.map((c) => {
                const isUsed = usedColors.includes(c.toLowerCase());
                const isSelected = color.toLowerCase() === c.toLowerCase();
                return (
                  <button
                    key={c}
                    disabled={isUsed && !isSelected}
                    onClick={() => setColor(c)}
                    style={{
                      width: "100%",
                      aspectRatio: "1",
                      backgroundColor: c,
                      border: isSelected ? "2px solid var(--primary)" : "2px solid transparent",
                      borderRadius: "var(--radius-sm)",
                      cursor: isUsed && !isSelected ? "not-allowed" : "pointer",
                      opacity: isUsed && !isSelected ? 0.2 : 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fff",
                      transition: "all 0.2s",
                    }}
                    title={isUsed && !isSelected ? "Màu này đã được sử dụng" : ""}
                  >
                    {isSelected && <Check size={16} strokeWidth={3} />}
                  </button>
                );
              })}
            </div>
          </div>
        </FormRow>

        <FormRow>
          <BaseInput
            label="Ghi chú"
            placeholder="Mô tả thêm về ca trực này..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </FormRow>
      </div>
    </BaseModal>
  );
};

export default ShiftModal;
