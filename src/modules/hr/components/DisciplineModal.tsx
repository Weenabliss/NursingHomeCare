import React, { useState } from "react";
import { BaseModal } from "../../../shared/components/BaseModal";
import { BaseInput } from "../../../shared/components/BaseInput";
import { BaseSelect } from "../../../shared/components/BaseSelect";
import { BaseButton } from "../../../shared/components/BaseButton";
import { useCreateDisciplineRecord } from "../hooks/useDisciplineQuery";
import type { DisciplineRecord } from "../types";

interface DisciplineModalProps {
  isOpen: boolean;
  onClose: () => void;
  staffId: string;
}

export const DisciplineModal: React.FC<DisciplineModalProps> = ({ isOpen, onClose, staffId }) => {
  const { mutate: createRecord } = useCreateDisciplineRecord();
  const [formData, setFormData] = useState<Partial<DisciplineRecord>>({
    staffId,
    type: "violation",
    date: new Date().toISOString().split("T")[0],
    reason: "",
    severity: "low",
    actionTaken: "",
    amount: 0,
  });

  const handleChange = (field: keyof DisciplineRecord, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    createRecord(formData as DisciplineRecord);
    onClose();
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Thêm Quyết định Khen thưởng / Kỷ luật">
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <BaseSelect
            label="Loại"
            value={formData.type as string}
            onChange={(v) => handleChange("type", v)}
            options={[
              { value: "reward", label: "Khen thưởng" },
              { value: "violation", label: "Kỷ luật" },
            ]}
          />
          <BaseInput
            label="Ngày ra quyết định"
            type="date"
            value={formData.date as string}
            onChange={(v) => handleChange("date", v)}
          />
        </div>

        {formData.type === "violation" ? (
          <BaseSelect
            label="Mức độ vi phạm"
            value={formData.severity as string}
            onChange={(v) => handleChange("severity", v)}
            options={[
              { value: "low", label: "Nhắc nhở" },
              { value: "medium", label: "Khiển trách" },
              { value: "high", label: "Cảnh cáo" },
              { value: "termination", label: "Sa thải" },
            ]}
          />
        ) : (
          <BaseSelect
            label="Hình thức khen thưởng"
            value={formData.rewardType as string}
            onChange={(v) => handleChange("rewardType", v)}
            options={[
              { value: "bonus", label: "Thưởng tiền" },
              { value: "certificate", label: "Bằng khen" },
              { value: "promotion", label: "Thăng chức" },
              { value: "other", label: "Khác" },
            ]}
          />
        )}

        <BaseInput
          label="Lý do"
          value={formData.reason as string}
          onChange={(v) => handleChange("reason", v)}
        />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <BaseInput
            label="Biện pháp xử lý / Ghi chú"
            value={formData.actionTaken as string}
            onChange={(v) => handleChange("actionTaken", v)}
          />
          <BaseInput
            label="Số tiền (nếu có)"
            type="number"
            value={formData.amount?.toString() || "0"}
            onChange={(v) => handleChange("amount", Number(v))}
          />
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem", marginTop: "1rem" }}>
          <BaseButton variant="outline" onClick={onClose}>Hủy</BaseButton>
          <BaseButton variant="primary" onClick={handleSubmit}>Lưu</BaseButton>
        </div>
      </div>
    </BaseModal>
  );
};
