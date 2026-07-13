import React from "react";
import { useTranslation } from "react-i18next";
import { useActivityLog } from "../../../../hooks/useActivityLog";
import { BaseCard } from "../../../../components/atoms/BaseCard";
import { BaseModal } from "../../../../components/atoms/BaseModal";
import { BaseInput } from "../../../../components/atoms/BaseInput";
import { InfoField } from "../../../../components/atoms/InfoField";
import { useFormModal } from "../../../../hooks/useFormModal";
import type { Resident } from "../../../../mock/residents";

interface BasicInfoTabProps {
  resident: Resident;
}

export const BasicInfoTab: React.FC<BasicInfoTabProps> = ({ resident }) => {
  const { t } = useTranslation();
  const { log } = useActivityLog({ module: "residents" });
  
  // Helper to get age
  const getAge = (dob: string) => {
    if (!dob) return 0;
    const birthYear = new Date(dob).getFullYear();
    const currentYear = new Date().getFullYear();
    return currentYear - birthYear;
  };

  const mockIdentity = React.useMemo(() => ({
    dob: resident.dateOfBirth || resident.dob,
    cccd: resident.code || "",
    issueDate: "2020-08-15",
    issuePlace: "Cục CS QLHC về TTXH",
  }), [resident]);

  const mockInsurance = React.useMemo(() => ({
    bhyt: "DN40123456789",
    hobbies: "Đọc báo, nghe đài",
    notes: "Có tiền sử khó ngủ vào ban đêm",
  }), []);

  const identityModal = useFormModal(mockIdentity);
  const insuranceModal = useFormModal(mockInsurance);

  const handleSaveIdentity = () => {
    log("update", `Cập nhật Định danh cư dân ${resident.code}`, { residentId: resident.id });
    identityModal.closeModal();
  };

  const handleSaveInsurance = () => {
    log("update", `Cập nhật Bảo hiểm cư dân ${resident.code}`, { residentId: resident.id });
    insuranceModal.closeModal();
  };

  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", height: "100%", alignItems: "stretch" }}>
        
        {/* Identity Info */}
        <BaseCard
          isSelected={identityModal.isOpen}
          onClick={identityModal.openModal}
          style={{ height: "100%" }}
        >
          <h3 style={{ margin: "0 0 1rem 0", color: "var(--text-main)", fontSize: "1.05rem", fontWeight: 700, borderBottom: "1px solid #f1f5f9", paddingBottom: "0.75rem" }}>
            Định danh & Giấy tờ
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem", marginTop: "0.5rem" }}>
            <InfoField label="Ngày sinh" value={`${identityModal.committedData.dob} (${getAge(identityModal.committedData.dob)} tuổi)`} />
            <InfoField label="CCCD/Hộ chiếu" value={identityModal.committedData.cccd} />
            <InfoField label="Ngày cấp" value={identityModal.committedData.issueDate} />
            <InfoField label="Nơi cấp" value={identityModal.committedData.issuePlace} />
          </div>
        </BaseCard>

        {/* Insurance Info */}
        <BaseCard
          isSelected={insuranceModal.isOpen}
          onClick={insuranceModal.openModal}
          style={{ height: "100%" }}
        >
          <h3 style={{ margin: "0 0 1rem 0", color: "var(--text-main)", fontSize: "1.05rem", fontWeight: 700, borderBottom: "1px solid #f1f5f9", paddingBottom: "0.75rem" }}>
            Bảo hiểm & Khác
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", marginTop: "0.5rem" }}>
            <InfoField label="Mã thẻ BHYT" value={<span style={{ fontWeight: 600, color: "var(--text-main)" }}>{insuranceModal.committedData.bhyt}</span>} />
            <div style={{ gridColumn: "1 / -1" }}>
              <InfoField label="Sở thích / Thói quen" value={insuranceModal.committedData.hobbies} />
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <InfoField label="Ghi chú đặc biệt" value={<span style={{ color: "var(--primary)", fontWeight: 500 }}>{insuranceModal.committedData.notes}</span>} />
            </div>
          </div>
        </BaseCard>
      </div>

      {/* Identity Modal */}
      <BaseModal
        isOpen={identityModal.isOpen}
        onClose={identityModal.closeModal}
        title="Định danh & Giấy tờ"
        confirmText="Lưu thay đổi"
        onConfirm={identityModal.saveData}
        isDirty={identityModal.isDirty}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <BaseInput label="Ngày sinh" type="date" value={identityModal.localData.dob} onChange={e => { identityModal.setLocalData({...identityModal.localData, dob: e.target.value}); identityModal.markDirty(); }} />
          <BaseInput label="CCCD/Hộ chiếu" type="text" value={identityModal.localData.cccd} onChange={e => { identityModal.setLocalData({...identityModal.localData, cccd: e.target.value}); identityModal.markDirty(); }} />
          <BaseInput label="Ngày cấp" type="date" value={identityModal.localData.issueDate} onChange={e => { identityModal.setLocalData({...identityModal.localData, issueDate: e.target.value}); identityModal.markDirty(); }} />
          <BaseInput label="Nơi cấp" type="text" value={identityModal.localData.issuePlace} onChange={e => { identityModal.setLocalData({...identityModal.localData, issuePlace: e.target.value}); identityModal.markDirty(); }} />
        </div>
      </BaseModal>

      {/* Insurance Modal */}
      <BaseModal
        isOpen={insuranceModal.isOpen}
        onClose={insuranceModal.closeModal}
        title="Bảo hiểm & Khác"
        confirmText="Lưu thay đổi"
        onConfirm={insuranceModal.saveData}
        isDirty={insuranceModal.isDirty}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <BaseInput label="Mã thẻ BHYT" type="text" value={insuranceModal.localData.bhyt} onChange={e => { insuranceModal.setLocalData({...insuranceModal.localData, bhyt: e.target.value}); insuranceModal.markDirty(); }} />
          <BaseInput label="Sở thích / Thói quen" type="text" value={insuranceModal.localData.hobbies} onChange={e => { insuranceModal.setLocalData({...insuranceModal.localData, hobbies: e.target.value}); insuranceModal.markDirty(); }} />
          <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
            <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-main)" }}>Ghi chú đặc biệt</label>
            <textarea 
              value={insuranceModal.localData.notes} 
              onChange={e => { insuranceModal.setLocalData({...insuranceModal.localData, notes: e.target.value}); insuranceModal.markDirty(); }}
              style={{ 
                width: "100%", padding: "0.75rem 1rem", borderRadius: "8px", border: "1px solid var(--border)", 
                background: "#ffffff", fontSize: "0.95rem", outline: "none", minHeight: "100px", fontFamily: "inherit"
              }}
              onFocus={(e) => e.target.style.borderColor = "var(--primary)"}
              onBlur={(e) => e.target.style.borderColor = "var(--border)"}
            />
          </div>
        </div>
      </BaseModal>
    </>
  );
};
