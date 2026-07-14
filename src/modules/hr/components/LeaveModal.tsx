import React, { useState } from "react";
import { BaseModal } from "../../../shared/components/BaseModal";
import { BaseInput } from "../../../shared/components/BaseInput";
import { BaseSelect } from "../../../shared/components/BaseSelect";
import { BaseButton } from "../../../shared/components/BaseButton";
import { useCreateLeave } from "../hooks/useLeaveQuery";
import type { LeaveRequest } from "../types";

interface LeaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  staffId: string;
}

export const LeaveModal: React.FC<LeaveModalProps> = ({ isOpen, onClose, staffId }) => {
  const { mutate: createLeave } = useCreateLeave();
  const [formData, setFormData] = useState<Partial<LeaveRequest>>({
    staffId,
    type: "annual_leave",
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
    reason: "",
    status: "pending",
  });

  const handleChange = (field: keyof LeaveRequest, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    const start = new Date(formData.startDate as string);
    const end = new Date(formData.endDate as string);
    const totalDays = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1);

    createLeave({
      ...(formData as LeaveRequest),
      totalDays,
    });
    onClose();
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Tạo đơn xin nghỉ">
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <BaseSelect
          label="Loại phép"
          value={formData.type as string}
          onChange={(v) => handleChange("type", v)}
          options={[
            { value: "annual_leave", label: "Phép năm" },
            { value: "sick_leave", label: "Nghỉ ốm" },
            { value: "unpaid_leave", label: "Nghỉ không lương" },
            { value: "compensatory", label: "Nghỉ bù" },
          ]}
        />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <BaseInput
            label="Từ ngày"
            type="date"
            value={formData.startDate as string}
            onChange={(v) => handleChange("startDate", v)}
          />
          <BaseInput
            label="Đến ngày"
            type="date"
            value={formData.endDate as string}
            onChange={(v) => handleChange("endDate", v)}
          />
        </div>
        <BaseInput
          label="Lý do"
          value={formData.reason as string}
          onChange={(v) => handleChange("reason", v)}
        />

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem", marginTop: "1rem" }}>
          <BaseButton variant="outline" onClick={onClose}>Hủy</BaseButton>
          <BaseButton variant="primary" onClick={handleSubmit}>Lưu</BaseButton>
        </div>
      </div>
    </BaseModal>
  );
};
