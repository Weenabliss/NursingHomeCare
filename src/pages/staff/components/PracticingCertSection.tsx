import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Award, Trash2 } from "lucide-react";
import { BaseCard } from "../../../shared/components/BaseCard";
import { BaseModal } from "../../../shared/components/BaseModal";
import { BaseInput } from "../../../shared/components/BaseInput";
import { BaseButton } from "../../../shared/components/BaseButton";
import type { Staff } from "../../../modules/hr/types";
import styles from "../StaffDetail.module.scss";

interface PracticingCertSectionProps {
  staff: Staff;
}

export const PracticingCertSection: React.FC<PracticingCertSectionProps> = ({ staff }) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [formData, setFormData] = useState(staff.medicalCredentials.practicingCert || {
    certNumber: "",
    scopeOfPractice: "",
    issuedBy: "",
    issueDate: "",
    expiryDate: ""
  });

  useEffect(() => {
    if (!isOpen) {
      setFormData(staff.medicalCredentials.practicingCert || {
        certNumber: "",
        scopeOfPractice: "",
        issuedBy: "",
        issueDate: "",
        expiryDate: ""
      });
      setIsDirty(false);
    }
  }, [isOpen, staff.medicalCredentials.practicingCert]);

  const handleSave = () => {
    // We would normally pass this to a parent to mutate or use useMutation
    // For now we just close the modal.
    setIsOpen(false);
    setIsDirty(false);
  };

  const handleClear = () => {
    setFormData({
      certNumber: "",
      scopeOfPractice: "",
      issuedBy: "",
      issueDate: "",
      expiryDate: ""
    });
    setIsDirty(true);
  };

  const cert = staff.medicalCredentials.practicingCert;

  return (
    <>
      <BaseCard
        isSelected={isOpen}
        onClick={() => setIsOpen(true)}
        style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}
      >
        <h3 className={styles.infoSectionTitle}>Chứng chỉ hành nghề</h3>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", marginTop: "var(--spacing-md)" }}>
          {cert ? (
            <div style={{
              backgroundColor: "#f8fafc",
              border: "1px solid var(--border)",
              borderRadius: "12px",
              padding: "1rem",
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Award size={18} color="var(--primary)" />
                <span style={{ fontWeight: 700, color: "var(--text-main)" }}>{cert.certNumber}</span>
              </div>
              <div style={{ fontSize: "0.85rem", color: "var(--text-main)" }}>
                <strong>Phạm vi:</strong> {cert.scopeOfPractice}
              </div>
              <div style={{ fontSize: "0.85rem", color: "var(--text-main)" }}>
                <strong>Nơi cấp:</strong> {cert.issuedBy}
              </div>
              <div style={{ display: "flex", gap: "1rem", marginTop: "0.25rem" }}>
                <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Cấp: {cert.issueDate}</span>
                {cert.expiryDate && (
                  <span style={{ fontSize: "0.8rem", color: "#dc2626" }}>Hết hạn: {cert.expiryDate}</span>
                )}
              </div>
            </div>
          ) : (
            <div style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--text-muted)",
              gap: "0.75rem",
              backgroundColor: "#f8fafc",
              border: "1px dashed var(--border)",
              borderRadius: "12px"
            }}>
              <Award size={36} strokeWidth={1.5} color="#cbd5e1" />
              <p style={{ margin: 0, fontSize: "0.9rem" }}>Chưa cập nhật CCHN</p>
            </div>
          )}
        </div>
      </BaseCard>

      <BaseModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Thông tin Chứng chỉ hành nghề"
        confirmText={t("common.save")}
        onConfirm={handleSave}
        isDirty={isDirty}
      >
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "1rem" }}>
          <BaseButton variant="danger" onClick={handleClear}>
            <Trash2 size={16} style={{ marginRight: "6px" }} /> Xóa thông tin CCHN
          </BaseButton>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--spacing-md)" }}>
          <BaseInput
            label="Số CCHN *"
            value={formData.certNumber}
            onChange={(e: any) => { setFormData({ ...formData, certNumber: e.target.value }); setIsDirty(true); }}
          />
          <BaseInput
            label="Phạm vi hoạt động *"
            value={formData.scopeOfPractice}
            onChange={(e: any) => { setFormData({ ...formData, scopeOfPractice: e.target.value }); setIsDirty(true); }}
          />
          <BaseInput
            label="Nơi cấp *"
            value={formData.issuedBy}
            onChange={(e: any) => { setFormData({ ...formData, issuedBy: e.target.value }); setIsDirty(true); }}
          />
          <div />
          <BaseInput
            label="Ngày cấp *"
            type="date"
            value={formData.issueDate}
            onChange={(e: any) => { setFormData({ ...formData, issueDate: e.target.value }); setIsDirty(true); }}
          />
          <BaseInput
            label="Ngày hết hạn"
            type="date"
            value={formData.expiryDate || ""}
            onChange={(e: any) => { setFormData({ ...formData, expiryDate: e.target.value }); setIsDirty(true); }}
          />
        </div>
      </BaseModal>
    </>
  );
};
