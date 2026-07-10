import React from "react";
import { useTranslation } from "react-i18next";
import { AlertCircle } from "lucide-react";
import { BaseCard } from "../../../components/atoms/BaseCard";
import { BaseModal } from "../../../components/atoms/BaseModal";
import { BaseInput } from "../../../components/atoms/BaseInput";
import { InfoField } from "../../../components/atoms/InfoField";
import { useFormModal } from "../../../hooks/useFormModal";
import type { Staff } from "../../../mock/staff";
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
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
        {/* Basic Info */}
        <BaseCard
          isSelected={identityModal.isOpen}
          onClick={identityModal.openModal}
        >
          <h3 className={styles.infoSectionTitle}>Định danh & Giấy tờ</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem", marginTop: "0.5rem" }}>
            <InfoField label="Ngày sinh" value={`${staff.dob} (${staff.age} tuổi)`} />
            <InfoField label="CCCD/Hộ chiếu" value={staff.cccd} />
            <InfoField label="Ngày cấp" value="15/08/2020" />
            <InfoField label="Nơi cấp" value="Cục CS QLHC về TTXH" />
          </div>
        </BaseCard>

        {/* Contact Info */}
        <BaseCard
          isSelected={contactModal.isOpen}
          onClick={contactModal.openModal}
        >
          <h3 className={styles.infoSectionTitle}>Liên lạc & Gia cảnh</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem", marginTop: "0.5rem" }}>
            <InfoField label="Điện thoại" value="0988.xxx.xxx" />
            <InfoField label="Email cá nhân" value={staff.email} />
            <div style={{ gridColumn: "1 / -1" }}>
              <InfoField label="Thường trú" value="Quận Đống Đa, Hà Nội" />
            </div>
            <InfoField label="Người phụ thuộc" value={<span style={{ color: "var(--primary-dark)", fontWeight: 600 }}>02 người</span>} />
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
            <InfoField label="Họ tên người liên hệ" value={<span style={{ color: "#881337", fontWeight: 600 }}>Nguyễn Văn X</span>} />
            <InfoField label="Quan hệ" value={<span style={{ color: "#881337", fontWeight: 500 }}>Chồng</span>} />
            <InfoField label="Số điện thoại" value={<span style={{ color: "#be123c", fontWeight: 600 }}>09xx.xxx.xxx</span>} />
          </div>
        </BaseCard>

        {/* RBAC */}
        <BaseCard>
          <h3 className={styles.infoSectionTitle}>Quyền hạn hệ thống (RBAC)</h3>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            {staff.autoRoles.length > 0 ? (
              staff.autoRoles.map((role: string) => (
                <span
                  key={role}
                  style={{
                    fontSize: "0.8rem",
                    padding: "4px 12px",
                    borderRadius: "16px",
                    backgroundColor: "var(--surface)",
                    color: "var(--primary-dark)",
                    fontWeight: 600,
                    border: "1px solid var(--border)",
                  }}
                >
                  {role}
                </span>
              ))
            ) : (
              <span style={{ color: "#dc2626", fontStyle: "italic", fontWeight: 500 }}>
                Tài khoản đang bị khóa - Đã thu hồi toàn bộ quyền
              </span>
            )}
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
          <BaseInput label="Ngày sinh" type="date" defaultValue={staff.dob} onChange={identityModal.markDirty} />
          <BaseInput label="CCCD/Hộ chiếu" type="text" defaultValue={staff.cccd} onChange={identityModal.markDirty} />
          <BaseInput label="Ngày cấp" type="date" defaultValue="2020-08-15" onChange={identityModal.markDirty} />
          <BaseInput label="Nơi cấp" type="text" defaultValue="Cục CS QLHC về TTXH" onChange={identityModal.markDirty} />
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
          <BaseInput label="Điện thoại" type="text" defaultValue="0988.xxx.xxx" onChange={contactModal.markDirty} />
          <BaseInput label="Email cá nhân" type="email" defaultValue={staff.email} onChange={contactModal.markDirty} />
          <BaseInput label="Thường trú" type="text" defaultValue="Quận Đống Đa, Hà Nội" onChange={contactModal.markDirty} />
          <BaseInput label="Người phụ thuộc (người)" type="number" defaultValue={2} onChange={contactModal.markDirty} />
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
          <BaseInput label="Họ tên người liên hệ" type="text" defaultValue="Nguyễn Văn X" onChange={emergencyModal.markDirty} />
          <BaseInput label="Quan hệ" type="text" defaultValue="Chồng" onChange={emergencyModal.markDirty} />
          <BaseInput label="Số điện thoại" type="text" defaultValue="09xx.xxx.xxx" onChange={emergencyModal.markDirty} />
        </div>
      </BaseModal>
    </>
  );
};
