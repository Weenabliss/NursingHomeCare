import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { FileText, Eye } from "lucide-react";
import { BaseCard } from "../../../components/atoms/BaseCard";
import { BaseModal } from "../../../components/atoms/BaseModal";
import { BaseInput } from "../../../components/atoms/BaseInput";
import { BaseSelect } from "../../../components/atoms/BaseSelect";
import { BaseButton } from "../../../components/atoms/BaseButton";
import { BaseTimeline } from "../../../components/molecules/BaseTimeline";
import { MediaViewerModal } from "../../../components/molecules/MediaViewerModal";
import { useFormModal } from "../../../hooks/useFormModal";
import type { Staff } from "../../../mock/staff";
import styles from "../StaffDetail.module.scss";

export const ContractsSection: React.FC<{ staff: Staff }> = ({ staff }) => {
  const { t } = useTranslation();
  const { isOpen, isDirty, localData, setLocalData, openModal, closeModal, markDirty } = useFormModal(staff.contracts);
  const [previewPdfUrl, setPreviewPdfUrl] = useState<string | null>(null);

  return (
    <>
      <BaseCard
        isSelected={isOpen}
        onClick={openModal}
        style={{ display: "flex", flexDirection: "column", height: "100%" }}
      >
        <h3 className={styles.infoSectionTitle}>Hợp đồng lao động</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginTop: "0.5rem", flex: 1, maxHeight: "200px", overflowY: "auto", paddingRight: "4px" }}>
          {staff.contracts.map((contract) => (
            <div
              key={contract.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "0.5rem",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-md)",
                backgroundColor: "var(--background)",
              }}
            >
              <div>
                <div
                  style={{
                    fontWeight: 600,
                    fontSize: "0.95rem",
                    color: "var(--text-main)",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  {contract.type}
                  {contract.documentUrl && (
                    <span
                      style={{ display: "inline-flex", color: "var(--primary)", textDecoration: "none", cursor: "pointer" }}
                      title="Xem bản quét"
                      onClick={(e) => {
                        e.stopPropagation();
                        setPreviewPdfUrl(contract.documentUrl || null);
                      }}
                    >
                      <FileText size={16} />
                    </span>
                  )}
                </div>
                <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                  Từ: {contract.startDate} {contract.endDate ? `Đến: ${contract.endDate}` : ""}
                </div>
              </div>
              <div
                style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.25rem" }}
              >
                {contract.status === "active" && (
                  <span
                    style={{
                      backgroundColor: "#dcfce7",
                      color: "#16a34a",
                      padding: "2px 8px",
                      borderRadius: "12px",
                      fontSize: "0.8rem",
                      fontWeight: 600,
                    }}
                  >
                    Hiệu lực
                  </span>
                )}
                {contract.status === "expired" && (
                  <span
                    style={{
                      backgroundColor: "#fee2e2",
                      color: "#dc2626",
                      padding: "2px 8px",
                      borderRadius: "12px",
                      fontSize: "0.8rem",
                      fontWeight: 600,
                    }}
                  >
                    Hết hạn
                  </span>
                )}
                {contract.status === "terminated" && (
                  <span
                    style={{
                      backgroundColor: "#f3f4f6",
                      color: "#4b5563",
                      padding: "2px 8px",
                      borderRadius: "12px",
                      fontSize: "0.8rem",
                      fontWeight: 600,
                    }}
                  >
                    Đã chấm dứt
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
        title="Hợp đồng lao động"
        confirmText={t("common.save")}
        onConfirm={closeModal}
        isDirty={isDirty}
        maxWidth="700px"
      >
        <BaseTimeline>
          {localData.map((contract, idx, arr) => (
            <BaseTimeline.Item key={contract.id} isLast={idx === arr.length - 1}>
                {/* Row 1: Core Info */}
                <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", width: "100%" }}>
                  <div style={{ flex: 2, minWidth: "200px" }}>
                    <BaseSelect
                      label="Loại hợp đồng"
                      defaultValue={contract.type}
                      options={[
                        { label: "Thử việc", value: "Thử việc" },
                        { label: "Có thời hạn 1 năm", value: "Có thời hạn 1 năm" },
                        { label: "Có thời hạn 3 năm", value: "Có thời hạn 3 năm" },
                        { label: "Vô thời hạn", value: "Vô thời hạn" },
                      ]}
                      onChange={markDirty}
                    />
                  </div>
                  <div style={{ flex: 1, minWidth: "150px" }}>
                    <BaseSelect
                      label="Trạng thái"
                      defaultValue={contract.status}
                      options={[
                        { label: "Hiệu lực", value: "active" },
                        { label: "Hết hạn", value: "expired" },
                        { label: "Đã chấm dứt", value: "terminated" },
                      ]}
                      onChange={markDirty}
                    />
                  </div>
                </div>

                {/* Row 2: Dates */}
                <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", width: "100%" }}>
                  <div style={{ flex: 1, minWidth: "150px" }}>
                    <BaseInput label="Từ ngày" type="date" defaultValue={contract.startDate} onChange={markDirty} />
                  </div>
                  <div style={{ flex: 1, minWidth: "150px" }}>
                    <BaseInput label="Đến ngày" type="date" defaultValue={contract.endDate || ""} onChange={markDirty} />
                  </div>
                </div>

                {/* Row 3: Attachment */}
                <div style={{ display: "flex", alignItems: "flex-end", gap: "0.5rem", width: "100%" }}>
                  <div style={{ flex: 1 }}>
                    <BaseInput 
                      label="URL Bản quét Hợp đồng" 
                      value={contract.documentUrl || ""} 
                      onChange={(e) => {
                        const newData = [...localData];
                        newData[idx].documentUrl = e.target.value;
                        setLocalData(newData);
                        markDirty();
                      }} 
                    />
                  </div>
                  {contract.documentUrl && (
                    <BaseButton
                      variant="outline"
                      type="button"
                      style={{ height: "38px" }}
                      onClick={() => setPreviewPdfUrl(contract.documentUrl || null)}
                    >
                      <Eye size={16} style={{ marginRight: "4px" }} /> Xem
                    </BaseButton>
                  )}
                  <input 
                    type="file" 
                    accept="application/pdf,image/*" 
                    style={{ display: "none" }} 
                    id={`file-upload-${contract.id}`} 
                    onChange={(e) => {
                       if (e.target.files && e.target.files[0]) {
                         const file = e.target.files[0];
                         const objectUrl = URL.createObjectURL(file);
                         const newData = [...localData];
                         newData[idx].documentUrl = objectUrl;
                         setLocalData(newData);
                         markDirty();
                       }
                    }}
                  />
                  <BaseButton 
                    variant="outline" 
                    type="button" 
                    style={{ height: "38px" }}
                    onClick={() => document.getElementById(`file-upload-${contract.id}`)?.click()}
                  >
                    <FileText size={16} style={{ marginRight: "4px" }} /> Đính kèm
                  </BaseButton>
                </div>
            </BaseTimeline.Item>
          ))}
          <BaseButton
            variant="outline"
            style={{ alignSelf: "flex-start", marginTop: "1.5rem", marginLeft: "36px" }}
            onClick={() => {
              setLocalData([...localData, { id: `new-${Date.now()}`, type: "Thử việc", status: "active", startDate: "" }]);
              markDirty();
            }}
          >
            + Thêm mới
          </BaseButton>
        </BaseTimeline>
      </BaseModal>

      <MediaViewerModal
        isOpen={!!previewPdfUrl}
        onClose={() => setPreviewPdfUrl(null)}
        url={previewPdfUrl}
        type="pdf"
      />
    </>
  );
};
