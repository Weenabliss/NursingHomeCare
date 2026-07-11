import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { BaseModal } from "../../../components/atoms/BaseModal";
import { BaseSelect } from "../../../components/atoms/BaseSelect";
import { BaseCheckbox } from "../../../components/atoms/BaseCheckbox";
import { BaseInput } from "../../../components/atoms/BaseInput";
import { FormRow } from "../../../components/atoms/FormRow";
import { useShifts } from "../../../contexts/ShiftContext";
import { isMainShift } from "../../../utils/shiftUtils";
import { staffListMock } from "../../../mock/staff";

interface AutoScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (roster: any, warnings: string[]) => void;
  currentRosterData: any[];
}

const AutoScheduleModal: React.FC<AutoScheduleModalProps> = ({ isOpen, onClose, onSuccess, currentRosterData }) => {
  const { t } = useTranslation();
  const { shifts } = useShifts();
  
  const mainShifts = shifts.filter((s) => isMainShift(s.startTime, s.endTime));

  const [loading, setLoading] = useState(false);
  const [month, setMonth] = useState("8");
  const [year, setYear] = useState("2026");
  const [mode, setMode] = useState<"append" | "overwrite">("append");
  const [ensureFairness, setEnsureFairness] = useState(true);
  const [strictRest, setStrictRest] = useState(true);
  const [offDaysPerWeek, setOffDaysPerWeek] = useState<string>("2");
  
  const [shiftReqs, setShiftReqs] = useState<Record<string, { min: string; max: string }>>({});
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsDirty(false);
    }
  }, [isOpen]);

  useEffect(() => {
    const reqs: Record<string, { min: string; max: string }> = {};
    mainShifts.forEach((s) => {
      // Defaulting min to what's defined in mock or 2, max to 5
      reqs[s.id] = { min: (s as any).requiredStaffCount?.toString() || "2", max: "5" };
    });
    setShiftReqs(reqs);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shifts]);

  const handleReqChange = (id: string, field: "min" | "max", val: string) => {
    setShiftReqs(prev => ({ ...prev, [id]: { ...prev[id], [field]: val } }));
    setIsDirty(true);
  };

  const handleRun = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3001/api/schedule/auto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          month: parseInt(month, 10),
          year: parseInt(year, 10),
          ensureFairness,
          strictRest,
          offDaysPerWeek: parseInt(offDaysPerWeek, 10),
          shiftRequirements: shiftReqs,
          mode,
          currentRoster: currentRosterData,
          staffNames: staffListMock.filter(s => s.status !== "resigned").map(s => ({
            id: s.id,
            name: s.name,
            position: s.position,
            department: s.department,
            avatar: s.avatar
          }))
        })
      });
      if (!response.ok) {
        throw new Error("Có lỗi xảy ra khi chạy thuật toán.");
      }
      const data = await response.json();
      onSuccess(data.rosterData, data.warnings);
      onClose();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Có lỗi xảy ra.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Tự động xếp ca (Auto Rostering)"
      onConfirm={handleRun}
      confirmText={loading ? "Đang chạy..." : "Bắt đầu xếp ca"}
      cancelText={t("common.cancel")}
      maxWidth="600px"
      isDirty={isDirty}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-md)" }}>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>
          Thuật toán sẽ sử dụng Google OR-Tools để tối ưu hóa lịch trực, đảm bảo số ca chính được phân bổ công bằng giữa tất cả nhân viên theo số lượng đăng ký tối đa/tối thiểu.
        </p>

        <FormRow>
          <div style={{ display: "flex", gap: "var(--spacing-sm)", width: "100%" }}>
            <div style={{ flex: 1 }}>
              <BaseSelect
                label="Tháng"
                value={month}
                onChange={(e) => { setMonth(e.target.value); setIsDirty(true); }}
                options={[
                  { label: "Tháng 7", value: "7" },
                  { label: "Tháng 8", value: "8" },
                  { label: "Tháng 9", value: "9" },
                ]}
              />
            </div>
            <div style={{ flex: 1 }}>
              <BaseSelect
                label="Năm"
                value={year}
                onChange={(e) => { setYear(e.target.value); setIsDirty(true); }}
                options={[
                  { label: "2026", value: "2026" },
                  { label: "2027", value: "2027" },
                ]}
              />
            </div>
          </div>
        </FormRow>

        <div style={{ padding: "var(--spacing-md)", backgroundColor: "#ffffff", borderRadius: "var(--radius-md)", border: "1px solid var(--border)", display: "flex", flexDirection: "column", gap: "var(--spacing-md)" }}>
          <span style={{ fontWeight: 600, fontSize: "0.875rem", color: "var(--text-primary)" }}>Số lượng nhân viên từng ca chính</span>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-sm)" }}>
            {mainShifts.map((shift) => (
              <div key={shift.id} style={{ display: "flex", alignItems: "center", gap: "var(--spacing-md)" }}>
                <div style={{ width: "120px", fontWeight: 500, display: "flex", alignItems: "center", gap: "8px" }}>
                  <div style={{ width: 12, height: 12, borderRadius: 2, backgroundColor: shift.color }} />
                  {shift.name}
                </div>
                <div style={{ flex: 1 }}>
                  <BaseInput
                    type="number"
                    placeholder="Tối thiểu"
                    value={shiftReqs[shift.id]?.min || ""}
                    onChange={(e) => handleReqChange(shift.id, "min", e.target.value)}
                    min={1}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <BaseInput
                    type="number"
                    placeholder="Tối đa"
                    value={shiftReqs[shift.id]?.max || ""}
                    onChange={(e) => handleReqChange(shift.id, "max", e.target.value)}
                    min={1}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ padding: "var(--spacing-md)", backgroundColor: "#ffffff", borderRadius: "var(--radius-md)", border: "1px solid var(--border)", display: "flex", flexDirection: "column", gap: "var(--spacing-sm)" }}>
          <span style={{ fontWeight: 600, fontSize: "0.875rem", color: "var(--text-primary)" }}>Chế độ phân ca</span>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginTop: "4px" }}>
            <div 
              onClick={() => { setMode("append"); setIsDirty(true); }}
              style={{ 
                padding: "16px", 
                borderRadius: "var(--radius-md)", 
                border: mode === "append" ? "2px solid var(--primary)" : "2px solid transparent",
                backgroundColor: mode === "append" ? "#eef2ff" : "#f8fafc",
                cursor: "pointer",
                transition: "all 0.2s",
                boxShadow: mode === "append" ? "var(--shadow-md)" : "none"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                <div style={{ width: "16px", height: "16px", borderRadius: "50%", border: mode === "append" ? "5px solid var(--primary)" : "1px solid var(--text-muted)", backgroundColor: "#ffffff" }} />
                <strong style={{ color: mode === "append" ? "var(--primary-dark)" : "var(--text-main)", fontSize: "0.95rem" }}>Phân ca tiếp</strong>
              </div>
              <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: "1.4" }}>
                Chỉ xếp thêm vào những ngày trống. Giữ nguyên toàn bộ lịch đã phân trước đó.
              </p>
            </div>

            <div 
              onClick={() => { setMode("overwrite"); setIsDirty(true); }}
              style={{ 
                padding: "16px", 
                borderRadius: "var(--radius-md)", 
                border: mode === "overwrite" ? "2px solid var(--primary)" : "2px solid transparent",
                backgroundColor: mode === "overwrite" ? "#eef2ff" : "#f8fafc",
                cursor: "pointer",
                transition: "all 0.2s",
                boxShadow: mode === "overwrite" ? "var(--shadow-md)" : "none"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                <div style={{ width: "16px", height: "16px", borderRadius: "50%", border: mode === "overwrite" ? "5px solid var(--primary)" : "1px solid var(--text-muted)", backgroundColor: "#ffffff" }} />
                <strong style={{ color: mode === "overwrite" ? "var(--primary-dark)" : "var(--text-main)", fontSize: "0.95rem" }}>Phân ca mới</strong>
              </div>
              <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: "1.4" }}>
                Xoá toàn bộ lịch đã phân và tự động xếp lại từ đầu. Giữ nguyên các ngày Xin phép.
              </p>
            </div>
          </div>
        </div>

        <div style={{ padding: "var(--spacing-md)", backgroundColor: "#ffffff", borderRadius: "var(--radius-md)", border: "1px solid var(--border)", display: "flex", flexDirection: "column", gap: "var(--spacing-sm)" }}>
          <span style={{ fontWeight: 600, fontSize: "0.875rem", color: "var(--text-primary)" }}>Điều kiện xếp ca</span>
          
          <div style={{ marginBottom: "var(--spacing-sm)", display: "flex", alignItems: "center", gap: "var(--spacing-md)" }}>
            <span style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>Số ngày nghỉ tối thiểu trong 1 tuần:</span>
            <div style={{ width: "80px" }}>
              <BaseInput
                type="number"
                value={offDaysPerWeek}
                onChange={(e) => { setOffDaysPerWeek(e.target.value); setIsDirty(true); }}
                min={0}
                max={7}
              />
            </div>
          </div>

          <BaseCheckbox
            checked={ensureFairness}
            onChange={(e) => { setEnsureFairness(e.target.checked); setIsDirty(true); }}
            label="Đảm bảo công bằng số lượng ca chính (kế thừa dữ liệu tháng trước)"
          />

          <BaseCheckbox
            checked={strictRest}
            onChange={(e) => { setStrictRest(e.target.checked); setIsDirty(true); }}
            label="Tuân thủ nghiêm ngặt giờ nghỉ (sau ca đêm phải nghỉ ca sáng hôm sau)"
          />
        </div>
      </div>
    </BaseModal>
  );
};

export default AutoScheduleModal;
