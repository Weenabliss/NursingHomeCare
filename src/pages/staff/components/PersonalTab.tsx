import React from "react";
import { useTranslation } from "react-i18next";
import { AlertCircle } from "lucide-react";
import { BaseCard } from "../../../shared/components/BaseCard";
import { BaseModal } from "../../../shared/components/BaseModal";
import { BaseInput } from "../../../shared/components/BaseInput";
import { InfoField } from "../../../shared/components/InfoField";
import { useFormModal } from "../../../shared/hooks/useFormModal";
import type { Staff } from "../../../modules/hr/types";
import styles from "../StaffDetail.module.scss";

interface PersonalTabProps {
  staff: Staff;
}

export const PersonalTab: React.FC<PersonalTabProps> = ({ staff }) => {
  const { t } = useTranslation();

  const identityModal = useFormModal(staff);
  const contactModal = useFormModal(staff);
  const emergencyModal = useFormModal(staff);

  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", height: "100%", alignItems: "stretch" }}>
        {/* Basic Info */}
        <BaseCard
          isSelected={identityModal.isOpen}
          onClick={identityModal.openModal}
        >
          <h3 className={styles.infoSectionTitle}>Định danh & Giấy tờ</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem", marginTop: "0.5rem" }}>
            <InfoField label="Ngày sinh" value={`${staff.personal.dob}`} />
            <InfoField label="CCCD/Hộ chiếu" value={staff.personal.nationalId} />
            <InfoField label="Quê quán" value={staff.personal.hometown || "—"} />
            <InfoField label="Tôn giáo" value={staff.personal.religion || "—"} />
          </div>
        </BaseCard>

        {/* Contact Info */}
        <BaseCard
          isSelected={contactModal.isOpen}
          onClick={contactModal.openModal}
        >
          <h3 className={styles.infoSectionTitle}>Liên lạc & Gia cảnh</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem", marginTop: "0.5rem" }}>
            <InfoField label="Điện thoại" value={staff.personal.phone || "Chưa cập nhật"} />
            <InfoField label="Email cá nhân" value={staff.personal.email || "—"} />
            <div style={{ gridColumn: "1 / -1" }}>
              <InfoField label="Thường trú" value={staff.personal.currentAddress || "Chưa cập nhật"} />
            </div>
          </div>
        </BaseCard>

        {/* Emergency */}
        <BaseCard
          isSelected={emergencyModal.isOpen}
          onClick={emergencyModal.openModal}
          style={{ backgroundColor: "#fff1f2", borderColor: emergencyModal.isOpen ? "var(--primary)" : "#fecdd3" }}
        >
          <h3
            className={styles.infoSectionTitle}
            style={{ color: "#be123c", display: "flex", alignItems: "center", gap: "0.5rem", borderBottomColor: "#fda4af" }}
          >
            <AlertCircle size={16} /> Liên hệ khẩn cấp
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1.25rem", marginTop: "0.5rem" }}>
            <InfoField label="Họ tên" value={<span style={{ color: "#881337", fontWeight: 600 }}>{staff.emergencyContacts?.[0]?.name || "Chưa cập nhật"}</span>} />
            <InfoField label="Quan hệ" value={<span style={{ color: "#881337", fontWeight: 500 }}>{staff.emergencyContacts?.[0]?.relation || "—"}</span>} />
            <InfoField label="Số điện thoại" value={<span style={{ color: "#be123c", fontWeight: 600 }}>{staff.emergencyContacts?.[0]?.phone || "Chưa cập nhật"}</span>} />
          </div>
        </BaseCard>

        {/* RBAC */}
        <BaseCard>
          <h3 className={styles.infoSectionTitle}>Quyền hạn hệ thống (RBAC)</h3>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            <span style={{ color: "#16a34a", fontWeight: 600 }}>
              (Mock Roles UI - sẽ phát triển sau)
            </span>
          </div>
        </BaseCard>
      </div>

      {/* Identity Modal */}
      <BaseModal
        isOpen={identityModal.isOpen}
        onClose={identityModal.closeModal}
        title="Định danh & Giấy tờ"
        confirmText={t("common.save")}
        onConfirm={identityModal.closeModal}
        isDirty={identityModal.isDirty}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <BaseInput label="Ngày sinh" type="date" defaultValue={staff.personal.dob} onChange={identityModal.markDirty} />
          <BaseInput label="CCCD/Hộ chiếu" type="text" defaultValue={staff.personal.nationalId} onChange={identityModal.markDirty} />
        </div>
      </BaseModal>

      {/* Contact Modal */}
      <BaseModal
        isOpen={contactModal.isOpen}
        onClose={contactModal.closeModal}
        title="Liên lạc & Gia cảnh"
        confirmText={t("common.save")}
        onConfirm={contactModal.closeModal}
        isDirty={contactModal.isDirty}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <BaseInput label="Điện thoại" type="text" defaultValue={staff.personal.phone || ""} onChange={contactModal.markDirty} />
          <BaseInput label="Email cá nhân" type="email" defaultValue={staff.personal.email || ""} onChange={contactModal.markDirty} />
          <BaseInput label="Thường trú" type="text" defaultValue={staff.personal.currentAddress || ""} onChange={contactModal.markDirty} />
        </div>
      </BaseModal>

      {/* Emergency Modal */}
      <BaseModal
        isOpen={emergencyModal.isOpen}
        onClose={emergencyModal.closeModal}
        title="Liên hệ khẩn cấp"
        confirmText={t("common.save")}
        onConfirm={emergencyModal.closeModal}
        isDirty={emergencyModal.isDirty}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <BaseInput label="Họ tên người liên hệ" type="text" defaultValue={staff.emergencyContacts?.[0]?.name || ""} onChange={emergencyModal.markDirty} />
          <BaseInput label="Quan hệ" type="text" defaultValue={staff.emergencyContacts?.[0]?.relation || ""} onChange={emergencyModal.markDirty} />
          <BaseInput label="Số điện thoại" type="text" defaultValue={staff.emergencyContacts?.[0]?.phone || ""} onChange={emergencyModal.markDirty} />
        </div>
      </BaseModal>
    </>
  );
};
