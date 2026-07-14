import React from "react";
import { AlertCircle } from "lucide-react";
import { BaseCard } from "../../../../shared/components/BaseCard";
import { BaseModal } from "../../../../shared/components/BaseModal";
import { BaseInput } from "../../../../shared/components/BaseInput";
import { InfoField } from "../../../../shared/components/InfoField";
import { useFormModal } from "../../../../shared/hooks/useFormModal";
import type { Resident } from "../../../../mock/residents";

interface RelativesTabProps {
  resident: Resident;
}

export const RelativesTab: React.FC<RelativesTabProps> = ({ resident }) => {
  const mockPrimary = React.useMemo(() => ({
    name: "Nguyễn Văn Bảo",
    relationship: "Con trai",
    phone: "0901234567",
    email: "baonv@gmail.com",
    address: resident.address || "123 Lê Lợi, Quận 1, TP.HCM",
  }), [resident]);

  const mockEmergency = React.useMemo(() => ({
    name: "Trần Thị Lan",
    relationship: "Con dâu",
    phone: "0987654321",
    email: "",
    address: resident.address || "123 Lê Lợi, Quận 1, TP.HCM",
  }), [resident]);

  const primaryModal = useFormModal(mockPrimary);
  const emergencyModal = useFormModal(mockEmergency);

  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", height: "100%", alignItems: "stretch" }}>
        
        {/* Contact Info (Primary Guarantor) */}
        <BaseCard
          isSelected={primaryModal.isOpen}
          onClick={primaryModal.openModal}
          style={{ height: "100%" }}
        >
          <h3 style={{ margin: "0 0 1rem 0", color: "var(--text-main)", fontSize: "1.05rem", fontWeight: 700, borderBottom: "1px solid #f1f5f9", paddingBottom: "0.75rem" }}>
            Người bảo lãnh (Liên lạc chính)
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem", marginTop: "0.5rem" }}>
            <InfoField label="Họ tên" value={<span style={{ fontWeight: 600, color: "var(--text-main)" }}>{primaryModal.committedData.name}</span>} />
            <InfoField label="Quan hệ" value={primaryModal.committedData.relationship} />
            <InfoField label="Điện thoại" value={primaryModal.committedData.phone} />
            <InfoField label="Email cá nhân" value={primaryModal.committedData.email || "Chưa cập nhật"} />
            <div style={{ gridColumn: "1 / -1" }}>
              <InfoField label="Thường trú" value={primaryModal.committedData.address} />
            </div>
          </div>
        </BaseCard>

        {/* Emergency Info */}
        <BaseCard
          isSelected={emergencyModal.isOpen}
          onClick={emergencyModal.openModal}
          style={{ backgroundColor: "#fff1f2", borderColor: emergencyModal.isOpen ? "var(--primary)" : "#fecdd3", height: "100%" }}
        >
          <h3 style={{ margin: "0 0 1rem 0", color: "#be123c", fontSize: "1.05rem", fontWeight: 700, borderBottom: "1px solid #fda4af", paddingBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <AlertCircle size={18} /> Liên hệ khẩn cấp
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem", marginTop: "0.5rem" }}>
            <InfoField label="Họ tên" value={<span style={{ color: "#881337", fontWeight: 600 }}>{emergencyModal.committedData.name || "Chưa cập nhật"}</span>} />
            <InfoField label="Quan hệ" value={<span style={{ color: "#881337", fontWeight: 500 }}>{emergencyModal.committedData.relationship || "—"}</span>} />
            <div style={{ gridColumn: "1 / -1" }}>
              <InfoField label="Số điện thoại" value={<span style={{ color: "#be123c", fontWeight: 600 }}>{emergencyModal.committedData.phone || "Chưa cập nhật"}</span>} />
            </div>
          </div>
        </BaseCard>
      </div>

      {/* Primary Modal */}
      <BaseModal
        isOpen={primaryModal.isOpen}
        onClose={primaryModal.closeModal}
        title="Sửa Liên lạc chính"
        confirmText="Lưu thay đổi"
        onConfirm={primaryModal.saveData}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", background: "#f8fafc", padding: "1.5rem", margin: "-1.5rem", borderBottom: "1px solid var(--border)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <BaseInput label="Họ tên" value={primaryModal.localData.name} onChange={(e) => { primaryModal.setLocalData({...primaryModal.localData, name: e.target.value}); primaryModal.markDirty(); }} />
            <BaseInput label="Quan hệ" value={primaryModal.localData.relationship} onChange={(e) => { primaryModal.setLocalData({...primaryModal.localData, relationship: e.target.value}); primaryModal.markDirty(); }} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <BaseInput label="Điện thoại" value={primaryModal.localData.phone} onChange={(e) => { primaryModal.setLocalData({...primaryModal.localData, phone: e.target.value}); primaryModal.markDirty(); }} />
            <BaseInput label="Email cá nhân" value={primaryModal.localData.email} onChange={(e) => { primaryModal.setLocalData({...primaryModal.localData, email: e.target.value}); primaryModal.markDirty(); }} />
          </div>
          <BaseInput label="Thường trú" value={primaryModal.localData.address} onChange={(e) => { primaryModal.setLocalData({...primaryModal.localData, address: e.target.value}); primaryModal.markDirty(); }} />
        </div>
      </BaseModal>

      {/* Emergency Modal */}
      <BaseModal
        isOpen={emergencyModal.isOpen}
        onClose={emergencyModal.closeModal}
        title="Sửa Liên hệ khẩn cấp"
        confirmText="Lưu thay đổi"
        onConfirm={emergencyModal.saveData}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", background: "#f8fafc", padding: "1.5rem", margin: "-1.5rem", borderBottom: "1px solid var(--border)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <BaseInput label="Họ tên" value={emergencyModal.localData.name} onChange={(e) => { emergencyModal.setLocalData({...emergencyModal.localData, name: e.target.value}); emergencyModal.markDirty(); }} />
            <BaseInput label="Quan hệ" value={emergencyModal.localData.relationship} onChange={(e) => { emergencyModal.setLocalData({...emergencyModal.localData, relationship: e.target.value}); emergencyModal.markDirty(); }} />
          </div>
          <BaseInput label="Số điện thoại" value={emergencyModal.localData.phone} onChange={(e) => { emergencyModal.setLocalData({...emergencyModal.localData, phone: e.target.value}); emergencyModal.markDirty(); }} />
        </div>
      </BaseModal>
    </>
  );
};
