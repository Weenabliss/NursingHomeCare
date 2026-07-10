import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { ImageIcon, Eye } from "lucide-react";
import { BaseCard } from "../../../components/atoms/BaseCard";
import { BaseModal } from "../../../components/atoms/BaseModal";
import { BaseInput } from "../../../components/atoms/BaseInput";
import { BaseButton } from "../../../components/atoms/BaseButton";
import { BaseTimeline } from "../../../components/molecules/BaseTimeline";
import { MediaViewerModal } from "../../../components/molecules/MediaViewerModal";
import { useFormModal } from "../../../hooks/useFormModal";
import type { Staff } from "../../../mock/staff";
import styles from "../StaffDetail.module.scss";

export const CertificatesSection: React.FC<{ staff: Staff }> = ({ staff }) => {
  const { t } = useTranslation();
  const { isOpen, isDirty, localData, setLocalData, openModal, closeModal, markDirty } = useFormModal(staff.certificates);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);

  return (
    <>
      <BaseCard
        isSelected={isOpen}
        onClick={openModal}
      >
        <h3 className={styles.infoSectionTitle}>Hồ sơ & Bằng cấp</h3>
        <div className="custom-scrollbar" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "var(--spacing-md)", marginTop: "0.5rem", maxHeight: "90px", overflowY: "auto", overflowX: "hidden", padding: "4px" }}>
          {staff.certificates.map((cert) => (
            <div
              key={cert.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "0.5rem",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-md)",
                backgroundColor: "var(--background)",
                height: "75px",
                overflow: "hidden",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "1rem", flex: 1, minWidth: 0 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: "0.95rem", color: "var(--text-main)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {cert.name}
                  </div>
                  <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{cert.issuer}</div>
                </div>
              </div>
              <div
                style={{
                  textAlign: "right",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.25rem",
                  alignItems: "flex-end",
                }}
              >
                <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Cấp: {cert.issueDate}</div>
                {cert.expiryDate && (
                  <div
                    style={{
                      fontSize: "0.85rem",
                      color: staff.certWarning ? "#dc2626" : "var(--text-muted)",
                      fontWeight: staff.certWarning ? 600 : 400,
                    }}
                  >
                    Hết hạn: {cert.expiryDate}
                  </div>
                )}
                {cert.imageUrl && (
                  <span
                    style={{
                      fontSize: "0.8rem",
                      color: "var(--primary)",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      textDecoration: "none",
                      marginTop: "2px",
                      cursor: "pointer"
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setPreviewImageUrl(cert.imageUrl || null);
                    }}
                  >
                    <ImageIcon size={14} /> Xem ảnh
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </BaseCard>

      <BaseModal
        isOpen={isOpen}
        onClose={closeModal}
        title="Hồ sơ & Bằng cấp"
        confirmText={t("common.save")}
        onConfirm={closeModal}
        isDirty={isDirty}
        maxWidth="700px"
      >
        <BaseTimeline>
          {localData.map((cert, idx, arr) => (
            <BaseTimeline.Item key={cert.id} isLast={idx === arr.length - 1}>
                {/* Row 1: Core Info */}
                <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", width: "100%" }}>
                  <div style={{ flex: 2, minWidth: "200px" }}>
                    <BaseInput label="Tên bằng cấp" value={cert.name} onChange={(e) => {
                      const newData = [...localData];
                      newData[idx].name = e.target.value;
                      setLocalData(newData);
                      markDirty();
                    }} />
                  </div>
                  <div style={{ flex: 1, minWidth: "150px" }}>
                    <BaseInput label="Nơi cấp" value={cert.issuer} onChange={(e) => {
                      const newData = [...localData];
                      newData[idx].issuer = e.target.value;
                      setLocalData(newData);
                      markDirty();
                    }} />
                  </div>
                </div>

                {/* Row 2: Dates */}
                <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", width: "100%" }}>
                  <div style={{ flex: 1, minWidth: "150px" }}>
                    <BaseInput label="Ngày cấp" type="date" value={cert.issueDate} onChange={(e) => {
                      const newData = [...localData];
                      newData[idx].issueDate = e.target.value;
                      setLocalData(newData);
                      markDirty();
                    }} />
                  </div>
                  <div style={{ flex: 1, minWidth: "150px" }}>
                    <BaseInput label="Ngày hết hạn" type="date" value={cert.expiryDate || ""} onChange={(e) => {
                      const newData = [...localData];
                      newData[idx].expiryDate = e.target.value;
                      setLocalData(newData);
                      markDirty();
                    }} />
                  </div>
                </div>

                {/* Row 3: Attachment */}
                <div style={{ display: "flex", alignItems: "flex-end", gap: "0.5rem", width: "100%" }}>
                  <div style={{ flex: 1 }}>
                    <BaseInput 
                      label="URL Ảnh chụp" 
                      value={cert.imageUrl || ""} 
                      onChange={(e) => {
                        const newData = [...localData];
                        newData[idx].imageUrl = e.target.value;
                        setLocalData(newData);
                        markDirty();
                      }} 
                    />
                  </div>
                  {cert.imageUrl && (
                    <BaseButton
                      variant="outline"
                      type="button"
                      style={{ height: "38px" }}
                      onClick={() => setPreviewImageUrl(cert.imageUrl || null)}
                    >
                      <Eye size={16} style={{ marginRight: "4px" }} /> Xem
                    </BaseButton>
                  )}
                  <input 
                    type="file" 
                    accept="image/*" 
                    style={{ display: "none" }} 
                    id={`cert-upload-${cert.id}`} 
                    onChange={(e) => {
                       if (e.target.files && e.target.files[0]) {
                         const file = e.target.files[0];
                         const objectUrl = URL.createObjectURL(file);
                         const newData = [...localData];
                         newData[idx].imageUrl = objectUrl;
                         setLocalData(newData);
                         markDirty();
                       }
                    }}
                  />
                  <BaseButton 
                    variant="outline" 
                    type="button" 
                    style={{ height: "38px" }}
                    onClick={() => document.getElementById(`cert-upload-${cert.id}`)?.click()}
                  >
                    <ImageIcon size={16} style={{ marginRight: "4px" }} /> Tải lên
                  </BaseButton>
                </div>
            </BaseTimeline.Item>
          ))}
          <BaseButton
            variant="outline"
            style={{ alignSelf: "flex-start", marginTop: "1.5rem", marginLeft: "36px" }}
            onClick={() => {
              setLocalData([...localData, { id: `new-cert-${Date.now()}`, name: "", issuer: "", issueDate: "" }]);
              markDirty();
            }}
          >
            + Thêm mới
          </BaseButton>
        </BaseTimeline>
      </BaseModal>

      <MediaViewerModal
        isOpen={!!previewImageUrl}
        onClose={() => setPreviewImageUrl(null)}
        url={previewImageUrl}
        type="image"
      />
    </>
  );
};
